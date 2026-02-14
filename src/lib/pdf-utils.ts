import { PDFDocument, rgb, StandardFonts, degrees, PageSizes } from "pdf-lib";

export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const bytes = await readFileAsArrayBuffer(file);
    const doc = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }
  return merged.save();
}

export async function splitPdf(
  file: File,
  ranges: { start: number; end: number }[]
): Promise<Uint8Array[]> {
  const bytes = await readFileAsArrayBuffer(file);
  const src = await PDFDocument.load(bytes);
  const results: Uint8Array[] = [];

  for (const range of ranges) {
    const doc = await PDFDocument.create();
    const indices = [];
    for (let i = range.start; i <= range.end && i < src.getPageCount(); i++) {
      indices.push(i);
    }
    const pages = await doc.copyPages(src, indices);
    pages.forEach((p) => doc.addPage(p));
    results.push(await doc.save());
  }

  return results;
}

export async function rotatePdf(
  file: File,
  angle: number
): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(bytes);
  doc.getPages().forEach((page) => {
    page.setRotation(degrees(page.getRotation().angle + angle));
  });
  return doc.save();
}

export async function addWatermark(
  file: File,
  text: string,
  opacity = 0.3,
  fontSize = 50
): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  doc.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity,
      rotate: degrees(-45),
    });
  });

  return doc.save();
}

export async function protectPdf(
  file: File,
  password: string
): Promise<Uint8Array> {
  const { encryptPDF } = await import("@pdfsmaller/pdf-encrypt-lite");
  const bytes = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(bytes);
  const pdfBytes = await doc.save();
  return encryptPDF(new Uint8Array(pdfBytes), password, password);
}

export async function unlockPdf(
  file: File,
  _password: string
): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return doc.save();
}

export async function addSignature(
  file: File,
  signatureDataUrl: string,
  pageIndex = 0,
  x = 50,
  y = 50,
  width = 200,
  height = 80
): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(bytes);

  const response = await fetch(signatureDataUrl);
  const sigBytes = new Uint8Array(await response.arrayBuffer());
  const sigImage = await doc.embedPng(sigBytes);

  const page = doc.getPage(pageIndex);
  page.drawImage(sigImage, { x, y, width, height });

  return doc.save();
}

export async function compressPdf(
  file: File,
  quality: number
): Promise<Uint8Array> {
  const pdfjsLib = await import("pdfjs-dist");
  if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }

  const clamped = Math.max(1, Math.min(100, quality));
  const t = (clamped - 1) / 99;
  const scale = 0.3 + t * 0.9;
  const jpegQuality = 0.15 + t * 0.6;

  const arrayBuffer = await readFileAsArrayBuffer(file);
  const srcDoc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const newDoc = await PDFDocument.create();

  for (let i = 1; i <= srcDoc.numPages; i++) {
    const page = await srcDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;

    const jpegDataUrl = canvas.toDataURL("image/jpeg", jpegQuality);
    const jpegBytes = Uint8Array.from(atob(jpegDataUrl.split(",")[1]), (c) => c.charCodeAt(0));
    const jpegImage = await newDoc.embedJpg(jpegBytes);

    const newPage = newDoc.addPage([viewport.width / scale, viewport.height / scale]);
    newPage.drawImage(jpegImage, {
      x: 0,
      y: 0,
      width: newPage.getWidth(),
      height: newPage.getHeight(),
    });

    canvas.width = 0;
    canvas.height = 0;
    page.cleanup();
  }

  srcDoc.destroy();
  return newDoc.save();
}

export async function insertBlankPage(
  file: File,
  afterPage: number,
  pageSize: [number, number] = PageSizes.A4
): Promise<Uint8Array> {
  const bytes = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(bytes);
  const total = doc.getPageCount();
  const insertIndex = Math.max(0, Math.min(afterPage, total));

  if (total > 0) {
    const refIndex = Math.min(insertIndex, total - 1);
    const refPage = doc.getPage(refIndex);
    const { width, height } = refPage.getSize();
    pageSize = [width, height];
  }

  doc.insertPage(insertIndex, pageSize);
  return doc.save();
}
