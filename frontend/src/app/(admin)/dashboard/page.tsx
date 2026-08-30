"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  FolderGit2,
  Cpu,
  Award,
  GraduationCap,
  Milestone,
  ExternalLink,
  ShieldCheck,
  Server,
  Database,
  Clock,
  ArrowUpRight,
  Layers,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { getDashboardStats, DashboardStats } from "@/lib/api/admin-client";
import { useAuth } from "@/lib/auth/auth-context";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard overview statistics.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatDate = (isoString: string | null | undefined) => {
    if (!isoString) return "Never updated";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#58a6ff] mb-1">
            <span>CAREER OS CONTROL PLANE</span>
            <span>•</span>
            <span>MILESTONE V2.0 ACTIVE</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome, {user?.first_name || user?.username || "Administrator"}
          </h1>
          <p className="text-sm text-[#8b949e] mt-1">
            System overview, canonical entity counts, and control plane readiness.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchStats}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-xs font-medium text-[#c9d1d9] hover:text-white transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh Stats</span>
          </button>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-xs font-semibold text-white transition-all shadow-md shadow-[#238636]/20"
          >
            <span>Live Portfolio</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchStats}
            className="text-xs underline hover:text-white cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* System Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d]">
          <div className="flex items-center justify-between text-xs text-[#8b949e] mb-2 font-mono">
            <span>BACKEND ENGINE</span>
            <Server className="w-4 h-4 text-[#58a6ff]" />
          </div>
          <div className="flex items-center gap-2 text-base font-semibold text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3fb950]" />
            <span>Django 5.0 REST API</span>
          </div>
          <p className="text-xs text-[#8b949e] mt-1 font-mono">Port 8002 • /api/v1/*</p>
        </div>

        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d]">
          <div className="flex items-center justify-between text-xs text-[#8b949e] mb-2 font-mono">
            <span>DATABASE SOURCE</span>
            <Database className="w-4 h-4 text-[#58a6ff]" />
          </div>
          <div className="flex items-center gap-2 text-base font-semibold text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3fb950]" />
            <span>PostgreSQL 16 (Canonical)</span>
          </div>
          <p className="text-xs text-[#8b949e] mt-1 font-mono">Relational Persistence Active</p>
        </div>

        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d]">
          <div className="flex items-center justify-between text-xs text-[#8b949e] mb-2 font-mono">
            <span>LAST SITE UPDATE</span>
            <Clock className="w-4 h-4 text-[#58a6ff]" />
          </div>
          <div className="text-sm font-semibold text-white truncate">
            {isLoading ? "Loading..." : formatDate(stats?.site_settings?.updated_at)}
          </div>
          <p className="text-xs text-[#8b949e] mt-1 truncate">
            {stats?.site_settings?.name || "Harsh Tripathi"} ({stats?.site_settings?.title || "Backend & Cloud Engineer"})
          </p>
        </div>
      </div>

      {/* Canonical Career Entity Counts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#58a6ff]" />
            <span>Canonical Career Entities (PostgreSQL)</span>
          </h2>
          <span className="text-xs font-mono text-[#8b949e]">Authoritative Records</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8b949e] mb-3">
              <Briefcase className="w-4 h-4 text-[#58a6ff]" />
              <span className="text-[10px] font-mono uppercase">V2.2</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-mono">
                {isLoading ? "-" : stats?.counts?.experiences ?? 0}
              </div>
              <div className="text-xs text-[#8b949e] mt-0.5">Experiences</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8b949e] mb-3">
              <FolderGit2 className="w-4 h-4 text-[#bc8cff]" />
              <span className="text-[10px] font-mono uppercase">V2.3</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-mono">
                {isLoading ? "-" : stats?.counts?.projects ?? 0}
              </div>
              <div className="text-xs text-[#8b949e] mt-0.5">
                Projects ({stats?.counts?.featured_projects ?? 0} Featured)
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8b949e] mb-3">
              <Cpu className="w-4 h-4 text-[#39d353]" />
              <span className="text-[10px] font-mono uppercase">V2.4</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-mono">
                {isLoading ? "-" : stats?.counts?.skills ?? 0}
              </div>
              <div className="text-xs text-[#8b949e] mt-0.5">Skills</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8b949e] mb-3">
              <Award className="w-4 h-4 text-[#d29922]" />
              <span className="text-[10px] font-mono uppercase">V2.4</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-mono">
                {isLoading ? "-" : stats?.counts?.certifications ?? 0}
              </div>
              <div className="text-xs text-[#8b949e] mt-0.5">Certifications</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8b949e] mb-3">
              <GraduationCap className="w-4 h-4 text-[#58a6ff]" />
              <span className="text-[10px] font-mono uppercase">V2.4</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-mono">
                {isLoading ? "-" : stats?.counts?.education ?? 0}
              </div>
              <div className="text-xs text-[#8b949e] mt-0.5">Education</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8b949e] mb-3">
              <Milestone className="w-4 h-4 text-[#ff7b72]" />
              <span className="text-[10px] font-mono uppercase">V2.4</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-mono">
                {isLoading ? "-" : stats?.counts?.timeline_events ?? 0}
              </div>
              <div className="text-xs text-[#8b949e] mt-0.5">Milestones</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Plane Phasing Roadmap */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#58a6ff]" />
            <span>Career OS V2 Milestone Roadmap</span>
          </h2>
          <span className="text-xs font-mono text-[#8b949e]">Staged Evolution</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-[#21262d]/40 border border-[#3fb950]/50 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-[#3fb950] font-semibold">MILESTONE V2.0</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40">
                ACTIVE
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">Dashboard Foundation</h3>
            <p className="text-xs text-[#8b949e] mt-1">
              Authentication, secure session cookies, route protection, and admin shell.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] opacity-75">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-[#8b949e]">MILESTONE V2.1</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                PLANNED
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">Profile Management</h3>
            <p className="text-xs text-[#8b949e] mt-1">
              Site settings, bio, headline, contact channels, and open-to-work status.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] opacity-75">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-[#8b949e]">MILESTONE V2.2</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                PLANNED
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">Experience Management</h3>
            <p className="text-xs text-[#8b949e] mt-1">
              Work experience architectures, technical challenges, problem/solution, metrics.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] opacity-75">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-[#8b949e]">MILESTONE V2.3–V2.7</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                PLANNED
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">Projects, Draft/Publish & Media</h3>
            <p className="text-xs text-[#8b949e] mt-1">
              Project deep-dives, dual-state draft engine, previewing, and asset management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
