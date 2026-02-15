"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import { stampPdf, getStampTypes } from "@/lib/pdf-utils";
import { downloadBlob } from "@/lib/download";

const STAMP_OPTIONS = getStampTypes();

export default function StampPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [stampType, setStampType] = useState(STAMP_OPTIONS[0]);
  const [opacity, setOpacity] = useState(0.25);
  const [fontSize, setFontSize] = useState(60);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  async function handleProcess() {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const stamped = await stampPdf(files[0], stampType, opacity, fontSize);
      setResult(stamped);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to add stamp");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900";

  return (
    <ToolLayout title="Stamp PDF" description="Add a colored stamp across all pages of your PDF.">
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={(f) => { setFiles(f); setResult(null); }}
        files={files}
      />
      {files.length > 0 && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Stamp type</label>
            <select
              className={inputClass}
              value={stampType}
              onChange={(e) => setStampType(e.target.value)}
            >
              {STAMP_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Opacity ({Math.round(opacity * 100)}%)
              </label>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Font size</label>
              <input
                type="number"
                min={20}
                max={120}
                className="w-20 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value) || 60)}
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-3">
        <Button onClick={handleProcess} loading={loading} disabled={files.length === 0}>
          Add Stamp
        </Button>
        {result && (
          <Button variant="secondary" onClick={() => downloadBlob(result, files[0]?.name || "stamped.pdf")}>
            Download
          </Button>
        )}
      </div>
    </ToolLayout>
  );
}
