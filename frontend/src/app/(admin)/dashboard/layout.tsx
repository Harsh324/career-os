"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  User,
  Briefcase,
  FolderGit2,
  Cpu,
  Award,
  GraduationCap,
  Milestone,
  Image as ImageIcon,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/auth/auth-context";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  disabled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Profile & Settings", href: "/dashboard/profile", icon: User, badge: "V2.1", disabled: true },
  { name: "Work Experience", href: "/dashboard/experience", icon: Briefcase, badge: "V2.2", disabled: true },
  { name: "Projects Showcase", href: "/dashboard/projects", icon: FolderGit2, badge: "V2.3", disabled: true },
  { name: "Skills Matrix", href: "/dashboard/skills", icon: Cpu, badge: "V2.4", disabled: true },
  { name: "Certifications", href: "/dashboard/certifications", icon: Award, badge: "V2.4", disabled: true },
  { name: "Education", href: "/dashboard/education", icon: GraduationCap, badge: "V2.4", disabled: true },
  { name: "Career Timeline", href: "/dashboard/timeline", icon: Milestone, badge: "V2.4", disabled: true },
  { name: "Media Assets", href: "/dashboard/media", icon: ImageIcon, badge: "V2.6", disabled: true },
];

function DashboardShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // If viewing login page, do not render admin shell
  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  // Client-side authentication loading barrier
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-[#c9d1d9]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#58a6ff]" />
          <p className="text-sm font-mono text-[#8b949e]">Verifying Control Plane Session...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, the middleware + auth-context handles redirect
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-[#c9d1d9]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#58a6ff]" />
          <p className="text-sm font-mono text-[#8b949e]">Redirecting to Login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col md:flex-row selection:bg-[#58a6ff]/30 selection:text-[#58a6ff]">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#30363d] bg-[#161b22] shrink-0 sticky top-0 h-screen z-30">
        {/* Brand */}
        <div className="h-16 px-5 flex items-center gap-3 border-b border-[#30363d]">
          <div className="w-8 h-8 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#58a6ff]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              Career OS
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-[#21262d] text-[#58a6ff] border border-[#30363d]">
                v2.0
              </span>
            </div>
            <div className="text-[11px] text-[#8b949e]">Control Plane</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.disabled) {
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-[#484f58] cursor-not-allowed select-none group"
                  title={`${item.name} is scheduled for milestone ${item.badge}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#484f58]" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#21262d] text-white border border-[#30363d] shadow-sm"
                    : "text-[#8b949e] hover:text-white hover:bg-[#21262d]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#58a6ff]" : "text-[#8b949e]"}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#58a6ff]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* System & User Footer */}
        <div className="p-3 border-t border-[#30363d] bg-[#0d1117]/60">
          <div className="px-3 py-2 rounded-lg bg-[#161b22] border border-[#30363d] mb-2 flex items-center justify-between">
            <div className="truncate">
              <div className="text-xs font-semibold text-white truncate">{user?.username}</div>
              <div className="text-[11px] text-[#8b949e] truncate">{user?.email}</div>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 shrink-0">
              Admin
            </span>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#f85149] hover:bg-[#f85149]/10 transition-colors border border-transparent hover:border-[#f85149]/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navigation Header */}
      <div className="md:hidden flex items-center justify-between h-14 px-4 bg-[#161b22] border-b border-[#30363d] sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#58a6ff]" />
          <span className="text-sm font-bold text-white">Career OS Control Plane</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-[#8b949e] hover:text-white bg-[#21262d] border border-[#30363d]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-[#0d1117] z-30 p-4 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            if (item.disabled) {
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between px-3 py-3 rounded-lg text-sm text-[#484f58]"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-xs font-mono text-[#8b949e]">{item.badge}</span>
                </div>
              );
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-[#21262d] text-white border border-[#30363d]"
                    : "text-[#8b949e] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[#58a6ff]" />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
          <div className="pt-4 border-t border-[#30363d]">
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm text-[#f85149] bg-[#f85149]/10 border border-[#f85149]/30"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Operational Header */}
        <header className="h-16 px-6 border-b border-[#30363d] bg-[#161b22]/70 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#3fb950] px-2.5 py-1 rounded-full bg-[#238636]/15 border border-[#238636]/30">
              <span className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse" />
              <span>Control Plane Active</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-medium text-[#8b949e] hover:text-white px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] transition-all"
            >
              <span>View Public Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardShellContent>{children}</DashboardShellContent>
    </AuthProvider>
  );
}
