import { readFileAsArrayBuffer } from "./pdf-utils";
import type { PDFDocumentProxy } from "pdfjs-dist";

export interface Thumbnail {
  pageNum: number;
  dataUrl: string;
  width: number;
  height: number;
}

let pdfjsModule: typeof import("pdfjs-dist") | null = null;

async function getPdfjs() {
  if (pdfjsModule) return pdfjsModule;
  const pdfjs = await import("pdfjs-dist");
  if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }
  pdfjsModule = pdfjs;
  return pdfjs;
}

export async function loadPdfDocument(file: File): Promise<PDFDocumentProxy> {
  const buffer = await readFileAsArrayBuffer(file);
  const pdfjs = await getPdfjs();
  return pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
}

export async function renderSinglePage(
  doc: PDFDocumentProxy,
  pageNum: number,
  scale = 0.3,
): Promise<Thumbnail> {
  const page = await doc.getPage(pageNum);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d")!;

  await page.render({ canvas, canvasContext: ctx, viewport }).promise;
  const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
  page.cleanup();

  return { pageNum, dataUrl, width: viewport.width, height: viewport.height };
}
