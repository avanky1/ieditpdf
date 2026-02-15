"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import { insertBlankPage, readFileAsArrayBuffer } from "@/lib/pdf-utils";
import { downloadBlob } from "@/lib/download";
import { PDFDocument } from "pdf-lib";

export default function InsertBlankPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [position, setPosition] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  async function handleFiles(f: File[]) {
    setFiles(f);
    setResult(null);
    if (f.length > 0) {
      const buf = await readFileAsArrayBuffer(f[0]);
      const doc = await PDFDocument.load(buf);
      const count = doc.getPageCount();
      setPageCount(count);
      setPosition(count);
    } else {
      setPageCount(0);
      setPosition(1);
    }
  }

  async function handleProcess() {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const processed = await insertBlankPage(files[0], position);
      setResult(processed);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to insert blank page");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout title="Insert Blank Page" description="Add a blank page at any position in your PDF.">
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={handleFiles}
        files={files}
      />
      {pageCount > 0 && (
        <div>
          <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-2">Insert position</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { setPosition(Math.max(0, position - 1)); setResult(null); }}
              disabled={position === 0}
              className="w-10 h-10 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center text-lg font-medium transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              −
            </button>
            <div className="flex-1 text-center">
              <input
                type="number"
                min="0"
                max={pageCount}
                value={position}
                onChange={(e) => {
                  const v = Math.max(0, Math.min(pageCount, Number(e.target.value) || 0));
                  setPosition(v);
                  setResult(null);
                }}
                className="w-20 text-center border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm font-medium bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-400"
              />
              <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-2">of {pageCount}</span>
            </div>
            <button
              type="button"
              onClick={() => { setPosition(Math.min(pageCount, position + 1)); setResult(null); }}
              disabled={position === pageCount}
              className="w-10 h-10 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center text-lg font-medium transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              +
            </button>
          </div>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2 text-center">
            {position === 0
              ? "Before page 1 (at the very beginning)"
              : position === pageCount
              ? `After page ${pageCount} (at the very end)`
              : `Between page ${position} and page ${position + 1}`}
          </p>
        </div>
      )}
      <div className="flex gap-3">
        <Button onClick={handleProcess} loading={loading} disabled={files.length === 0}>
          Insert Page
        </Button>
        {result && (
          <Button variant="secondary" onClick={() => downloadBlob(result, files[0]?.name || "with-blank-page.pdf")}>
            Download
          </Button>
        )}
      </div>
    </ToolLayout>
  );
}
