"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import { cropPdf, readFileAsArrayBuffer } from "@/lib/pdf-utils";
import type { CropMargins } from "@/lib/pdf-utils";
import { downloadBlob } from "@/lib/download";
import { PDFDocument } from "pdf-lib";

export default function CropPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [pageSize, setPageSize] = useState<{ width: number; height: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [top, setTop] = useState(0);
  const [bottom, setBottom] = useState(0);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadPreview = useCallback(async (file: File) => {
    const pdfjsLib = await import("pdfjs-dist");
    if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }
    const arrayBuffer = await file.arrayBuffer();
    const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await doc.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    setPageSize({ width: Math.round(viewport.width), height: Math.round(viewport.height) });

    const scale = 1.5;
    const sv = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = sv.width;
    canvas.height = sv.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, viewport: sv, canvas }).promise;
    setPreviewUrl(canvas.toDataURL("image/jpeg", 0.8));
    canvas.width = 0;
    canvas.height = 0;
    doc.destroy();
  }, []);

  async function handleFiles(f: File[]) {
    setFiles(f);
    setResult(null);
    setTop(0);
    setBottom(0);
    setLeft(0);
    setRight(0);
    setPreviewUrl(null);
    setPageSize(null);
    if (f.length > 0) {
      const buf = await readFileAsArrayBuffer(f[0]);
      const doc = await PDFDocument.load(buf);
      const pg = doc.getPage(0);
      const { width, height } = pg.getSize();
      setPageSize({ width: Math.round(width), height: Math.round(height) });
      loadPreview(f[0]);
    }
  }

  useEffect(() => {
    if (!previewUrl || !pageSize || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const displayW = 400;
      const ratio = displayW / pageSize.width;
      const displayH = pageSize.height * ratio;
      canvas.width = displayW;
      canvas.height = displayH;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, displayW, displayH);

      ctx.fillStyle = "rgba(239, 68, 68, 0.25)";
      const tPx = top * ratio;
      const bPx = bottom * ratio;
      const lPx = left * ratio;
      const rPx = right * ratio;
      ctx.fillRect(0, 0, displayW, tPx);
      ctx.fillRect(0, displayH - bPx, displayW, bPx);
      ctx.fillRect(0, tPx, lPx, displayH - tPx - bPx);
      ctx.fillRect(displayW - rPx, tPx, rPx, displayH - tPx - bPx);

      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(lPx, tPx, displayW - lPx - rPx, displayH - tPx - bPx);
    };
    img.src = previewUrl;
  }, [previewUrl, pageSize, top, bottom, left, right]);

  async function handleProcess() {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const cropped = await cropPdf(files[0], { top, bottom, left, right });
      setResult(cropped);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to crop PDF");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900";

  return (
    <ToolLayout title="Crop Pages" description="Trim margins from all pages of your PDF.">
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={handleFiles}
        files={files}
      />

      {files.length > 0 && pageSize && (
        <div className="space-y-4">
          <p className="text-xs text-neutral-400">
            Page size: {pageSize.width} × {pageSize.height} pt
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Top (pt)</label>
              <input type="number" min={0} max={pageSize.height / 2} className={inputClass} value={top} onChange={(e) => setTop(Math.max(0, Number(e.target.value) || 0))} />
            </div>
            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Bottom (pt)</label>
              <input type="number" min={0} max={pageSize.height / 2} className={inputClass} value={bottom} onChange={(e) => setBottom(Math.max(0, Number(e.target.value) || 0))} />
            </div>
            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Left (pt)</label>
              <input type="number" min={0} max={pageSize.width / 2} className={inputClass} value={left} onChange={(e) => setLeft(Math.max(0, Number(e.target.value) || 0))} />
            </div>
            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Right (pt)</label>
              <input type="number" min={0} max={pageSize.width / 2} className={inputClass} value={right} onChange={(e) => setRight(Math.max(0, Number(e.target.value) || 0))} />
            </div>
          </div>

          {previewUrl && (
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Preview (page 1) — red area will be trimmed</p>
              <canvas
                ref={canvasRef}
                className="border border-neutral-200 dark:border-neutral-700 rounded-lg max-w-full"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={handleProcess} loading={loading} disabled={files.length === 0}>
          Crop
        </Button>
        {result && (
          <Button variant="secondary" onClick={() => downloadBlob(result, files[0]?.name || "cropped.pdf")}>
            Download
          </Button>
        )}
      </div>
    </ToolLayout>
  );
}
