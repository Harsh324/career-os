"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Cpu,
  Save,
  RotateCcw,
  Eye,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  ShieldCheck,
  Briefcase,
  FolderGit2,
  Award,
  Lock,
} from "lucide-react";
import {
  getAdminTechnologies,
  getAdminExperiences,
  getAdminProjects,
  createAdminSkill,
  updateAdminSkill,
} from "@/lib/api/admin-client";
import { SkillPreviewModal } from "./SkillPreviewModal";
import type { Skill, Technology, Experience, Project } from "@/lib/api/types";

interface SkillEditorFormProps {
  initialData?: Skill | null;
  isNew?: boolean;
}

const CATEGORY_CHOICES = [
  "Backend Engineering",
  "Cloud & Infrastructure",
  "Architecture & Distributed Systems",
  "Databases & Caching",
  "AI & Data",
  "DevOps & CI/CD",
  "Supporting Technologies",
];

const PROFICIENCY_CHOICES = [
  { value: "expert", label: "Expert / Staff Level" },
  { value: "advanced", label: "Advanced / Production Proficient" },
  { value: "proficient", label: "Proficient / Working Knowledge" },
  { value: "familiar", label: "Familiar / Basic" },
  { value: "learning", label: "Active Learning / Exploring" },
];

const TARGET_ROLE_OPTIONS = [
  "Backend Engineering",
  "Platform Engineering",
  "Cloud Architecture",
  "DevOps",
  "Site Reliability Engineering",
  "Distributed Systems",
  "Full-Stack Development",
  "AI Engineering",
  "Data Engineering",
  "Systems Architecture",
];

