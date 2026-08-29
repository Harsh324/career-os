import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0969da]/10 dark:bg-[#58a6ff]/10 text-[#0969da] dark:text-[#58a6ff]">
        <FileQuestion className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#24292f] dark:text-[#f0f6fc]">
          404 — Page Not Found
        </h1>
        <p className="text-sm text-[#57606a] dark:text-[#8b949e] max-w-md mx-auto">
          The page or resource you are looking for does not exist or has been moved.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0969da] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0859b8] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Overview</span>
        </Link>

        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-4 py-2.5 text-xs font-semibold text-[#24292f] dark:text-[#f0f6fc] shadow-sm hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] transition-colors"
        >
          <span>View Projects</span>
        </Link>

        <Link
          href="/experience"
          className="inline-flex items-center gap-2 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-4 py-2.5 text-xs font-semibold text-[#24292f] dark:text-[#f0f6fc] shadow-sm hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] transition-colors"
        >
          <span>View Experience</span>
        </Link>

        <Link
          href="/resume"
          className="inline-flex items-center gap-2 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-4 py-2.5 text-xs font-semibold text-[#24292f] dark:text-[#f0f6fc] shadow-sm hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] transition-colors"
        >
          <span>View Resume</span>
        </Link>
      </div>
    </div>
  );
}
