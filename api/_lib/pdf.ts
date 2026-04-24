import PDFDocument from "pdfkit";

export type FieldPair = [string, string];

export type ApplicationPdfInput = {
  title?: string;
  subtitle?: string;
  businessFields: FieldPair[];
  ownerFields: FieldPair[];
  disclaimer: string;
  signature: string;
  signatureDate: string;
  logo?: Buffer;
};

const NAVY = "#1e3a5c";
const SLATE = "#475569";
const INK = "#0f172a";
const RULE = "#cbd5e1";

const MARGIN = 50;

function drawSectionHeader(doc: PDFKit.PDFDocument, label: string) {
  doc.moveDown(0.75);
  const y = doc.y;
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor(NAVY)
    .text(label, MARGIN, y, { align: "center", width: doc.page.width - MARGIN * 2 });
  doc
    .moveTo(MARGIN, doc.y + 2)
    .lineTo(doc.page.width - MARGIN, doc.y + 2)
    .lineWidth(0.75)
    .strokeColor(RULE)
    .stroke();
  doc.moveDown(0.75);
}

function drawFieldGrid(doc: PDFKit.PDFDocument, pairs: FieldPair[]) {
  const colWidth = (doc.page.width - MARGIN * 2 - 20) / 2;
  const rowHeight = 34;

  for (let i = 0; i < pairs.length; i += 2) {
    const rowY = doc.y;
    const left = pairs[i];
    const right = pairs[i + 1];

    drawField(doc, left[0], left[1], MARGIN, rowY, colWidth);
    if (right) {
      drawField(doc, right[0], right[1], MARGIN + colWidth + 20, rowY, colWidth);
    }

    doc.y = rowY + rowHeight;
  }
}

function drawField(
  doc: PDFKit.PDFDocument,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
) {
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(SLATE)
    .text(label.toUpperCase(), x, y, { width });
  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor(INK)
    .text(value || "—", x, y + 13, { width });
}

export function generateApplicationPdf(data: ApplicationPdfInput): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "LETTER", margin: MARGIN });
      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Header with logo + title
      const headerTop = MARGIN;
      const logoHeight = 48;
      if (data.logo) {
        try {
          doc.image(data.logo, MARGIN, headerTop, { height: logoHeight });
        } catch {
          // ignore unsupported image
        }
      }

      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor(NAVY)
        .text(
          data.title ?? "BAYVIEW ADVANCE FUNDING APPLICATION",
          MARGIN,
          headerTop + 4,
          { align: "right", width: doc.page.width - MARGIN * 2 },
        );
      doc
        .font("Helvetica-Oblique")
        .fontSize(10)
        .fillColor(SLATE)
        .text(
          data.subtitle ?? "Funding Made Simple",
          MARGIN,
          doc.y + 2,
          { align: "right", width: doc.page.width - MARGIN * 2 },
        );

      doc.y = headerTop + logoHeight + 20;

      // Business Information
      drawSectionHeader(doc, "Business Information");
      drawFieldGrid(doc, data.businessFields);

      // Owner Information
      drawSectionHeader(doc, "Owner Information");
      drawFieldGrid(doc, data.ownerFields);

      // Disclaimer
      doc.moveDown(0.75);
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(SLATE)
        .text(data.disclaimer, MARGIN, doc.y, {
          width: doc.page.width - MARGIN * 2,
          align: "justify",
          lineGap: 1.5,
        });

      // Signature row
      doc.moveDown(1.5);
      const sigY = doc.y;
      const halfWidth = (doc.page.width - MARGIN * 2 - 20) / 2;

      drawField(doc, "Owner Signature", data.signature, MARGIN, sigY, halfWidth);
      drawField(
        doc,
        "Today's Date",
        data.signatureDate,
        MARGIN + halfWidth + 20,
        sigY,
        halfWidth,
      );

      // Signature underlines
      doc
        .moveTo(MARGIN, sigY + 32)
        .lineTo(MARGIN + halfWidth, sigY + 32)
        .strokeColor(RULE)
        .lineWidth(0.5)
        .stroke();
      doc
        .moveTo(MARGIN + halfWidth + 20, sigY + 32)
        .lineTo(MARGIN + halfWidth * 2 + 20, sigY + 32)
        .stroke();

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
