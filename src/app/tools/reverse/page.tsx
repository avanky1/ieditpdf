"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import { reversePdf } from "@/lib/pdf-utils";
import { downloadBlob } from "@/lib/download";

export default function ReversePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  async function handleProcess() {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const reversed = await reversePdf(files[0]);
      setResult(reversed);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to reverse pages");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout title="Reverse Pages" description="Reverse the page order of your PDF.">
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={(f) => { setFiles(f); setResult(null); }}
        files={files}
      />
      <div className="flex gap-3">
        <Button onClick={handleProcess} loading={loading} disabled={files.length === 0}>
          Reverse
        </Button>
        {result && (
          <Button variant="secondary" onClick={() => downloadBlob(result, files[0]?.name || "reversed.pdf")}>
            Download
          </Button>
        )}
      </div>
    </ToolLayout>
  );
}
