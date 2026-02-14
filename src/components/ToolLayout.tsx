"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function ToolLayout({
  title,
  description,
  children,
}: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="text-sm text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mt-4">
          {title}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 mb-8">{description}</p>
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
