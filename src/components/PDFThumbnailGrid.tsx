"use client";

import { useState, useEffect, useCallback, useRef, memo } from "react";
import type { Thumbnail } from "@/lib/pdf-thumbnail";
import type { PDFDocumentProxy } from "pdfjs-dist";

interface TileProps {
  pageNum: number;
  thumb: Thumbnail | null;
  index: number;
  selected: boolean;
  selectable: boolean;
  draggable: boolean;
  onVisible: (pageNum: number) => void;
  onToggle: (pageNum: number) => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
}

const Tile = memo(function Tile({
  pageNum,
  thumb,
  index,
  selected,
  selectable,
  draggable: isDraggable,
  onVisible,
  onToggle,
  onDragStart,
  onDragOver,
  onDragEnd,
}: TileProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || thumb) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onVisible(pageNum);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [pageNum, thumb, onVisible]);

  return (
    <div
      ref={ref}
      className={`relative border rounded-lg overflow-hidden bg-neutral-50 dark:bg-neutral-800 ${
        selected ? "ring-2 ring-neutral-900 dark:ring-neutral-50 border-transparent" : "border-neutral-200 dark:border-neutral-700"
      } ${isDraggable ? "cursor-grab active:cursor-grabbing" : ""}`}
      draggable={isDraggable}
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(index);
      }}
      onDragEnd={onDragEnd}
      onClick={() => selectable && onToggle(pageNum)}
    >
      {thumb ? (
        <img
          src={thumb.dataUrl}
          alt={`Page ${pageNum}`}
          className="w-full h-auto"
        />
      ) : (
        <div className="w-full aspect-[3/4] flex items-center justify-center">
          <span className="text-xs text-neutral-400">Loading…</span>
        </div>
      )}
      <span className="absolute bottom-1 left-1 bg-white/80 dark:bg-black/80 text-xs px-1.5 py-0.5 rounded text-neutral-700 dark:text-neutral-200">
        {pageNum}
      </span>
      {selectable && (
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(pageNum)}
          className="absolute top-2 right-2 w-4 h-4 accent-neutral-900 dark:accent-neutral-50 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
});

interface PDFThumbnailGridProps {
  file: File | null;
  selectedPages?: Set<number>;
  onTogglePage?: (pageNum: number) => void;
  selectable?: boolean;
  draggable?: boolean;
  pageOrder?: number[];
  onReorder?: (newOrder: number[]) => void;
  onReady?: (count: number) => void;
}

export default function PDFThumbnailGrid({
  file,
  selectedPages = new Set(),
  onTogglePage,
  selectable = false,
  draggable = false,
  pageOrder,
  onReorder,
  onReady,
}: PDFThumbnailGridProps) {
  const [pageCount, setPageCount] = useState(0);
  const [thumbnails, setThumbnails] = useState<Map<number, Thumbnail>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const docRef = useRef<PDFDocumentProxy | null>(null);
  const renderingRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!file) {
      setPageCount(0);
      setThumbnails(new Map());
      if (docRef.current) {
        docRef.current.destroy();
        docRef.current = null;
      }
      return;
    }

    let cancelled = false;
    setError(null);

    (async () => {
      try {
        const { loadPdfDocument } = await import("@/lib/pdf-thumbnail");
        const doc = await loadPdfDocument(file);
        if (cancelled) {
          doc.destroy();
          return;
        }
        docRef.current = doc;
        setPageCount(doc.numPages);
        onReady?.(doc.numPages);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load PDF");
        }
      }
    })();

    return () => {
      cancelled = true;
      if (docRef.current) {
        docRef.current.destroy();
        docRef.current = null;
      }
      renderingRef.current.clear();
    };
  }, [file, onReady]);

  const handleVisible = useCallback(async (pageNum: number) => {
    if (!docRef.current || renderingRef.current.has(pageNum)) return;
    renderingRef.current.add(pageNum);

    try {
      const { renderSinglePage } = await import("@/lib/pdf-thumbnail");
      const thumb = await renderSinglePage(docRef.current, pageNum, 0.3);
      setThumbnails((prev) => {
        const next = new Map(prev);
        next.set(pageNum, thumb);
        return next;
      });
    } catch {
      renderingRef.current.delete(pageNum);
    }
  }, []);

  const handleToggle = useCallback(
    (pageNum: number) => onTogglePage?.(pageNum),
    [onTogglePage],
  );

  const handleDragStart = useCallback((idx: number) => setDragIndex(idx), []);

  const handleDragOver = useCallback(
    (idx: number) => {
      if (dragIndex === null || dragIndex === idx || !pageOrder || !onReorder) return;
      const updated = [...pageOrder];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(idx, 0, moved);
      setDragIndex(idx);
      onReorder(updated);
    },
    [dragIndex, pageOrder, onReorder],
  );

  const handleDragEnd = useCallback(() => setDragIndex(null), []);

  if (error) {
    return <p className="text-sm text-red-600 py-4">{error}</p>;
  }

  if (pageCount === 0) return null;

  const pageNums = pageOrder ?? Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {pageNums.map((pn, idx) => (
        <Tile
          key={pn}
          pageNum={pn}
          thumb={thumbnails.get(pn) ?? null}
          index={idx}
          selected={selectedPages.has(pn)}
          selectable={selectable}
          draggable={draggable}
          onVisible={handleVisible}
          onToggle={handleToggle}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  );
}
