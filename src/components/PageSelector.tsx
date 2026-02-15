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
      <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
        Pages (e.g. 1,3,5-8)
      </label>
      <input
        type="text"
        className="w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`1-${pageCount}`}
      />
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 underline cursor-pointer"
          onClick={() => onChange(`1-${pageCount}`)}
        >
          Select All
        </button>
        <button
          type="button"
          className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 underline cursor-pointer"
          onClick={() => onChange("")}
        >
          Deselect All
        </button>
      </div>
      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
        {pageCount} pages available
      </p>
    </div>
  );
}
