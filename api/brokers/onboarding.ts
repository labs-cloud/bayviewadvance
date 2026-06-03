type UploadedFile = {
  name: string;
  type: string;
  size: number;
  data: string;
};

type Attachment = {
  filename: string;
  content: string;
  content_type: string;
};

type JsonRequest = {
  method?: string;
  body?: unknown;
};

type JsonResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => {
    json: (payload: Record<string, unknown>) => void;
  };
};

const fileLabels: Record<string, string> = {
  w9: "W-9 / 1099 tax form",
  id: "Government ID",
  voidedCheck: "Voided check or bank letter",
  brokerAgreement: "Broker agreement or license",
  other: "Other supporting file",
};

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function row(label: string, value: unknown): string {
  return `
    <tr>
      <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;color:#64748b;width:180px;">${escapeHtml(label)}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-weight:600;">${escapeHtml(value || "N/A")}</td>
    </tr>
  `;
}

function base64FromDataUri(value = ""): string {
  return value.includes(",") ? value.split(",")[1] : value;
}

function emailLayout(title: string, subtitle: string, bodyHtml: string): string {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:640px;margin:0 auto;">
      <div style="background:#102033;padding:22px 24px;border-radius:8px 8px 0 0;">
        <h2 style="color:#fff;margin:0;font-size:19px;">${escapeHtml(title)}</h2>
        <p style="color:#a9bdd0;margin:4px 0 0;font-size:14px;">${escapeHtml(subtitle)}</p>
      </div>
      <div style="border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px;font-size:14px;color:#1e293b;">
        ${bodyHtml}
      </div>
    </div>
  `;
}

export default async function handler(req: JsonRequest, res: JsonResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "bankName",
      "accountName",
      "routingNumber",
      "accountLast4",
      "signatureName",
    ];

    for (const field of required) {
      if (!String(body[field] || "").trim()) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email))) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    if (!/^\d{9}$/.test(String(body.routingNumber))) {
      return res.status(400).json({ error: "Routing number must be 9 digits" });
    }
    if (!/^\d{4}$/.test(String(body.accountLast4))) {
      return res.status(400).json({ error: "Account last 4 must be 4 digits" });
    }
    if (!body.agreed || !body.signature?.content) {
      return res.status(400).json({ error: "NDA signature and acknowledgment are required" });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Email is not configured. Add RESEND_API_KEY in Vercel." });
    }

    const attachments: Attachment[] = [
      {
        filename: body.signature.filename || "broker-signature.png",
        content: body.signature.content,
        content_type: body.signature.contentType || "image/png",
      },
    ];

    for (const [key, file] of Object.entries((body.files || {}) as Record<string, UploadedFile | null>)) {
      if (!file?.data) continue;
      if (file.size > 15 * 1024 * 1024) {
        return res.status(400).json({ error: `${file.name} is larger than 15MB` });
      }
      attachments.push({
        filename: `${fileLabels[key] || key} - ${file.name}`.replace(/[^\w.\- ()/]/g, ""),
        content: base64FromDataUri(file.data),
        content_type: file.type || "application/octet-stream",
      });
    }

    const fullName = `${body.firstName} ${body.lastName}`.trim();
    const submittedAt = new Date().toLocaleString("en-US", { timeZone: "America/New_York" }) + " ET";
    const bodyHtml = `
      <p style="margin-top:0;">A broker completed the Bayview Advance onboarding packet.</p>
      <h3 style="font-size:15px;margin:20px 0 8px;">Broker Information</h3>
      <table style="border-collapse:collapse;width:100%;font-size:14px;">
        ${row("Name", fullName)}
        ${row("Company / DBA", body.companyName)}
        ${row("Email", body.email)}
        ${row("Phone", body.phone)}
        ${row("Address", [body.address, body.city, body.state, body.zip].filter(Boolean).join(", "))}
        ${row("Referral source", body.referralSource)}
      </table>

      <h3 style="font-size:15px;margin:20px 0 8px;">Tax & Payout</h3>
      <table style="border-collapse:collapse;width:100%;font-size:14px;">
        ${row("Tax classification", body.taxClassification)}
        ${row("Tax ID last 4", body.taxIdLast4)}
        ${row("Payout method", body.payoutMethod)}
        ${row("Bank name", body.bankName)}
        ${row("Account name", body.accountName)}
        ${row("Routing number", body.routingNumber)}
        ${row("Account last 4", body.accountLast4)}
        ${row("Commission email", body.commissionEmail)}
      </table>

      <h3 style="font-size:15px;margin:20px 0 8px;">NDA Signature</h3>
      <table style="border-collapse:collapse;width:100%;font-size:14px;">
        ${row("Typed legal name", body.signatureName)}
        ${row("Agreement accepted", "Yes")}
        ${row("Submitted at", submittedAt)}
      </table>

      ${body.notes ? `<h3 style="font-size:15px;margin:20px 0 8px;">Notes</h3><p>${escapeHtml(body.notes)}</p>` : ""}
      <p style="color:#64748b;font-size:13px;margin-bottom:0;">Uploaded documents and the signature image are attached to this email.</p>
    `;

    const resend = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Bayview Advance <onboarding@bayviewadvance.com>",
        to: [process.env.BROKER_ONBOARDING_EMAIL || process.env.NOTIFICATION_EMAIL || "labs@optentia.com"],
        subject: `New Bayview Broker Onboarding: ${fullName}`,
        html: emailLayout("New Bayview Broker Onboarding", fullName, bodyHtml),
        attachments,
      }),
    });

    if (!resend.ok) {
      const detail = await resend.text().catch(() => "");
      console.error("[broker-onboarding] Resend rejected", resend.status, detail);
      return res.status(500).json({ error: "The submission could not be emailed. Please try again." });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("[broker-onboarding] failed", error);
    return res.status(500).json({ error: "Failed to process broker onboarding" });
  }
}
