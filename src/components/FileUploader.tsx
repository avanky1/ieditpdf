"use client";

import { useCallback } from "react";
import { useDropzone, Accept, FileRejection } from "react-dropzone";

interface FileUploaderProps {
  accept?: Accept;
  multiple?: boolean;
  maxSizeMB?: number;
  onFiles: (files: File[]) => void;
  files: File[];
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function FileUploader({
  accept,
  multiple = false,
  maxSizeMB = 50,
  onFiles,
  files,
}: FileUploaderProps) {
  const maxSize = maxSizeMB * 1024 * 1024;

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      if (rejected.length > 0) {
        alert(rejected[0].errors[0].message);
        return;
      }
      onFiles(accepted);
    },
    [onFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-150 ${
          isDragActive
            ? "border-neutral-900 bg-neutral-50 dark:border-neutral-100 dark:bg-neutral-800"
            : "border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500 dark:bg-neutral-900/50"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {isDragActive
            ? "Drop files here"
            : multiple
            ? "Drag & drop files here, or click to select"
            : "Drag & drop a file here, or click to select"}
        </p>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
          Max {maxSizeMB} MB per file
        </p>
      </div>

      {files.length > 0 && (
        <ul className="mt-3 space-y-1">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between text-sm text-neutral-700 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 rounded"
            >
              <span className="truncate mr-2">{f.name}</span>
              <span className="text-neutral-400 dark:text-neutral-500 text-xs whitespace-nowrap">
                {formatSize(f.size)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
