"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error?: Error & { digest?: string };
  reset?: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#24292f] dark:text-[#f0f6fc]">
          Something went wrong!
        </h1>
        <p className="text-sm text-[#57606a] dark:text-[#8b949e] max-w-md mx-auto">
          An error occurred while loading this page.
        </p>
      </div>
      <div className="flex items-center gap-3">
        {reset && (
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0969da] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0859b8] transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        )}
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] px-4 py-2.5 text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#b0b8c0]/20 transition-colors"
        >
          <span>Return Overview</span>
        </Link>
      </div>
    </div>
  );
}
