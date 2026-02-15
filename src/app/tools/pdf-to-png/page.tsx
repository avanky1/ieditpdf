"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import { pdfToPng } from "@/lib/image-utils";
import { downloadDataUrl } from "@/lib/download";

export default function PdfToPngPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [scale, setScale] = useState(2);

  async function handleProcess() {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const imgs = await pdfToPng(files[0], scale);
      setImages(imgs);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to convert PDF");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout title="PDF to PNG" description="Convert each page of a PDF into a high-quality PNG image.">
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={(f) => { setFiles(f); setImages([]); }}
        files={files}
      />
      {files.length > 0 && (
        <div>
          <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
            Resolution scale
          </label>
          <select
            className="border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
          >
            <option value={1}>1× (Standard)</option>
            <option value={2}>2× (High)</option>
            <option value={3}>3× (Very High)</option>
            <option value={4}>4× (Ultra)</option>
          </select>
        </div>
      )}
      <div className="flex gap-3">
        <Button onClick={handleProcess} loading={loading} disabled={files.length === 0}>
          Convert
        </Button>
      </div>
      {images.length > 0 && (
        <div className="space-y-4">
          {images.map((src, i) => (
            <div key={i} className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
              <img src={src} alt={`Page ${i + 1}`} className="w-full" />
              <div className="p-3 flex items-center justify-between">
                <span className="text-xs text-neutral-400">Page {i + 1}</span>
                <Button
                  variant="secondary"
                  onClick={() => downloadDataUrl(src, `${files[0]?.name.replace(/\.pdf$/i, "")}-page-${i + 1}.png`)}
                  className="!text-xs !px-3 !py-1"
                >
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
