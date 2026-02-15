"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import { mergePdfs } from "@/lib/pdf-utils";
import { downloadBlob } from "@/lib/download";

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  async function handleProcess() {
    if (files.length < 2) return;
    setLoading(true);
    try {
      const merged = await mergePdfs(files);
      setResult(merged);
      setDone(true);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to merge PDFs");
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (result) downloadBlob(result, files[0]?.name || "merged.pdf");
  }

  return (
    <ToolLayout title="Merge PDF" description="Combine multiple PDF files into a single document.">
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        multiple
        onFiles={(f) => { setFiles(f); setDone(false); setResult(null); }}
        files={files}
      />
      <div className="flex gap-3">
        <Button onClick={handleProcess} loading={loading} disabled={files.length < 2}>
          Merge
        </Button>
        {done && (
          <Button variant="secondary" onClick={handleDownload}>
            Download
          </Button>
        )}
      </div>
    </ToolLayout>
  );
}
