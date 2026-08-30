"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Briefcase,
  FolderGit2,
  Cpu,
  History,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { GitNodeIcon } from "@/components/icons/GitNodeIcon";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface NavbarProps {
  name?: string;
  title?: string;
}

export function Navbar({ name = "Harsh Tripathi", title = "Backend & Cloud Engineer" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const navItems: { label: string; href: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { label: "Overview", href: "/", icon: BookOpen },
    { label: "Experience", href: "/experience", icon: Briefcase },
    { label: "Projects", href: "/projects", icon: FolderGit2 },
    { label: "Skills", href: "/skills", icon: Cpu },
    { label: "Timeline", href: "/timeline", icon: History },
    { label: "Resume", href: "/resume", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] transition-colors">
      {/* Top Utility Header */}
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6 border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 text-xs">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-sans text-sm font-semibold text-[#24292f] dark:text-[#f0f6fc] hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-colors group"
          aria-label={`${name} | ${title}`}
        >
          {/* Git Node Geometric Logo Badge */}
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-[#0969da]/10 dark:bg-[#388bfd]/15 text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/30 dark:border-[#58a6ff]/30 shadow-sm group-hover:scale-105 transition-transform">
            <GitNodeIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </div>
          <span className="tracking-tight flex items-center gap-1.5">
            <span className="font-semibold text-[#24292f] dark:text-[#f0f6fc]">{name}</span>
            <span className="text-[#57606a] dark:text-[#8b949e] font-normal hidden sm:inline">&bull;</span>
            <span className="text-[#0969da] dark:text-[#58a6ff] font-semibold text-xs hidden sm:inline">{title}</span>
          </span>
        </Link>

        {/* Header Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] md:hidden focus:outline-none"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* GitHub Signature Horizontal Tab Navigation Bar */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 hidden md:block overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <nav aria-label="Profile Tabs" className="flex items-center gap-1 sm:gap-2 -mb-px">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : Boolean(pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-[#fd8c73] dark:border-[#f0883e] text-[#24292f] dark:text-[#f0f6fc]"
                    : "border-transparent text-[#57606a] dark:text-[#8b949e] hover:border-[#d0d7de] dark:hover:border-[#6e7681] hover:text-[#0969da] dark:hover:text-[#58a6ff]"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-[#24292f] dark:text-[#f0f6fc]" : "text-[#8b949e]"}`} />
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span className="rounded-full bg-[#afb8c1]/20 dark:bg-[#6e7681]/40 px-2 py-0.5 text-[11px] font-mono text-[#24292f] dark:text-[#c9d1d9]">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div id="mobile-nav" className="w-full border-b border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-4 py-3 md:hidden shadow-xl space-y-1 animate-in slide-in-from-top-2 fade-in duration-150">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : Boolean(pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#0969da]/10 dark:bg-[#388bfd]/15 text-[#0969da] dark:text-[#58a6ff] font-semibold"
                    : "text-[#57606a] dark:text-[#8b949e] hover:bg-[#f6f8fa] dark:hover:bg-[#161b22]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className="rounded-full bg-[#afb8c1]/20 dark:bg-[#6e7681]/40 px-2 py-0.5 text-xs font-mono">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
