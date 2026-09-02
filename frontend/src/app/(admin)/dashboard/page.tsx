"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  Briefcase,
  FolderGit2,
  Cpu,
  Award,
  GraduationCap,
  Milestone,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  Server,
  Database,
  Clock,
  Layers,
  AlertCircle,
  RefreshCw,
  Download,
  CheckCircle2,
  Sparkles,
  Zap,
  Activity,
  ArrowRight,
} from "lucide-react";
import { getDashboardStats, DashboardStats } from "@/lib/api/admin-client";
import { useAuth } from "@/lib/auth/auth-context";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    const start = performance.now();
    try {
      const data = await getDashboardStats();
      const duration = Math.round(performance.now() - start);
      setLatencyMs(duration);
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

  const getRelativeTime = (isoString: string | null | undefined) => {
    if (!isoString) return "N/A";
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 30) return `${diffDays} days ago`;
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    } catch {
      return "Recent";
    }
  };

  const handleExportJsonResume = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002/api/v1";
    window.open(`${apiUrl}/settings/json-resume/`, "_blank");
  };

  return (
    <div className="space-y-8">
      {/* Streamlined Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold text-[#24292f] dark:text-white tracking-tight flex items-center gap-2.5">
            <span>Overview</span>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#0969da]/10 dark:bg-[#58a6ff]/15 text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/20 dark:border-[#58a6ff]/30">
              V2.0 Active
            </span>
          </h1>
          <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-1">
            Welcome back, <span className="font-semibold text-[#24292f] dark:text-white">{user?.first_name || user?.username || "Admin"}</span> • Authoritative career telemetry and canonical database records.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={fetchStats}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#21262d] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] border border-[#d0d7de] dark:border-[#30363d] text-xs font-medium text-[#24292f] dark:text-[#c9d1d9] transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#0969da] dark:text-[#58a6ff]" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportJsonResume}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0969da] hover:bg-[#0859b8] text-xs font-semibold text-white transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Error Alert if any */}
      {error && (
        <div className="p-4 rounded-xl bg-[#ffebe9] dark:bg-red-950/40 border border-[#ff8182]/50 dark:border-red-800/60 text-[#cf222e] dark:text-red-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#cf222e] dark:text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchStats}
            className="text-xs font-semibold underline hover:no-underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* System Infrastructure Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Backend Engine Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#57606a] dark:text-[#8b949e] mb-3 font-mono">
            <span className="font-semibold">BACKEND ENGINE</span>
            <Server className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-base font-bold text-[#24292f] dark:text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1a7f37] dark:bg-[#3fb950] animate-pulse" />
              <span>Django 5.0 REST API</span>
            </div>
            {latencyMs !== null && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0969da]/10 dark:bg-[#58a6ff]/15 text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/20 dark:border-[#58a6ff]/30 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" />
                <span>{latencyMs}ms</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-1.5 font-mono">Port 8002 • /api/v1/*</p>
        </div>

        {/* Database Persistence Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#57606a] dark:text-[#8b949e] mb-3 font-mono">
            <span className="font-semibold">DATABASE SOURCE</span>
            <Database className="w-4 h-4 text-[#1a7f37] dark:text-[#3fb950]" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-base font-bold text-[#24292f] dark:text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1a7f37] dark:bg-[#3fb950]" />
              <span>PostgreSQL 16</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1a7f37]/10 dark:bg-[#238636]/20 text-[#1a7f37] dark:text-[#3fb950] border border-[#1a7f37]/30 dark:border-[#238636]/40">
              Canonical
            </span>
          </div>
          <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-1.5 font-mono">Relational Persistence Active</p>
        </div>

        {/* Last Modified Telemetry */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#57606a] dark:text-[#8b949e] mb-3 font-mono">
            <span className="font-semibold">LAST PROFILE UPDATE</span>
            <Clock className="w-4 h-4 text-[#8957e5] dark:text-[#a371f7]" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-[#24292f] dark:text-white truncate">
              {isLoading ? "Loading..." : formatDate(stats?.site_settings?.updated_at)}
            </div>
            {stats?.site_settings?.updated_at && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#8957e5]/10 dark:bg-[#a371f7]/15 text-[#8957e5] dark:text-[#a371f7] border border-[#8957e5]/20 dark:border-[#a371f7]/30 shrink-0">
                {getRelativeTime(stats?.site_settings?.updated_at)}
              </span>
            )}
          </div>
          <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-1.5 truncate">
            {stats?.site_settings?.name || "Harsh Tripathi"} ({stats?.site_settings?.title || "Backend & Cloud Engineer"})
          </p>
        </div>
      </div>

      {/* Canonical Career Entity Counts Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#24292f] dark:text-white tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
            <span>Canonical Career Entities (PostgreSQL)</span>
          </h2>
          <span className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">Authoritative Records</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Experiences (Emerald) */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all shadow-2xs group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d]">
                V2.2
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#24292f] dark:text-white font-mono">
                {isLoading ? "-" : stats?.counts?.experiences ?? 0}
              </div>
              <div className="text-xs font-medium text-[#57606a] dark:text-[#8b949e] mt-0.5">Work Roles</div>
            </div>
          </div>

          {/* Projects (Sky Blue) */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all shadow-2xs group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center justify-center">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d]">
                V2.3
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#24292f] dark:text-white font-mono">
                {isLoading ? "-" : stats?.counts?.projects ?? 0}
              </div>
              <div className="text-xs font-medium text-[#57606a] dark:text-[#8b949e] mt-0.5">
                Projects ({stats?.counts?.featured_projects ?? 0} Feat)
              </div>
            </div>
          </div>

          {/* Skills (Purple) */}
          <Link
            href="/dashboard/skills"
            className="p-4 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] flex flex-col justify-between hover:-translate-y-1 hover:border-[#8957e5]/50 hover:shadow-md transition-all shadow-2xs group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d]">
                V2.4
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#24292f] dark:text-white font-mono">
                {isLoading ? "-" : stats?.counts?.skills ?? 0}
              </div>
              <div className="text-xs font-medium text-[#57606a] dark:text-[#8b949e] mt-0.5">Tech Skills</div>
            </div>
          </Link>

          {/* Certifications (Amber) */}
          <Link
            href="/dashboard/certifications"
            className="p-4 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] flex flex-col justify-between hover:-translate-y-1 hover:border-[#d97706]/50 hover:shadow-md transition-all shadow-2xs group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-[#f6f8fa] dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/30">
                V2.5
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#24292f] dark:text-white font-mono">
                {isLoading ? "-" : stats?.counts?.certifications ?? 0}
              </div>
              <div className="text-xs font-medium text-[#57606a] dark:text-[#8b949e] mt-0.5">Certifications</div>
            </div>
          </Link>

          {/* Education (Cyan) */}
          <Link
            href="/dashboard/education"
            className="p-4 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] flex flex-col justify-between hover:-translate-y-1 hover:border-[#0969da]/50 hover:shadow-md transition-all shadow-2xs group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-[#f6f8fa] dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/30">
                V2.5
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#24292f] dark:text-white font-mono">
                {isLoading ? "-" : stats?.counts?.education ?? 0}
              </div>
              <div className="text-xs font-medium text-[#57606a] dark:text-[#8b949e] mt-0.5">Degrees & Edu</div>
            </div>
          </Link>

          {/* Milestones (Orange) */}
          <Link
            href="/dashboard/timeline"
            className="p-4 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] flex flex-col justify-between hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-md transition-all shadow-2xs group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center">
                <Milestone className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-[#f6f8fa] dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/30">
                V2.5
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#24292f] dark:text-white font-mono">
                {isLoading ? "-" : stats?.counts?.timeline_events ?? 0}
              </div>
              <div className="text-xs font-medium text-[#57606a] dark:text-[#8b949e] mt-0.5">Timeline Events</div>
            </div>
          </Link>

          {/* Media Assets (Rose) */}
          <Link
            href="/dashboard/media"
            className="p-4 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] flex flex-col justify-between hover:-translate-y-1 hover:border-rose-500/50 hover:shadow-md transition-all shadow-2xs group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-[#f6f8fa] dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/30">
                V2.6
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#24292f] dark:text-white font-mono">
                {isLoading ? "-" : stats?.counts?.media_assets ?? 0}
              </div>
              <div className="text-xs font-medium text-[#57606a] dark:text-[#8b949e] mt-0.5">Media Assets</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Connected Milestone Roadmap Stepper */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#24292f] dark:text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1a7f37] dark:text-[#3fb950]" />
              <span>Career OS Staged Evolution Roadmap</span>
            </h2>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-0.5">
              Disciplined vertical milestone rollout according to engineering governance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-[#1a7f37] dark:text-[#3fb950]">
              1 / 8 Milestones (12.5%)
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#d0d7de]/50 dark:bg-[#21262d] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#1a7f37] to-[#2ea043] transition-all duration-500"
            style={{ width: "12.5%" }}
          />
        </div>

        {/* Milestone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Milestone V2.0 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#161b22] border-2 border-[#1a7f37] dark:border-[#3fb950] relative shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-mono text-[#1a7f37] dark:text-[#3fb950] font-bold">MILESTONE V2.0</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#1a7f37]/15 dark:bg-[#238636]/25 text-[#1a7f37] dark:text-[#3fb950] border border-[#1a7f37]/30 dark:border-[#238636]/40 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>ACTIVE</span>
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#24292f] dark:text-white">Dashboard Foundation</h3>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-1.5 leading-relaxed">
              Authentication, edge middleware route protection, silent refresh cookies, and fixed control plane shell.
            </p>
          </div>

          {/* Milestone V2.1 */}
          <div className="p-5 rounded-2xl bg-white/60 dark:bg-[#161b22]/60 border border-[#d0d7de] dark:border-[#30363d] relative group hover:border-[#0969da]/50 dark:hover:border-[#58a6ff]/50 transition-colors">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e] font-semibold">MILESTONE V2.1</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d]">
                NEXT UP
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#24292f] dark:text-white">Profile Management</h3>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-1.5 leading-relaxed">
              Site settings, bio, headline, contact channels, and open-to-work status with instant updates.
            </p>
          </div>

          {/* Milestone V2.2 */}
          <div className="p-5 rounded-2xl bg-white/60 dark:bg-[#161b22]/60 border border-[#d0d7de] dark:border-[#30363d] relative">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e]">MILESTONE V2.2</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d]">
                PLANNED
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#24292f] dark:text-white">Experience Management</h3>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-1.5 leading-relaxed">
              Work experience architectures, technical challenges, problem/solution breakdown, and metrics.
            </p>
          </div>

          {/* Milestone V2.3–V2.7 */}
          <div className="p-5 rounded-2xl bg-white/60 dark:bg-[#161b22]/60 border border-[#d0d7de] dark:border-[#30363d] relative">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e]">MILESTONE V2.3–V2.7</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d]">
                PLANNED
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#24292f] dark:text-white">Projects, Drafts & Media</h3>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-1.5 leading-relaxed">
              Project deep-dives, dual-state draft engine, authenticated previewing, and asset library.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
