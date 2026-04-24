import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const LABELS: Record<string, string> = {
  full_name: "Full Name",
  business_name: "Business Name",
  email: "Email",
  phone: "Phone",
  monthly_revenue_range: "Monthly Revenue",
  funding_needed_range: "Funding Needed",
  purpose: "Purpose",
  source: "Source",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "RESEND_API_KEY is not configured" });
  }

  const toEmail = process.env.APPLICATION_TO_EMAIL ?? "submissions@bayviewadvance.com";
  const fromEmail =
    process.env.APPLICATION_FROM_EMAIL ?? "Bayview Advance <onboarding@resend.dev>";

  const application = (req.body ?? {}) as Record<string, unknown>;

  const rows = Object.entries(application)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;color:#475569;font-weight:600">${
          LABELS[k] ?? k
        }</td><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;color:#0f172a">${
          String(v ?? "")
        }</td></tr>`,
    )
    .join("");

  const businessName = String(application.business_name ?? "Unknown Business");
  const replyTo = typeof application.email === "string" ? application.email : undefined;

  const html = `
    <div style="font-family:-apple-system,system-ui,sans-serif;max-width:640px;margin:0 auto">
      <h2 style="color:#1e3a5c">New Application Received</h2>
      <p style="color:#475569">A new application was submitted through the Bayview Advance website.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:12px">${rows}</table>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo,
      subject: `New Bayview Advance application: ${businessName}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ error: error.message ?? "Failed to send email" });
    }

    return res.status(200).json({ success: true, id: data?.id });
  } catch (err) {
    console.error("send-application-email error:", err);
    return res.status(500).json({ error: String(err) });
  }
}
