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
      setError(err.message || "Failed to load timeline events.");
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

      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.subtitle?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.date.toLowerCase().includes(q);

      return matchesCat && matchesQuery;
    });

    return [...result].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [events, selectedCategory, searchQuery]);

  const handleTogglePublish = async (item: TimelineEvent) => {
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
    setIsDeleting(true);
    try {
      await deleteAdminTimelineEvent(deletingItem.slug);
      setEvents((prev) => prev.filter((e) => e.slug !== deletingItem.slug));
      setDeletingItem(null);
    } catch (err: any) {
      alert(`Failed to delete timeline event: ${err.message}`);
    } finally {
      setIsDeleting(false);
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
              V2.5 Active
            </span>
          </h1>
          <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-1">
            Chronological career trajectory, promotions, milestones, and public narrative stream.
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
            <span>New Timeline Event</span>
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
          <div className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">TOTAL EVENTS</div>
          <div className="text-2xl font-bold text-[#24292f] dark:text-white font-mono mt-1">
            {isLoading ? "-" : events.length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
          <div className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">KEY MILESTONES</div>
          <div className="text-2xl font-bold text-[#0969da] dark:text-[#58a6ff] font-mono mt-1">
            {isLoading ? "-" : events.filter((e) => e.is_milestone).length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
          <div className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">CAREER ROLES</div>
          <div className="text-2xl font-bold text-[#1a7f37] dark:text-[#3fb950] font-mono mt-1">
            {isLoading ? "-" : events.filter((e) => e.category === "Career").length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
          <div className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">PUBLISHED</div>
          <div className="text-2xl font-bold text-[#8957e5] dark:text-[#a371f7] font-mono mt-1">
            {isLoading ? "-" : events.filter((e) => e.is_published).length}
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

        <div className="flex items-center gap-2">
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

          <div className="flex items-center rounded-lg border border-[#d0d7de] dark:border-[#30363d] p-0.5 bg-[#f6f8fa] dark:bg-[#0d1117]">
            <button
              onClick={() => setViewMode("stream")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "stream"
                  ? "bg-white dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff] shadow-2xs"
                  : "text-[#57606a] dark:text-[#8b949e]"
              }`}
              title="Stream View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "table"
                  ? "bg-white dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff] shadow-2xs"
                  : "text-[#57606a] dark:text-[#8b949e]"
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
            {searchQuery || selectedCategory !== "all"
              ? "Try adjusting your search query or category filter."
              : "Add your first career milestone or event."}
          </p>
        </div>
      ) : viewMode === "stream" ? (
        <div className="relative border-l-2 border-[#d0d7de] dark:border-[#30363d] ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-6">
          {filteredEvents.map((item) => (
            <div key={item.slug || item.id} className="relative group">
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
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="p-1.5 rounded-md hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff] cursor-pointer"
                      title="Live Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/dashboard/timeline/${item.slug}`}
                      className="p-1.5 rounded-md hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff]"
                      title="Edit Record"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setDeletingItem(item)}
                      className="p-1.5 rounded-md hover:bg-[#ffebe9] dark:hover:bg-red-950/40 text-[#cf222e] dark:text-red-400 cursor-pointer"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f8fa] dark:bg-[#21262d] border-b border-[#d0d7de] dark:border-[#30363d] font-mono text-[#57606a] dark:text-[#8b949e]">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Date</th>
                <th className="p-3">Milestone</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d0d7de]/60 dark:divide-[#30363d]/60">
              {filteredEvents.map((item) => (
                <tr key={item.slug || item.id} className="hover:bg-[#f6f8fa]/50 dark:hover:bg-[#21262d]/50">
                  <td className="p-3 font-mono text-center w-12 text-[#57606a]">{item.order}</td>
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
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewItem(item)}
                        className="p-1 rounded hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] cursor-pointer"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href={`/dashboard/timeline/${item.slug}`}
                        className="p-1 rounded hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da]"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setDeletingItem(item)}
                        className="p-1 rounded hover:bg-[#ffebe9] dark:hover:bg-red-950/40 text-[#cf222e] dark:text-red-400 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewItem && (
        <TimelinePreviewModal
          timelineItem={previewItem}
          allTimeline={events}
          isOpen={true}
          onClose={() => setPreviewItem(null)}
          isDirty={false}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-[#cf222e] dark:text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-[#24292f] dark:text-white">
                Delete Timeline Event?
              </h3>
            </div>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-[#24292f] dark:text-white">{deletingItem.title}</strong>? This action
              cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                disabled={isDeleting}
                className="px-3.5 py-1.5 rounded-lg bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-1.5 rounded-lg bg-[#cf222e] hover:bg-red-700 text-xs font-semibold text-white cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
