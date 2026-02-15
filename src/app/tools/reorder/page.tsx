"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import PDFThumbnailGrid from "@/components/PDFThumbnailGrid";
import { reorderPages } from "@/lib/pdf-page-utils";
import { downloadBlob } from "@/lib/download";

export default function ReorderPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  const handleReady = useCallback((count: number) => {
    setPageOrder(Array.from({ length: count }, (_, i) => i + 1));
  }, []);

  async function handleSave() {
    if (files.length === 0 || pageOrder.length === 0) return;
    setLoading(true);
    try {
      const zeroIndexed = pageOrder.map((pn) => pn - 1);
      const bytes = await reorderPages(files[0], zeroIndexed);
      setResult(bytes);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to reorder pages");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout
      title="Reorder Pages"
      description="Drag and drop thumbnails to reorder pages in your PDF."
    >
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={(f) => {
          setFiles(f);
          setResult(null);
          setPageOrder([]);
        }}
        files={files}
      />

      {files.length > 0 && (
        <PDFThumbnailGrid
          file={files[0]}
          draggable
          pageOrder={pageOrder}
          onReorder={setPageOrder}
          onReady={handleReady}
        />
      )}

      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          loading={loading}
          disabled={files.length === 0 || pageOrder.length === 0}
        >
          Save Reordered PDF
        </Button>
        {result && (
          <Button
            variant="secondary"
            onClick={() => downloadBlob(result, files[0]?.name || "reordered.pdf")}
          >
            Download
          </Button>
        )}
      </div>
    </ToolLayout>
  );
}
