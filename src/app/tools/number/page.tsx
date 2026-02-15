"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import { addPageNumbers } from "@/lib/pdf-page-utils";
import type { PageNumberingOptions } from "@/lib/pdf-page-utils";
import { downloadBlob } from "@/lib/download";

export default function NumberPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  const [position, setPosition] = useState<PageNumberingOptions["position"]>("bottom-center");
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(12);
  const [margin, setMargin] = useState(20);

  async function handleProcess() {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const bytes = await addPageNumbers(files[0], {
        position,
        startNumber,
        fontSize,
        margin,
      });
      setResult(bytes);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to add page numbers");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900";

  return (
    <ToolLayout
      title="Page Numbers"
      description="Add page numbers to every page of your PDF."
    >
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={(f) => {
          setFiles(f);
          setResult(null);
        }}
        files={files}
      />

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-neutral-600 mb-1">Position</label>
            <select
              className={inputClass}
              value={position}
              onChange={(e) =>
                setPosition(e.target.value as PageNumberingOptions["position"])
              }
            >
              <option value="bottom-center">Bottom Center</option>
              <option value="bottom-right">Bottom Right</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-neutral-600 mb-1">Start Number</label>
            <input
              type="number"
              min={1}
              className={inputClass}
              value={startNumber}
              onChange={(e) => setStartNumber(Number(e.target.value) || 1)}
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-600 mb-1">Font Size</label>
            <input
              type="number"
              min={6}
              max={72}
              className={inputClass}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value) || 12)}
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-600 mb-1">Margin (pt)</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value) || 20)}
            />
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={handleProcess}
          loading={loading}
          disabled={files.length === 0}
        >
          Add Numbers
        </Button>
        {result && (
          <Button
            variant="secondary"
            onClick={() => downloadBlob(result, files[0]?.name || "numbered.pdf")}
          >
            Download
          </Button>
        )}
      </div>
    </ToolLayout>
  );
}
