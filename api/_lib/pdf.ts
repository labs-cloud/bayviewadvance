import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from "pdf-lib";

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

const NAVY = rgb(30 / 255, 58 / 255, 92 / 255);
const SLATE = rgb(71 / 255, 85 / 255, 105 / 255);
const INK = rgb(15 / 255, 23 / 255, 42 / 255);
const RULE = rgb(203 / 255, 213 / 255, 225 / 255);

const PAGE_WIDTH = 612; // Letter
const PAGE_HEIGHT = 792;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

type Ctx = {
  page: PDFPage;
  cursorY: number;
  regular: PDFFont;
  bold: PDFFont;
  italic: PDFFont;
};

function drawSectionHeader(ctx: Ctx, label: string) {
  ctx.cursorY -= 18;
  const textWidth = ctx.bold.widthOfTextAtSize(label, 11);
  const x = MARGIN + (CONTENT_WIDTH - textWidth) / 2;
  ctx.page.drawText(label, {
    x,
    y: ctx.cursorY,
    size: 11,
    font: ctx.bold,
    color: NAVY,
  });
  ctx.cursorY -= 6;
  ctx.page.drawLine({
    start: { x: MARGIN, y: ctx.cursorY },
    end: { x: MARGIN + CONTENT_WIDTH, y: ctx.cursorY },
    thickness: 0.75,
    color: RULE,
  });
  ctx.cursorY -= 14;
}

function drawField(
  ctx: Ctx,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
) {
  ctx.page.drawText(label.toUpperCase(), {
    x,
    y,
    size: 8,
    font: ctx.bold,
    color: SLATE,
  });
  ctx.page.drawText(value || "—", {
    x,
    y: y - 12,
    size: 10,
    font: ctx.regular,
    color: INK,
    maxWidth: width,
  });
}

function drawFieldGrid(ctx: Ctx, pairs: FieldPair[]) {
  const colWidth = (CONTENT_WIDTH - 20) / 2;
  const rowHeight = 30;

  for (let i = 0; i < pairs.length; i += 2) {
    const left = pairs[i];
    const right = pairs[i + 1];

    drawField(ctx, left[0], left[1], MARGIN, ctx.cursorY, colWidth);
    if (right) {
      drawField(ctx, right[0], right[1], MARGIN + colWidth + 20, ctx.cursorY, colWidth);
    }

    ctx.cursorY -= rowHeight;
  }
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const attempt = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(attempt, size) <= maxWidth) {
      current = attempt;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function generateApplicationPdf(
  data: ApplicationPdfInput,
): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);

  const ctx: Ctx = {
    page,
    cursorY: PAGE_HEIGHT - MARGIN,
    regular,
    bold,
    italic,
  };

  // Header: logo left, title right
  const headerTop = ctx.cursorY;
  const logoHeight = 44;
  if (data.logo) {
    try {
      const img = await pdf.embedPng(data.logo);
      const scaled = img.scaleToFit(150, logoHeight);
      page.drawImage(img, {
        x: MARGIN,
        y: headerTop - logoHeight + (logoHeight - scaled.height) / 2,
        width: scaled.width,
        height: scaled.height,
      });
    } catch {
      // skip unsupported image
    }
  }

  const title = data.title ?? "BAYVIEW ADVANCE FUNDING APPLICATION";
  const titleWidth = bold.widthOfTextAtSize(title, 13);
  page.drawText(title, {
    x: PAGE_WIDTH - MARGIN - titleWidth,
    y: headerTop - 14,
    size: 13,
    font: bold,
    color: NAVY,
  });

  const subtitle = data.subtitle ?? "Funding Made Simple";
  const subtitleWidth = italic.widthOfTextAtSize(subtitle, 10);
  page.drawText(subtitle, {
    x: PAGE_WIDTH - MARGIN - subtitleWidth,
    y: headerTop - 30,
    size: 10,
    font: italic,
    color: SLATE,
  });

  ctx.cursorY = headerTop - logoHeight - 20;

  drawSectionHeader(ctx, "Business Information");
  drawFieldGrid(ctx, data.businessFields);

  drawSectionHeader(ctx, "Owner Information");
  drawFieldGrid(ctx, data.ownerFields);

  // Disclaimer
  ctx.cursorY -= 10;
  const disclaimerLines = wrapText(data.disclaimer, regular, 8, CONTENT_WIDTH);
  for (const line of disclaimerLines) {
    page.drawText(line, {
      x: MARGIN,
      y: ctx.cursorY,
      size: 8,
      font: regular,
      color: SLATE,
    });
    ctx.cursorY -= 11;
  }

  // Signature row
  ctx.cursorY -= 20;
  const halfWidth = (CONTENT_WIDTH - 20) / 2;
  const sigY = ctx.cursorY;
  drawField(ctx, "Owner Signature", data.signature, MARGIN, sigY, halfWidth);
  drawField(ctx, "Today's Date", data.signatureDate, MARGIN + halfWidth + 20, sigY, halfWidth);

  // Signature underlines
  const lineY = sigY - 18;
  page.drawLine({
    start: { x: MARGIN, y: lineY },
    end: { x: MARGIN + halfWidth, y: lineY },
    thickness: 0.5,
    color: RULE,
  });
  page.drawLine({
    start: { x: MARGIN + halfWidth + 20, y: lineY },
    end: { x: MARGIN + CONTENT_WIDTH, y: lineY },
    thickness: 0.5,
    color: RULE,
  });

  const bytes = await pdf.save();
  return Buffer.from(bytes);
}
