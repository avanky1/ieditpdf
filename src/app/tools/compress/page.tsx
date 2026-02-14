"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import { compressPdf } from "@/lib/pdf-utils";
import { downloadBlob } from "@/lib/download";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function qualityLabel(value: number) {
  if (value <= 20) return "Maximum compression";
  if (value <= 40) return "High compression";
  if (value <= 60) return "Balanced";
  if (value <= 80) return "Light compression";
  return "Minimal compression";
}

export default function CompressPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(30);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  const originalSize = files.length > 0 ? files[0].size : 0;
  const compressedSize = result ? result.byteLength : 0;

  async function handleProcess() {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const compressed = await compressPdf(files[0], quality);
      setResult(compressed);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to compress PDF");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout title="Compress PDF" description="Reduce PDF file size by optimizing images and removing unused data.">
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={(f) => { setFiles(f); setResult(null); }}
        files={files}
      />
      <div>
        <label className="block text-sm text-neutral-600 mb-1">
          Quality — {quality}% <span className="text-neutral-400">({qualityLabel(quality)})</span>
        </label>
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={quality}
          onChange={(e) => { setQuality(Number(e.target.value)); setResult(null); }}
          className="w-full accent-neutral-900"
        />
        <div className="flex justify-between text-xs text-neutral-400 mt-1">
          <span>Smaller file</span>
          <span>Better quality</span>
        </div>
      </div>
      {result && (
        <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-4 text-sm text-neutral-700 space-y-1">
          <div className="flex justify-between">
            <span>Original</span>
            <span className="font-medium">{formatSize(originalSize)}</span>
          </div>
          <div className="flex justify-between">
            <span>Compressed</span>
            <span className="font-medium">{formatSize(compressedSize)}</span>
          </div>
          <div className="flex justify-between border-t border-neutral-200 pt-1 mt-1">
            <span>Saved</span>
            <span className={`font-medium ${originalSize > compressedSize ? "text-green-700" : "text-red-600"}`}>
              {originalSize > compressedSize
                ? `${((1 - compressedSize / originalSize) * 100).toFixed(1)}% smaller`
                : `${((compressedSize / originalSize - 1) * 100).toFixed(1)}% larger`}
            </span>
          </div>
        </div>
      )}
      <div className="flex gap-3">
        <Button onClick={handleProcess} loading={loading} disabled={files.length === 0}>
          Compress
        </Button>
        {result && (
          <Button variant="secondary" onClick={() => downloadBlob(result, "compressed.pdf")}>
            Download
          </Button>
        )}
      </div>
    </ToolLayout>
  );
}
