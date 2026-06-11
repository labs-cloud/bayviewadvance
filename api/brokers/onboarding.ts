import crypto from "node:crypto";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { ExternalAccountClient } from "google-auth-library";
import { getVercelOidcToken } from "@vercel/functions/oidc";

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
  {
    title: "11. Commission Structure",
    body: [
      "As consideration for Broker's services under this Agreement, the Company shall pay Broker commissions on funded deals in accordance with the following tiered schedule, based on cumulative funded volume during the term of Broker's engagement:",
      "(a) Base Rate - 25% Commission: Broker shall earn a commission rate of twenty-five percent (25%) on all funded deals from the commencement of engagement.",
      "(b) Tier 2 - 30% Commission: Upon Broker's cumulative funded volume reaching two hundred fifty thousand dollars ($250,000), the commission rate shall increase to thirty percent (30%) on all subsequent funded deals.",
      "(c) Tier 3 - 35% Commission: Upon Broker's cumulative funded volume reaching four hundred fifty thousand dollars ($450,000), the commission rate shall further increase to thirty-five percent (35%) on all subsequent funded deals.",
      "Commission thresholds are calculated on a cumulative basis. The Company reserves the right to adjust the commission schedule upon thirty (30) days' written notice to Broker, provided that no adjustment shall reduce commissions already earned on deals funded prior to such notice.",
      "(d) Chargeback Upon Default: In the event that a merchant defaults on a funded deal and fails to satisfy its payment obligations to the Company, the Company shall have the right to recover (chargeback) all or a proportionate portion of the commission previously paid to Broker in connection with that deal. The chargeback amount shall be calculated based on the outstanding unpaid balance at the time of default. The Company may, at its sole discretion, deduct any such chargeback amount from future commissions owed to Broker or demand repayment directly. Broker acknowledges and agrees that commissions are earned only on successfully collected deals, and that this chargeback right is a material term of the compensation arrangement.",
      "(e) Commission Payment Schedule: Commissions shall be paid on a weekly basis, every Thursday, for all deals funded during the preceding calendar week (Monday through Sunday). Payment shall be made via the Company's standard disbursement method. The Company reserves the right to withhold payment on any deal that is under review, subject to a pending chargeback, or otherwise disputed, pending resolution.",
    ],
  },
  {
    title: "12. Forfeiture and Waiver of Claims Upon Breach",
    body: [
      "In the event that Broker breaches any provision of this Agreement, including but not limited to the confidentiality, non-solicitation, or non-competition obligations set forth herein, Broker shall, upon the Company's determination of such breach: (i) immediately forfeit any and all unpaid commissions, compensation, or monies of any kind then owed or accrued by the Company to Broker, and Broker shall have no right to receive or collect any such amounts; and (ii) irrevocably waive, release, and relinquish any and all claims, rights, causes of action, demands, or legal proceedings of any kind against Bayview Advance, its affiliates, officers, directors, employees, and assigns, whether known or unknown, arising out of or related to Broker's engagement, this Agreement, or any compensation or commission allegedly owed.",
      "Broker acknowledges that this forfeiture and waiver constitutes reasonable and agreed-upon liquidated damages in light of the difficulty of calculating the harm caused by a breach, and not a penalty. By signing this Agreement, Broker expressly agrees that, upon breach, Broker shall not initiate, pursue, or participate in any lawsuit, arbitration, administrative proceeding, or other legal action against the Company related to any withheld or forfeited compensation.",
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

// Renders the full signed NDA (sections 1-12 + the broker's drawn signature)
// as a print-ready PDF so the email carries an actual signed document.
async function generateNdaPdf(
  body: SubmissionBody,
  fullName: string,
  agreementDate: string,
  submittedAt: string,
): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  const reg = await pdf.embedFont(StandardFonts.TimesRoman);
  const bold = await pdf.embedFont(StandardFonts.TimesRomanBold);

  const PAGE_W = 612;
  const PAGE_H = 792;
  const M = 56;
  const CW = PAGE_W - M * 2;
  const NAVY = rgb(16 / 255, 32 / 255, 51 / 255);
  const INK = rgb(17 / 255, 17 / 255, 17 / 255);
  const SLATE = rgb(85 / 255, 85 / 255, 85 / 255);
  const RULE = rgb(17 / 255, 17 / 255, 17 / 255);

  let page = pdf.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - M;

  const newPage = () => {
    page = pdf.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - M;
  };
  const ensure = (height: number) => {
    if (y - height < M) newPage();
  };

  const wrap = (text: string, font: typeof reg, size: number, max: number): string[] => {
    const lines: string[] = [];
    for (const rawLine of text.split("\n")) {
      const words = rawLine.split(/\s+/).filter(Boolean);
      let cur = "";
      for (const w of words) {
        const test = cur ? `${cur} ${w}` : w;
        if (font.widthOfTextAtSize(test, size) <= max) cur = test;
        else {
          if (cur) lines.push(cur);
          cur = w;
        }
      }
      lines.push(cur);
    }
    return lines;
  };

  const drawParagraph = (
    text: string,
    font: typeof reg,
    size: number,
    indent = 0,
    gapAfter = 8,
    color = INK,
  ) => {
    for (const line of wrap(text, font, size, CW - indent)) {
      ensure(size + 3);
      page.drawText(line, { x: M + indent, y, size, font, color });
      y -= size + 3;
    }
    y -= gapAfter;
  };

  // Title
  for (const t of ["NON-DISCLOSURE, NON-COMPETE &", "NON-SOLICITATION AGREEMENT"]) {
    const w = bold.widthOfTextAtSize(t, 13);
    page.drawText(t, { x: M + (CW - w) / 2, y, size: 13, font: bold, color: NAVY });
    y -= 18;
  }
  y -= 12;

  drawParagraph(
    `This Agreement (the "Agreement") is made and entered into on ${agreementDate}, by and between ` +
      `Bayview Advance ("Company") and the undersigned broker ("Broker").`,
    reg,
    11,
    0,
    14,
  );

  for (const section of agreementSections) {
    ensure(30);
    page.drawText(section.title, { x: M, y, size: 11, font: bold, color: NAVY });
    y -= 16;
    for (const para of section.body) {
      drawParagraph(para, reg, 10.5, 14, 8);
    }
    y -= 4;
  }

  // Signature block ‚Äî keep it together on one page.
  ensure(130);
  y -= 12;

  if (body.signature?.content) {
    try {
      const img = await pdf.embedPng(Buffer.from(body.signature.content, "base64"));
      const dims = img.scaleToFit(200, 56);
      page.drawImage(img, { x: M, y: y - dims.height, width: dims.width, height: dims.height });
      y -= dims.height;
    } catch (err) {
      console.error("[broker-onboarding] could not embed signature image", err);
    }
  }

  const colW = (CW - 24) / 2;
  page.drawLine({ start: { x: M, y }, end: { x: M + colW, y }, thickness: 0.5, color: RULE });
  page.drawLine({
    start: { x: M + colW + 24, y },
    end: { x: M + CW, y },
    thickness: 0.5,
    color: RULE,
  });
  y -= 12;
  page.drawText("Broker Signature", { x: M, y, size: 9, font: reg, color: SLATE });
  page.drawText(String(body.signatureName || fullName), {
    x: M + colW + 24,
    y,
    size: 11,
    font: reg,
    color: INK,
  });
  y -= 26;

  page.drawLine({ start: { x: M, y }, end: { x: M + colW, y }, thickness: 0.5, color: RULE });
  page.drawLine({
    start: { x: M + colW + 24, y },
    end: { x: M + CW, y },
    thickness: 0.5,
    color: RULE,
  });
  y -= 12;
  page.drawText("Printed Name", { x: M, y, size: 9, font: reg, color: SLATE });
  page.drawText("Date", { x: M + colW + 24, y, size: 9, font: reg, color: SLATE });
  page.drawText(String(body.signatureName || fullName), { x: M, y: y + 14, size: 11, font: reg, color: INK });
  page.drawText(agreementDate, { x: M + colW + 24, y: y + 14, size: 11, font: reg, color: INK });
  y -= 14;

  if (body.companyName) {
    y -= 10;
    page.drawText(`Company / DBA: ${String(body.companyName)}`, { x: M, y, size: 9, font: reg, color: SLATE });
    y -= 12;
  }
  page.drawText(`Electronically submitted at ${submittedAt}.`, { x: M, y, size: 8, font: reg, color: SLATE });

  const bytes = await pdf.save();
  return Buffer.from(bytes);
}

function base64Url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
// Mints a short-lived Google API access token via Workload Identity
// Federation: a fresh Vercel OIDC token is exchanged at STS and used to
// impersonate the service account. Falls back to a service-account private
// key (JWT-bearer) only when GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is set.
async function getGoogleAccessToken(scope: string): Promise<string | null> {
  const serviceAccountEmail =
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    "bayview-onboarding@grounded-block-499021-d1.iam.gserviceaccount.com";
  const audience =
    process.env.GOOGLE_WIF_AUDIENCE ||
    "//iam.googleapis.com/projects/158413387618/locations/global/workloadIdentityPools/vercel/providers/vercel";
  const scopes = scope.split(/\s+/).filter(Boolean);

  // Preferred: Workload Identity Federation (no private key stored).
  try {
    const authClient = ExternalAccountClient.fromJSON({
      type: "external_account",
      audience,
      subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
      token_url: "https://sts.googleapis.com/v1/token",
      service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccountEmail}:generateAccessToken`,
      scopes,
      subject_token_supplier: {
        getSubjectToken: async () => getVercelOidcToken(),
      },
    });
    if (authClient) {
      const { token } = await authClient.getAccessToken();
      if (token) return token;
    }
  } catch (err) {
    console.error("[broker-onboarding] WIF token request failed", err);
  }

  // Fallback: service-account private key (JWT-bearer grant).
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!serviceAccountEmail || !rawKey) return null;

  const privateKey = rawKey.replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64Url(
    JSON.stringify({
      iss: serviceAccountEmail,
      scope,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const signingInput = `${header}.${claims}`;
  const signature = base64Url(crypto.sign("RSA-SHA256", Buffer.from(signingInput), privateKey));
  const assertion = `${signingInput}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!res.ok) {
    console.error("[broker-onboarding] Google token request failed", res.status, await res.text().catch(() => ""));
    return null;
  }
  const data = (await res.json()) as { access_token?: string };
  return data.access_token || null;
}

type DriveFile = { id?: string; webViewLink?: string };

// Creates a Drive folder and returns its id + view link.
async function driveCreateFolder(token: string, name: string, parentId?: string): Promise<DriveFile> {
  const metadata: Record<string, unknown> = { name, mimeType: "application/vnd.google-apps.folder" };
  if (parentId) metadata.parents = [parentId];
  const res = await fetch(
    "https://www.googleapis.com/drive/v3/files?fields=id,webViewLink&supportsAllDrives=true",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(metadata),
    },
  );
  if (!res.ok) {
    throw new Error(`Drive folder create failed: ${res.status} ${await res.text().catch(() => "")}`);
  }
  return (await res.json()) as DriveFile;
}

// Uploads a single binary file into Drive via a multipart/related request.
async function driveUploadFile(
  token: string,
  name: string,
  contentType: string,
  content: Buffer,
  parentId?: string,
): Promise<DriveFile> {
  const metadata: Record<string, unknown> = { name };
  if (parentId) metadata.parents = [parentId];

  const boundary = `bayview-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const pre = Buffer.from(
    `--${boundary}\r\n` +
      "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
      `${JSON.stringify(metadata)}\r\n` +
      `--${boundary}\r\n` +
      `Content-Type: ${contentType}\r\n\r\n`,
    "utf-8",
  );
  const post = Buffer.from(`\r\n--${boundary}--`, "utf-8");
  const bodyBuf = Buffer.concat([pre, content, post]);

  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink&supportsAllDrives=true",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: bodyBuf,
    },
  );
  if (!res.ok) {
    throw new Error(`Drive upload failed: ${res.status} ${await res.text().catch(() => "")}`);
  }
  return (await res.json()) as DriveFile;
}

// Creates a per-broker subfolder under the shared documents folder and uploads
// the signed NDA plus every document the broker submitted. Returns a link to
// that folder.
async function uploadBrokerDocuments(
  token: string,
  body: SubmissionBody,
  fullName: string,
  dateLabel: string,
  ndaPdf: Buffer | null,
): Promise<string> {
  const parentId = process.env.BROKERS_DRIVE_FOLDER_ID || process.env.BROKERS_NDA_FOLDER_ID;
  const folder = await driveCreateFolder(token, `${dateLabel} - ${fullName}`, parentId);
  const folderId = folder.id;

  const uploads: Promise<unknown>[] = [];
  if (ndaPdf) {
    uploads.push(
      driveUploadFile(token, `Signed NDA - ${fullName}.pdf`, "application/pdf", ndaPdf, folderId),
    );
  }
  for (const [key, file] of Object.entries(body.files || {})) {
    if (!file?.data) continue;
    const ext = file.name.match(/\.[a-z0-9]+$/i)?.[0] || "";
    const label = fileLabels[key] || key;
    const buf = Buffer.from(base64FromDataUri(file.data), "base64");
    uploads.push(
      driveUploadFile(
        token,
        `${label} - ${fullName}${ext}`.replace(/[\\/]/g, "-"),
        file.type || "application/octet-stream",
        buf,
        folderId,
      ),
    );
  }
  await Promise.allSettled(uploads);

  // Optionally grant the whole Workspace domain read access to the folder.
  const shareDomain = process.env.BROKERS_NDA_SHARE_DOMAIN;
  if (folderId && shareDomain) {
    await fetch(`https://www.googleapis.com/drive/v3/files/${folderId}/permissions?supportsAllDrives=true`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ role: "reader", type: "domain", domain: shareDomain }),
    }).catch((err) => console.error("[broker-onboarding] folder share failed", err));
  }

  return folder.webViewLink || (folderId ? `https://drive.google.com/drive/folders/${folderId}` : "");
}

