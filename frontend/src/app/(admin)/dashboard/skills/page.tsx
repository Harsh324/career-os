"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Cpu,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Search,
  Layers,
  Table as TableIcon,
  LayoutGrid,
  Briefcase,
  FolderGit2,
} from "lucide-react";
import {
  getAdminSkills,
  updateAdminSkill,
  deleteAdminSkill,
} from "@/lib/api/admin-client";
import { SkillPreviewModal } from "@/components/skills/SkillPreviewModal";
import { Modal } from "@/components/ui/Modal";
import type { Skill } from "@/lib/api/types";

const TARGET_CATEGORY_ORDER = [
  "Backend Engineering",
  "Cloud & Infrastructure",
  "Architecture & Distributed Systems",
  "Databases & Caching",
  "AI & Data",
  "DevOps & CI/CD",
  "Supporting Technologies",
];

const PROFICIENCY_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  expert: {
    label: "Expert",
    badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    dotClass: "bg-emerald-500",
  },
  advanced: {
    label: "Advanced",
    badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    dotClass: "bg-blue-500",
  },
  proficient: {
    label: "Proficient",
    badgeClass: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    dotClass: "bg-purple-500",
  },
  familiar: {
    label: "Familiar",
    badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    dotClass: "bg-amber-500",
  },
  learning: {
    label: "Learning",
    badgeClass: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
    dotClass: "bg-slate-500",
  },
};

