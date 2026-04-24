import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import type { FieldPair } from "./_lib/pdf.js";
import { renderApplicationEmail, EmailSection } from "./_lib/email-template.js";

const DISCLAIMER = `By signing below, each of the above-listed business and business owner(s) (individually and collectively, "you") authorize Bayview Advance ("B/A") and each of its representatives, successors, assigns and designees ("Recipients") that may be involved with or require commercial loans having daily repayment features or Merchant Cash Advance transactions, including without limitation the application(s) herein (collectively, "Transactions") to obtain consumer or personal, business and investigative reports and other information about you, including credit card processor statements and bank statements; bureau or non-consumer reporting agencies; and/or third parties. Equifax, Experian and/or from other credit bureaus, banks, creditors and other third parties. You also authorize B/A to transmit this application form, along with any of the foregoing information obtained in connection with this application, to any or all of the Recipients for the foregoing purposes. You also consent to the release, by any creditor or financial institution, of any information relating to any of you, to B/A and to each of the Recipients, on its own behalf.`;

type Payload = Record<string, unknown> & {
  source?: string;
  email?: string;
};

function str(v: unknown): string {
  if (v === undefined || v === null) return "";
  return String(v);
}

function getHost(req: VercelRequest): string {
  const host =
    (req.headers["x-forwarded-host"] as string | undefined) ??
    (req.headers.host as string | undefined) ??
    process.env.VERCEL_URL;
  return host ?? "bayviewadvance.com";
}

async function fetchLogo(host: string): Promise<Buffer | undefined> {
  try {
    const protocol = host.startsWith("localhost") ? "http" : "https";
    const res = await fetch("https://www.bayviewadvance.com/lovable-uploads/new-logo.png");
    if (!res.ok) return undefined;
    const buf = await res.arrayBuffer();
    return Buffer.from(buf);
  } catch {
    return undefined;
  }
}

function buildSections(payload: Payload): {
  email: EmailSection[];
  businessPdf: FieldPair[];
  ownerPdf: FieldPair[];
  headline: string;
  signature: string;
  signatureDate: string;
} {
  const source = str(payload.source);
  const isQuick = source === "quick" || !!payload.full_name;

  if (isQuick) {
    const headline = str(payload.business_name) || "Unknown Business";
    const contactFields = [
      { label: "Full Name", value: str(payload.full_name) },
      { label: "Business Name", value: str(payload.business_name) },
      { label: "Email", value: str(payload.email) },
      { label: "Phone", value: str(payload.phone) },
    ];
    const fundingFields = [
      { label: "Monthly Revenue", value: str(payload.monthly_revenue_range) },
      { label: "Funding Needed", value: str(payload.funding_needed_range) },
      { label: "Purpose", value: str(payload.purpose) },
    ];

    return {
      email: [
        { heading: "Applicant", fields: contactFields },
        { heading: "Funding Request", fields: fundingFields },
      ],
      businessPdf: [
        ["Business Name", str(payload.business_name)],
        ["Full Name", str(payload.full_name)],
        ["Email", str(payload.email)],
        ["Phone", str(payload.phone)],
        ["Monthly Revenue", str(payload.monthly_revenue_range)],
        ["Funding Needed", str(payload.funding_needed_range)],
      ],
      ownerPdf: [["Purpose of Funding", str(payload.purpose)]],
      headline,
      signature: str(payload.full_name),
      signatureDate: new Date().toLocaleDateString("en-US"),
    };
  }

  // Full application
  const headline = str(payload.legal_business_name) || "Unknown Business";
  const businessFields: FieldPair[] = [
    ["Legal Business Name", str(payload.legal_business_name)],
    ["DBA", str(payload.dba)],
    ["Business Start Date", str(payload.business_start_date)],
    ["Business Address", str(payload.business_address)],
    ["Entity Type", str(payload.entity_type)],
    ["State Incorporated", str(payload.state_incorporated)],
    ["Federal Tax ID (EIN)", str(payload.ein)],
    ["Industry", str(payload.industry)],
  ];
  const ownerFields: FieldPair[] = [
    ["Owner Name", str(payload.owner_name)],
    ["Ownership", str(payload.ownership)],
    ["Date of Birth", str(payload.date_of_birth)],
    ["SSN", str(payload.ssn)],
    ["Home Address", str(payload.home_address)],
  ];
  if (payload.rep) ownerFields.push(["Rep", str(payload.rep)]);

  return {
    email: [
      {
        heading: "Business Information",
        fields: businessFields.map(([label, value]) => ({ label, value })),
      },
      {
        heading: "Owner Information",
        fields: ownerFields.map(([label, value]) => ({ label, value })),
      },
    ],
    businessPdf: businessFields,
    ownerPdf: ownerFields,
    headline,
    signature: str(payload.owner_signature),
    signatureDate: str(payload.signature_date) || new Date().toLocaleDateString("en-US"),
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

  const toEmail = process.env.APPLICATION_TO_EMAIL ?? "submissions@bayviewadvance.com";
  const fromEmail =
    process.env.APPLICATION_FROM_EMAIL ??
    "Bayview Advance <applications@bayviewadvance.com>";

  const payload = (req.body ?? {}) as Payload;
  const host = getHost(req);
  const logoUrl = "https://www.bayviewadvance.com/lovable-uploads/new-logo.png";

  const sections = buildSections(payload);
  const submittedAt = new Date().toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/New_York",
  }) + " ET";

  const html = renderApplicationEmail({
    preheader: `New application from ${sections.headline}`,
    headlineBusiness: sections.headline,
    submittedAt,
    sections: sections.email,
    logoUrl,
  });

  let pdfAttachment: { filename: string; content: string } | undefined;
  try {
    const { generateApplicationPdf } = await import("./_lib/pdf.js");
    const logoBuffer = await fetchLogo(host);
    const pdfBuffer = await generateApplicationPdf({
      businessFields: sections.businessPdf,
      ownerFields: sections.ownerPdf,
      disclaimer: DISCLAIMER,
      signature: sections.signature,
      signatureDate: sections.signatureDate,
      logo: logoBuffer,
    });
    const safeName = sections.headline.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    pdfAttachment = {
      filename: `bayview-advance-application-${safeName || "submission"}.pdf`,
      content: pdfBuffer.toString("base64"),
    };
  } catch (err) {
    console.error("PDF generation failed, sending without attachment:", err);
    // Send email without PDF if generation fails
  }

  const replyTo = typeof payload.email === "string" ? payload.email : undefined;
  const subject = `New Bayview Advance application: ${sections.headline}`;

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo,
      subject,
      html,
      attachments: pdfAttachment ? [pdfAttachment] : undefined,
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
