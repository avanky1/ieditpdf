"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import { extractTextFromPdf } from "@/lib/pdf-text-utils";

export default function PdfToTextPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleProcess() {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const extracted = await extractTextFromPdf(files[0]);
      setText(extracted || "(No text found in this PDF)");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to extract text");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownloadTxt() {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const baseName = files[0]?.name?.replace(/\.pdf$/i, "") || "extracted";
    a.download = `${baseName}-text.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout title="PDF to Text" description="Extract all text content from a PDF file.">
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={(f) => { setFiles(f); setText(""); setCopied(false); }}
        files={files}
      />
      <div className="flex gap-3">
        <Button onClick={handleProcess} loading={loading} disabled={files.length === 0}>
          Extract Text
        </Button>
      </div>
      {text && (
        <div className="space-y-3">
          <textarea
            readOnly
            value={text}
            className="w-full h-64 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono resize-y focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
            <Button variant="secondary" onClick={handleDownloadTxt}>
              Download as .txt
            </Button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
