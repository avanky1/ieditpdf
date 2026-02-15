"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import { jpgToPdf } from "@/lib/image-utils";
import { downloadBlob } from "@/lib/download";

export default function JpgToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  async function handleProcess() {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const pdf = await jpgToPdf(files);
      setResult(pdf);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to convert images");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout title="JPG to PDF" description="Convert one or more images into a PDF document.">
      <FileUploader
        accept={{ "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }}
        multiple
        onFiles={(f) => { setFiles(f); setResult(null); }}
        files={files}
      />
      <div className="flex gap-3">
        <Button onClick={handleProcess} loading={loading} disabled={files.length === 0}>
          Convert
        </Button>
        {result && (
          <Button variant="secondary" onClick={() => downloadBlob(result, files[0]?.name.replace(/\.\w+$/, ".pdf") || "images.pdf")}>
            Download
          </Button>
        )}
      </div>
    </ToolLayout>
  );
}
