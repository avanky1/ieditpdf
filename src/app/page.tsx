import Link from "next/link";

const tools = [
  { name: "Merge PDF", description: "Combine multiple PDFs into one", href: "/tools/merge" },
  { name: "Split PDF", description: "Extract pages from a PDF", href: "/tools/split" },
  { name: "Rotate PDF", description: "Rotate all pages in a PDF", href: "/tools/rotate" },
  { name: "Watermark", description: "Add text watermark to a PDF", href: "/tools/watermark" },
  { name: "Protect PDF", description: "Add password protection", href: "/tools/protect" },
  { name: "Unlock PDF", description: "Remove password from a PDF", href: "/tools/unlock" },
  { name: "JPG to PDF", description: "Convert images to PDF", href: "/tools/jpg-to-pdf" },
  { name: "PDF to JPG", description: "Convert PDF pages to images", href: "/tools/pdf-to-jpg" },
  { name: "Sign PDF", description: "Draw and add your signature", href: "/tools/sign" },
  { name: "HTML to PDF", description: "Convert HTML content to PDF", href: "/tools/html-to-pdf" },
  { name: "Reorder Pages", description: "Drag & drop to reorder PDF pages", href: "/tools/reorder" },
  { name: "Delete Pages", description: "Remove specific pages from a PDF", href: "/tools/delete" },
  { name: "Extract Pages", description: "Extract selected pages into a new PDF", href: "/tools/extract" },
  { name: "Page Numbers", description: "Add page numbers to a PDF", href: "/tools/number" },
  { name: "File Inspector", description: "View PDF metadata and details", href: "/tools/inspect" },
  { name: "Size Analyzer", description: "Analyze PDF file size and structure", href: "/tools/analyze" },
  { name: "Compress PDF", description: "Reduce PDF file size", href: "/tools/compress" },
  { name: "Insert Blank Page", description: "Add a blank page at any position", href: "/tools/insert-blank" },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight">PDF Toolkit</h1>
        <p className="text-neutral-500 mt-2 text-sm">
          Every tool runs in your browser. No uploads, no servers.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group border border-neutral-200 rounded-lg p-5 transition-colors duration-150 hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
          >
            <h2 className="text-sm font-medium text-neutral-900 group-hover:text-black dark:text-neutral-100 group-hover:dark:text-white">
              {tool.name}
            </h2>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
