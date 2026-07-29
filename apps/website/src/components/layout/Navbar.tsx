import Link from "next/link";
import { Terminal, Briefcase, FolderGit2, Cpu, History, BookOpen } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-base font-bold text-zinc-100 transition-colors hover:text-emerald-400"
          aria-label="Career OS Home"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
            <Terminal className="h-4 w-4" />
          </div>
          <span>career-os<span className="text-emerald-400">.dev</span></span>
        </Link>

        <nav aria-label="Main Navigation" className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/experience"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
          >
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Experience</span>
          </Link>
          <Link
            href="/projects"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
          >
            <FolderGit2 className="h-4 w-4" />
            <span className="hidden sm:inline">Projects</span>
          </Link>
          <Link
            href="/skills"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
          >
            <Cpu className="h-4 w-4" />
            <span className="hidden sm:inline">Skills</span>
          </Link>
          <Link
            href="/timeline"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Timeline</span>
          </Link>
          <Link
            href="/blog"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Blog</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
