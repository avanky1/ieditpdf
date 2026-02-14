"use client";

interface PageSelectorProps {
  pageCount: number;
  value: string;
  onChange: (value: string) => void;
}

export default function PageSelector({
  pageCount,
  value,
  onChange,
}: PageSelectorProps) {
  return (
    <div>
      <label className="block text-sm text-neutral-600 mb-1">
        Pages (e.g. 1,3,5-8)
      </label>
      <input
        type="text"
        className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`1-${pageCount}`}
      />
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          className="text-xs text-neutral-500 hover:text-neutral-800 underline"
          onClick={() => onChange(`1-${pageCount}`)}
        >
          Select All
        </button>
        <button
          type="button"
          className="text-xs text-neutral-500 hover:text-neutral-800 underline"
          onClick={() => onChange("")}
        >
          Deselect All
        </button>
      </div>
      <p className="text-xs text-neutral-400 mt-1">
        {pageCount} pages available
      </p>
    </div>
  );
}
