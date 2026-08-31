"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FolderGit2,
  Plus,
  Calendar,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Zap,
  Tag,
  ShieldCheck,
  RefreshCw,
  Search,
  ExternalLink,
  Layers,
  BookOpen,
} from "lucide-react";
import {
  getAdminProjects,
  updateAdminProject,
  deleteAdminProject,
} from "@/lib/api/admin-client";
import { ProjectPreviewModal } from "@/components/project/ProjectPreviewModal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TechChip } from "@/components/ui/TechChip";
import { GithubIcon } from "@/components/icons/SocialIcons";
import type { Project } from "@/lib/api/types";

export default function ProjectManagementPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [previewProj, setPreviewProj] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { data: projects = [], isLoading, error, refetch, isFetching } = useQuery<Project[]>({
    queryKey: ["admin-projects"],
    queryFn: getAdminProjects,
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ slug, is_published }: { slug: string; is_published: boolean }) => {
      return updateAdminProject(slug, { is_published });
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      setNotification({
        type: "success",
        message: `"${updated.title}" publication status updated.`,
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

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ slug, featured }: { slug: string; featured: boolean }) => {
      return updateAdminProject(slug, { featured });
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      setNotification({
        type: "success",
        message: `"${updated.title}" featured status updated.`,
      });
      setTimeout(() => setNotification(null), 4000);
    },
    onError: (err: any) => {
      setNotification({
        type: "error",
        message: err.message || "Failed to update featured status.",
      });
      setTimeout(() => setNotification(null), 5000);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      return deleteAdminProject(slug);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      setDeleteTarget(null);
      setNotification({
        type: "success",
        message: "Project record deleted successfully.",
      });
      setTimeout(() => setNotification(null), 4000);
    },
    onError: (err: any) => {
      setNotification({
        type: "error",
        message: err.message || "Failed to delete project.",
      });
      setTimeout(() => setNotification(null), 5000);
    },
  });

  const filteredProjects = projects.filter((p) => {
    // Type filter
    if (typeFilter !== "all" && p.project_type !== typeFilter) {
      return false;
    }
    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.project_type?.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q) ||
      p.target_roles?.some((r) => r.toLowerCase().includes(q)) ||
      p.tech_stack_detail?.some((t) => t.name.toLowerCase().includes(q))
    );
  });

  const totalProjects = projects.length;
  const featuredCount = projects.filter((p) => p.featured).length;
  const publishedCount = projects.filter((p) => p.is_published !== false).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Sticky Single-Row Action Bar */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3.5 bg-[#f6f8fa]/90 dark:bg-[#0d1117]/90 backdrop-blur-md border-b border-[#d0d7de] dark:border-[#30363d] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <FolderGit2 className="h-5 w-5 text-[#0969da] dark:text-[#58a6ff] flex-shrink-0" />
            <h1 className="text-base sm:text-lg font-bold text-[#24292f] dark:text-[#f0f6fc] truncate">
              Projects Showcase Management
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-white dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] text-[#57606a] dark:text-[#8b949e]">
              Total: {totalProjects}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#dafbe1] dark:bg-[#112a1c] border border-[#2da44e]/30 text-[#1a7f37] dark:text-[#3fb950]">
              Published: {publishedCount}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#ddf4ff] dark:bg-[#0c2d6b] border border-[#0969da]/30 text-[#0969da] dark:text-[#58a6ff]">
              Featured: {featuredCount}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-1.5 rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#f0f6fc] hover:bg-[#eaeef2] dark:hover:bg-[#30363d] transition-colors"
            title="Refresh canonical projects"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg bg-[#1f883d] text-white hover:bg-[#1a7f37] transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Project</span>
          </Link>
        </div>
      </div>

      {/* Global Toast Notification */}
      {notification && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg border text-xs font-mono animate-in fade-in duration-200 ${
            notification.type === "success"
              ? "bg-[#dafbe1] dark:bg-[#112a1c] border-[#2da44e]/40 text-[#1a7f37] dark:text-[#3fb950]"
              : "bg-[#ffebe9] dark:bg-[#2b1011] border-[#cf222e]/40 text-[#cf222e] dark:text-[#ff7b72]"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#161b22] p-3.5 rounded-xl border border-[#d0d7de] dark:border-[#30363d] shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57606a] dark:text-[#8b949e]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, summary, tech, or target role..."
            className="w-full pl-9 pr-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] placeholder-[#57606a] focus:outline-none focus:border-[#0969da]"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e] whitespace-nowrap">
            Category:
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
          >
            <option value="all">All Categories</option>
            <option value="application">Application / Product</option>
            <option value="infrastructure">Infrastructure & Homelab</option>
            <option value="platform">Platform & Tooling</option>
            <option value="open_source">Open Source</option>
            <option value="experiment">Experiment</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-3 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22]">
          <RefreshCw className="h-6 w-6 animate-spin text-[#0969da] dark:text-[#58a6ff]" />
          <p className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
            Loading canonical project records from PostgreSQL...
          </p>
        </div>
      )}

      {/* Error View */}
      {error && !isLoading && (
        <div className="rounded-xl border border-[#cf222e]/30 bg-[#ffebe9] dark:bg-[#2b1011] p-6 text-center space-y-2 text-[#cf222e] dark:text-[#ff7b72]">
          <AlertCircle className="h-6 w-6 mx-auto" />
          <h2 className="text-sm font-bold font-mono">Failed to Load Projects</h2>
          <p className="text-xs font-mono">{(error as Error).message}</p>
        </div>
      )}

      {/* Projects List */}
      {!isLoading && !error && (
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-12 text-center space-y-3">
              <FolderGit2 className="h-8 w-8 text-[#57606a] dark:text-[#8b949e] mx-auto opacity-60" />
              <p className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
                {searchQuery || typeFilter !== "all"
                  ? "No projects match your filter criteria."
                  : "No projects registered in Career OS database."}
              </p>
              <Link
                href="/dashboard/projects/new"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-[#0969da] text-white hover:bg-[#085ac1] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create First Project</span>
              </Link>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const isPublished = project.is_published !== false;
              const isFeatured = Boolean(project.featured);
              const hasLiveDemo = Boolean(project.demo && project.demo.trim().length > 0);
              const featuresCount = project.key_features?.length || 0;
              const flowStepsCount = project.architecture_flow?.length || 0;
              const highlightsCount = project.highlights?.length || 0;

              return (
                <div
                  key={project.id || project.slug}
                  className={`rounded-xl border transition-all shadow-xs bg-white dark:bg-[#161b22] ${
                    isPublished
                      ? "border-[#d0d7de] dark:border-[#30363d]"
                      : "border-[#d0d7de]/50 dark:border-[#30363d]/50 opacity-80"
                  }`}
                >
                  <div className="p-5 space-y-4">
                    {/* Header Row */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-bold text-[#24292f] dark:text-[#f0f6fc]">
                            {project.title}
                          </h2>

                          {/* Category Pill */}
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#eaeef2] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de]/50 dark:border-[#30363d]">
                            {project.project_type || "application"}
                          </span>

                          {/* Status Badge */}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                              project.status === "in_development"
                                ? "bg-[#ddf4ff] dark:bg-[#0c2d6b] text-[#0969da] dark:text-[#58a6ff] border-[#0969da]/30"
                                : project.status === "deployed"
                                ? "bg-[#dafbe1] dark:bg-[#112a1c] text-[#1a7f37] dark:text-[#3fb950] border-[#2da44e]/30"
                                : "bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border-[#d0d7de] dark:border-[#30363d]"
                            }`}
                          >
                            {project.status || "active"}
                          </span>

                          {/* Featured Star */}
                          {isFeatured && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#fff8c5] dark:bg-[#3b2300] text-[#9a6700] dark:text-[#f5d90a] border border-[#d4a72c]/40">
                              ★ Featured
                            </span>
                          )}

                          {/* Unpublished Flag */}
                          {!isPublished && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#ffebe9] dark:bg-[#2b1011] text-[#cf222e] dark:text-[#ff7b72] border border-[#cf222e]/30">
                              Draft (Hidden)
                            </span>
                          )}
                        </div>

                        {/* Summary */}
                        <p className="text-xs text-[#57606a] dark:text-[#8b949e] line-clamp-2 leading-relaxed">
                          {project.summary}
                        </p>
                      </div>

                      {/* Action Controls */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* Toggle Featured */}
                        <button
                          type="button"
                          onClick={() =>
                            toggleFeaturedMutation.mutate({
                              slug: project.slug,
                              featured: !isFeatured,
                            })
                          }
                          title={isFeatured ? "Unfeature on homepage" : "Feature on homepage"}
                          className={`px-2 py-1 text-xs font-mono rounded-lg border transition-colors ${
                            isFeatured
                              ? "border-[#d4a72c] bg-[#fff8c5] dark:bg-[#3b2300] text-[#9a6700] dark:text-[#f5d90a]"
                              : "border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e]"
                          }`}
                        >
                          {isFeatured ? "★" : "☆"}
                        </button>

                        {/* Toggle Publish */}
                        <button
                          type="button"
                          onClick={() =>
                            togglePublishMutation.mutate({
                              slug: project.slug,
                              is_published: !isPublished,
                            })
                          }
                          className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-colors ${
                            isPublished
                              ? "border-[#2da44e]/40 bg-[#dafbe1] dark:bg-[#112a1c] text-[#1a7f37] dark:text-[#3fb950]"
                              : "border-[#cf222e]/40 bg-[#ffebe9] dark:bg-[#2b1011] text-[#cf222e] dark:text-[#ff7b72]"
                          }`}
                        >
                          {isPublished ? "Published" : "Draft"}
                        </button>

                        {/* Preview Action */}
                        <button
                          type="button"
                          onClick={() => setPreviewProj(project)}
                          className="p-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#f0f6fc] hover:bg-[#eaeef2] dark:hover:bg-[#30363d] transition-colors"
                          title="Preview public presentation"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Action */}
                        <Link
                          href={`/dashboard/projects/${project.slug}`}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-mono font-medium rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff] hover:bg-[#eaeef2] dark:hover:bg-[#30363d] transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </Link>

                        {/* Delete Action */}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(project)}
                          className="p-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#cf222e] dark:text-[#ff7b72] hover:bg-[#ffebe9] dark:hover:bg-[#2b1011] transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata & Telemetry Chips */}
                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#d0d7de]/50 dark:border-[#30363d]/50 text-[11px] font-mono text-[#57606a] dark:text-[#8b949e]">
                      {project.timeline && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#1f883d] dark:text-[#39d353]" />
                          <span>{project.timeline}</span>
                        </div>
                      )}

                      {project.repository && (
                        <a
                          href={project.repository}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-colors"
                        >
                          <GithubIcon className="w-3 h-3" />
                          <span>GitHub</span>
                        </a>
                      )}

                      {hasLiveDemo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[#0969da] dark:text-[#58a6ff] hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Live System</span>
                        </a>
                      )}

                      {/* Counters */}
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="px-1.5 py-0.5 rounded bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de]/40 dark:border-[#30363d]">
                          Flow: {flowStepsCount} steps
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de]/40 dark:border-[#30363d]">
                          Features: {featuresCount}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de]/40 dark:border-[#30363d]">
                          Evidence: {highlightsCount}
                        </span>
                      </div>
                    </div>

                    {/* Tech Stack Preview */}
                    {project.tech_stack_detail && project.tech_stack_detail.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {project.tech_stack_detail.map((t) => (
                          <TechChip key={t.id} name={t.name} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Live Presentation Preview Modal */}
      {previewProj && (
        <ProjectPreviewModal
          isOpen={Boolean(previewProj)}
          onClose={() => setPreviewProj(null)}
          project={previewProj}
          isDirty={false}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-[#161b22] border border-[#cf222e]/40 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 text-[#cf222e] dark:text-[#ff7b72]">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <h3 className="text-sm font-bold font-mono">Confirm Project Deletion</h3>
            </div>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] leading-relaxed">
              Are you sure you want to delete <strong className="text-[#24292f] dark:text-[#f0f6fc]">&ldquo;{deleteTarget.title}&rdquo;</strong> ({deleteTarget.slug})? This action removes the canonical project record from PostgreSQL.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(deleteTarget.slug)}
                disabled={deleteMutation.isPending}
                className="px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-[#cf222e] text-white hover:bg-[#a40e26] transition-colors"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
