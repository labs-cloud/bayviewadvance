export type EmailField = { label: string; value: string };
export type EmailSection = { heading: string; fields: EmailField[] };

const NAVY = "#1e3a5c";
const NAVY_DARK = "#0f2339";
const SLATE_50 = "#f8fafc";
const SLATE_100 = "#f1f5f9";
const SLATE_300 = "#cbd5e1";
const SLATE_500 = "#64748b";
const SLATE_700 = "#334155";
const SLATE_900 = "#0f172a";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderField(field: EmailField): string {
  return `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid ${SLATE_300};width:45%;vertical-align:top">
        <div style="font-size:11px;letter-spacing:0.6px;text-transform:uppercase;color:${SLATE_500};font-weight:600">${escapeHtml(
          field.label,
        )}</div>
      </td>
      <td style="padding:10px 16px;border-bottom:1px solid ${SLATE_300};color:${SLATE_900};font-size:14px;vertical-align:top">
        ${escapeHtml(field.value || "—")}
      </td>
    </tr>
  `;
}

function renderSection(section: EmailSection): string {
  return `
    <tr>
      <td style="padding:28px 0 8px">
        <div style="font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:${NAVY};font-weight:700;border-bottom:2px solid ${NAVY};padding-bottom:6px">
          ${escapeHtml(section.heading)}
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background:${SLATE_50};border-radius:6px;overflow:hidden">
          ${section.fields.map(renderField).join("")}
        </table>
      </td>
    </tr>
  `;
}

export type EmailTemplateInput = {
  preheader: string;
  headlineBusiness: string;
  submittedAt: string;
  sections: EmailSection[];
  logoUrl: string;
};

export function renderApplicationEmail(input: EmailTemplateInput): string {
  const { preheader, headlineBusiness, submittedAt, sections, logoUrl } = input;
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New Application</title>
</head>
<body style="margin:0;padding:0;background:${SLATE_100};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${SLATE_900}">
  <div style="display:none;font-size:1px;color:${SLATE_100};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">
    ${escapeHtml(preheader)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${SLATE_100};padding:32px 12px">
    <tr>
      <td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 2px rgba(15,23,42,0.08)">
          <tr>
            <td style="background:linear-gradient(135deg, ${NAVY} 0%, ${NAVY_DARK} 100%);padding:28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align:middle">
                    <img src="${logoUrl}" alt="Bayview Advance" width="160" style="display:block;max-width:160px;height:auto;filter:brightness(0) invert(1)" />
                  </td>
                  <td align="right" style="vertical-align:middle;color:#ffffff">
                    <div style="font-size:11px;letter-spacing:1.4px;text-transform:uppercase;opacity:0.75">Funding Application</div>
                    <div style="font-size:16px;font-weight:600;margin-top:4px">Funding Made Simple</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:32px">
              <div style="font-size:22px;font-weight:700;color:${NAVY};line-height:1.3">
                New application received
              </div>
              <div style="margin-top:6px;font-size:15px;color:${SLATE_700};line-height:1.5">
                A new funding application was just submitted by
                <strong style="color:${SLATE_900}">${escapeHtml(headlineBusiness)}</strong>.
                The completed application is attached as a PDF.
              </div>
              <div style="margin-top:10px;font-size:12px;color:${SLATE_500}">Submitted ${escapeHtml(submittedAt)}</div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px">
                ${sections.map(renderSection).join("")}
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:${SLATE_50};padding:20px 32px;border-top:1px solid ${SLATE_300};color:${SLATE_500};font-size:12px;line-height:1.5">
              Bayview Advance &middot; Funding Made Simple<br />
              This message was sent automatically from the Bayview Advance application form. Reply directly to reach the applicant.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
