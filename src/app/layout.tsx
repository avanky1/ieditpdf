import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "iEditPDF - Client-Side PDF Toolkit",
  description:
    "Free, private PDF tools that run entirely in your browser. Merge, split, rotate, watermark, protect, convert, and sign PDFs without uploading files.",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 antialiased transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="border-b border-neutral-100 dark:border-neutral-800 transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
              <a href="/" className="text-lg font-semibold tracking-tight hover:opacity-80 transition-opacity">
                iEditPDF
              </a>
              <div className="flex items-center gap-4">
                <span className="text-xs text-neutral-400 hidden sm:inline-block">
                  100% client-side · your files never leave your device
                </span>
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="min-h-screen">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
