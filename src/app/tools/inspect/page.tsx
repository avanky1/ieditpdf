"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import { getPdfInfo } from "@/lib/pdf-info-utils";
import type { PdfFileInfo } from "@/lib/pdf-info-utils";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-neutral-100 dark:border-neutral-800 last:border-0">
      <td className="py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
        {label}
      </td>
      <td className="py-3 px-4 text-sm text-neutral-900 dark:text-neutral-100 break-all">{value || "—"}</td>
    </tr>
  );
}

export default function InspectPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [info, setInfo] = useState<PdfFileInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(selected: File[]) {
    setFiles(selected);
    setInfo(null);
    setError(null);

    if (selected.length === 0) return;

    setLoading(true);
    try {
      const result = await getPdfInfo(selected[0]);
      setInfo(result);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to read PDF. The file may be corrupted.",
      );
    } finally {
      setLoading(false);
    }
  }

  const firstPage = info?.pages[0];

  return (
    <ToolLayout
      title="File Inspector"
      description="View detailed metadata and properties of a PDF file."
    >
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={handleFiles}
        files={files}
      />

      {loading && (
        <p className="text-sm text-neutral-400">Reading PDF…</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {info && (
        <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <tbody>
              <InfoRow label="File Name" value={info.fileName} />
              <InfoRow label="File Size" value={info.fileSizeFormatted} />
              <InfoRow label="Page Count" value={String(info.pageCount)} />
              {firstPage && (
                <>
                  <InfoRow
                    label="Page Size"
                    value={`${firstPage.width} × ${firstPage.height} pt`}
                  />
                  <InfoRow
                    label="Orientation"
                    value={firstPage.orientation.charAt(0).toUpperCase() + firstPage.orientation.slice(1)}
                  />
                </>
              )}
              <InfoRow label="PDF Version" value={info.pdfVersion} />
              <InfoRow label="Title" value={info.title ?? ""} />
              <InfoRow label="Author" value={info.author ?? ""} />
              <InfoRow label="Subject" value={info.subject ?? ""} />
              <InfoRow label="Creator" value={info.creator ?? ""} />
              <InfoRow
                label="Created"
                value={info.creationDate ? info.creationDate.toLocaleString() : ""}
              />
              <InfoRow
                label="Modified"
                value={info.modificationDate ? info.modificationDate.toLocaleString() : ""}
              />
            </tbody>
          </table>
        </div>
      )}
    </ToolLayout>
  );
}