// Appends a row to the onboarded-brokers tracking sheet.
async function appendBrokerRow(token: string, values: string[]): Promise<void> {
  const sheetId = process.env.BROKERS_SHEET_ID;
  if (!sheetId) throw new Error("BROKERS_SHEET_ID is not set");
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ values: [values] }),
    },
  );
  if (!res.ok) {
    throw new Error(`Sheets append failed: ${res.status} ${await res.text().catch(() => "")}`);
  }
}

// Logs a new broker to the tracking sheet with a Pending status and a link to
// the Drive folder holding their signed NDA and uploaded documents. Never
// throws: sheet logging must not block the submission.
async function logBrokerToSheet(body: SubmissionBody, fullName: string, ndaPdf: Buffer | null): Promise<void> {
  try {
    const token = await getGoogleAccessToken(
      "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive",
    );
    if (!token) {
      console.warn("[broker-onboarding] Google not configured; skipping broker sheet log");
      return;
    }

    const onboardedDate = new Date().toLocaleDateString("en-US", { timeZone: "America/New_York" });

    let documentsLink = "";
    try {
      documentsLink = await uploadBrokerDocuments(token, body, fullName, onboardedDate, ndaPdf);
    } catch (err) {
      console.error("[broker-onboarding] broker document upload failed", err);
    }

    await appendBrokerRow(token, [
      onboardedDate, // Date Onboarded
      fullName, // Name
      String(body.phone || ""), // Phone Number
      String(body.email || ""), // Email
      "Pending", // Status
      "", // Close Account (filled in manually by ops)
      documentsLink, // Documents (Drive) ‚Äî folder with the NDA and uploaded files
      String(body.notes || ""), // Notes
    ]);
  } catch (err) {
    console.error("[broker-onboarding] broker sheet log failed", err);
  }
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
      "accountNumber",
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
    if (!/^\d{4,17}$/.test(String(body.accountNumber))) {
      return res.status(400).json({ error: "Account number must be 4 to 17 digits" });
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
    const agreementDate = new Date().toLocaleDateString("en-US", { timeZone: "America/New_York" });

    // Attach the signed NDA as a real PDF; fall back to HTML only if PDF
    // generation fails so the email always carries the agreement.
    let ndaPdf: Buffer | null = null;
    try {
      ndaPdf = await generateNdaPdf(body, fullName, agreementDate, submittedAt);
      attachments.unshift({
        filename: `Signed Bayview NDA - ${fullName}.pdf`.replace(/[^\w.\- ()]/g, ""),
        content: ndaPdf.toString("base64"),
        content_type: "application/pdf",
      });
    } catch (err) {
      console.error("[broker-onboarding] NDA PDF generation failed; attaching HTML instead", err);
      attachments.unshift({
        filename: `Signed Bayview NDA - ${fullName}.html`.replace(/[^\w.\- ()]/g, ""),
        content: Buffer.from(signedNdaHtml(body, fullName, submittedAt)).toString("base64"),
        content_type: "text/html",
      });
    }

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
        ${row("Account number", body.accountNumber)}
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

    // Record the broker in the tracking sheet and archive their documents to
    // Drive (non-blocking ‚Äî never fails the submission).
    await logBrokerToSheet(body, fullName, ndaPdf);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("[broker-onboarding] failed", error);
    return res.status(500).json({ error: "Failed to process broker onboarding" });
  }
}
