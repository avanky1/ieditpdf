import { PDFDocument } from "pdf-lib";
import { readFileAsArrayBuffer } from "./pdf-utils";



export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1_073_741_824) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  return `${(bytes / 1_073_741_824).toFixed(2)} GB`;
}



export interface PageDimension {
  pageNumber: number;
  width: number;
  height: number;
  orientation: "portrait" | "landscape" | "square";
}

export interface PdfFileInfo {
  fileName: string;
  fileSize: number;
  fileSizeFormatted: string;
  pageCount: number;
  pages: PageDimension[];
  pdfVersion: string;
  title: string | undefined;
  author: string | undefined;
  subject: string | undefined;
  creator: string | undefined;
  creationDate: Date | undefined;
  modificationDate: Date | undefined;
}

function detectPdfVersion(buffer: ArrayBuffer): string {
  const header = new Uint8Array(buffer, 0, 20);
  const text = String.fromCharCode(...header);
  const match = text.match(/%PDF-(\d+\.\d+)/);
  return match ? match[1] : "unknown";
}

function orientationOf(w: number, h: number): "portrait" | "landscape" | "square" {
  if (w === h) return "square";
  return h > w ? "portrait" : "landscape";
}

export async function getPdfInfo(file: File): Promise<PdfFileInfo> {
  const buffer = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });

  const pages: PageDimension[] = doc.getPages().map((page, i) => {
    const { width, height } = page.getSize();
    return {
      pageNumber: i + 1,
      width: Math.round(width * 100) / 100,
      height: Math.round(height * 100) / 100,
      orientation: orientationOf(width, height),
    };
  });

  return {
    fileName: file.name,
    fileSize: file.size,
    fileSizeFormatted: formatFileSize(file.size),
    pageCount: doc.getPageCount(),
    pages,
    pdfVersion: detectPdfVersion(buffer),
    title: doc.getTitle(),
    author: doc.getAuthor(),
    subject: doc.getSubject(),
    creator: doc.getCreator(),
    creationDate: doc.getCreationDate(),
    modificationDate: doc.getModificationDate(),
  };
}



export interface PdfSizeAnalysis {
  totalSize: number;
  totalSizeFormatted: string;
  pageCount: number;
  estimatedPerPageSize: number;
  estimatedPerPageSizeFormatted: string;
  isLargeFile: boolean;
  isManyPages: boolean;
}

export async function analyzePdfSize(file: File): Promise<PdfSizeAnalysis> {
  const buffer = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pageCount = doc.getPageCount();
  const estimatedPerPage = pageCount > 0 ? Math.round(file.size / pageCount) : 0;

  return {
    totalSize: file.size,
    totalSizeFormatted: formatFileSize(file.size),
    pageCount,
    estimatedPerPageSize: estimatedPerPage,
    estimatedPerPageSizeFormatted: formatFileSize(estimatedPerPage),
    isLargeFile: file.size > 20 * 1_048_576,
    isManyPages: pageCount > 100,
  };
}
