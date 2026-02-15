import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { readFileAsArrayBuffer } from "./pdf-utils";


export function parsePageRangeInput(input: string, max: number): number[] {
  const set = new Set<number>();
  const parts = input.split(",").map((s) => s.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      if (isNaN(a) || isNaN(b) || a < 1 || b < 1 || a > max || b > max) {
        throw new Error(`Invalid range "${part}" - pages must be between 1 and ${max}`);
      }
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      for (let i = lo; i <= hi; i++) set.add(i - 1);
    } else {
      const n = Number(part);
      if (isNaN(n) || n < 1 || n > max) {
        throw new Error(`Invalid page "${part}" - must be between 1 and ${max}`);
      }
      set.add(n - 1);
    }
  }

  return Array.from(set).sort((a, b) => a - b);
}


export async function reorderPages(
  file: File,
  order: number[],
): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const src = await PDFDocument.load(bytes);
  const dst = await PDFDocument.create();
  const copied = await dst.copyPages(src, order);
  copied.forEach((p) => dst.addPage(p));
  return dst.save();
}


export async function deletePages(
  file: File,
  indicesToDelete: number[],
): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const src = await PDFDocument.load(bytes);
  const total = src.getPageCount();

  const deleteSet = new Set(indicesToDelete);
  const keep = Array.from({ length: total }, (_, i) => i).filter(
    (i) => !deleteSet.has(i),
  );

  if (keep.length === 0) {
    throw new Error("Cannot delete all pages - at least one page must remain");
  }

  const dst = await PDFDocument.create();
  const copied = await dst.copyPages(src, keep);
  copied.forEach((p) => dst.addPage(p));
  return dst.save();
}


export async function extractPages(
  file: File,
  indicesToExtract: number[],
): Promise<Uint8Array> {
  const sorted = [...indicesToExtract].sort((a, b) => a - b);
  const bytes = await readFileAsArrayBuffer(file);
  const src = await PDFDocument.load(bytes);
  const dst = await PDFDocument.create();
  const copied = await dst.copyPages(src, sorted);
  copied.forEach((p) => dst.addPage(p));
  return dst.save();
}



export interface PageNumberingOptions {
  position: "bottom-center" | "bottom-right";
  startNumber: number;
  fontSize: number;
  margin: number;
}

export async function addPageNumbers(
  file: File,
  opts: PageNumberingOptions,
): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();

  pages.forEach((page, idx) => {
    const { width } = page.getSize();
    const label = String(opts.startNumber + idx);
    const textWidth = font.widthOfTextAtSize(label, opts.fontSize);

    let x: number;
    if (opts.position === "bottom-center") {
      x = (width - textWidth) / 2;
    } else {
      x = width - textWidth - opts.margin;
    }

    page.drawText(label, {
      x,
      y: opts.margin,
      size: opts.fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  });

  return doc.save();
}

export interface HeaderFooterOptions {
  headerText: string;
  footerText: string;
  fontSize: number;
  position: "left" | "center" | "right";
  margin: number;
}

export async function addHeaderFooter(
  file: File,
  opts: HeaderFooterOptions,
): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();

  pages.forEach((page) => {
    const { width, height } = page.getSize();

    if (opts.headerText.trim()) {
      const tw = font.widthOfTextAtSize(opts.headerText, opts.fontSize);
      let x: number;
      if (opts.position === "center") x = (width - tw) / 2;
      else if (opts.position === "right") x = width - tw - opts.margin;
      else x = opts.margin;

      page.drawText(opts.headerText, {
        x,
        y: height - opts.margin - opts.fontSize,
        size: opts.fontSize,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
    }

    if (opts.footerText.trim()) {
      const tw = font.widthOfTextAtSize(opts.footerText, opts.fontSize);
      let x: number;
      if (opts.position === "center") x = (width - tw) / 2;
      else if (opts.position === "right") x = width - tw - opts.margin;
      else x = opts.margin;

      page.drawText(opts.footerText, {
        x,
        y: opts.margin,
        size: opts.fontSize,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
    }
  });

  return doc.save();
}

export async function duplicatePages(
  file: File,
  pageIndices: number[],
  copies: number = 1,
): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const src = await PDFDocument.load(bytes);
  const total = src.getPageCount();
  const dst = await PDFDocument.create();

  const duplicateSet = new Set(pageIndices);
  const allIndices: number[] = [];

  for (let i = 0; i < total; i++) {
    allIndices.push(i);
    if (duplicateSet.has(i)) {
      for (let c = 0; c < copies; c++) {
        allIndices.push(i);
      }
    }
  }

  const copied = await dst.copyPages(src, allIndices);
  copied.forEach((p) => dst.addPage(p));
  return dst.save();
}
