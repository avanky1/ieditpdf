"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  loading?: boolean;
}

export default function Button({
  variant = "primary",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-900 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200",
    secondary:
      "bg-white text-neutral-900 border border-neutral-300 hover:bg-neutral-50 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-800",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Processing…" : children}
    </button>
  );
}
