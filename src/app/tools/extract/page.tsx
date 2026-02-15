"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import PDFThumbnailGrid from "@/components/PDFThumbnailGrid";
import PageSelector from "@/components/PageSelector";
import { extractPages, parsePageRangeInput } from "@/lib/pdf-page-utils";
import { downloadBlob } from "@/lib/download";

export default function ExtractPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [pageCount, setPageCount] = useState(0);
  const [rangeInput, setRangeInput] = useState("");
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

  /** Sync range input → selection set */
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

  async function handleExtract() {
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
      setError("Select at least one page to extract.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const bytes = await extractPages(files[0], indices);
      setResult(bytes);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to extract pages");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout
      title="Extract Pages"
      description="Select pages to extract into a new PDF."
    >
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
          <PageSelector
            pageCount={pageCount}
            value={rangeInput}
            onChange={handleRangeChange}
          />
          <PDFThumbnailGrid
            file={files[0]}
            selectable
            selectedPages={selectedPages}
            onTogglePage={handleToggle}
            onReady={handleReady}
          />
        </>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button
          onClick={handleExtract}
          loading={loading}
          disabled={files.length === 0}
        >
          Extract
        </Button>
        {result && (
          <Button
            variant="secondary"
            onClick={() => downloadBlob(result, files[0]?.name || "extracted.pdf")}
          >
            Download
          </Button>
        )}
      </div>
    </ToolLayout>
  );
}
