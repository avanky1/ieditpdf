"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import { removeMetadata } from "@/lib/pdf-utils";
import { downloadBlob } from "@/lib/download";

export default function RemoveMetadataPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  async function handleProcess() {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const cleaned = await removeMetadata(files[0]);
      setResult(cleaned);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to remove metadata");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout title="Remove Metadata" description="Strip author, title, creation date, and other metadata for privacy.">
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={(f) => { setFiles(f); setResult(null); }}
        files={files}
      />
      {files.length > 0 && (
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">The following metadata fields will be cleared:</p>
          <ul className="text-sm text-neutral-500 dark:text-neutral-400 space-y-1 list-disc list-inside">
            <li>Title</li>
            <li>Author</li>
            <li>Subject</li>
            <li>Creator</li>
            <li>Producer</li>
            <li>Keywords</li>
            <li>Creation Date</li>
            <li>Modification Date</li>
          </ul>
        </div>
      )}
      <div className="flex gap-3">
        <Button onClick={handleProcess} loading={loading} disabled={files.length === 0}>
          Remove Metadata
        </Button>
        {result && (
          <Button variant="secondary" onClick={() => downloadBlob(result, files[0]?.name || "clean.pdf")}>
            Download
          </Button>
        )}
      </div>
    </ToolLayout>
  );
}
