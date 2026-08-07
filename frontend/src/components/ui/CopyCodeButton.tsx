"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-md border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] px-2.5 py-1 text-xs font-mono text-[#57606a] dark:text-[#8b949e] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] transition-colors focus:outline-none"
      aria-label="Copy code to clipboard"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-[#1f883d] dark:text-[#39d353]" />
          <span className="text-[#1f883d] dark:text-[#39d353]">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
