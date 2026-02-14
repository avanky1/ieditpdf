"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import { rotatePdf } from "@/lib/pdf-utils";
import { downloadBlob } from "@/lib/download";

export default function RotatePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [angle, setAngle] = useState(90);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  async function handleProcess() {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const rotated = await rotatePdf(files[0], angle);
      setResult(rotated);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to rotate PDF");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout title="Rotate PDF" description="Rotate all pages in a PDF by a specified angle.">
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={(f) => { setFiles(f); setResult(null); }}
        files={files}
      />
      <div>
        <label className="block text-sm text-neutral-600 mb-1">Rotation angle</label>
        <select
          className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
        >
          <option value={90}>90° clockwise</option>
          <option value={180}>180°</option>
          <option value={270}>90° counter-clockwise</option>
        </select>
      </div>
      <div className="flex gap-3">
        <Button onClick={handleProcess} loading={loading} disabled={files.length === 0}>
          Rotate
        </Button>
        {result && (
          <Button variant="secondary" onClick={() => downloadBlob(result, "rotated.pdf")}>
            Download
          </Button>
        )}
      </div>
    </ToolLayout>
  );
}
