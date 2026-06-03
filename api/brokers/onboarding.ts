type UploadedFile = {
  name: string;
  type: string;
  size: number;
  data: string;
};

type SignaturePayload = {
  filename?: string;
  contentType?: string;
  content?: string;
};

type SubmissionBody = Record<string, unknown> & {
  agreed?: boolean;
  files?: Record<string, UploadedFile | null>;
  signature?: SignaturePayload;
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
  other: "Other supporting file",
};

const agreementSections: { title: string; body: string[] }[] = [
  {
    title: "1. Purpose",
    body: [
      "The purpose of this Agreement is to protect the Company's legitimate business interests, including its confidential information, proprietary systems, client and referral relationships, and goodwill developed through the Company's investment of time and resources. For purposes of this Agreement, references to the Company shall include its affiliates, subsidiaries, officers, and assigns, and the term Broker shall include any entity or individual acting on behalf of the Broker.",
      "This Agreement sets forth the Broker's obligations concerning the protection of such interests, including duties of confidentiality, non-solicitation, and limited non-competition, each of which is intended to be reasonable and necessary for the fair protection of the Company's business. The parties acknowledge that the Broker is an independent contractor and not an employee, partner, or agent of the Company, and nothing in this Agreement shall be construed to create any employment relationship.",
    ],
  },
  {
    title: "2. Confidential Information",
    body: [
      "Broker acknowledges that, during the course of their engagement, they will have access to the Company's confidential and proprietary information, including but not limited to client and referral lists, leads, pricing and commission structures, marketing materials, scripts, training systems, business strategies, financial data, and technology platforms (collectively, Confidential Information). Broker agrees that they shall not, during or after their engagement, directly or indirectly disclose, copy, retain, or use any Confidential Information for any purpose other than in furtherance of the Company's business. The obligations under this section shall not apply to information that becomes public through no fault of the Broker.",
    ],
  },
  {
    title: "3. Non-Solicitation",
    body: [
      "During the term of this Agreement and for a period of twelve (12) months following the termination of Broker's engagement, Broker shall not, directly or indirectly, solicit or attempt to solicit any client, prospective client, or referral source with whom the Broker had material contact through the Company, for the purpose of providing products or services that compete with those offered by the Company. Broker shall likewise not solicit or induce any employee, contractor, or vendor of the Company to terminate or reduce their relationship with the Company.",
    ],
  },
  {
    title: "4. Non-Competition",
    body: [
      "For a period of twelve (12) months following the termination of Broker's engagement, Broker shall not, without the Company's prior written consent, directly or indirectly engage in, own, manage, operate, or provide services to any business that competes with the Company in the merchant cash-advance or alternative funding industry within the geographic area in which the Broker performed services for the Company.",
      "This restriction applies only to activities that are the same as or substantially similar to those the Broker performed for the Company and only to the extent necessary to protect the Company's confidential information and goodwill. Nothing in this Section shall prevent the Broker from earning a livelihood in a non-competitive capacity or from owning stock, shares, or equity of any publicly traded company.",
    ],
  },
  {
    title: "5. Return of Materials",
    body: [
      "Upon termination of Broker's engagement for any reason, Broker shall immediately return to the Company all property, records, and materials belonging to the Company, whether in physical or electronic form, including but not limited to client and lead information, data, scripts, marketing materials, access credentials, and any copies thereof. Broker further agrees to permanently delete all such materials from any personal devices, accounts, or storage systems and, upon request, certify in writing that all Company materials have been returned or deleted.",
    ],
  },
  {
    title: "6. Remedies",
    body: [
      "Broker acknowledges that a breach or threatened breach of this Agreement may cause the Company irreparable harm for which monetary damages would be inadequate. Accordingly, the Company shall be entitled, in addition to any other remedies available at law or in equity, to seek temporary, preliminary, and permanent injunctive relief to prevent or restrain any such breach, without the necessity of posting a bond. Nothing in this Agreement shall limit the Company's right to pursue monetary damages or any other relief as may be appropriate.",
    ],
  },
  {
    title: "7. Governing Law",
    body: [
      "This Agreement shall be governed by, and construed in accordance with, the laws of the State of New York, without regard to its conflict of laws principles. Any dispute arising out of or relating to this Agreement shall be brought exclusively in the state or federal courts located in Kings County (Brooklyn), New York, and each party hereby consents to the personal jurisdiction and venue of such courts.",
    ],
  },
  {
    title: "8. Entire Agreement",
    body: [
      "This Agreement constitutes the entire understanding between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements, representations, or understandings, whether oral or written. No modification or waiver of any provision of this Agreement shall be effective unless in writing and signed by both parties.",
    ],
  },
  {
    title: "9. Miscellaneous",
    body: [
      "This Agreement may be executed in one or more counterparts, each of which shall be deemed an original and all of which together shall constitute one and the same instrument. Signatures delivered electronically, including via DocuSign or other recognized electronic signature platform, or by scanned copy, shall be deemed to have the same force and effect as original signatures.",
      "No presumption or inference shall be drawn against either party based on the drafting of this Agreement. Each party acknowledges that they have had the opportunity to review this Agreement and to seek the advice of independent legal counsel before signing. If any provision of this Agreement is held to be invalid or unenforceable, such provision shall be limited or modified to the minimum extent necessary to make it enforceable, and the remaining provisions shall remain in full force and effect.",
    ],
  },
  {
    title: "10. Acknowledgment",
    body: [
      "Broker acknowledges that the restrictions in this Agreement are reasonable and necessary to protect the Company's legitimate business interests, and that Broker has received adequate consideration in exchange for entering into this Agreement.",
    ],
  },
];

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

