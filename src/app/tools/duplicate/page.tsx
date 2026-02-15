"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import PDFThumbnailGrid from "@/components/PDFThumbnailGrid";
import PageSelector from "@/components/PageSelector";
import { duplicatePages, parsePageRangeInput } from "@/lib/pdf-page-utils";
import { downloadBlob } from "@/lib/download";

export default function DuplicatePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [pageCount, setPageCount] = useState(0);
  const [rangeInput, setRangeInput] = useState("");
  const [copies, setCopies] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReady = useCallback((count: number) => {
    setPageCount(count);
    setSelectedPages(new Set());
    setRangeInput(`1-${count}`);
  }, []);

  const handleToggle = useCallback((pageNum: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageNum)) next.delete(pageNum);
      else next.add(pageNum);
      return next;
    });
    setError(null);
  }, []);

  function handleRangeChange(val: string) {
    setRangeInput(val);
    setError(null);
    if (!val.trim()) {
      setSelectedPages(new Set());
      return;
    }
    try {
      const indices = parsePageRangeInput(val, pageCount);
      setSelectedPages(new Set(indices.map((i) => i + 1)));
    } catch {
    }
  }

  async function handleProcess() {
    if (files.length === 0) return;

    let indices: number[];
    if (rangeInput.trim()) {
      try {
        indices = parsePageRangeInput(rangeInput, pageCount);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Invalid page range");
        return;
      }
    } else if (selectedPages.size > 0) {
      indices = Array.from(selectedPages).map((pn) => pn - 1);
    } else {
      setError("Select at least one page to duplicate.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const bytes = await duplicatePages(files[0], indices, copies);
      setResult(bytes);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to duplicate pages");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout title="Duplicate Pages" description="Duplicate specific pages within your PDF.">
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={(f) => {
          setFiles(f);
          setResult(null);
          setSelectedPages(new Set());
          setRangeInput("");
          setError(null);
        }}
        files={files}
      />

      {files.length > 0 && pageCount > 0 && (
        <>
          <div>
            <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
              Number of copies per page
            </label>
            <input
              type="number"
              min={1}
              max={10}
              className="w-24 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              value={copies}
              onChange={(e) => setCopies(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
            />
          </div>
          <PageSelector
            pageCount={pageCount}
            value={rangeInput}
            onChange={handleRangeChange}
          />
        </>
      )}

      {files.length > 0 && (
        <PDFThumbnailGrid
          file={files[0]}
          selectable
          selectedPages={selectedPages}
          onTogglePage={handleToggle}
          onReady={handleReady}
        />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button onClick={handleProcess} loading={loading} disabled={files.length === 0}>
          Duplicate
        </Button>
        {result && (
          <Button variant="secondary" onClick={() => downloadBlob(result, files[0]?.name || "duplicated.pdf")}>
            Download
          </Button>
        )}
      </div>
    </ToolLayout>
  );
}
