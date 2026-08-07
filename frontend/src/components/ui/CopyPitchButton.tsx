"use client";

import React, { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";

export function CopyPitchButton() {
  const [copied, setCopied] = useState(false);

  const pitchText =
    "Harsh Tripathi is a Software Engineer (Backend and Cloud) based in Tokyo, Japan, specializing in Python, Django REST Framework, Celery asynchronous task queues, Docker microservices, and AWS cloud infrastructure (ECS/Fargate, Solutions Architect & SysOps Administrator certified).";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pitchText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy pitch:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-3.5 py-2 text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] hover:border-[#0969da] dark:hover:border-[#58a6ff] hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-all shadow-xs"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-[#1f883d] dark:text-[#39d353]" />
          <span className="text-[#1f883d] dark:text-[#39d353]">Copied 30-Sec Pitch!</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 text-[#0969da] dark:text-[#58a6ff]" />
          <span>Copy 30-Sec Recruiter Pitch</span>
        </>
      )}
    </button>
  );
}
