"use client";

import * as React from "react";
import { Mail, Check, Copy } from "lucide-react";

interface EmailCopyButtonProps {
  email: string;
  variant?: "button" | "link";
  className?: string;
  children?: React.ReactNode;
}

export function EmailCopyButton({
  email,
  variant = "button",
  className = "",
  children,
}: EmailCopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    // If holding Shift key, open mailto directly
    if (e.shiftKey) return;

    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  if (variant === "link") {
    return (
      <button
        onClick={handleCopy}
        title="Click to copy email (Shift+Click to send email)"
        className={`group flex items-center gap-2.5 text-xs font-mono text-[#0969da] dark:text-[#58a6ff] hover:underline focus:outline-none transition-colors ${className}`}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-[#1f883d] dark:text-[#39d353] flex-shrink-0" />
            <span className="font-semibold text-[#1f883d] dark:text-[#39d353]">
              Email Copied!
            </span>
          </>
        ) : (
          <>
            <Mail className="h-4 w-4 text-[#57606a] dark:text-[#8b949e] flex-shrink-0 group-hover:text-[#0969da] dark:group-hover:text-[#58a6ff]" />
            <span className="truncate">{email}</span>
            <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 text-[#57606a] dark:text-[#8b949e] transition-opacity" />
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      title="Click to copy email (Shift+Click to open mail app)"
      className={`whitespace-nowrap rounded-xl bg-[#0969da] px-4 py-2 text-xs font-mono font-semibold text-white shadow-xs hover:bg-[#085ac1] active:scale-95 transition-all flex items-center gap-1.5 focus:outline-none ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-white" />
          <span>Email Copied!</span>
        </>
      ) : (
        children || (
          <>
            <Mail className="h-3.5 w-3.5" />
            <span>Get in Touch</span>
          </>
        )
      )}
    </button>
  );
}
