"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import { grayscalePdf } from "@/lib/pdf-utils";
import { downloadBlob } from "@/lib/download";

export default function GrayscalePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(80);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  async function handleProcess() {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const gray = await grayscalePdf(files[0], quality);
      setResult(gray);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to convert to grayscale");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout title="Grayscale PDF" description="Convert a color PDF to grayscale.">
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={(f) => { setFiles(f); setResult(null); }}
        files={files}
      />
      {files.length > 0 && (
        <div>
          <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
            Quality ({quality}%)
          </label>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full max-w-xs"
          />
          <p className="text-xs text-neutral-400 mt-1">
            Higher quality = larger file size
          </p>
        </div>
      )}
      <div className="flex gap-3">
        <Button onClick={handleProcess} loading={loading} disabled={files.length === 0}>
          Convert to Grayscale
        </Button>
        {result && (
          <Button variant="secondary" onClick={() => downloadBlob(result, files[0]?.name || "grayscale.pdf")}>
            Download
          </Button>
        )}
      </div>
    </ToolLayout>
  );
}
