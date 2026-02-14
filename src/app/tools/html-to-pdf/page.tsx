"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import Button from "@/components/Button";
import { htmlToPdf } from "@/lib/html-utils";
import { downloadBlob } from "@/lib/download";

export default function HtmlToPdfPage() {
  const [html, setHtml] = useState(
    "<h1>Hello World</h1>\n<p>This is a sample HTML content that will be converted to PDF.</p>"
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);

  async function handleProcess() {
    if (!html.trim()) return;
    setLoading(true);
    try {
      const pdf = await htmlToPdf(html);
      setResult(pdf);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to convert HTML");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout title="HTML to PDF" description="Convert HTML content into a PDF document.">
      <div>
        <label className="block text-sm text-neutral-600 mb-1">HTML content</label>
        <textarea
          className="w-full h-48 border border-neutral-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-y"
          value={html}
          onChange={(e) => { setHtml(e.target.value); setResult(null); }}
        />
      </div>
      <div className="flex gap-3">
        <Button onClick={handleProcess} loading={loading} disabled={!html.trim()}>
          Convert
        </Button>
        {result && (
          <Button variant="secondary" onClick={() => downloadBlob(result, "document.pdf")}>
            Download
          </Button>
        )}
      </div>
    </ToolLayout>
  );
}