export default function SkillsManagementPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [scopeFilter, setScopeFilter] = useState<string>("all"); // all, core, supporting
  const [proficiencyFilter, setProficiencyFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"matrix" | "table">("matrix");
  const [previewSkillSlug, setPreviewSkillSlug] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { data: skills = [], isLoading, error, refetch, isFetching } = useQuery<Skill[]>({
    queryKey: ["admin-skills"],
    queryFn: getAdminSkills,
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ slug, is_published }: { slug: string; is_published: boolean }) => {
      return updateAdminSkill(slug, { is_published });
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
      setNotification({
        type: "success",
        message: `"${updated.name}" publication status updated.`,
      });
      setTimeout(() => setNotification(null), 4000);
    },
    onError: (err: any) => {
      setNotification({
        type: "error",
        message: err.message || "Failed to update publication status.",
      });
      setTimeout(() => setNotification(null), 5000);
    },
  });

  const toggleCoreMutation = useMutation({
    mutationFn: async ({ slug, is_core }: { slug: string; is_core: boolean }) => {
      return updateAdminSkill(slug, { is_core });
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
      setNotification({
        type: "success",
        message: `"${updated.name}" core stack status updated.`,
      });
      setTimeout(() => setNotification(null), 4000);
    },
    onError: (err: any) => {
      setNotification({
        type: "error",
        message: err.message || "Failed to update core status.",
      });
      setTimeout(() => setNotification(null), 5000);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      return deleteAdminSkill(slug);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
      setNotification({
        type: "success",
        message: "Skill deleted successfully.",
      });
      setDeleteTarget(null);
      setTimeout(() => setNotification(null), 4000);
    },
    onError: (err: any) => {
      setNotification({
        type: "error",
        message: err.message || "Failed to delete skill.",
      });
      setTimeout(() => setNotification(null), 5000);
    },
  });

  // Filter skills
  const filteredSkills = skills.filter((skill) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = skill.name.toLowerCase().includes(q);
      const catMatch = skill.category.toLowerCase().includes(q);
      const descMatch = (skill.description || "").toLowerCase().includes(q);
      const techMatch = (skill.technologies_detail || []).some((t) =>
        t.name.toLowerCase().includes(q)
      );
      const roleMatch = (skill.target_roles || []).some((r) =>
        r.toLowerCase().includes(q)
      );
      if (!nameMatch && !catMatch && !descMatch && !techMatch && !roleMatch) {
        return false;
      }
    }

    // Category filter
    if (categoryFilter !== "all" && skill.category !== categoryFilter) {
      return false;
    }

    // Scope filter
    if (scopeFilter === "core" && !skill.is_core) {
      return false;
    }
    if (scopeFilter === "supporting" && skill.is_core) {
      return false;
    }

    // Proficiency filter
    if (proficiencyFilter !== "all" && skill.proficiency?.toLowerCase() !== proficiencyFilter) {
      return false;
    }

    return true;
  });

  // Derived telemetry metrics
  const totalCount = skills.length;
  const coreCount = skills.filter((s) => s.is_core).length;
  const publishedCount = skills.filter((s) => s.is_published).length;

  // Group filtered skills by category
  const skillsByCategory: Record<string, Skill[]> = {};
  filteredSkills.forEach((s) => {
    const cat = s.category || "Backend Engineering";
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(s);
  });

  const allCategories = Array.from(
    new Set([...TARGET_CATEGORY_ORDER, ...Object.keys(skillsByCategory)])
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* ========================================================================= */}
      {/* DESKTOP STICKY TOP ACTION BAR */}
      {/* ========================================================================= */}
      <div className="sticky top-0 z-20 bg-[#f6f8fa]/95 dark:bg-[#0d1117]/95 backdrop-blur-md py-3 border-b border-[#d0d7de] dark:border-[#30363d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#24292f] dark:text-[#f0f6fc] flex items-center gap-2 font-mono">
              <span>Skills Matrix Management</span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                V2.4 Control Plane
              </span>
            </h1>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e]">
              Manage canonical engineering capabilities, proficiency depth, and evidence associations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Telemetry Badges */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] text-xs font-mono">
            <span className="text-[#57606a] dark:text-[#8b949e]">Total:</span>
            <span className="font-bold text-[#24292f] dark:text-[#f0f6fc]">{totalCount}</span>
            <span className="text-[#d0d7de] dark:text-[#30363d]">|</span>
            <span className="text-[#d97706] dark:text-[#f59e0b]">★ Core:</span>
            <span className="font-bold text-[#24292f] dark:text-[#f0f6fc]">{coreCount}</span>
            <span className="text-[#d0d7de] dark:text-[#30363d]">|</span>
            <span className="text-[#1a7f37] dark:text-[#3fb950]">Live:</span>
            <span className="font-bold text-[#24292f] dark:text-[#f0f6fc]">{publishedCount}</span>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] transition-colors"
            title="Refresh skills data"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => setPreviewSkillSlug("all")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] transition-colors shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#0969da] dark:text-[#58a6ff]" />
            <span>Preview Matrix</span>
          </button>

          <Link
            href="/dashboard/skills/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg bg-[#1f883d] text-white hover:bg-[#1a7f37] transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Skill</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NOTIFICATION BANNER */}
      {/* ========================================================================= */}
      {notification && (
        <div
          className={`p-3 rounded-lg border text-xs font-mono flex items-center gap-2 ${
            notification.type === "success"
              ? "bg-[#dafbe1] dark:bg-[#112a1c] border-[#2da44e]/30 text-[#1a7f37] dark:text-[#3fb950]"
              : "bg-[#ffebe9] dark:bg-[#2b1011] border-[#cf222e]/30 text-[#cf222e] dark:text-[#ff7b72]"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEARCH, FILTERS & VIEW SWITCHER */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] shadow-xs">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#57606a] dark:text-[#8b949e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by skill name, category, tech, or target role..."
              className="w-full pl-9 pr-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
          >
            <option value="all">All Categories</option>
            {TARGET_CATEGORY_ORDER.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Scope Filter */}
          <select
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
          >
            <option value="all">All Scopes</option>
            <option value="core">Core Stack Only</option>
            <option value="supporting">Supporting Only</option>
          </select>

          {/* Proficiency Filter */}
          <select
            value={proficiencyFilter}
            onChange={(e) => setProficiencyFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
          >
            <option value="all">All Proficiencies</option>
            <option value="expert">Expert</option>
            <option value="advanced">Advanced</option>
            <option value="proficient">Proficient</option>
            <option value="familiar">Familiar</option>
            <option value="learning">Learning</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("matrix")}
              className={`p-1.5 rounded-md text-xs font-mono transition-colors ${
                viewMode === "matrix"
                  ? "bg-white dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff] shadow-xs"
                  : "text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#f0f6fc]"
              }`}
              title="Categorized Matrix View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md text-xs font-mono transition-colors ${
                viewMode === "table"
                  ? "bg-white dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff] shadow-xs"
                  : "text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#f0f6fc]"
              }`}
              title="Compact Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LOADING & ERROR STATES */}
      {/* ========================================================================= */}
      {isLoading && (
        <div className="p-12 text-center text-xs font-mono text-[#57606a] dark:text-[#8b949e] border border-dashed border-[#d0d7de] dark:border-[#30363d] rounded-xl">
          Loading canonical skills matrix from PostgreSQL...
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl border border-[#cf222e]/40 bg-[#ffebe9] dark:bg-[#2b1011] text-xs font-mono text-[#cf222e] dark:text-[#ff7b72]">
          Error loading skills: {(error as any).message || "Unknown error"}
        </div>
      )}

      {!isLoading && !error && filteredSkills.length === 0 && (
        <div className="p-12 text-center text-xs font-mono text-[#57606a] dark:text-[#8b949e] border border-dashed border-[#d0d7de] dark:border-[#30363d] rounded-xl space-y-3">
          <p>No technical skills found matching your filters.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("all");
              setScopeFilter("all");
              setProficiencyFilter("all");
            }}
            className="px-3 py-1 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff]"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 1: CATEGORIZED MATRIX VIEW */}
      {/* ========================================================================= */}
      {!isLoading && !error && filteredSkills.length > 0 && viewMode === "matrix" && (
        <div className="space-y-6">
          {allCategories.map((category) => {
            const catSkills = skillsByCategory[category] || [];
            if (catSkills.length === 0) return null;

            return (
              <div
                key={category}
                className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
                    <h2 className="text-xs font-mono font-bold text-[#0969da] dark:text-[#58a6ff] uppercase tracking-wider">
                      {category}
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e] px-2 py-0.5 rounded-full bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d]">
                    {catSkills.length} competencies
                  </span>
                </div>

                {/* Skills Cards Grid */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {catSkills.map((skill) => {
                    const prof =
                      PROFICIENCY_CONFIG[skill.proficiency?.toLowerCase()] ||
                      PROFICIENCY_CONFIG.advanced;

                    return (
                      <div
                        key={skill.id}
                        className={`p-3.5 rounded-lg border transition-all space-y-2.5 flex flex-col justify-between ${
                          skill.is_published
                            ? "bg-[#f6f8fa]/80 dark:bg-[#0d1117]/80 border-[#d0d7de] dark:border-[#30363d] hover:border-[#0969da]/50"
                            : "bg-amber-500/5 dark:bg-amber-500/5 border-amber-500/30 dark:border-amber-500/30"
                        }`}
                      >
                        <div>
                          {/* Top row: Name, Core Badge, Proficiency Badge */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-xs font-bold text-[#24292f] dark:text-[#f0f6fc]">
                                  {skill.name}
                                </span>
                                {skill.is_core && (
                                  <span
                                    className="text-[10px] font-mono font-bold text-[#d97706] dark:text-[#f59e0b]"
                                    title="Core Stack Competency"
                                  >
                                    ★
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] font-mono text-[#57606a] dark:text-[#8b949e]">
                                slug: {skill.slug} • #{skill.order}
                              </div>
                            </div>

                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${prof.badgeClass}`}
                            >
                              {prof.label}
                            </span>
                          </div>

                          {/* Description / Evidence Snippet */}
                          {skill.description && (
                            <p className="text-[11px] text-[#57606a] dark:text-[#8b949e] line-clamp-2 mt-1.5">
                              {skill.description}
                            </p>
                          )}

                          {/* Relational Telemetry Counts */}
                          <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] font-mono text-[#57606a] dark:text-[#8b949e]">
                            {skill.years > 0 && (
                              <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d]">
                                {skill.years}y exp
                              </span>
                            )}
                            {(skill.related_experiences_detail?.length || 0) > 0 && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d]">
                                <Briefcase className="w-3 h-3 text-[#0969da]" />
                                {skill.related_experiences_detail?.length}
                              </span>
                            )}
                            {(skill.related_projects_detail?.length || 0) > 0 && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d]">
                                <FolderGit2 className="w-3 h-3 text-[#1f883d]" />
                                {skill.related_projects_detail?.length}
                              </span>
                            )}
                            {(skill.technologies_detail?.length || 0) > 0 && (
                              <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d]">
                                {skill.technologies_detail?.length} tech
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bottom Action Bar */}
                        <div className="pt-2 border-t border-[#d0d7de]/50 dark:border-[#30363d]/50 flex items-center justify-between gap-1 text-[11px] font-mono">
                          {/* Quick Toggles */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                togglePublishMutation.mutate({
                                  slug: skill.slug,
                                  is_published: !skill.is_published,
                                })
                              }
                              className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                                skill.is_published
                                  ? "bg-[#dafbe1] dark:bg-[#112a1c] text-[#1a7f37] dark:text-[#3fb950] border-[#2da44e]/30"
                                  : "bg-[#ffebe9] dark:bg-[#2b1011] text-[#cf222e] dark:text-[#ff7b72] border-[#cf222e]/30"
                              }`}
                              title="Toggle public showcase visibility"
                            >
                              {skill.is_published ? "Live" : "Draft"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                toggleCoreMutation.mutate({
                                  slug: skill.slug,
                                  is_core: !skill.is_core,
                                })
                              }
                              className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                                skill.is_core
                                  ? "bg-[#fff8c5] dark:bg-[#3b2300] text-[#9a6700] dark:text-[#f5d90a] border-[#d4a72c]/40"
                                  : "bg-white dark:bg-[#161b22] text-[#57606a] dark:text-[#8b949e] border-[#d0d7de] dark:border-[#30363d]"
                              }`}
                              title="Toggle core stack promotion"
                            >
                              {skill.is_core ? "★ Core" : "☆ Core"}
                            </button>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/dashboard/skills/${skill.slug}`}
                              className="p-1 text-[#0969da] dark:text-[#58a6ff] hover:bg-[#ddf4ff] dark:hover:bg-[#0c2d6b] rounded transition-colors"
                              title="Edit Skill"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(skill)}
                              className="p-1 text-[#cf222e] dark:text-[#ff7b72] hover:bg-[#ffebe9] dark:hover:bg-[#2b1011] rounded transition-colors"
                              title="Delete Skill"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 2: COMPACT TABLE VIEW */}
      {/* ========================================================================= */}
      {!isLoading && !error && filteredSkills.length > 0 && viewMode === "table" && (
        <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#f6f8fa] dark:bg-[#0d1117] border-b border-[#d0d7de] dark:border-[#30363d] text-[#57606a] dark:text-[#8b949e]">
                <tr>
                  <th className="px-4 py-2.5">#</th>
                  <th className="px-4 py-2.5">Skill Name</th>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5">Proficiency</th>
                  <th className="px-4 py-2.5">Years</th>
                  <th className="px-4 py-2.5">Core</th>
                  <th className="px-4 py-2.5">Visibility</th>
                  <th className="px-4 py-2.5">Evidence</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d0d7de]/60 dark:divide-[#30363d]/60">
                {filteredSkills.map((skill) => {
                  const prof =
                    PROFICIENCY_CONFIG[skill.proficiency?.toLowerCase()] ||
                    PROFICIENCY_CONFIG.advanced;

                  return (
                    <tr
                      key={skill.id}
                      className="hover:bg-[#f6f8fa]/50 dark:hover:bg-[#0d1117]/50 transition-colors"
                    >
                      <td className="px-4 py-2.5 text-[#57606a] dark:text-[#8b949e]">
                        {skill.order}
                      </td>
                      <td className="px-4 py-2.5 font-bold text-[#24292f] dark:text-[#f0f6fc]">
                        {skill.name}
                      </td>
                      <td className="px-4 py-2.5 text-[#57606a] dark:text-[#8b949e]">
                        {skill.category}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${prof.badgeClass}`}
                        >
                          {prof.label}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[#57606a] dark:text-[#8b949e]">
                        {skill.years}y
                      </td>
                      <td className="px-4 py-2.5">
                        <button
                          type="button"
                          onClick={() =>
                            toggleCoreMutation.mutate({
                              slug: skill.slug,
                              is_core: !skill.is_core,
                            })
                          }
                          className={`text-[10px] px-1.5 py-0.5 rounded border ${
                            skill.is_core
                              ? "bg-[#fff8c5] dark:bg-[#3b2300] text-[#9a6700] dark:text-[#f5d90a] border-[#d4a72c]/40"
                              : "text-[#57606a] dark:text-[#8b949e] border-[#d0d7de] dark:border-[#30363d]"
                          }`}
                        >
                          {skill.is_core ? "★ Core" : "☆"}
                        </button>
                      </td>
                      <td className="px-4 py-2.5">
                        <button
                          type="button"
                          onClick={() =>
                            togglePublishMutation.mutate({
                              slug: skill.slug,
                              is_published: !skill.is_published,
                            })
                          }
                          className={`text-[10px] px-1.5 py-0.5 rounded border ${
                            skill.is_published
                              ? "bg-[#dafbe1] dark:bg-[#112a1c] text-[#1a7f37] dark:text-[#3fb950] border-[#2da44e]/30"
                              : "bg-[#ffebe9] dark:bg-[#2b1011] text-[#cf222e] dark:text-[#ff7b72] border-[#cf222e]/30"
                          }`}
                        >
                          {skill.is_published ? "Published" : "Draft"}
                        </button>
                      </td>
                      <td className="px-4 py-2.5 text-[10px] text-[#57606a] dark:text-[#8b949e]">
                        {(skill.related_experiences_detail?.length || 0)} Exp / {(skill.related_projects_detail?.length || 0)} Proj
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/dashboard/skills/${skill.slug}`}
                            className="p-1 text-[#0969da] dark:text-[#58a6ff] hover:bg-[#ddf4ff] dark:hover:bg-[#0c2d6b] rounded"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(skill)}
                            className="p-1 text-[#cf222e] dark:text-[#ff7b72] hover:bg-[#ffebe9] dark:hover:bg-[#2b1011] rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PREVIEW MODAL */}
      {/* ========================================================================= */}
      {previewSkillSlug && (
        <SkillPreviewModal
          isOpen={true}
          onClose={() => setPreviewSkillSlug(null)}
          skills={skills}
          isDirty={false}
          highlightSkillSlug={previewSkillSlug === "all" ? undefined : previewSkillSlug}
        />
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {deleteTarget && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          title="Delete Skill Record"
          subtitle={`Are you sure you want to permanently delete "${deleteTarget.name}"?`}
          maxWidth="md"
          footerActions={
            <div className="flex items-center justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(deleteTarget.slug)}
                disabled={deleteMutation.isPending}
                className="px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg bg-[#cf222e] text-white hover:bg-[#a40e26] transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleteMutation.isPending ? "Deleting..." : "Permanently Delete"}</span>
              </button>
            </div>
          }
        >
          <div className="p-4 space-y-3 text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
            <p>
              This will remove the skill competency record{" "}
              <strong className="text-[#24292f] dark:text-[#f0f6fc]">{deleteTarget.name}</strong> from PostgreSQL and any associated presentation views.
            </p>
            <div className="p-3 rounded-lg bg-[#ffebe9] dark:bg-[#2b1011] border border-[#cf222e]/30 text-[#cf222e] dark:text-[#ff7b72]">
              Warning: This action cannot be undone.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
