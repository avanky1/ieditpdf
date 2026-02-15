"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import { unlockPdf } from "@/lib/pdf-utils";
import { downloadBlob } from "@/lib/download";

export default function UnlockPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  async function handleProcess() {
    if (files.length === 0 || !password) return;
    setLoading(true);
    try {
      const unlocked = await unlockPdf(files[0], password);
      setResult(unlocked);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to unlock PDF. Check your password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout title="Unlock PDF" description="Remove password protection from a PDF.">
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={(f) => { setFiles(f); setResult(null); }}
        files={files}
      />
      <div>
        <label className="block text-sm text-neutral-600 mb-1">Current password</label>
        <input
          type="password"
          className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter current password"
        />
      </div>
      <div className="flex gap-3">
        <Button onClick={handleProcess} loading={loading} disabled={files.length === 0 || !password}>
          Unlock
        </Button>
        {result && (
          <Button variant="secondary" onClick={() => downloadBlob(result, files[0]?.name || "unlocked.pdf")}>
            Download
          </Button>
        )}
      </div>
    </ToolLayout>
  );
}
