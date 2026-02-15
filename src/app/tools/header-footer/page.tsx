"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import { addHeaderFooter } from "@/lib/pdf-page-utils";
import type { HeaderFooterOptions } from "@/lib/pdf-page-utils";
import { downloadBlob } from "@/lib/download";

export default function HeaderFooterPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");
  const [fontSize, setFontSize] = useState(10);
  const [position, setPosition] = useState<HeaderFooterOptions["position"]>("center");
  const [margin, setMargin] = useState(30);

  async function handleProcess() {
    if (files.length === 0) return;
    if (!headerText.trim() && !footerText.trim()) {
      alert("Enter at least a header or footer text.");
      return;
    }
    setLoading(true);
    try {
      const bytes = await addHeaderFooter(files[0], {
        headerText,
        footerText,
        fontSize,
        position,
        margin,
      });
      setResult(bytes);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to add header/footer");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900";

  return (
    <ToolLayout title="Header & Footer" description="Add custom header and footer text to every page.">
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={(f) => { setFiles(f); setResult(null); }}
        files={files}
      />
      {files.length > 0 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Header text</label>
            <input
              type="text"
              className={inputClass}
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              placeholder="e.g. Company Name"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Footer text</label>
            <input
              type="text"
              className={inputClass}
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              placeholder="e.g. Confidential Document"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Position</label>
              <select
                className={inputClass}
                value={position}
                onChange={(e) => setPosition(e.target.value as HeaderFooterOptions["position"])}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Font size</label>
              <input
                type="number"
                min={6}
                max={36}
                className={inputClass}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value) || 10)}
              />
            </div>
            <div>
              <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">Margin (pt)</label>
              <input
                type="number"
                min={10}
                className={inputClass}
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value) || 30)}
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-3">
        <Button
          onClick={handleProcess}
          loading={loading}
          disabled={files.length === 0 || (!headerText.trim() && !footerText.trim())}
        >
          Apply
        </Button>
        {result && (
          <Button variant="secondary" onClick={() => downloadBlob(result, files[0]?.name || "header-footer.pdf")}>
            Download
          </Button>
        )}
      </div>
    </ToolLayout>
  );
}
