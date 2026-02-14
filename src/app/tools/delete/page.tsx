"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import PDFThumbnailGrid from "@/components/PDFThumbnailGrid";
import { deletePages } from "@/lib/pdf-page-utils";
import { downloadBlob } from "@/lib/download";

export default function DeletePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReady = useCallback((count: number) => {
    setPageCount(count);
    setSelectedPages(new Set());
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

  async function handleDelete() {
    if (files.length === 0) return;
    if (selectedPages.size === 0) {
      setError("Select at least one page to delete.");
      return;
    }
    if (selectedPages.size >= pageCount) {
      setError("Cannot delete all pages — at least one page must remain.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const indices = Array.from(selectedPages).map((pn) => pn - 1);
      const bytes = await deletePages(files[0], indices);
      setResult(bytes);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete pages");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout
      title="Delete Pages"
      description="Select pages to remove from your PDF."
    >
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={(f) => {
          setFiles(f);
          setResult(null);
          setSelectedPages(new Set());
          setError(null);
        }}
        files={files}
      />

      {files.length > 0 && (
        <>
          <PDFThumbnailGrid
            file={files[0]}
            selectable
            selectedPages={selectedPages}
            onTogglePage={handleToggle}
            onReady={handleReady}
          />
          {selectedPages.size > 0 && (
            <p className="text-xs text-neutral-500">
              {selectedPages.size} page{selectedPages.size > 1 ? "s" : ""} selected
              for deletion
            </p>
          )}
        </>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button
          onClick={handleDelete}
          loading={loading}
          disabled={files.length === 0}
        >
          Delete Selected
        </Button>
        {result && (
          <Button
            variant="secondary"
            onClick={() => downloadBlob(result, "pages-deleted.pdf")}
          >
            Download
          </Button>
        )}
      </div>
    </ToolLayout>
  );
}
