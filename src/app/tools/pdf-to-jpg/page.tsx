"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import Button from "@/components/Button";
import { pdfToJpg } from "@/lib/image-utils";
import { downloadDataUrl } from "@/lib/download";

export default function PdfToJpgPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  async function handleProcess() {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const imgs = await pdfToJpg(files[0]);
      setImages(imgs);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to convert PDF");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout title="PDF to JPG" description="Convert each page of a PDF into a JPG image.">
      <FileUploader
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={(f) => { setFiles(f); setImages([]); }}
        files={files}
      />
      <div className="flex gap-3">
        <Button onClick={handleProcess} loading={loading} disabled={files.length === 0}>
          Convert
        </Button>
      </div>
      {images.length > 0 && (
        <div className="space-y-4">
          {images.map((src, i) => (
            <div key={i} className="border border-neutral-200 rounded-lg overflow-hidden">
              <img src={src} alt={`Page ${i + 1}`} className="w-full" />
              <div className="p-3 flex items-center justify-between">
                <span className="text-xs text-neutral-400">Page {i + 1}</span>
                <Button
                  variant="secondary"
                  onClick={() => downloadDataUrl(src, `page-${i + 1}.jpg`)}
                  className="!text-xs !px-3 !py-1"
                >
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
