"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Milestone,
  Plus,
  Search,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Calendar,
  AlertTriangle,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Award,
  Rocket,
  Server,
  LayoutGrid,
  List,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import type { TimelineEvent } from "@/lib/api/types";
import {
  getAdminTimelineEvents,
  updateAdminTimelineEvent,
  deleteAdminTimelineEvent,
} from "@/lib/api/admin-client";
import { TimelinePreviewModal } from "@/components/timeline/TimelinePreviewModal";

export default function TimelineDashboardPage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSourceType, setSelectedSourceType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"stream" | "table">("stream");

  // Preview & Delete Modals
  const [previewItem, setPreviewItem] = useState<TimelineEvent | null>(null);
  const [deletingItem, setDeletingItem] = useState<TimelineEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAdminTimelineEvents();
      setEvents(data);
    } catch (err: any) {
      setError(err.message || "Failed to load timeline projection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => {
      if (e.category) set.add(e.category);
    });
    return Array.from(set);
  }, [events]);

  const filteredEvents = useMemo(() => {
    const result = events.filter((e) => {
      const matchesCat =
        selectedCategory === "all" ||
        e.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSource =
        selectedSourceType === "all" ||
        e.source_type?.toLowerCase() === selectedSourceType.toLowerCase();

      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.subtitle?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.date.toLowerCase().includes(q);

      return matchesCat && matchesSource && matchesQuery;
    });

    return [...result].sort((a, b) => {
      const dateA = a.date_sort || "0000-00-00";
      const dateB = b.date_sort || "0000-00-00";
      if (dateA !== dateB) return dateB.localeCompare(dateA);
      return (a.order || 0) - (b.order || 0);
    });
  }, [events, selectedCategory, selectedSourceType, searchQuery]);

  const handleTogglePublish = async (item: TimelineEvent) => {
    if (item.source_type !== "manual_milestone") return;
    const nextState = !item.is_published;
    try {
      await updateAdminTimelineEvent(item.slug, { is_published: nextState });
      setEvents((prev) =>
        prev.map((e) => (e.slug === item.slug ? { ...e, is_published: nextState } : e))
      );
    } catch (err: any) {
      alert(`Failed to update publication status: ${err.message}`);
    }
  };

  const handleToggleMilestone = async (item: TimelineEvent) => {
    if (item.source_type !== "manual_milestone") return;
    const nextState = !item.is_milestone;
    try {
      await updateAdminTimelineEvent(item.slug, { is_milestone: nextState });
      setEvents((prev) =>
        prev.map((e) => (e.slug === item.slug ? { ...e, is_milestone: nextState } : e))
      );
    } catch (err: any) {
      alert(`Failed to update milestone status: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    if (deletingItem.source_type !== "manual_milestone") return;
    setIsDeleting(true);
    try {
      await deleteAdminTimelineEvent(deletingItem.slug);
      setEvents((prev) => prev.filter((e) => e.slug !== deletingItem.slug));
      setDeletingItem(null);
    } catch (err: any) {
      alert(`Failed to delete milestone: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const getAdminSourceUrl = (item: TimelineEvent): string => {
    const slug = item.source_slug || item.slug;
    switch (item.source_type) {
      case "experience":
        return `/dashboard/experience/${slug}`;
      case "education":
        return `/dashboard/education/${slug}`;
      case "certification":
        return `/dashboard/certifications/${slug}`;
      case "project":
        return `/dashboard/projects/${slug}`;
      case "manual_milestone":
      default:
        return `/dashboard/timeline/${slug}`;
    }
  };

  const getSourceBadge = (sourceType?: string) => {
    switch (sourceType) {
      case "experience":
        return (
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
            Experience
          </span>
        );
      case "education":
        return (
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20">
            Education
          </span>
        );
      case "certification":
        return (
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            Certification
          </span>
        );
      case "project":
        return (
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20">
            Project
          </span>
        );
      case "manual_milestone":
        return (
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            Manual Milestone
          </span>
        );
      default:
        return null;
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "GraduationCap":
        return <GraduationCap className="h-4 w-4" />;
      case "Rocket":
        return <Rocket className="h-4 w-4" />;
      case "Server":
        return <Server className="h-4 w-4" />;
      case "Award":
        return <Award className="h-4 w-4" />;
      case "Milestone":
        return <Milestone className="h-4 w-4" />;
      default:
        return <Briefcase className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-[#d0d7de] dark:border-[#30363d]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#24292f] dark:text-white tracking-tight flex items-center gap-2.5">
            <Milestone className="w-6 h-6 text-[#0969da] dark:text-[#58a6ff]" />
            <span>Career Timeline Management</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-[#0969da]/10 text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/30">
              Aggregated Projection
            </span>
          </h1>
          <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-1">
            Dynamic timeline projected from Experience, Education, Certifications, and Manual Milestones.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={fetchEvents}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#21262d] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] border border-[#d0d7de] dark:border-[#30363d] text-xs font-medium text-[#24292f] dark:text-[#c9d1d9] transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#0969da] dark:text-[#58a6ff]" : ""}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/dashboard/timeline/new"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0969da] hover:bg-[#0859b8] text-xs font-semibold text-white transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Manual Milestone</span>
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-[#ffebe9] dark:bg-red-950/40 border border-[#ff8182]/50 dark:border-red-800/60 text-[#cf222e] dark:text-red-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchEvents} className="text-xs font-semibold underline hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {/* Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
          <div className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">PROJECTED EVENTS</div>
          <div className="text-2xl font-bold text-[#24292f] dark:text-white font-mono mt-1">
            {isLoading ? "-" : events.length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
          <div className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">CAREER ROLES</div>
          <div className="text-2xl font-bold text-[#0969da] dark:text-[#58a6ff] font-mono mt-1">
            {isLoading ? "-" : events.filter((e) => e.source_type === "experience").length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
          <div className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">CREDENTIALS & DEGREES</div>
          <div className="text-2xl font-bold text-[#1a7f37] dark:text-[#3fb950] font-mono mt-1">
            {isLoading
              ? "-"
              : events.filter(
                  (e) => e.source_type === "certification" || e.source_type === "education"
                ).length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
          <div className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">MANUAL MILESTONES</div>
          <div className="text-2xl font-bold text-[#8957e5] dark:text-[#a371f7] font-mono mt-1">
            {isLoading ? "-" : events.filter((e) => e.source_type === "manual_milestone").length}
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#57606a] dark:text-[#8b949e]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search timeline events by title, subtitle, date..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-xs text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Source Type Filter */}
          <select
            value={selectedSourceType}
            onChange={(e) => setSelectedSourceType(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-xs font-mono text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden"
          >
            <option value="all">All Sources</option>
            <option value="experience">Experience</option>
            <option value="education">Education</option>
            <option value="certification">Certification</option>
            <option value="manual_milestone">Manual Milestone</option>
          </select>

          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-xs font-mono text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}

          {/* View Mode Switcher */}
          <div className="flex items-center rounded-lg border border-[#d0d7de] dark:border-[#30363d] p-0.5 bg-[#f6f8fa] dark:bg-[#0d1117]">
            <button
              onClick={() => setViewMode("stream")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "stream"
                  ? "bg-white dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff] shadow-2xs"
                  : "text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-white"
              }`}
              title="Stream View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "bg-white dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff] shadow-2xs"
                  : "text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-white"
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Stream / Table */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] text-center space-y-3 shadow-xs">
          <Milestone className="w-10 h-10 text-[#57606a] dark:text-[#8b949e] mx-auto opacity-50" />
          <div className="text-sm font-semibold text-[#24292f] dark:text-white">
            No timeline events found
          </div>
          <p className="text-xs text-[#57606a] dark:text-[#8b949e]">
            {searchQuery || selectedCategory !== "all" || selectedSourceType !== "all"
              ? "Try adjusting your search query or filter."
              : "Add your first manual milestone or populate canonical Experience/Education records."}
          </p>
        </div>
      ) : viewMode === "stream" ? (
        <div className="relative border-l-2 border-[#d0d7de] dark:border-[#30363d] ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-6">
          {filteredEvents.map((item) => {
            const isManual = item.source_type === "manual_milestone";
            return (
              <div key={item.id || item.slug} className="relative group">
                {/* Node Icon */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] text-[#0969da] dark:text-[#58a6ff] shadow-xs group-hover:border-[#0969da] dark:group-hover:border-[#58a6ff] transition-colors">
                  {getIcon(item.icon)}
                </div>

                <div
                  className={`rounded-2xl border bg-white dark:bg-[#161b22] p-5 space-y-3 shadow-xs transition-all hover:border-[#0969da]/50 dark:hover:border-[#58a6ff]/50 ${
                    item.is_milestone
                      ? "border-[#0969da]/40 dark:border-[#58a6ff]/40 bg-[#f6f8fa]/30 dark:bg-[#161b22]"
                      : "border-[#d0d7de] dark:border-[#30363d]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-[#24292f] dark:text-[#f0f6fc] group-hover:text-[#0969da] dark:group-hover:text-[#58a6ff] transition-colors">
                        {item.title}
                      </h3>
                      {item.is_milestone && (
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#0969da]/10 text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/30">
                          Key Milestone
                        </span>
                      )}
                      {item.category && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d]">
                          {item.category}
                        </span>
                      )}
                      {getSourceBadge(item.source_type)}
                    </div>

                    <span className="text-xs font-mono font-semibold text-[#0969da] dark:text-[#58a6ff] rounded-full bg-[#f6f8fa] dark:bg-[#21262d] px-2.5 py-0.5 border border-[#d0d7de] dark:border-[#30363d] self-start sm:self-auto">
                      {item.date}
                    </span>
                  </div>

                  {item.subtitle && (
                    <p className="text-xs font-mono font-semibold text-[#0969da] dark:text-[#58a6ff]">
                      {item.subtitle}
                    </p>
                  )}

                  {item.description && (
                    <p className="text-xs text-[#57606a] dark:text-[#8b949e] leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Actions Toolbar */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60">
                    <div className="flex items-center gap-3">
                      {isManual ? (
                        <>
                          <button
                            onClick={() => handleTogglePublish(item)}
                            className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border cursor-pointer transition-colors ${
                              item.is_published
                                ? "bg-[#dafbe1] dark:bg-[#1f883d]/20 text-[#1a7f37] dark:text-[#3fb950] border-[#1a7f37]/30"
                                : "bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border-[#d0d7de] dark:border-[#30363d]"
                            }`}
                          >
                            {item.is_published ? "Published" : "Draft"}
                          </button>

                          <button
                            onClick={() => handleToggleMilestone(item)}
                            className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border cursor-pointer transition-colors ${
                              item.is_milestone
                                ? "bg-[#0969da]/10 text-[#0969da] dark:text-[#58a6ff] border-[#0969da]/30"
                                : "bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border-[#d0d7de] dark:border-[#30363d]"
                            }`}
                          >
                            {item.is_milestone ? "Key Milestone" : "Regular Event"}
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e] flex items-center gap-1">
                          <span>Canonical source:</span>
                          <span className="capitalize font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                            {item.source_type}
                          </span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewItem(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-[#f6f8fa] dark:bg-[#21262d] hover:bg-[#eaeef2] dark:hover:bg-[#30363d] text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff] border border-[#d0d7de] dark:border-[#30363d] cursor-pointer"
                        title="Live Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      {isManual ? (
                        <>
                          <Link
                            href={`/dashboard/timeline/${item.slug}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-white dark:bg-[#161b22] hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/30 hover:border-[#0969da]"
                            title="Edit Milestone"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => setDeletingItem(item)}
                            className="p-1.5 rounded-md hover:bg-[#ffebe9] dark:hover:bg-red-950/40 text-[#cf222e] dark:text-red-400 cursor-pointer"
                            title="Delete Milestone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <Link
                          href={getAdminSourceUrl(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-[#0969da]/10 hover:bg-[#0969da]/20 text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/30 transition-colors"
                          title="Open canonical source record in control plane"
                        >
                          <span>Open Source</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f8fa] dark:bg-[#21262d] border-b border-[#d0d7de] dark:border-[#30363d] font-mono text-[#57606a] dark:text-[#8b949e]">
              <tr>
                <th className="p-3">Source</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Date</th>
                <th className="p-3">Milestone</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d0d7de]/60 dark:divide-[#30363d]/60">
              {filteredEvents.map((item) => {
                const isManual = item.source_type === "manual_milestone";
                return (
                  <tr key={item.id || item.slug} className="hover:bg-[#f6f8fa]/50 dark:hover:bg-[#21262d]/50">
                    <td className="p-3 font-mono text-center w-28">
                      {getSourceBadge(item.source_type)}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-[#24292f] dark:text-[#f0f6fc]">{item.title}</div>
                      {item.subtitle && (
                        <div className="font-mono text-[11px] text-[#0969da] dark:text-[#58a6ff]">
                          {item.subtitle}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d] font-mono text-[11px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#57606a] dark:text-[#8b949e]">
                      {item.date}
                    </td>
                    <td className="p-3">
                      {item.is_milestone ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#0969da]/10 text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/30">
                          Key
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#57606a]">Regular</span>
                      )}
                    </td>
                    <td className="p-3">
                      {isManual ? (
                        <button
                          onClick={() => handleTogglePublish(item)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border cursor-pointer ${
                            item.is_published
                              ? "bg-[#dafbe1] dark:bg-[#1f883d]/20 text-[#1a7f37] dark:text-[#3fb950] border-[#1a7f37]/30"
                              : "bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border-[#d0d7de] dark:border-[#30363d]"
                          }`}
                        >
                          {item.is_published ? "Published" : "Draft"}
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-[#57606a] dark:text-[#8b949e]">
                          {item.is_published ? "Published" : "Draft"}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="p-1 rounded-md hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff] cursor-pointer"
                          title="Live Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {isManual ? (
                          <>
                            <Link
                              href={`/dashboard/timeline/${item.slug}`}
                              className="p-1 rounded-md hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff]"
                              title="Edit Milestone"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => setDeletingItem(item)}
                              className="p-1 rounded-md hover:bg-[#ffebe9] dark:hover:bg-red-950/40 text-[#cf222e] dark:text-red-400 cursor-pointer"
                              title="Delete Milestone"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <Link
                            href={getAdminSourceUrl(item)}
                            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-mono text-[#0969da] dark:text-[#58a6ff] hover:underline"
                            title="Open canonical source record"
                          >
                            <span>Open</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#ffebe9] dark:bg-red-950/40 text-[#cf222e] dark:text-red-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#24292f] dark:text-[#f0f6fc]">
                  Delete Manual Milestone?
                </h3>
                <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-1">
                  Are you sure you want to delete <span className="font-semibold text-[#24292f] dark:text-white font-mono">&quot;{deletingItem.title}&quot;</span>? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                disabled={isDeleting}
                className="px-3.5 py-1.5 rounded-lg border border-[#d0d7de] dark:border-[#30363d] text-xs font-medium text-[#57606a] dark:text-[#8b949e] hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3.5 py-1.5 rounded-lg bg-[#cf222e] hover:bg-[#a40e26] text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewItem && (
        <TimelinePreviewModal
          isOpen={!!previewItem}
          onClose={() => setPreviewItem(null)}
          timelineItem={previewItem}
          allTimeline={events}
        />
      )}
    </div>
  );
}
