"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import { protectPdf } from "@/lib/pdf-utils";
import { downloadBlob } from "@/lib/download";

export default function ProtectPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  async function handleProcess() {
    if (files.length === 0 || !password) return;
    setLoading(true);
    try {
      const encrypted = await protectPdf(files[0], password);
      setResult(encrypted);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to protect PDF");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout title="Protect PDF" description="Add password protection to a PDF.">
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={(f) => { setFiles(f); setResult(null); }}
        files={files}
      />
      <div>
        <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Password</label>
        <input
          type="password"
          className="w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </div>
      <div className="flex gap-3">
        <Button onClick={handleProcess} loading={loading} disabled={files.length === 0 || !password}>
          Protect
        </Button>
        {result && (
          <Button variant="secondary" onClick={() => downloadBlob(result, files[0]?.name || "protected.pdf")}>
            Download
          </Button>
        )}
      </div>
    </ToolLayout>
  );
}
