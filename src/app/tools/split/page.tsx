"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import { splitPdf, readFileAsArrayBuffer } from "@/lib/pdf-utils";
import { downloadBlob } from "@/lib/download";
import { PDFDocument } from "pdf-lib";

export default function SplitPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Uint8Array[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [rangeInput, setRangeInput] = useState("");

  async function handleFileSelect(selected: File[]) {
    setFiles(selected);
    setResults([]);
    if (selected.length > 0) {
      const buf = await readFileAsArrayBuffer(selected[0]);
      const doc = await PDFDocument.load(buf);
      setPageCount(doc.getPageCount());
      setRangeInput(`1-${doc.getPageCount()}`);
    }
  }

  async function handleProcess() {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const ranges = rangeInput.split(",").map((r) => {
        const [s, e] = r.trim().split("-").map(Number);
        return { start: s - 1, end: (e || s) - 1 };
      });
      const parts = await splitPdf(files[0], ranges);
      setResults(parts);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to split PDF");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout title="Split PDF" description="Extract specific page ranges from a PDF.">
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={handleFileSelect}
        files={files}
      />
      {pageCount > 0 && (
        <div>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-1">{pageCount} pages detected</p>
          <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
            Page ranges (e.g. 1-3, 5-5)
          </label>
          <input
            type="text"
            className="w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-400"
            value={rangeInput}
            onChange={(e) => setRangeInput(e.target.value)}
          />
        </div>
      )}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={handleProcess} loading={loading} disabled={files.length === 0}>
          Split
        </Button>
        {results.map((r, i) => (
          <Button key={i} variant="secondary" onClick={() => downloadBlob(r, files[0]?.name || `split-${i + 1}.pdf`)}>
            Download Part {i + 1}
          </Button>
        ))}
      </div>
    </ToolLayout>
  );
}
