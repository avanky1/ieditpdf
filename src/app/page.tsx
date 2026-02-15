"use client";

import { useState } from "react";
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
  { name: "Reverse Pages", description: "Reverse the page order of a PDF", href: "/tools/reverse" },
  { name: "Grayscale PDF", description: "Convert a color PDF to grayscale", href: "/tools/grayscale" },
  { name: "PDF to Text", description: "Extract all text content from a PDF", href: "/tools/pdf-to-text" },
  { name: "Header & Footer", description: "Add header and footer to every page", href: "/tools/header-footer" },
  { name: "Stamp PDF", description: "Add DRAFT, CONFIDENTIAL, or APPROVED stamps", href: "/tools/stamp" },
  { name: "Crop Pages", description: "Trim margins from all pages", href: "/tools/crop" },
  { name: "PDF to PNG", description: "Convert PDF pages to PNG images", href: "/tools/pdf-to-png" },
  { name: "Duplicate Pages", description: "Duplicate specific pages in a PDF", href: "/tools/duplicate" },
  { name: "Remove Metadata", description: "Strip metadata for privacy", href: "/tools/remove-metadata" },
];

export default function Home() {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase())
      )
    : tools;

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">PDF Toolkit</h1>
        <p className="text-neutral-500 mt-2 text-sm">
          Every tool runs in your browser. No uploads, no servers.
        </p>
      </div>

      <div className="relative mb-8">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search tools..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-400 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-neutral-400 dark:text-neutral-500 text-center py-12">
          No tools found for &quot;{query}&quot;
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((tool) => (
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
      )}
    </div>
  );
}
