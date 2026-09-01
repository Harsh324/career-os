"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  RotateCcw,
  Sparkles,
  Milestone,
  Briefcase,
  GraduationCap,
  Award,
  Rocket,
  Server,
  Lock,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import type { TimelineEvent } from "@/lib/api/types";
import {
  createAdminTimelineEvent,
  updateAdminTimelineEvent,
} from "@/lib/api/admin-client";
import { TimelinePreviewModal } from "./TimelinePreviewModal";

interface TimelineEditorFormProps {
  initialEvent?: TimelineEvent;
  isNew?: boolean;
}

const AVAILABLE_ICONS = [
  { name: "Briefcase", label: "Work / Role", icon: Briefcase },
  { name: "GraduationCap", label: "Education / Academic", icon: GraduationCap },
  { name: "Award", label: "Certification / Award", icon: Award },
  { name: "Rocket", label: "Launch / Project", icon: Rocket },
  { name: "Server", label: "Infrastructure / Scale", icon: Server },
  { name: "Milestone", label: "Milestone / General", icon: Milestone },
];

export function TimelineEditorForm({
  initialEvent,
  isNew = false,
}: TimelineEditorFormProps) {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState<Partial<TimelineEvent>>({
    title: initialEvent?.title || "",
    slug: initialEvent?.slug || "",
    subtitle: initialEvent?.subtitle || "",
    description: initialEvent?.description || "",
    date: initialEvent?.date || "",
    category: initialEvent?.category || "Career",
    icon: initialEvent?.icon || "Briefcase",
    link: initialEvent?.link || "",
    order: initialEvent?.order ?? 0,
    is_milestone: initialEvent?.is_milestone || false,
    is_published: initialEvent?.is_published ?? true,
    target_roles: initialEvent?.target_roles || [],
    internal_notes: initialEvent?.internal_notes || "",
  });

  // Dynamic role input buffer
  const [newRoleInput, setNewRoleInput] = useState("");

  // UX State
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleChange = (field: keyof TimelineEvent, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setError(null);
  };

  const handleAddTargetRole = () => {
    const trimmed = newRoleInput.trim();
    if (!trimmed) return;
    const current = formData.target_roles || [];
    if (!current.includes(trimmed)) {
      handleChange("target_roles", [...current, trimmed]);
    }
    setNewRoleInput("");
  };

  const handleRemoveTargetRole = (role: string) => {
    const current = formData.target_roles || [];
    handleChange(
      "target_roles",
      current.filter((r) => r !== role)
    );
  };

  const handleDiscard = () => {
    if (confirm("Discard all unsaved changes?")) {
      if (initialEvent) {
        setFormData({
          title: initialEvent.title || "",
          slug: initialEvent.slug || "",
          subtitle: initialEvent.subtitle || "",
          description: initialEvent.description || "",
          date: initialEvent.date || "",
          category: initialEvent.category || "Career",
          icon: initialEvent.icon || "Briefcase",
          link: initialEvent.link || "",
          order: initialEvent.order ?? 0,
          is_milestone: initialEvent.is_milestone || false,
          is_published: initialEvent.is_published ?? true,
          target_roles: initialEvent.target_roles || [],
          internal_notes: initialEvent.internal_notes || "",
        });
      } else {
        router.push("/dashboard/timeline");
      }
      setIsDirty(false);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setError("Event title is required.");
      return;
    }
    if (!formData.date?.trim()) {
      setError("Date label is required.");
      return;
    }
    if (!formData.category?.trim()) {
      setError("Category is required.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      if (isNew) {
        const created = await createAdminTimelineEvent(formData);
        setIsDirty(false);
        setSuccessMessage("Timeline event created successfully.");
        router.push(`/dashboard/timeline/${created.slug}`);
      } else if (initialEvent?.slug) {
        await updateAdminTimelineEvent(initialEvent.slug, formData);
        setIsDirty(false);
        setSuccessMessage("Timeline event updated successfully.");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save timeline event.");
    } finally {
      setIsSaving(false);
    }
  };

  const previewEvent: TimelineEvent = {
    id: initialEvent?.id || 0,
    title: formData.title || "Untitled Event",
    slug: formData.slug || "preview-event",
    subtitle: formData.subtitle,
    description: formData.description,
    date: formData.date || "Present",
    category: formData.category || "Career",
    icon: formData.icon || "Briefcase",
    link: formData.link,
    order: formData.order,
    is_milestone: formData.is_milestone,
    is_published: formData.is_published,
    target_roles: formData.target_roles,
    internal_notes: formData.internal_notes,
  };

  return (
    <div className="space-y-6">
      {/* Sticky Desktop Action Bar */}
      <div className="sticky top-0 z-20 bg-[#f6f8fa]/95 dark:bg-[#0d1117]/95 backdrop-blur-xs py-3 border-b border-[#d0d7de] dark:border-[#30363d] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/timeline"
            className="p-1.5 rounded-lg bg-white dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#f0f6fc] transition-colors"
            title="Back to Timeline"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-[#24292f] dark:text-white tracking-tight flex items-center gap-2">
              <span>{isNew ? "New Timeline Event" : formData.title || "Edit Event"}</span>
              {isDirty && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#fff8c5] dark:bg-[#9e6a03]/20 text-[#9a6700] dark:text-[#d29922] border border-[#9a6700]/30 dark:border-[#d29922]/30">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Unsaved Changes</span>
                </span>
              )}
            </h1>
            <p className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e]">
              Canonical Career Timeline &bull; PostgreSQL 16
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              type="button"
              onClick={handleDiscard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#21262d] hover:bg-[#ffebe9] dark:hover:bg-red-950/40 text-xs font-semibold text-[#cf222e] dark:text-red-400 border border-[#d0d7de] dark:border-[#30363d] hover:border-[#ff8182] dark:hover:border-red-800 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#21262d] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9] border border-[#d0d7de] dark:border-[#30363d] transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#0969da] dark:text-[#58a6ff]" />
            <span>Live Preview</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0969da] hover:bg-[#0859b8] text-xs font-semibold text-white transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : isNew ? "Create Event" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 rounded-xl bg-[#ffebe9] dark:bg-red-950/40 border border-[#ff8182]/50 dark:border-red-800/60 text-[#cf222e] dark:text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-[#dafbe1] dark:bg-emerald-950/40 border border-[#1a7f37]/30 dark:border-emerald-800/60 text-[#1a7f37] dark:text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form Workspace */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Event Identity & Category */}
        <section className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <h2 className="text-sm font-bold text-[#24292f] dark:text-white flex items-center gap-2">
              <Milestone className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
              <span>1. Event Identity & Category</span>
            </h2>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-0.5">
              Event title, organizational subtitle, and timeline category.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Event Title *
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g. Backend & Cloud Engineer Promotion"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-sm text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Subtitle / Organization
              </label>
              <input
                type="text"
                value={formData.subtitle || ""}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="e.g. SMS DataTech Corp."
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-sm text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Category *
              </label>
              <input
                type="text"
                value={formData.category || ""}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="e.g. Career, Education, Certification, Milestone"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-sm text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Slug (Optional / Auto-generated)
              </label>
              <input
                type="text"
                value={formData.slug || ""}
                onChange={(e) => handleChange("slug", e.target.value)}
                placeholder="sms-promotion"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] font-mono text-xs text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Date Label / Range *
              </label>
              <input
                type="text"
                value={formData.date || ""}
                onChange={(e) => handleChange("date", e.target.value)}
                placeholder="e.g. Oct 2024 – Present, Jun 2024, or 2025"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-sm text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
                required
              />
            </div>
          </div>
        </section>

        {/* Section 2: Icon & Presentation */}
        <section className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <h2 className="text-sm font-bold text-[#24292f] dark:text-white flex items-center gap-2">
              <Rocket className="w-4 h-4 text-[#8957e5] dark:text-[#a371f7]" />
              <span>2. Visual Icon & Key Milestone Highlight</span>
            </h2>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-0.5">
              Timeline node icon, milestone visual emphasis, and optional link.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
              Timeline Node Icon
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {AVAILABLE_ICONS.map((item) => {
                const isSelected = formData.icon === item.name;
                const IconComp = item.icon;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleChange("icon", item.name)}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#0969da] bg-[#0969da]/10 dark:border-[#58a6ff] dark:bg-[#58a6ff]/10 text-[#0969da] dark:text-[#58a6ff] font-bold"
                        : "border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-white"
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                    <span className="text-[11px] font-mono">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2 pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono text-[#24292f] dark:text-[#f0f6fc]">
                <input
                  type="checkbox"
                  checked={formData.is_milestone || false}
                  onChange={(e) => handleChange("is_milestone", e.target.checked)}
                  className="rounded border-[#d0d7de] dark:border-[#30363d] text-[#0969da] focus:ring-0 cursor-pointer"
                />
                <span>Key Career Milestone (Special Blue Glow Badge)</span>
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                External Link (Optional)
              </label>
              <input
                type="url"
                value={formData.link || ""}
                onChange={(e) => handleChange("link", e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-xs text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Narrative Description */}
        <section className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <h2 className="text-sm font-bold text-[#24292f] dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
              <span>3. Narrative Summary & Technical Scope</span>
            </h2>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-0.5">
              Concrete description of the milestone, responsibilities, or recognition.
            </p>
          </div>

          <div className="space-y-1.5">
            <textarea
              rows={4}
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Architected async Celery task pipelines and containerized microservices on AWS ECS..."
              className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-sm text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
            />
          </div>
        </section>

        {/* Section 4: Staff-Only Private Career Intelligence */}
        <section className="rounded-2xl border border-[#d97706]/40 dark:border-[#f59e0b]/40 bg-[#fff8c5]/20 dark:bg-[#d97706]/5 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="border-b border-[#d97706]/30 dark:border-[#f59e0b]/30 pb-3">
            <h2 className="text-sm font-bold text-[#9a6700] dark:text-[#d29922] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#d97706] dark:text-[#f59e0b]" />
              <span>4. Visibility & Private Career Intelligence (Staff-Only)</span>
            </h2>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-0.5">
              These fields are server-masked and NEVER rendered on public pages or exposed to non-staff API clients.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono text-[#24292f] dark:text-[#f0f6fc]">
                <input
                  type="checkbox"
                  checked={formData.is_published ?? true}
                  onChange={(e) => handleChange("is_published", e.target.checked)}
                  className="rounded border-[#d0d7de] dark:border-[#30363d] text-[#0969da] focus:ring-0 cursor-pointer"
                />
                <span>Published on Public Timeline</span>
              </label>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Display Chronological Sort Order
              </label>
              <input
                type="number"
                value={formData.order ?? 0}
                onChange={(e) => handleChange("order", parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] font-mono text-xs text-[#24292f] dark:text-[#f0f6fc]"
              />
            </div>
          </div>

          {/* Target Roles */}
          <div className="space-y-2 pt-2 border-t border-[#d97706]/20">
            <label className="block text-xs font-mono font-semibold text-[#9a6700] dark:text-[#d29922]">
              Target Roles Taxonomy (Future Resume Studio Matching)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.target_roles?.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-white dark:bg-[#161b22] text-[#24292f] dark:text-[#f0f6fc] border border-[#d0d7de] dark:border-[#30363d]"
                >
                  <span>{role}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTargetRole(role)}
                    className="text-[#cf222e] hover:text-red-700 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRoleInput}
                onChange={(e) => setNewRoleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTargetRole();
                  }
                }}
                placeholder="e.g. Backend Engineering, Cloud Architecture"
                className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] text-xs text-[#24292f] dark:text-[#f0f6fc]"
              />
              <button
                type="button"
                onClick={handleAddTargetRole}
                className="px-3.5 py-1.5 rounded-lg bg-[#21262d] text-white hover:bg-black text-xs font-mono font-semibold cursor-pointer"
              >
                Add Role
              </button>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="space-y-1.5 pt-2 border-t border-[#d97706]/20">
            <label className="block text-xs font-mono font-semibold text-[#9a6700] dark:text-[#d29922]">
              Staff Internal Notes
            </label>
            <textarea
              rows={3}
              value={formData.internal_notes || ""}
              onChange={(e) => handleChange("internal_notes", e.target.value)}
              placeholder="Private milestone context, promotion details, or talking points..."
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] text-xs text-[#24292f] dark:text-[#f0f6fc]"
            />
          </div>
        </section>
      </form>

      {/* Live Preview Modal */}
      <TimelinePreviewModal
        timelineItem={previewEvent}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        isDirty={isDirty}
      />
    </div>
  );
}
