import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from "pdf-lib";

// ----- Email helpers -----

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

const DISCLAIMER =
  'By signing below, each of the above-listed business and business owner(s) (individually and collectively, "you") authorize Bayview Advance ("B/A") and each of its representatives, successors, assigns and designees ("Recipients") that may be involved with or require commercial loans having daily repayment features or Merchant Cash Advance transactions, including without limitation the application(s) herein (collectively, "Transactions") to obtain consumer or personal, business and investigative reports and other information about you, including credit card processor statements and bank statements; bureau or non-consumer reporting agencies; and/or third parties. Equifax, Experian and/or from other credit bureaus, banks, creditors and other third parties. You also authorize B/A to transmit this application form, along with any of the foregoing information obtained in connection with this application, to any or all of the Recipients for the foregoing purposes. You also consent to the release, by any creditor or financial institution, of any information relating to any of you, to B/A and to each of the Recipients, on its own behalf.';

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 16px;border-bottom:1px solid #cbd5e1;color:${SLATE};font-weight:600;font-size:11px;letter-spacing:0.6px;text-transform:uppercase;width:42%;vertical-align:top">${escapeHtml(label)}</td>
    <td style="padding:10px 16px;border-bottom:1px solid #cbd5e1;color:#0f172a;font-size:14px">${escapeHtml(value || "—")}</td>
  </tr>`;
}

function buildEmail(payload: Record<string, unknown>): {
  subject: string;
  html: string;
  replyTo?: string;
  headline: string;
} {
  const isQuick = payload.source === "quick" || payload.full_name !== undefined;
  const labels = isQuick ? QUICK_LABELS : FULL_LABELS;
  const headline = String(
    payload.business_name ?? payload.legal_business_name ?? "Unknown Business",
  );

  const rows = Object.entries(labels)
    .map(([key, label]) => {
      const value = payload[key];
      if (value === undefined || value === null || String(value).trim() === "") return "";
      return htmlRow(label, String(value));
    })
    .join("");

  const submittedAt =
    new Date().toLocaleString("en-US", {
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
        <div style="margin-top:6px;font-size:15px;color:#334155;line-height:1.5">A new funding application was submitted by <strong style="color:#0f172a">${escapeHtml(headline)}</strong>. The full application is attached as a PDF.</div>
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

  const replyTo =
    typeof payload.email === "string" && payload.email ? payload.email : undefined;

  return {
    subject: `New Bayview Advance application: ${headline}`,
    html,
    replyTo,
    headline,
  };
}

// ----- PDF helpers (inline, pdf-lib only) -----

type FieldPair = [string, string];

const PDF_NAVY = rgb(30 / 255, 58 / 255, 92 / 255);
const PDF_SLATE = rgb(71 / 255, 85 / 255, 105 / 255);
const PDF_INK = rgb(15 / 255, 23 / 255, 42 / 255);
const PDF_RULE = rgb(203 / 255, 213 / 255, 225 / 255);

const PAGE_W = 612;
const PAGE_H = 792;
const M = 50;
const CW = PAGE_W - M * 2;

function pdfWrap(text: string, font: PDFFont, size: number, max: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (font.widthOfTextAtSize(test, size) <= max) cur = test;
    else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function pdfBusinessFields(payload: Record<string, unknown>): FieldPair[] {
  const isQuick = payload.source === "quick" || payload.full_name !== undefined;
  if (isQuick) {
    return [
      ["Business Name", String(payload.business_name ?? "")],
      ["Full Name", String(payload.full_name ?? "")],
      ["Email", String(payload.email ?? "")],
      ["Phone", String(payload.phone ?? "")],
      ["Monthly Revenue", String(payload.monthly_revenue_range ?? "")],
      ["Funding Needed", String(payload.funding_needed_range ?? "")],
    ];
  }
  return [
    ["Legal Business Name", String(payload.legal_business_name ?? "")],
    ["DBA", String(payload.dba ?? "")],
    ["Business Start Date", String(payload.business_start_date ?? "")],
    ["Business Address", String(payload.business_address ?? "")],
    ["Entity Type", String(payload.entity_type ?? "")],
    ["State Incorporated", String(payload.state_incorporated ?? "")],
    ["Federal Tax ID (EIN)", String(payload.ein ?? "")],
    ["Industry", String(payload.industry ?? "")],
  ];
}

function pdfOwnerFields(payload: Record<string, unknown>): FieldPair[] {
  const isQuick = payload.source === "quick" || payload.full_name !== undefined;
  if (isQuick) {
    return [["Purpose of Funding", String(payload.purpose ?? "")]];
  }
  return [
    ["Owner Name", String(payload.owner_name ?? "")],
    ["Ownership", String(payload.ownership ?? "")],
    ["Date of Birth", String(payload.date_of_birth ?? "")],
    ["SSN", String(payload.ssn ?? "")],
    ["Home Address", String(payload.home_address ?? "")],
  ];
}

async function generatePdf(
  payload: Record<string, unknown>,
  headline: string,
): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  const page: PDFPage = pdf.addPage([PAGE_W, PAGE_H]);
  const reg = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const ital = await pdf.embedFont(StandardFonts.HelveticaOblique);

  let y = PAGE_H - M;

  // Header bar
  page.drawRectangle({
    x: 0,
    y: y - 56,
    width: PAGE_W,
    height: 56,
    color: PDF_NAVY,
  });
  page.drawText("BAYVIEW ADVANCE", {
    x: M,
    y: y - 24,
    size: 16,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText("Funding Application", {
    x: M,
    y: y - 42,
    size: 11,
    font: reg,
    color: rgb(1, 1, 1),
  });

  const subtitle = "Funding Made Simple";
  const subW = ital.widthOfTextAtSize(subtitle, 11);
  page.drawText(subtitle, {
    x: PAGE_W - M - subW,
    y: y - 32,
    size: 11,
    font: ital,
    color: rgb(1, 1, 1),
  });

  y -= 80;

  // Applicant headline
  page.drawText(headline, {
    x: M,
    y,
    size: 14,
    font: bold,
    color: PDF_INK,
  });
  y -= 24;

  const drawSection = (label: string) => {
    const w = bold.widthOfTextAtSize(label, 11);
    page.drawText(label, {
      x: M + (CW - w) / 2,
      y,
      size: 11,
      font: bold,
      color: PDF_NAVY,
    });
    y -= 6;
    page.drawLine({
      start: { x: M, y },
      end: { x: M + CW, y },
      thickness: 0.75,
      color: PDF_RULE,
    });
    y -= 16;
  };

  const drawField = (label: string, value: string, x: number, fy: number, w: number) => {
    page.drawText(label.toUpperCase(), {
      x,
      y: fy,
      size: 8,
      font: bold,
      color: PDF_SLATE,
    });
    const lines = pdfWrap(value || "—", reg, 10, w);
    let ly = fy - 12;
    for (const line of lines.slice(0, 2)) {
      page.drawText(line, { x, y: ly, size: 10, font: reg, color: PDF_INK });
      ly -= 11;
    }
  };

  const drawGrid = (pairs: FieldPair[]) => {
    const colW = (CW - 20) / 2;
    for (let i = 0; i < pairs.length; i += 2) {
      const left = pairs[i];
      const right = pairs[i + 1];
      drawField(left[0], left[1], M, y, colW);
      if (right) drawField(right[0], right[1], M + colW + 20, y, colW);
      y -= 32;
    }
  };

  drawSection("Business Information");
  drawGrid(pdfBusinessFields(payload));

  y -= 6;
  drawSection("Owner Information");
  drawGrid(pdfOwnerFields(payload));

  // Disclaimer
  y -= 6;
  const disclaimerLines = pdfWrap(DISCLAIMER, reg, 8, CW);
  for (const line of disclaimerLines) {
    if (y < M + 80) break;
    page.drawText(line, { x: M, y, size: 8, font: reg, color: PDF_SLATE });
    y -= 11;
  }

  // Signature row
  y -= 18;
  const halfW = (CW - 20) / 2;
  const sigName =
    String(payload.owner_signature ?? payload.full_name ?? payload.owner_name ?? "");
  const sigDate = String(
    payload.signature_date ?? new Date().toLocaleDateString("en-US"),
  );
  drawField("Owner Signature", sigName, M, y, halfW);
  drawField("Today's Date", sigDate, M + halfW + 20, y, halfW);

  page.drawLine({
    start: { x: M, y: y - 18 },
    end: { x: M + halfW, y: y - 18 },
    thickness: 0.5,
    color: PDF_RULE,
  });
  page.drawLine({
    start: { x: M + halfW + 20, y: y - 18 },
    end: { x: M + CW, y: y - 18 },
    thickness: 0.5,
    color: PDF_RULE,
  });

  const bytes = await pdf.save();
  return Buffer.from(bytes);
}

// ----- Handler -----

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
  const toEmail =
    process.env.APPLICATION_TO_EMAIL ?? "submissions@bayviewadvance.com";

  try {
    const payload = (req.body ?? {}) as Record<string, unknown>;
    const { subject, html, replyTo, headline } = buildEmail(payload);

    let attachment: { filename: string; content: string } | undefined;
    try {
      const pdfBytes = await generatePdf(payload, headline);
      const safeName =
        headline.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "submission";
      attachment = {
        filename: `bayview-advance-application-${safeName}.pdf`,
        content: pdfBytes.toString("base64"),
      };
    } catch (pdfErr) {
      console.error("PDF generation failed; sending email without attachment:", pdfErr);
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo,
      subject,
      html,
      attachments: attachment ? [attachment] : undefined,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ error: error.message ?? "Failed to send email" });
    }

    return res.status(200).json({
      success: true,
      id: data?.id,
      pdfAttached: Boolean(attachment),
    });
  } catch (err) {
    console.error("send-application-email crash:", err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
