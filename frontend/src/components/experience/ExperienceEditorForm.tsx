"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Eye,
  Briefcase,
  Building2,
  Calendar,
  MapPin,
  Sparkles,
  Zap,
  Tag,
  ShieldCheck,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Globe,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  createAdminExperience,
  updateAdminExperience,
  getAdminCompanies,
  createAdminCompany,
  getAdminTechnologies,
  getAdminProjects,
} from "@/lib/api/admin-client";
import { ExperiencePreviewModal } from "./ExperiencePreviewModal";
import type { Experience, Company, Technology, Project, ExperienceHighlight, TechnicalChallenge, Metric } from "@/lib/api/types";

interface ExperienceEditorFormProps {
  initialData?: Experience;
  isNew?: boolean;
}

export function ExperienceEditorForm({ initialData, isNew = false }: ExperienceEditorFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Queries for selectors
  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ["admin-companies"],
    queryFn: getAdminCompanies,
  });

  const { data: allTech = [] } = useQuery<Technology[]>({
    queryKey: ["admin-technologies"],
    queryFn: getAdminTechnologies,
  });

  const { data: allProjects = [] } = useQuery<Project[]>({
    queryKey: ["admin-projects"],
    queryFn: getAdminProjects,
  });

  // State management
  const [formData, setFormData] = useState<Partial<Experience>>(() => {
    if (initialData) {
      // Normalize highlights
      const normalizedHighlights: ExperienceHighlight[] = (initialData.highlights || []).map((h, idx) => {
        if (typeof h === "string") {
          return {
            id: `ach-${idx + 1}`,
            text: h,
            is_public: true,
            target_roles: initialData.target_roles || ["Backend Engineering"],
            order: idx,
          };
        }
        return {
          id: h.id || `ach-${idx + 1}`,
          text: h.text || "",
          is_public: h.is_public !== false,
          target_roles: h.target_roles || initialData.target_roles || [],
          order: h.order ?? idx,
        };
      });

      return {
        ...initialData,
        company: initialData.company || initialData.company_detail?.id,
        highlights: normalizedHighlights,
        technologies: initialData.technologies || initialData.technologies_detail?.map((t) => t.id) || [],
        related_projects: initialData.related_projects || initialData.related_projects_detail?.map((p) => p.id) || [],
      };
    }
    return {
      title: "",
      subtitle: "",
      slug: "",
      company: undefined,
      employment_type: "full-time",
      location: "Tokyo, Japan",
      start_date: "",
      end_date: "Present",
      current_position: true,
      is_published: true,
      featured: true,
      mission: "",
      summary: "",
      executive_overview: "",
      highlights: [],
      challenges: [],
      metrics: [],
      team: "",
      ownership: "",
      lessons_learned: [],
      technologies: [],
      related_projects: [],
      target_roles: ["Backend Engineering", "Cloud Architecture"],
      internal_notes: "",
    };
  });

  const [savedData, setSavedData] = useState<Partial<Experience>>(formData);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [newCompanyForm, setNewCompanyForm] = useState({
    name: "",
    location: "Tokyo, Japan",
    industry: "Software & Technology",
    website: "",
    description: "",
  });

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Dirty check
  const isDirty = JSON.stringify(formData) !== JSON.stringify(savedData);

  // Sync when initialData changes
  useEffect(() => {
    if (initialData) {
      const normalizedHighlights: ExperienceHighlight[] = (initialData.highlights || []).map((h, idx) => {
        if (typeof h === "string") {
          return {
            id: `ach-${idx + 1}`,
            text: h,
            is_public: true,
            target_roles: initialData.target_roles || ["Backend Engineering"],
            order: idx,
          };
        }
        return {
          id: h.id || `ach-${idx + 1}`,
          text: h.text || "",
          is_public: h.is_public !== false,
          target_roles: h.target_roles || initialData.target_roles || [],
          order: h.order ?? idx,
        };
      });

      const updated = {
        ...initialData,
        company: initialData.company || initialData.company_detail?.id,
        highlights: normalizedHighlights,
        technologies: initialData.technologies || initialData.technologies_detail?.map((t) => t.id) || [],
        related_projects: initialData.related_projects || initialData.related_projects_detail?.map((p) => p.id) || [],
      };
      setFormData(updated);
      setSavedData(updated);
    }
  }, [initialData]);

  // Mutations
  const saveMutation = useMutation({
    mutationFn: async (payload: Partial<Experience>) => {
      if (isNew) {
        return createAdminExperience(payload);
      } else {
        return updateAdminExperience(initialData!.slug, payload);
      }
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ["admin-experiences"] });
      setSavedData(saved);
      setFormData(saved);
      setNotification({
        type: "success",
        message: isNew
          ? `Successfully created "${saved.title}".`
          : `Successfully updated "${saved.title}".`,
      });
      setTimeout(() => setNotification(null), 4000);

      if (isNew && saved.slug) {
        router.push(`/dashboard/experience/${saved.slug}`);
      }
    },
    onError: (err: any) => {
      setNotification({
        type: "error",
        message: err.message || "Failed to save experience.",
      });
      setTimeout(() => setNotification(null), 6000);
    },
  });

  const createCompanyMutation = useMutation({
    mutationFn: async (cData: Partial<Company>) => {
      return createAdminCompany(cData);
    },
    onSuccess: (newComp) => {
      queryClient.invalidateQueries({ queryKey: ["admin-companies"] });
      setFormData((prev) => ({ ...prev, company: newComp.id }));
      setIsCompanyModalOpen(false);
      setNewCompanyForm({
        name: "",
        location: "Tokyo, Japan",
        industry: "Software & Technology",
        website: "",
        description: "",
      });
      setNotification({
        type: "success",
        message: `Company "${newComp.name}" added and selected.`,
      });
      setTimeout(() => setNotification(null), 4000);
    },
    onError: (err: any) => {
      setNotification({
        type: "error",
        message: err.message || "Failed to add company.",
      });
      setTimeout(() => setNotification(null), 5000);
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setNotification({ type: "error", message: "Job Title is required." });
      return;
    }
    if (!formData.company) {
      setNotification({ type: "error", message: "Company selection is required." });
      return;
    }
    if (!formData.start_date?.trim()) {
      setNotification({ type: "error", message: "Start Date is required (e.g. 'Oct 2024')." });
      return;
    }

    saveMutation.mutate(formData);
  };

  const handleDiscard = () => {
    setFormData(savedData);
    setNotification({
      type: "success",
      message: "Unsaved changes discarded.",
    });
    setTimeout(() => setNotification(null), 3000);
  };

  // Helper for highlights
  const addHighlight = () => {
    const currentHighlights = (formData.highlights as ExperienceHighlight[]) || [];
    const newH: ExperienceHighlight = {
      id: `ach-${Date.now()}`,
      text: "",
      is_public: true,
      target_roles: formData.target_roles || ["Backend Engineering"],
      order: currentHighlights.length,
    };
    setFormData({ ...formData, highlights: [...currentHighlights, newH] });
  };

  const updateHighlight = (idx: number, updates: Partial<ExperienceHighlight>) => {
    const currentHighlights = [...((formData.highlights as ExperienceHighlight[]) || [])];
    currentHighlights[idx] = { ...currentHighlights[idx], ...updates };
    setFormData({ ...formData, highlights: currentHighlights });
  };

  const removeHighlight = (idx: number) => {
    const currentHighlights = [...((formData.highlights as ExperienceHighlight[]) || [])];
    currentHighlights.splice(idx, 1);
    setFormData({ ...formData, highlights: currentHighlights });
  };

  // Helper for metrics
  const addMetric = () => {
    const current = formData.metrics || [];
    setFormData({ ...formData, metrics: [...current, { label: "", value: "" }] });
  };

  const updateMetric = (idx: number, updates: Partial<Metric>) => {
    const current = [...(formData.metrics || [])];
    current[idx] = { ...current[idx], ...updates };
    setFormData({ ...formData, metrics: current });
  };

  const removeMetric = (idx: number) => {
    const current = [...(formData.metrics || [])];
    current.splice(idx, 1);
    setFormData({ ...formData, metrics: current });
  };

  // Helper for technical challenges
  const addChallenge = () => {
    const current = formData.challenges || [];
    setFormData({
      ...formData,
      challenges: [...current, { problem: "", solution: "", impact: "" }],
    });
  };

  const updateChallenge = (idx: number, updates: Partial<TechnicalChallenge>) => {
    const current = [...(formData.challenges || [])];
    current[idx] = { ...current[idx], ...updates };
    setFormData({ ...formData, challenges: current });
  };

  const removeChallenge = (idx: number) => {
    const current = [...(formData.challenges || [])];
    current.splice(idx, 1);
    setFormData({ ...formData, challenges: current });
  };

  // Build full preview object combining selected company and techs
  const previewData: Experience = {
    ...(formData as Experience),
    company_detail: companies.find((c) => c.id === formData.company) || initialData?.company_detail,
    technologies_detail: allTech.filter((t) => formData.technologies?.includes(t.id)),
    related_projects_detail: allProjects.filter((p) => formData.related_projects?.includes(p.id)),
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* 1. STICKY ACTION BAR (Guaranteed Single-Row Desktop Layout) */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-[#f6f8fa]/90 dark:bg-[#0d1117]/90 backdrop-blur-md border-b border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 max-w-5xl mx-auto">
          {/* Title & Sync Status Indicator */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/experience"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] transition-colors"
              title="Back to Experience list"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#24292f] dark:text-[#f0f6fc]">
                {isNew ? "Create New Experience" : formData.title || "Edit Experience"}
              </h1>

              {isDirty ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono font-medium rounded-full bg-[#fff8c5] dark:bg-[#382800] text-[#9a6700] dark:text-[#f2cc60] border border-[#d4a72c]/40 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4a72c] animate-pulse" />
                  Unsaved Changes
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono font-medium rounded-full bg-[#dafbe1] dark:bg-[#112a1c] text-[#1a7f37] dark:text-[#3fb950] border border-[#4ac26b]/30 shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                  Canonical Sync Active
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons (Single row on desktop) */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/dashboard/experience"
              className="px-3 py-1.5 text-xs font-mono font-medium rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] transition-colors shadow-2xs no-underline"
            >
              Cancel
            </Link>

            <button
              type="button"
              onClick={handleDiscard}
              disabled={!isDirty}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-colors shadow-2xs ${
                isDirty
                  ? "border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#cf222e] dark:text-[#ff7b72] hover:bg-[#ffebe9] dark:hover:bg-[#2b1011] cursor-pointer"
                  : "border-transparent text-[#8b949e] opacity-50 cursor-not-allowed"
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Discard</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border border-[#0969da]/40 dark:border-[#58a6ff]/40 bg-[#0969da]/10 dark:bg-[#58a6ff]/15 text-[#0969da] dark:text-[#58a6ff] hover:bg-[#0969da]/20 transition-colors shadow-2xs cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </button>

            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono font-semibold rounded-lg bg-[#1f883d] hover:bg-[#1a7f37] text-white shadow-2xs transition-colors cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{saveMutation.isPending ? "Saving..." : "Save Experience"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border p-4 text-xs font-mono shadow-xs transition-all max-w-5xl mx-auto ${
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

      {/* WORKSPACE SECTIONS CONTAINER */}
      <div className="max-w-5xl mx-auto space-y-6">
        {/* SECTION 1: IDENTITY & ORGANIZATION */}
        <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
              <h2 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
                Role & Organization Identity
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e]">
              Core Metadata
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Company Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-medium text-[#24292f] dark:text-[#c9d1d9]">
                  Company / Organization <span className="text-[#cf222e]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCompanyModalOpen(true)}
                  className="text-[11px] font-mono text-[#0969da] dark:text-[#58a6ff] hover:underline cursor-pointer"
                >
                  + Add New Company
                </button>
              </div>
              <select
                value={formData.company || ""}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value ? Number(e.target.value) : undefined })
                }
                className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-2 text-xs text-[#24292f] dark:text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#0969da]"
                required
              >
                <option value="">-- Select Company --</option>
                {companies.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name} {comp.location ? `(${comp.location})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-[#24292f] dark:text-[#c9d1d9]">
                Job Title <span className="text-[#cf222e]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Software Engineer (Backend and Cloud)"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-2 text-xs text-[#24292f] dark:text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#0969da]"
                required
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-[#24292f] dark:text-[#c9d1d9]">
                Subtitle / Team Descriptor
              </label>
              <input
                type="text"
                placeholder="e.g. Platform Architecture Team"
                value={formData.subtitle || ""}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-2 text-xs text-[#24292f] dark:text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#0969da]"
              />
            </div>

            {/* Employment Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-[#24292f] dark:text-[#c9d1d9]">
                Employment Type
              </label>
              <select
                value={formData.employment_type || "full-time"}
                onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-2 text-xs text-[#24292f] dark:text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#0969da]"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            {/* Location */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-mono font-medium text-[#24292f] dark:text-[#c9d1d9]">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Tokyo, Japan or Remote"
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-2 text-xs text-[#24292f] dark:text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#0969da]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: CHRONOLOGY & STATUS */}
        <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#1f883d] dark:text-[#39d353]" />
              <h2 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
                Chronology & Position Status
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e]">
              Derived Temporal Sorting
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-[#24292f] dark:text-[#c9d1d9]">
                Start Date <span className="text-[#cf222e]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Oct 2024"
                value={formData.start_date || ""}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-2 text-xs text-[#24292f] dark:text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#0969da]"
                required
              />
              <p className="text-[10px] font-mono text-[#57606a] dark:text-[#8b949e]">
                Auto-derives system sort key (e.g. 2024-10)
              </p>
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-[#24292f] dark:text-[#c9d1d9]">
                End Date
              </label>
              <input
                type="text"
                placeholder="e.g. Present or May 2024"
                value={formData.end_date || ""}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                disabled={formData.current_position}
                className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-2 text-xs text-[#24292f] dark:text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#0969da] disabled:opacity-50"
              />
            </div>

            {/* Current Role Toggle */}
            <div className="flex items-center sm:pt-6">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.current_position || false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData({
                      ...formData,
                      current_position: checked,
                      end_date: checked ? "Present" : formData.end_date === "Present" ? "" : formData.end_date,
                    });
                  }}
                  className="h-4 w-4 rounded border-[#d0d7de] text-[#1f883d] focus:ring-[#1f883d]"
                />
                <span className="text-xs font-mono font-medium text-[#24292f] dark:text-[#f0f6fc]">
                  I currently work in this role
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 3: ACHIEVEMENT & EVIDENCE BANK (HIGH VISUAL PRIORITY) */}
        <div className="rounded-xl border-2 border-[#0969da]/40 dark:border-[#58a6ff]/40 bg-white dark:bg-[#161b22] p-5 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#0969da]/20 dark:border-[#58a6ff]/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0969da]/10 dark:bg-[#58a6ff]/15 text-[#0969da] dark:text-[#58a6ff]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
                  Achievement & Evidence Bank
                </h2>
                <p className="text-[11px] font-mono text-[#0969da] dark:text-[#58a6ff]">
                  Canonical accomplishments powering Public Portfolio & future Resume Studio (V3.0)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={addHighlight}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-semibold rounded-lg bg-[#0969da] hover:bg-[#085ac1] text-white transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Achievement Bullet</span>
            </button>
          </div>

          {/* List of Achievement Bullets */}
          {(!formData.highlights || formData.highlights.length === 0) ? (
            <div className="rounded-lg border border-dashed border-[#d0d7de] dark:border-[#30363d] p-6 text-center space-y-2">
              <Sparkles className="h-6 w-6 mx-auto text-[#8b949e]" />
              <p className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
                No achievements added yet. Add concrete, action-oriented evidence of your engineering impact.
              </p>
              <button
                type="button"
                onClick={addHighlight}
                className="text-xs font-mono text-[#0969da] dark:text-[#58a6ff] hover:underline cursor-pointer"
              >
                + Add first accomplishment
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {(formData.highlights as ExperienceHighlight[]).map((ach, idx) => (
                <div
                  key={ach.id || idx}
                  className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/60 dark:bg-[#0d1117]/60 p-4 space-y-3 transition-all hover:border-[#0969da]/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0969da]/10 dark:bg-[#58a6ff]/15 text-[11px] font-mono font-bold text-[#0969da] dark:text-[#58a6ff]">
                      {idx + 1}
                    </span>

                    <textarea
                      rows={2}
                      placeholder="Action verb + technical architecture + quantified outcome (e.g. Designed and implemented AI-driven extraction pipeline using Celery and Redis, improving throughput by 30%)..."
                      value={ach.text}
                      onChange={(e) => updateHighlight(idx, { text: e.target.value })}
                      className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-2.5 text-xs text-[#24292f] dark:text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#0969da] leading-relaxed"
                    />

                    <button
                      type="button"
                      onClick={() => removeHighlight(idx)}
                      className="text-[#cf222e] dark:text-[#ff7b72] hover:bg-[#ffebe9] dark:hover:bg-[#2b1011] p-1.5 rounded-md transition-colors cursor-pointer shrink-0"
                      title="Remove bullet"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Bullet Controls: Public Toggle & Target Roles */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#d0d7de]/50 dark:border-[#30363d]/50 text-xs font-mono">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={ach.is_public !== false}
                        onChange={(e) => updateHighlight(idx, { is_public: e.target.checked })}
                        className="h-3.5 w-3.5 rounded border-[#d0d7de] text-[#0969da] focus:ring-[#0969da]"
                      />
                      <span className={ach.is_public !== false ? "text-[#1a7f37] dark:text-[#3fb950] font-medium" : "text-[#8b949e]"}>
                        {ach.is_public !== false ? "Public on Portfolio" : "Private Evidence (Resume/Interview Bank only)"}
                      </span>
                    </label>

                    <div className="flex items-center gap-2">
                      <Tag className="h-3 w-3 text-[#8a2be2]" />
                      <input
                        type="text"
                        placeholder="Tags: Backend, Cloud, AI (comma separated)"
                        value={(ach.target_roles || []).join(", ")}
                        onChange={(e) =>
                          updateHighlight(idx, {
                            target_roles: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        className="rounded-md border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-2 py-1 text-[11px] text-[#24292f] dark:text-[#c9d1d9] w-56"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 4: IMPACT & QUANTIFIED METRICS */}
        <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#1f883d] dark:text-[#39d353]" />
              <h2 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
                Impact & Quantified Proof Points
              </h2>
            </div>
            <button
              type="button"
              onClick={addMetric}
              className="text-xs font-mono text-[#1f883d] dark:text-[#39d353] hover:underline cursor-pointer"
            >
              + Add Metric Pair
            </button>
          </div>

          {(!formData.metrics || formData.metrics.length === 0) ? (
            <p className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
              No metrics added yet. (e.g. Value: <code>20–30%</code>, Label: <code>API Performance Improvement</code>)
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {formData.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-lg border border-[#1f883d]/30 bg-[#1f883d]/5 dark:bg-[#238636]/10 p-3"
                >
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      placeholder="Value (e.g. 20-30% or 99.99%)"
                      value={m.value}
                      onChange={(e) => updateMetric(idx, { value: e.target.value })}
                      className="w-full rounded border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-2 py-1 text-xs font-mono font-bold text-[#1f883d] dark:text-[#39d353]"
                    />
                    <input
                      type="text"
                      placeholder="Label (e.g. API Throughput Increase)"
                      value={m.label}
                      onChange={(e) => updateMetric(idx, { label: e.target.value })}
                      className="w-full rounded border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-2 py-1 text-xs text-[#57606a] dark:text-[#8b949e]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMetric(idx)}
                    className="text-[#cf222e] hover:bg-[#ffebe9] p-1.5 rounded cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 5: TECHNICAL CHALLENGES & SOLUTIONS */}
        <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#d97706] dark:text-[#f59e0b]" />
              <h2 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
                Technical Challenges & Solutions
              </h2>
            </div>
            <button
              type="button"
              onClick={addChallenge}
              className="text-xs font-mono text-[#d97706] dark:text-[#f59e0b] hover:underline cursor-pointer"
            >
              + Add Challenge Block
            </button>
          </div>

          {(!formData.challenges || formData.challenges.length === 0) ? (
            <p className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
              No deep-dive challenges added.
            </p>
          ) : (
            <div className="space-y-4">
              {formData.challenges.map((c, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/40 dark:bg-[#0d1117]/40 p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-[#cf222e] dark:text-[#ff7b72] uppercase">
                      Problem
                    </span>
                    <button
                      type="button"
                      onClick={() => removeChallenge(idx)}
                      className="text-[#cf222e] p-1 hover:bg-[#ffebe9] rounded cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Problem description..."
                    value={c.problem}
                    onChange={(e) => updateChallenge(idx, { problem: e.target.value })}
                    className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-3 py-1.5 text-xs font-semibold text-[#24292f] dark:text-[#f0f6fc]"
                  />

                  <span className="text-[11px] font-mono font-bold text-[#0969da] dark:text-[#58a6ff] uppercase block pt-1">
                    Solution
                  </span>
                  <textarea
                    rows={2}
                    placeholder="Solution implementation..."
                    value={c.solution}
                    onChange={(e) => updateChallenge(idx, { solution: e.target.value })}
                    className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-3 py-1.5 text-xs text-[#57606a] dark:text-[#8b949e]"
                  />

                  <span className="text-[11px] font-mono font-bold text-[#1f883d] dark:text-[#39d353] uppercase block pt-1">
                    Impact
                  </span>
                  <input
                    type="text"
                    placeholder="Measurable impact..."
                    value={c.impact || ""}
                    onChange={(e) => updateChallenge(idx, { impact: e.target.value })}
                    className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] px-3 py-1.5 text-xs text-[#1f883d] dark:text-[#39d353] font-medium"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 6: NARRATIVE BIO & SCOPE */}
        <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 shadow-xs space-y-4">
          <div className="border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <h2 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
              Public Narrative & Ownership Scope
            </h2>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-[#24292f] dark:text-[#c9d1d9]">
                Engineering Mission / Core Objective
              </label>
              <textarea
                rows={2}
                placeholder="High-level engineering mission of this role..."
                value={formData.mission || ""}
                onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] p-2.5 text-xs text-[#24292f] dark:text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#0969da]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-[#24292f] dark:text-[#c9d1d9]">
                Narrative Summary
              </label>
              <textarea
                rows={2}
                placeholder="Narrative summary for portfolio cards..."
                value={formData.summary || ""}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] p-2.5 text-xs text-[#24292f] dark:text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#0969da]"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-[#24292f] dark:text-[#c9d1d9]">
                  Team
                </label>
                <input
                  type="text"
                  placeholder="e.g. Platform Architecture Team"
                  value={formData.team || ""}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-1.5 text-xs text-[#24292f] dark:text-[#c9d1d9]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-[#24292f] dark:text-[#c9d1d9]">
                  Ownership Scope
                </label>
                <input
                  type="text"
                  placeholder="e.g. Primary ownership of AI scraping platform & AWS IaC"
                  value={formData.ownership || ""}
                  onChange={(e) => setFormData({ ...formData, ownership: e.target.value })}
                  className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-1.5 text-xs text-[#24292f] dark:text-[#c9d1d9]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 7: TECHNOLOGIES & LINKED PROJECTS */}
        <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 shadow-xs space-y-4">
          <div className="border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <h2 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
              Associated Technologies & Related Projects
            </h2>
          </div>

          {/* Tech Chips Multi-select */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-medium text-[#24292f] dark:text-[#c9d1d9]">
              Technologies Utilized
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/40 dark:bg-[#0d1117]/40">
              {allTech.map((tech) => {
                const isSelected = formData.technologies?.includes(tech.id);
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => {
                      const current = formData.technologies || [];
                      const updated = isSelected
                        ? current.filter((id) => id !== tech.id)
                        : [...current, tech.id];
                      setFormData({ ...formData, technologies: updated });
                    }}
                    className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-colors cursor-pointer ${
                      isSelected
                        ? "border-[#0969da] bg-[#0969da]/15 text-[#0969da] dark:text-[#58a6ff] font-bold"
                        : "border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] text-[#57606a] dark:text-[#8b949e]"
                    }`}
                  >
                    {tech.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 8: CAREER INTELLIGENCE & PUBLICATION */}
        <div className="rounded-xl border border-[#8a2be2]/40 dark:border-[#a371f7]/40 bg-[#8a2be2]/5 dark:bg-[#8a2be2]/10 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#8a2be2]/20 pb-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#8a2be2]" />
              <h2 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
                Private Career Intelligence & Publishing Controls
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[#8a2be2] font-semibold">
              Control Plane Exclusive
            </span>
          </div>

          <div className="space-y-4">
            {/* Target Roles */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-[#24292f] dark:text-[#c9d1d9]">
                Target Role Alignment Tags
              </label>
              <input
                type="text"
                placeholder="e.g. Backend Engineering, Cloud Architecture, Distributed Systems (comma separated)"
                value={(formData.target_roles || []).join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    target_roles: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-2 text-xs text-[#24292f] dark:text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#8a2be2]"
              />
            </div>

            {/* Internal Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-[#24292f] dark:text-[#c9d1d9]">
                Private Architecture & Interview Stories Notes
              </label>
              <textarea
                rows={3}
                placeholder="Internal interview talking points, architectural trade-offs made, post-mortem stories, performance review feedback..."
                value={formData.internal_notes || ""}
                onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
                className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] p-2.5 text-xs text-[#24292f] dark:text-[#c9d1d9] focus:outline-none focus:ring-2 focus:ring-[#8a2be2]"
              />
            </div>

            {/* Publication Toggles */}
            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#8a2be2]/20">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.is_published !== false}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="h-4 w-4 rounded border-[#d0d7de] text-[#1f883d] focus:ring-[#1f883d]"
                />
                <span className="text-xs font-mono font-bold text-[#24292f] dark:text-[#f0f6fc]">
                  Publish to Public Portfolio (/experience)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-[#d0d7de] text-[#0969da] focus:ring-[#0969da]"
                />
                <span className="text-xs font-mono font-medium text-[#24292f] dark:text-[#f0f6fc]">
                  Pin on Public Homepage
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ON-DEMAND PREVIEW MODAL */}
      <ExperiencePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={previewData}
        isDraft={isDirty}
      />

      {/* 3. INLINE NEW COMPANY MODAL */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
                <h3 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
                  Add New Company
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCompanyModalOpen(false)}
                className="text-xs font-mono text-[#8b949e] hover:text-[#24292f] cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-[#24292f] dark:text-[#c9d1d9]">
                  Company Name <span className="text-[#cf222e]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Cloud Corp"
                  value={newCompanyForm.name}
                  onChange={(e) => setNewCompanyForm({ ...newCompanyForm, name: e.target.value })}
                  className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-1.5 text-xs text-[#24292f] dark:text-[#c9d1d9]"
                  required
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-medium text-[#24292f] dark:text-[#c9d1d9]">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tokyo, Japan"
                    value={newCompanyForm.location}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, location: e.target.value })}
                    className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-1.5 text-xs text-[#24292f] dark:text-[#c9d1d9]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-medium text-[#24292f] dark:text-[#c9d1d9]">
                    Industry
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cloud & AI"
                    value={newCompanyForm.industry}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, industry: e.target.value })}
                    className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-1.5 text-xs text-[#24292f] dark:text-[#c9d1d9]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-[#24292f] dark:text-[#c9d1d9]">
                  Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://company.example.com"
                  value={newCompanyForm.website}
                  onChange={(e) => setNewCompanyForm({ ...newCompanyForm, website: e.target.value })}
                  className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] px-3 py-1.5 text-xs text-[#24292f] dark:text-[#c9d1d9]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-[#24292f] dark:text-[#c9d1d9]">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description of what the company does..."
                  value={newCompanyForm.description}
                  onChange={(e) => setNewCompanyForm({ ...newCompanyForm, description: e.target.value })}
                  className="w-full rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] p-2 text-xs text-[#24292f] dark:text-[#c9d1d9]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60">
              <button
                type="button"
                onClick={() => setIsCompanyModalOpen(false)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newCompanyForm.name.trim()) return;
                  createCompanyMutation.mutate(newCompanyForm);
                }}
                disabled={createCompanyMutation.isPending || !newCompanyForm.name.trim()}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0969da] hover:bg-[#085ac1] text-white shadow-2xs cursor-pointer"
              >
                {createCompanyMutation.isPending ? "Creating..." : "Create & Select"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
