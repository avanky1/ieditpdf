"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import { analyzePdfSize } from "@/lib/pdf-info-utils";
import type { PdfSizeAnalysis } from "@/lib/pdf-info-utils";

const MAX_BAR_MB = 50;

export default function AnalyzePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [analysis, setAnalysis] = useState<PdfSizeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(selected: File[]) {
    setFiles(selected);
    setAnalysis(null);
    setError(null);

    if (selected.length === 0) return;

    setLoading(true);
    try {
      const result = await analyzePdfSize(selected[0]);
      setAnalysis(result);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to analyze PDF. The file may be corrupted.",
      );
    } finally {
      setLoading(false);
    }
  }

  const barPercent = analysis
    ? Math.min((analysis.totalSize / (MAX_BAR_MB * 1_048_576)) * 100, 100)
    : 0;

  return (
    <ToolLayout
      title="Size Analyzer"
      description="Analyze the file size and structure of a PDF."
    >
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={handleFiles}
        files={files}
      />

      {loading && (
        <p className="text-sm text-neutral-400">Analyzing…</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {analysis && (
        <div className="space-y-4">

          <div className="grid grid-cols-3 gap-4">
            <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-900">
              <p className="text-xs text-neutral-400 dark:text-neutral-500">Total Size</p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {analysis.totalSizeFormatted}
              </p>
            </div>
            <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-900">
              <p className="text-xs text-neutral-400 dark:text-neutral-500">Pages</p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {analysis.pageCount}
              </p>
            </div>
            <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-900">
              <p className="text-xs text-neutral-400 dark:text-neutral-500">Per Page (est.)</p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {analysis.estimatedPerPageSizeFormatted}
              </p>
            </div>
          </div>


          <div>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-1">
              File size indicator (scale: 0 - {MAX_BAR_MB} MB)
            </p>
            <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  analysis.isLargeFile ? "bg-red-500" : "bg-neutral-900 dark:bg-neutral-100"
                }`}
                style={{ width: `${barPercent}%` }}
              />
            </div>
          </div>


          {(analysis.isLargeFile || analysis.isManyPages) && (
            <div className="space-y-2">
              {analysis.isLargeFile && (
                <p className="text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg px-3 py-2">
                  ⚠ Large file - this PDF is over 20 MB. Processing may be slow
                  in the browser.
                </p>
              )}
              {analysis.isManyPages && (
                <p className="text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg px-3 py-2">
                  ⚠ Many pages - this PDF has over 100 pages. Thumbnail
                  rendering may take a while.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