function signedNdaHtml(body: SubmissionBody, fullName: string, submittedAt: string): string {
  const signatureSrc = `data:${body.signature?.contentType || "image/png"};base64,${body.signature?.content || ""}`;
  const agreementDate = new Date().toLocaleDateString("en-US", { timeZone: "America/New_York" });
  const sections = agreementSections
    .map(
      (section) => `
        <h2>${escapeHtml(section.title)}</h2>
        ${section.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      `,
    )
    .join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Bayview Advance Signed NDA - ${escapeHtml(fullName)}</title>
  <style>
    @page { margin: 0.75in; }
    body {
      font-family: "Times New Roman", Times, serif;
      color: #111;
      font-size: 12pt;
      line-height: 1.42;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.25in;
    }
    h1 {
      text-align: center;
      font-size: 14pt;
      line-height: 1.2;
      margin: 0 0 28px;
      text-transform: uppercase;
    }
    h2 {
      font-size: 12pt;
      margin: 18px 0 8px;
    }
    p {
      margin: 0 0 10px;
      text-indent: 0.35in;
    }
    .intro {
      text-indent: 0;
      text-align: center;
      margin-bottom: 18px;
    }
    .signature-block {
      break-inside: avoid;
      margin-top: 34px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 26px;
      align-items: end;
    }
    .signature-line {
      border-bottom: 1px solid #111;
      min-height: 48px;
      display: flex;
      align-items: end;
    }
    .signature-line img {
      max-height: 64px;
      max-width: 260px;
      object-fit: contain;
      margin-bottom: 3px;
    }
    .label {
      font-family: Arial, sans-serif;
      font-size: 9pt;
      color: #333;
      margin-top: 5px;
      text-indent: 0;
    }
    .metadata {
      margin-top: 20px;
      font-family: Arial, sans-serif;
      font-size: 9pt;
      color: #555;
      text-indent: 0;
    }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <h1>Non-Disclosure, Non-Compete &<br />Non-Solicitation Agreement</h1>
  <p class="intro">
    This Agreement (the "Agreement") is made and entered into on ${escapeHtml(agreementDate)},
    by and between Bayview Advance ("Company") and the undersigned broker ("Broker").
  </p>
  ${sections}
  <div class="signature-block">
    <div>
      <div class="signature-line"><img src="${signatureSrc}" alt="Broker signature" /></div>
      <p class="label">Broker Signature</p>
    </div>
    <div>
      <div class="signature-line">${escapeHtml(body.signatureName || fullName)}</div>
      <p class="label">Printed Name</p>
    </div>
    <div>
      <div class="signature-line">${escapeHtml(agreementDate)}</div>
      <p class="label">Date</p>
    </div>
    <div>
      <div class="signature-line">${escapeHtml(body.companyName || "")}</div>
      <p class="label">Company / DBA, if applicable</p>
    </div>
  </div>
  <p class="metadata">Electronically submitted at ${escapeHtml(submittedAt)}.</p>
</body>
</html>`;
}

export default async function handler(req: JsonRequest, res: JsonResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body || {}) as SubmissionBody;
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
    if (!body.files?.id?.data) {
      return res.status(400).json({ error: "Government ID is required" });
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

    for (const [key, file] of Object.entries(body.files || {})) {
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
    attachments.unshift({
      filename: `Signed Bayview NDA - ${fullName}.html`.replace(/[^\w.\- ()]/g, ""),
      content: Buffer.from(signedNdaHtml(body, fullName, submittedAt)).toString("base64"),
      content_type: "text/html",
    });

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
      <p style="color:#64748b;font-size:13px;margin-bottom:0;">Uploaded documents and a print-ready signed NDA are attached to this email.</p>
    `;

    const resend = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.EMAIL_FROM ||
          process.env.APPLICATION_FROM_EMAIL ||
          "Bayview Advance <onboarding@bayviewadvance.com>",
        to: [
          process.env.BROKER_ONBOARDING_EMAIL ||
            process.env.NOTIFICATION_EMAIL ||
            process.env.APPLICATION_TO_EMAIL ||
            "labs@optentia.com",
        ],
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
