"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  Plus,
  Building2,
  Calendar,
  MapPin,
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
} from "lucide-react";
import {
  getAdminExperiences,
  updateAdminExperience,
  deleteAdminExperience,
} from "@/lib/api/admin-client";
import { ExperiencePreviewModal } from "@/components/experience/ExperiencePreviewModal";
import type { Experience } from "@/lib/api/types";

export default function ExperienceManagementPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [previewExp, setPreviewExp] = useState<Experience | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { data: experiences = [], isLoading, error, refetch, isFetching } = useQuery<Experience[]>({
    queryKey: ["admin-experiences"],
    queryFn: getAdminExperiences,
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ slug, is_published }: { slug: string; is_published: boolean }) => {
      return updateAdminExperience(slug, { is_published });
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin-experiences"] });
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

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      return deleteAdminExperience(slug);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-experiences"] });
      setDeleteTarget(null);
      setNotification({
        type: "success",
        message: "Experience record deleted successfully.",
      });
      setTimeout(() => setNotification(null), 4000);
    },
    onError: (err: any) => {
      setNotification({
        type: "error",
        message: err.message || "Failed to delete experience.",
      });
      setTimeout(() => setNotification(null), 5000);
    },
  });

  const filteredExperiences = experiences.filter((exp) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      exp.title.toLowerCase().includes(q) ||
      exp.company_detail?.name.toLowerCase().includes(q) ||
      exp.employment_type.toLowerCase().includes(q) ||
      exp.target_roles?.some((r) => r.toLowerCase().includes(q))
    );
  });

  const currentRole = experiences.find((e) => e.current_position);
  const totalRoles = experiences.length;
  const publishedRoles = experiences.filter((e) => e.is_published).length;

  return (
    <div className="space-y-6">
      {/* 1. TOP TOOLBAR / ACTION BAR */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-[#f6f8fa]/90 dark:bg-[#0d1117]/90 backdrop-blur-md border-b border-[#d0d7de] dark:border-[#30363d] shadow-2xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 max-w-7xl mx-auto">
          {/* Title & Telemetry Counters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0969da]/10 dark:bg-[#58a6ff]/15 border border-[#0969da]/20 dark:border-[#58a6ff]/25 text-[#0969da] dark:text-[#58a6ff]">
                <Briefcase className="h-4 w-4" />
              </div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#24292f] dark:text-[#f0f6fc]">
                Work Experience Management
              </h1>
            </div>

            <div className="hidden sm:flex items-center gap-2 border-l border-[#d0d7de] dark:border-[#30363d] pl-3 text-xs font-mono">
              <span className="px-2 py-0.5 rounded-full bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] text-[#57606a] dark:text-[#8b949e]">
                {totalRoles} {totalRoles === 1 ? "Role" : "Roles"} Total ({publishedRoles} Published)
              </span>
              {currentRole && (
                <span className="px-2 py-0.5 rounded-full bg-[#1a7f37]/10 dark:bg-[#238636]/15 border border-[#1a7f37]/30 dark:border-[#238636]/40 text-[#1a7f37] dark:text-[#3fb950] font-semibold">
                  Active: {currentRole.company_detail?.name || currentRole.title}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons (Single row on desktop) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] transition-colors shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-[#0969da]" : ""}`} />
              <span>Refresh</span>
            </button>

            <Link
              href="/dashboard/experience/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-semibold rounded-lg bg-[#1f883d] hover:bg-[#1a7f37] text-white transition-colors shadow-2xs cursor-pointer no-underline"
            >
              <Plus className="h-4 w-4" />
              <span>New Experience</span>
            </Link>
          </div>
        </div>
      </div>

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border p-4 text-xs font-mono shadow-xs transition-all ${
            notification.type === "success"
              ? "border-[#1a7f37]/30 bg-[#dafbe1] dark:bg-[#112a1c] text-[#1a7f37] dark:text-[#3fb950]"
              : "border-[#cf222e]/30 bg-[#ffebe9] dark:bg-[#2b1011] text-[#cf222e] dark:text-[#ff7b72]"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span className="flex-1 font-medium">{notification.message}</span>
        </div>
      )}

      {/* SEARCH AND SUMMARY CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#57606a] dark:text-[#8b949e]" />
          <input
            type="text"
            placeholder="Search by role, company, or target role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] pl-8.5 pr-3 py-1.5 text-xs text-[#24292f] dark:text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#58a6ff]"
          />
        </div>

        <span className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e]">
          Showing {filteredExperiences.length} of {totalRoles} career records
        </span>
      </div>

      {/* 2. CHRONOLOGICAL EXPERIENCE LIST */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-3 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22]">
          <RefreshCw className="h-6 w-6 animate-spin text-[#0969da] dark:text-[#58a6ff]" />
          <p className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
            Loading canonical career history...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-[#cf222e]/30 bg-[#ffebe9] dark:bg-[#2b1011] p-6 text-center space-y-2 text-[#cf222e] dark:text-[#ff7b72]">
          <AlertCircle className="h-6 w-6 mx-auto" />
          <p className="text-xs font-mono font-bold">Failed to load experiences</p>
          <p className="text-xs text-[#57606a] dark:text-[#8b949e]">{(error as Error).message}</p>
        </div>
      ) : filteredExperiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-3 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] text-center">
          <Briefcase className="h-8 w-8 text-[#57606a] dark:text-[#8b949e]" />
          <h3 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
            No experience records found
          </h3>
          <p className="text-xs text-[#57606a] dark:text-[#8b949e] max-w-sm">
            {searchQuery ? "Try modifying your search filter." : "Add your first professional role to build your Career OS evidence bank."}
          </p>
          {!searchQuery && (
            <Link
              href="/dashboard/experience/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-semibold rounded-lg bg-[#1f883d] text-white shadow-2xs hover:bg-[#1a7f37] no-underline"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create First Role</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExperiences.map((exp) => {
            const company = exp.company_detail;
            const highlightsList = exp.highlights || [];
            const publicHighlightsCount = highlightsList.filter((h) =>
              typeof h === "string" ? true : h.is_public !== false
            ).length;
            const privateHighlightsCount = highlightsList.length - publicHighlightsCount;
            const metricsCount = exp.metrics?.length || 0;
            const challengesCount = exp.challenges?.length || 0;
            const techCount = exp.technologies_detail?.length || 0;

            return (
              <div
                key={exp.slug}
                className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 shadow-xs space-y-4 transition-all hover:border-[#0969da]/40 dark:hover:border-[#58a6ff]/40"
              >
                {/* Card Top: Identity, Dates, Badges & Publication Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#d0d7de]/50 dark:border-[#30363d]/50 pb-3.5">
                  <div className="flex items-start gap-3.5">
                    {company?.logo ? (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-transparent p-1 shadow-2xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="h-full w-full object-contain invert dark:invert-0"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff]">
                        <Building2 className="h-5 w-5" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/dashboard/experience/${exp.slug}`}
                          className="text-base font-bold text-[#24292f] dark:text-[#f0f6fc] hover:text-[#0969da] dark:hover:text-[#58a6ff] transition-colors no-underline"
                        >
                          {exp.title}
                        </Link>
                        {exp.current_position && (
                          <span className="rounded-full bg-[#1a7f37]/15 dark:bg-[#238636]/20 border border-[#1a7f37]/30 dark:border-[#238636]/40 px-2 py-0.5 text-[10px] font-mono font-semibold text-[#1a7f37] dark:text-[#3fb950]">
                            Active Role
                          </span>
                        )}
                        <span className="rounded-full bg-[#0969da]/10 dark:bg-[#58a6ff]/15 border border-[#0969da]/25 dark:border-[#58a6ff]/25 px-2 py-0.5 text-[10px] font-mono font-medium text-[#0969da] dark:text-[#58a6ff] capitalize">
                          {exp.employment_type}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
                        <span className="font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                          {company?.name || "Company"}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{exp.location}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-[#1f883d] dark:text-[#39d353]" />
                          <span>
                            {exp.start_date} &mdash; {exp.end_date || "Present"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Publication Toggle & Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    {/* Publication Toggle */}
                    <button
                      type="button"
                      onClick={() =>
                        togglePublishMutation.mutate({
                          slug: exp.slug,
                          is_published: !exp.is_published,
                        })
                      }
                      disabled={togglePublishMutation.isPending}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg border transition-colors cursor-pointer ${
                        exp.is_published
                          ? "border-[#1a7f37]/40 bg-[#dafbe1]/60 dark:bg-[#112a1c]/60 text-[#1a7f37] dark:text-[#3fb950] hover:bg-[#dafbe1]"
                          : "border-[#57606a]/40 bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] hover:bg-[#eaeef2]"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          exp.is_published ? "bg-[#1a7f37] dark:bg-[#3fb950]" : "bg-[#57606a]"
                        }`}
                      />
                      <span>{exp.is_published ? "Published" : "Draft / Private"}</span>
                    </button>

                    {/* Quick Preview Modal */}
                    <button
                      type="button"
                      onClick={() => setPreviewExp(exp)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-medium rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] transition-colors cursor-pointer"
                      title="Preview public portfolio presentation"
                    >
                      <Eye className="h-3 w-3 text-[#0969da] dark:text-[#58a6ff]" />
                      <span>Preview</span>
                    </button>

                    {/* Edit Details */}
                    <Link
                      href={`/dashboard/experience/${exp.slug}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-medium rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] transition-colors no-underline"
                    >
                      <Edit className="h-3 w-3 text-[#57606a] dark:text-[#8b949e]" />
                      <span>Edit</span>
                    </Link>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(exp)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-medium rounded-lg border border-[#cf222e]/30 bg-white dark:bg-[#21262d] text-[#cf222e] dark:text-[#ff7b72] hover:bg-[#ffebe9] dark:hover:bg-[#2b1011] transition-colors cursor-pointer"
                      title="Delete experience"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Card Middle: Summary / Narrative snippet */}
                {exp.summary && (
                  <p className="text-xs text-[#57606a] dark:text-[#8b949e] line-clamp-2 leading-relaxed">
                    {exp.summary}
                  </p>
                )}

                {/* Card Bottom: Evidence & Target Role Telemetry Pills */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#d0d7de]/40 dark:border-[#30363d]/40 text-xs font-mono">
                  {/* Evidence Counts */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de]/60 dark:border-[#30363d]/60 text-[11px] text-[#24292f] dark:text-[#c9d1d9]">
                      <Sparkles className="h-3 w-3 text-[#0969da] dark:text-[#58a6ff]" />
                      <span>
                        {highlightsList.length} Highlights ({publicHighlightsCount} Public
                        {privateHighlightsCount > 0 && `, ${privateHighlightsCount} Private`})
                      </span>
                    </span>

                    {metricsCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1f883d]/5 dark:bg-[#238636]/10 border border-[#1f883d]/25 dark:border-[#39d353]/25 text-[11px] text-[#1f883d] dark:text-[#39d353] font-semibold">
                        <Zap className="h-3 w-3" />
                        <span>{metricsCount} Metrics</span>
                      </span>
                    )}

                    {challengesCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#d97706]/5 dark:bg-[#f59e0b]/10 border border-[#d97706]/25 dark:border-[#f59e0b]/25 text-[11px] text-[#d97706] dark:text-[#f59e0b]">
                        <span>{challengesCount} Challenges</span>
                      </span>
                    )}

                    {techCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de]/60 dark:border-[#30363d]/60 text-[11px] text-[#57606a] dark:text-[#8b949e]">
                        <span>{techCount} Tech Tags</span>
                      </span>
                    )}
                  </div>

                  {/* Target Roles Alignment */}
                  {exp.target_roles && exp.target_roles.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Tag className="h-3 w-3 text-[#8a2be2]" />
                      <span className="text-[#8b949e]">Target:</span>
                      {exp.target_roles.map((role, rIdx) => (
                        <span
                          key={rIdx}
                          className="px-1.5 py-0.5 rounded bg-[#8a2be2]/10 border border-[#8a2be2]/25 text-[#8a2be2] font-semibold text-[10px]"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. PREVIEW MODAL */}
      {previewExp && (
        <ExperiencePreviewModal
          isOpen={true}
          onClose={() => setPreviewExp(null)}
          data={previewExp}
          isDraft={false}
        />
      )}

      {/* 4. DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-[#cf222e]/40 bg-white dark:bg-[#161b22] p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-[#cf222e] dark:text-[#ff7b72]">
              <AlertCircle className="h-5 w-5" />
              <h3 className="text-sm font-bold">Delete Work Experience</h3>
            </div>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] leading-relaxed">
              Are you sure you want to delete <strong className="text-[#24292f] dark:text-[#f0f6fc]">{deleteTarget.title}</strong> at <strong className="text-[#24292f] dark:text-[#f0f6fc]">{deleteTarget.company_detail?.name}</strong>? This action is immediate and permanent.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(deleteTarget.slug)}
                disabled={deleteMutation.isPending}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#cf222e] hover:bg-[#a40e26] text-white shadow-2xs transition-colors cursor-pointer"
              >
                {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
