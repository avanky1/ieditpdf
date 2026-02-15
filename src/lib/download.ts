function brandFilename(filename: string): string {
  const dot = filename.lastIndexOf(".");
  if (dot === -1) return `${filename}-iEditPDF`;
  return `${filename.slice(0, dot)}-iEditPDF${filename.slice(dot)}`;
}

export function downloadBlob(data: Uint8Array, filename: string, mime = "application/pdf") {
  const copy = new Uint8Array(data);
  const blob = new Blob([copy.buffer as ArrayBuffer], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = brandFilename(filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = brandFilename(filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
