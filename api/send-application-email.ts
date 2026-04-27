import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const NAVY = "#1e3a5c";
const SLATE = "#475569";
const SLATE_LIGHT = "#f8fafc";

const QUICK_LABELS: Record<string, string> = {
  full_name: "Full Name",
  business_name: "Business Name",
  email: "Email",
  phone: "Phone",
  monthly_revenue_range: "Monthly Revenue",
  funding_needed_range: "Funding Needed",
  purpose: "Purpose",
};

const FULL_LABELS: Record<string, string> = {
  rep: "Rep",
  legal_business_name: "Legal Business Name",
  dba: "DBA",
  business_start_date: "Business Start Date",
  business_address: "Business Address",
  entity_type: "Entity Type",
  state_incorporated: "State Incorporated",
  ein: "Federal Tax ID (EIN)",
  industry: "Industry",
  owner_name: "Owner Name",
  ownership: "Ownership",
  date_of_birth: "Date of Birth",
  ssn: "SSN",
  home_address: "Home Address",
  owner_signature: "Owner Signature",
  signature_date: "Signature Date",
};

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 16px;border-bottom:1px solid #cbd5e1;color:${SLATE};font-weight:600;font-size:11px;letter-spacing:0.6px;text-transform:uppercase;width:42%;vertical-align:top">${escapeHtml(label)}</td>
    <td style="padding:10px 16px;border-bottom:1px solid #cbd5e1;color:#0f172a;font-size:14px">${escapeHtml(value || "—")}</td>
  </tr>`;
}

function buildEmail(payload: Record<string, unknown>): { subject: string; html: string; replyTo?: string } {
  const isQuick = payload.source === "quick" || payload.full_name !== undefined;
  const labels = isQuick ? QUICK_LABELS : FULL_LABELS;
  const headline = String(
    payload.business_name ?? payload.legal_business_name ?? "Unknown Business",
  );

  const rows = Object.entries(labels)
    .map(([key, label]) => {
      const value = payload[key];
      if (value === undefined || value === null || String(value).trim() === "") {
        return "";
      }
      return row(label, String(value));
    })
    .join("");

  const submittedAt = new Date().toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/New_York",
  }) + " ET";

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9;padding:32px 12px">
  <tr><td align="center">
    <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,0.08)">
      <tr><td style="background:linear-gradient(135deg, ${NAVY} 0%, #0f2339 100%);padding:28px 32px;color:#ffffff">
        <div style="font-size:11px;letter-spacing:1.4px;text-transform:uppercase;opacity:0.75">Bayview Advance</div>
        <div style="font-size:20px;font-weight:700;margin-top:4px">Funding Application</div>
        <div style="font-size:14px;opacity:0.85;font-style:italic;margin-top:2px">Funding Made Simple</div>
      </td></tr>
      <tr><td style="padding:32px">
        <div style="font-size:22px;font-weight:700;color:${NAVY};line-height:1.3">New application received</div>
        <div style="margin-top:6px;font-size:15px;color:#334155;line-height:1.5">
          A new funding application was submitted by <strong style="color:#0f172a">${escapeHtml(headline)}</strong>.
        </div>
        <div style="margin-top:8px;font-size:12px;color:${SLATE}">Submitted ${escapeHtml(submittedAt)}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;background:${SLATE_LIGHT};border-radius:8px;overflow:hidden">
          ${rows}
        </table>
      </td></tr>
      <tr><td style="background:${SLATE_LIGHT};padding:18px 32px;border-top:1px solid #cbd5e1;color:${SLATE};font-size:12px;line-height:1.5">
        Bayview Advance &middot; Funding Made Simple<br />
        Reply directly to this email to reach the applicant.
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  const replyTo = typeof payload.email === "string" && payload.email ? payload.email : undefined;

  return {
    subject: `New Bayview Advance application: ${headline}`,
    html,
    replyTo,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "RESEND_API_KEY is not configured" });
  }

  const fromEmail =
    process.env.APPLICATION_FROM_EMAIL ??
    "Bayview Advance <applications@bayviewadvance.com>";
  const toEmail = process.env.APPLICATION_TO_EMAIL ?? "submissions@bayviewadvance.com";

  try {
    const payload = (req.body ?? {}) as Record<string, unknown>;
    const { subject, html, replyTo } = buildEmail(payload);

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ error: error.message ?? "Failed to send email" });
    }

    return res.status(200).json({ success: true, id: data?.id });
  } catch (err) {
    console.error("send-application-email crash:", err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