export function SkillEditorForm({
  initialData,
  isNew = false,
}: SkillEditorFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: technologies = [] } = useQuery<Technology[]>({
    queryKey: ["admin-technologies"],
    queryFn: getAdminTechnologies,
  });

  const { data: experiences = [] } = useQuery<Experience[]>({
    queryKey: ["admin-experiences"],
    queryFn: getAdminExperiences,
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["admin-projects"],
    queryFn: getAdminProjects,
  });

  const [formData, setFormData] = useState<Partial<Skill>>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "Backend Engineering",
    proficiency: initialData?.proficiency || "advanced",
    years: initialData?.years ?? 1.0,
    is_core: initialData?.is_core || false,
    is_published: initialData?.is_published !== undefined ? initialData.is_published : true,
    order: initialData?.order ?? 0,
    description: initialData?.description || "",
    evidence_context: initialData?.evidence_context || "",
    technologies:
      initialData?.technologies ||
      initialData?.technologies_detail?.map((t) => t.id) ||
      [],
    related_experiences:
      initialData?.related_experiences ||
      initialData?.related_experiences_detail?.map((e) => e.id) ||
      [],
    related_projects:
      initialData?.related_projects ||
      initialData?.related_projects_detail?.map((p) => p.id) ||
      [],
    target_roles: initialData?.target_roles || [],
    internal_notes: initialData?.internal_notes || "",
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [techSearch, setTechSearch] = useState("");
  const [newRoleInput, setNewRoleInput] = useState("");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Sync initialData if it loads asynchronously
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        technologies:
          initialData.technologies ||
          initialData.technologies_detail?.map((t) => t.id) ||
          [],
        related_experiences:
          initialData.related_experiences ||
          initialData.related_experiences_detail?.map((e) => e.id) ||
          [],
        related_projects:
          initialData.related_projects ||
          initialData.related_projects_detail?.map((p) => p.id) ||
          [],
        target_roles: initialData.target_roles || [],
        internal_notes: initialData.internal_notes || "",
      });
    }
  }, [initialData]);

  const saveMutation = useMutation({
    mutationFn: async (payload: Partial<Skill>) => {
      if (isNew) {
        return createAdminSkill(payload);
      } else {
        return updateAdminSkill(initialData?.slug || payload.slug!, payload);
      }
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
      queryClient.invalidateQueries({ queryKey: ["admin-skill", saved.slug] });
      setIsDirty(false);
      setNotification({
        type: "success",
        message: `Skill "${saved.name}" saved successfully to PostgreSQL!`,
      });

      if (isNew && saved.slug) {
        router.replace(`/dashboard/skills/${saved.slug}`);
      }
    },
    onError: (err: any) => {
      setNotification({
        type: "error",
        message: err.message || "Failed to save skill.",
      });
    },
  });

  const handleFieldChange = (field: keyof Skill, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleToggleTech = (techId: number) => {
    const current = formData.technologies || [];
    const updated = current.includes(techId)
      ? current.filter((id) => id !== techId)
      : [...current, techId];
    handleFieldChange("technologies", updated);
  };

  const handleToggleExperience = (expId: number) => {
    const current = formData.related_experiences || [];
    const updated = current.includes(expId)
      ? current.filter((id) => id !== expId)
      : [...current, expId];
    handleFieldChange("related_experiences", updated);
  };

  const handleToggleProject = (projId: number) => {
    const current = formData.related_projects || [];
    const updated = current.includes(projId)
      ? current.filter((id) => id !== projId)
      : [...current, projId];
    handleFieldChange("related_projects", updated);
  };

  const handleToggleTargetRole = (role: string) => {
    const current = formData.target_roles || [];
    const updated = current.includes(role)
      ? current.filter((r) => r !== role)
      : [...current, role];
    handleFieldChange("target_roles", updated);
  };

  const handleAddCustomRole = () => {
    if (!newRoleInput.trim()) return;
    const role = newRoleInput.trim();
    const current = formData.target_roles || [];
    if (!current.includes(role)) {
      handleFieldChange("target_roles", [...current, role]);
    }
    setNewRoleInput("");
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name?.trim()) {
      setNotification({
        type: "error",
        message: "Skill Name is required.",
      });
      return;
    }

    saveMutation.mutate(formData);
  };

  const handleDiscard = () => {
    if (initialData) {
      setFormData({
        ...initialData,
        technologies:
          initialData.technologies ||
          initialData.technologies_detail?.map((t) => t.id) ||
          [],
        related_experiences:
          initialData.related_experiences ||
          initialData.related_experiences_detail?.map((e) => e.id) ||
          [],
        related_projects:
          initialData.related_projects ||
          initialData.related_projects_detail?.map((p) => p.id) ||
          [],
        target_roles: initialData.target_roles || [],
        internal_notes: initialData.internal_notes || "",
      });
      setIsDirty(false);
      setNotification({
        type: "success",
        message: "Unsaved changes discarded.",
      });
      setTimeout(() => setNotification(null), 3000);
    } else {
      router.push("/dashboard/skills");
    }
  };

  // Filter technologies for quick selector
  const filteredTechs = technologies.filter((t) => {
    if (!techSearch.trim()) return true;
    const q = techSearch.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      (t.category || "").toLowerCase().includes(q)
    );
  });

  const techCategories = Array.from(
    new Set(filteredTechs.map((t) => t.category || "General"))
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* STICKY TOP ACTION BAR */}
      {/* ========================================================================= */}
      <div className="sticky top-0 z-20 bg-[#f6f8fa]/95 dark:bg-[#0d1117]/95 backdrop-blur-md py-3 border-b border-[#d0d7de] dark:border-[#30363d] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/skills"
            className="p-1.5 rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] transition-colors"
            title="Back to Skills Matrix"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-[#24292f] dark:text-[#f0f6fc] font-mono flex items-center gap-2">
              <span>{formData.name || (isNew ? "New Skill" : "Edit Skill")}</span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                {formData.category || "Backend"}
              </span>
            </h1>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#57606a] dark:text-[#8b949e]">
              {isDirty ? (
                <span className="inline-flex items-center gap-1 text-[#d97706] dark:text-[#f59e0b]">
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  Unsaved Changes
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[#1a7f37] dark:text-[#3fb950]">
                  <CheckCircle2 className="w-3 h-3" />
                  Canonical Sync OK
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              type="button"
              onClick={handleDiscard}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] hover:bg-[#ffebe9] hover:text-[#cf222e] dark:hover:bg-[#2b1011] dark:hover:text-[#ff7b72] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Discard</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#0969da] dark:text-[#58a6ff]" />
            <span>Preview</span>
          </button>

          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono font-medium rounded-lg bg-[#1f883d] text-white hover:bg-[#1a7f37] transition-colors shadow-xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saveMutation.isPending ? "Saving..." : "Save Skill"}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NOTIFICATION BANNER */}
      {/* ========================================================================= */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2 shadow-xs ${
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
      {/* SECTION 1: SKILL IDENTITY & CATEGORIZATION */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs">
        <h2 className="flex items-center gap-2 text-xs font-mono font-bold text-[#0969da] dark:text-[#58a6ff] uppercase tracking-wider border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
          <Cpu className="w-4 h-4" />
          <span>1. Skill Identity & Categorization</span>
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] mb-1">
              Skill Name <span className="text-[#cf222e]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name || ""}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder="e.g. Distributed Systems Architecture"
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] mb-1">
              URL Slug (Auto-generated if empty)
            </label>
            <input
              type="text"
              value={formData.slug || ""}
              onChange={(e) => handleFieldChange("slug", e.target.value)}
              placeholder="e.g. distributed-systems-architecture"
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] mb-1">
              Competency Category <span className="text-[#cf222e]">*</span>
            </label>
            <select
              value={formData.category || "Backend Engineering"}
              onChange={(e) => handleFieldChange("category", e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            >
              {CATEGORY_CHOICES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] mb-1">
              Display Sort Order
            </label>
            <input
              type="number"
              value={formData.order ?? 0}
              onChange={(e) => handleFieldChange("order", parseInt(e.target.value) || 0)}
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: PROFICIENCY, SCOPE & VISIBILITY */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs">
        <h2 className="flex items-center gap-2 text-xs font-mono font-bold text-[#0969da] dark:text-[#58a6ff] uppercase tracking-wider border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
          <Layers className="w-4 h-4" />
          <span>2. Proficiency, Scope & Visibility</span>
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] mb-1">
              Proficiency Level
            </label>
            <select
              value={formData.proficiency || "advanced"}
              onChange={(e) => handleFieldChange("proficiency", e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            >
              {PROFICIENCY_CHOICES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] mb-1">
              Years of Experience (Curated Decimal)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={formData.years ?? 1.0}
              onChange={(e) => handleFieldChange("years", parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#24292f] dark:text-[#f0f6fc]">
              <input
                type="checkbox"
                checked={formData.is_core || false}
                onChange={(e) => handleFieldChange("is_core", e.target.checked)}
                className="rounded border-[#d0d7de] dark:border-[#30363d] text-[#0969da]"
              />
              <span className="font-semibold">★ Core Stack Competency</span>
            </label>
            <span className="text-[10px] text-[#57606a] dark:text-[#8b949e]">
              (Promotes to top Core Stack banner on public portfolio & resume)
            </span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#24292f] dark:text-[#f0f6fc]">
              <input
                type="checkbox"
                checked={formData.is_published !== false}
                onChange={(e) => handleFieldChange("is_published", e.target.checked)}
                className="rounded border-[#d0d7de] dark:border-[#30363d] text-[#1f883d]"
              />
              <span className="font-semibold">Published (Visible on Portfolio)</span>
            </label>
            <span className="text-[10px] text-[#57606a] dark:text-[#8b949e]">
              (Uncheck for internal private drafting)
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: CAPABILITY NARRATIVE & EVIDENCE CONTEXT */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs">
        <h2 className="flex items-center gap-2 text-xs font-mono font-bold text-[#0969da] dark:text-[#58a6ff] uppercase tracking-wider border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
          <ShieldCheck className="w-4 h-4" />
          <span>3. Capability Narrative & Evidence Context</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] mb-1">
              Competency Summary Description
            </label>
            <textarea
              rows={2}
              value={formData.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="e.g. Primary backend language utilized for microservices, asynchronous task queues, data processing, and cloud automation."
              className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] mb-1">
              Concrete Production Evidence & Proof Context
            </label>
            <textarea
              rows={2}
              value={formData.evidence_context || ""}
              onChange={(e) => handleFieldChange("evidence_context", e.target.value)}
              placeholder="e.g. Core backend engine for SMS DataTech enterprise platforms, Career OS REST API, and FinTrack AI analytics."
              className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            />
            <span className="text-[10px] font-mono text-[#57606a] dark:text-[#8b949e] mt-1 block">
              Explains how this competency has been validated by real production workloads or architecture implementations.
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: ASSOCIATED TECHNOLOGIES */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
          <h2 className="flex items-center gap-2 text-xs font-mono font-bold text-[#0969da] dark:text-[#58a6ff] uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>4. Associated Technologies</span>
          </h2>
          <input
            type="text"
            value={techSearch}
            onChange={(e) => setTechSearch(e.target.value)}
            placeholder="Filter technologies..."
            className="px-2 py-1 text-[11px] font-mono rounded border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none"
          />
        </div>

        <p className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e]">
          Link concrete tools and frameworks that implement or support this capability.
        </p>

        <div className="space-y-3">
          {techCategories.map((category) => {
            const catTechs = filteredTechs.filter((t) => (t.category || "General") === category);
            if (catTechs.length === 0) return null;

            return (
              <div key={category} className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase text-[#57606a] dark:text-[#8b949e] block">
                  {category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {catTechs.map((tech) => {
                    const isSelected = formData.technologies?.includes(tech.id);
                    return (
                      <button
                        key={tech.id}
                        type="button"
                        onClick={() => handleToggleTech(tech.id)}
                        className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium border transition-all ${
                          isSelected
                            ? "bg-[#0969da] text-white border-[#0969da] shadow-xs"
                            : "bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border-[#d0d7de] dark:border-[#30363d] hover:bg-[#eaeef2] dark:hover:bg-[#30363d]"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {tech.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 5: REAL-WORLD EVIDENCE LINKS */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs">
        <h2 className="flex items-center gap-2 text-xs font-mono font-bold text-[#0969da] dark:text-[#58a6ff] uppercase tracking-wider border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
          <Briefcase className="w-4 h-4" />
          <span>5. Real-World Evidence Links</span>
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Associated Work Experiences */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
              <Briefcase className="w-3.5 h-3.5 text-[#0969da]" />
              <span>Associated Work Experiences</span>
            </label>
            <p className="text-[10px] font-mono text-[#57606a] dark:text-[#8b949e]">
              Select positions where this capability was actively exercised in production:
            </p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto p-2 rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/60 dark:bg-[#0d1117]/60">
              {experiences.map((exp) => {
                if (exp.id === undefined) return null;
                const expId = exp.id;
                const isSelected = formData.related_experiences?.includes(expId);
                const companyLabel = exp.company_detail?.name || "Company";

                return (
                  <label
                    key={expId}
                    className="flex items-center gap-2 p-1.5 rounded hover:bg-white dark:hover:bg-[#161b22] text-xs font-mono cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected || false}
                      onChange={() => handleToggleExperience(expId)}
                      className="rounded border-[#d0d7de] dark:border-[#30363d] text-[#0969da]"
                    />
                    <div className="flex-1 truncate">
                      <span className="font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                        {exp.title}
                      </span>{" "}
                      <span className="text-[#57606a] dark:text-[#8b949e]">
                        ({companyLabel})
                      </span>
                    </div>
                  </label>
                );
              })}
              {experiences.length === 0 && (
                <div className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e] p-2 text-center">
                  No experience records loaded.
                </div>
              )}
            </div>
          </div>

          {/* Associated Projects */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
              <FolderGit2 className="w-3.5 h-3.5 text-[#1f883d]" />
              <span>Associated Portfolio Projects</span>
            </label>
            <p className="text-[10px] font-mono text-[#57606a] dark:text-[#8b949e]">
              Select projects demonstrating this competency:
            </p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto p-2 rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/60 dark:bg-[#0d1117]/60">
              {projects.map((proj) => {
                if (proj.id === undefined) return null;
                const projId = proj.id;
                const isSelected = formData.related_projects?.includes(projId);
                return (
                  <label
                    key={projId}
                    className="flex items-center gap-2 p-1.5 rounded hover:bg-white dark:hover:bg-[#161b22] text-xs font-mono cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected || false}
                      onChange={() => handleToggleProject(projId)}
                      className="rounded border-[#d0d7de] dark:border-[#30363d] text-[#1f883d]"
                    />
                    <div className="flex-1 truncate">
                      <span className="font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                        {proj.title}
                      </span>{" "}
                      <span className="text-[10px] text-[#57606a] dark:text-[#8b949e]">
                        ({proj.project_type || "app"})
                      </span>
                    </div>
                  </label>
                );
              })}
              {projects.length === 0 && (
                <div className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e] p-2 text-center">
                  No project records loaded.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Linked Certifications Display */}
        {(formData.certifications_detail?.length || 0) > 0 && (
          <div className="pt-2 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60 space-y-2">
            <span className="text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#d97706] dark:text-[#f59e0b]" />
              <span>Verified Certifications Linked via Certification Matrix</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {formData.certifications_detail?.map((cert) => (
                <div
                  key={cert.id}
                  className="px-2.5 py-1 rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-xs font-mono flex items-center gap-1.5"
                >
                  <Award className="w-3 h-3 text-[#d97706]" />
                  <span className="font-medium text-[#24292f] dark:text-[#f0f6fc]">
                    {cert.name}
                  </span>
                  <span className="text-[10px] text-[#57606a] dark:text-[#8b949e]">
                    ({cert.issuer})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 6: PRIVATE CAREER INTELLIGENCE & TARGET ROLES */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-amber-500/30 dark:border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/5 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
          <h2 className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>6. Private Career Intelligence & Target Roles</span>
          </h2>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            Staff Only • Never Public
          </span>
        </div>

        {/* Target Roles */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
            Target Career Roles Tagging Taxonomy (For V3.0 Resume Studio)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {TARGET_ROLE_OPTIONS.map((role) => {
              const isSelected = formData.target_roles?.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleToggleTargetRole(role)}
                  className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium border transition-all ${
                    isSelected
                      ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                      : "bg-white dark:bg-[#161b22] text-[#57606a] dark:text-[#8b949e] border-[#d0d7de] dark:border-[#30363d] hover:bg-amber-500/10"
                  }`}
                >
                  {isSelected ? "✓ " : "+ "}
                  {role}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={newRoleInput}
              onChange={(e) => setNewRoleInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomRole();
                }
              }}
              placeholder="Add custom target role..."
              className="px-2.5 py-1 text-xs font-mono rounded border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddCustomRole}
              className="px-2.5 py-1 text-xs font-mono rounded border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#24292f] dark:text-[#f0f6fc] hover:bg-[#f6f8fa]"
            >
              Add Role
            </button>
          </div>
        </div>

        {/* Private Internal Notes */}
        <div className="space-y-1">
          <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
            Private Staff Internal Notes & Interview Talking Points
          </label>
          <textarea
            rows={3}
            value={formData.internal_notes || ""}
            onChange={(e) => handleFieldChange("internal_notes", e.target.value)}
            placeholder="Confidential technical assessment notes, interview preparation talking points, proficiency growth roadmap..."
            className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ON-DEMAND PREVIEW MODAL */}
      {/* ========================================================================= */}
      {isPreviewOpen && (
        <SkillPreviewModal
          isOpen={true}
          onClose={() => setIsPreviewOpen(false)}
          skills={[formData as Skill]}
          isDirty={isDirty}
          highlightSkillSlug={formData.slug}
        />
      )}
    </form>
  );
}
