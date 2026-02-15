"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import { addWatermark } from "@/lib/pdf-utils";
import { downloadBlob } from "@/lib/download";

export default function WatermarkPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.3);
  const [fontSize, setFontSize] = useState(50);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  async function handleProcess() {
    if (files.length === 0 || !text.trim()) return;
    setLoading(true);
    try {
      const marked = await addWatermark(files[0], text, opacity, fontSize);
      setResult(marked);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to add watermark");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout title="Add Watermark" description="Add a text watermark across all pages.">
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={(f) => { setFiles(f); setResult(null); }}
        files={files}
      />
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-neutral-600 mb-1">Watermark text</label>
          <input
            type="text"
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div>
            <label className="block text-sm text-neutral-600 mb-1">Opacity ({opacity})</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-600 mb-1">Font size</label>
            <input
              type="number"
              className="w-20 border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Button onClick={handleProcess} loading={loading} disabled={files.length === 0 || !text.trim()}>
          Add Watermark
        </Button>
        {result && (
          <Button variant="secondary" onClick={() => downloadBlob(result, files[0]?.name || "watermarked.pdf")}>
            Download
          </Button>
        )}
      </div>
    </ToolLayout>
  );
}
