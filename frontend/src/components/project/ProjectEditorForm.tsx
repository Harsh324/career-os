"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Eye,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  Layers,
  Sparkles,
  Zap,
  Cpu,
  ShieldCheck,
  Globe,
  Tag,
  Lock,
  MoveUp,
  MoveDown,
} from "lucide-react";
import {
  createAdminProject,
  updateAdminProject,
  getAdminTechnologies,
} from "@/lib/api/admin-client";
import { ProjectPreviewModal } from "./ProjectPreviewModal";
import type {
  Project,
  Technology,
  ProjectArchitectureFlowStep,
  ProjectKeyFeature,
  ProjectHighlight,
} from "@/lib/api/types";

interface ProjectEditorFormProps {
  initialProject?: Project | null;
  isNew?: boolean;
}

export function ProjectEditorForm({
  initialProject,
  isNew = false,
}: ProjectEditorFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Form State
  const [formData, setFormData] = useState<Partial<Project>>(() => ({
    title: initialProject?.title || "",
    slug: initialProject?.slug || "",
    project_type: initialProject?.project_type || "application",
    status: initialProject?.status || "active",
    is_published: initialProject?.is_published !== undefined ? initialProject.is_published : true,
    featured: initialProject?.featured || false,
    order: initialProject?.order || 0,
    summary: initialProject?.summary || "",
    description: initialProject?.description || "",
    problem: initialProject?.problem || "",
    solution: initialProject?.solution || "",
    technical_outcome: initialProject?.technical_outcome || "",
    timeline: initialProject?.timeline || "",
    repository: initialProject?.repository || "",
    demo: initialProject?.demo || "",
    docs_url: initialProject?.docs_url || "",
    tech_stack: initialProject?.tech_stack || initialProject?.tech_stack_detail?.map((t) => t.id) || [],
    architecture_flow: initialProject?.architecture_flow || [],
    key_features: initialProject?.key_features || [],
    highlights: initialProject?.highlights || [],
    target_roles: initialProject?.target_roles || [],
    internal_notes: initialProject?.internal_notes || "",
  }));

  const [isDirty, setIsDirty] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [targetRoleInput, setTargetRoleInput] = useState("");

  // Fetch technologies for selector
  const { data: technologies = [] } = useQuery<Technology[]>({
    queryKey: ["admin-technologies"],
    queryFn: getAdminTechnologies,
  });

  // Track dirty state
  const handleFieldChange = <K extends keyof Project>(field: K, value: Project[K]) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-slug generation on new projects
      if (field === "title" && (isNew || !prev.slug)) {
        updated.slug = (value as string)
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
      return updated;
    });
    setIsDirty(true);
  };

  // Discard changes
  const handleDiscard = () => {
    if (!window.confirm("Discard all unsaved changes in this project editor?")) return;
    if (initialProject) {
      setFormData({
        ...initialProject,
        tech_stack: initialProject.tech_stack || initialProject.tech_stack_detail?.map((t) => t.id) || [],
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        project_type: "application",
        status: "active",
        is_published: true,
        featured: false,
        order: 0,
        summary: "",
        description: "",
        problem: "",
        solution: "",
        technical_outcome: "",
        timeline: "",
        repository: "",
        demo: "",
        docs_url: "",
        tech_stack: [],
        architecture_flow: [],
        key_features: [],
        highlights: [],
        target_roles: [],
        internal_notes: "",
      });
    }
    setIsDirty(false);
  };

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload: Partial<Project>) => {
      if (isNew) {
        return createAdminProject(payload);
      } else {
        return updateAdminProject(initialProject?.slug || payload.slug!, payload);
      }
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["admin-project", saved.slug] });
      setIsDirty(false);
      setNotification({
        type: "success",
        message: `Project "${saved.title}" successfully saved to PostgreSQL canonical store.`,
      });
      setTimeout(() => setNotification(null), 4000);

      if (isNew) {
        router.push(`/dashboard/projects/${saved.slug}`);
      }
    },
    onError: (err: any) => {
      setNotification({
        type: "error",
        message: err.message || "Failed to save project record.",
      });
      setTimeout(() => setNotification(null), 6000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert("Project Title is required.");
      return;
    }
    if (!formData.summary?.trim()) {
      alert("Project Summary is required.");
      return;
    }

    saveMutation.mutate(formData);
  };

  // Architecture Flow Step handlers
  const handleAddFlowStep = () => {
    const nextStepNum = (formData.architecture_flow?.length || 0) + 1;
    const updated = [
      ...(formData.architecture_flow || []),
      { step: nextStepNum, title: "", detail: "" },
    ];
    handleFieldChange("architecture_flow", updated);
  };

  const handleUpdateFlowStep = (index: number, field: keyof ProjectArchitectureFlowStep, val: any) => {
    const updated = [...(formData.architecture_flow || [])];
    updated[index] = { ...updated[index], [field]: val };
    handleFieldChange("architecture_flow", updated);
  };

  const handleRemoveFlowStep = (index: number) => {
    const updated = (formData.architecture_flow || [])
      .filter((_, i) => i !== index)
      .map((step, idx) => ({ ...step, step: idx + 1 }));
    handleFieldChange("architecture_flow", updated);
  };

  // Key Feature handlers
  const handleAddFeature = () => {
    const updated = [...(formData.key_features || []), { title: "", desc: "" }];
    handleFieldChange("key_features", updated);
  };

  const handleUpdateFeature = (index: number, field: keyof ProjectKeyFeature, val: string) => {
    const updated = [...(formData.key_features || [])];
    updated[index] = { ...updated[index], [field]: val };
    handleFieldChange("key_features", updated);
  };

  const handleRemoveFeature = (index: number) => {
    const updated = (formData.key_features || []).filter((_, i) => i !== index);
    handleFieldChange("key_features", updated);
  };

  // Highlight / Evidence handlers
  const handleAddHighlight = () => {
    const nextOrder = (formData.highlights?.length || 0);
    const updated = [
      ...(formData.highlights || []),
      {
        id: `hl-${Date.now()}`,
        text: "",
        is_public: true,
        target_roles: [],
        order: nextOrder,
      },
    ];
    handleFieldChange("highlights", updated);
  };

  const handleUpdateHighlight = (index: number, field: keyof ProjectHighlight, val: any) => {
    const updated = [...(formData.highlights || [])];
    updated[index] = { ...updated[index], [field]: val };
    handleFieldChange("highlights", updated);
  };

  const handleRemoveHighlight = (index: number) => {
    const updated = (formData.highlights || []).filter((_, i) => i !== index);
    handleFieldChange("highlights", updated);
  };

  // Target Roles handlers
  const handleAddTargetRole = () => {
    if (!targetRoleInput.trim()) return;
    if (!formData.target_roles?.includes(targetRoleInput.trim())) {
      handleFieldChange("target_roles", [
        ...(formData.target_roles || []),
        targetRoleInput.trim(),
      ]);
    }
    setTargetRoleInput("");
  };

  const handleRemoveTargetRole = (role: string) => {
    handleFieldChange(
      "target_roles",
      (formData.target_roles || []).filter((r) => r !== role)
    );
  };

  // Tech Stack selection handler
  const handleToggleTech = (techId: number) => {
    const current = formData.tech_stack || [];
    const updated = current.includes(techId)
      ? current.filter((id) => id !== techId)
      : [...current, techId];
    handleFieldChange("tech_stack", updated);
  };

  // Construct draft preview object
  const previewProjectObject: Project = {
    id: initialProject?.id || 0,
    title: formData.title || "Untitled Project",
    slug: formData.slug || "project-preview",
    project_type: formData.project_type || "application",
    status: formData.status || "active",
    is_published: formData.is_published,
    featured: Boolean(formData.featured),
    order: formData.order || 0,
    summary: formData.summary || "",
    description: formData.description || "",
    problem: formData.problem || "",
    solution: formData.solution || "",
    technical_outcome: formData.technical_outcome || "",
    timeline: formData.timeline || "",
    repository: formData.repository || "",
    demo: formData.demo || "",
    docs_url: formData.docs_url || "",
    architecture_flow: formData.architecture_flow || [],
    key_features: formData.key_features || [],
    highlights: formData.highlights || [],
    target_roles: formData.target_roles || [],
    internal_notes: formData.internal_notes || "",
    tech_stack_detail: technologies.filter((t) =>
      formData.tech_stack?.includes(t.id)
    ),
  };

  // Group technologies by category
  const techCategories = Array.from(
    new Set(technologies.map((t) => t.category || "General"))
  ).sort();

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto font-sans pb-16">
      {/* Sticky Single-Row Action Bar */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3.5 bg-[#f6f8fa]/90 dark:bg-[#0d1117]/90 backdrop-blur-md border-b border-[#d0d7de] dark:border-[#30363d] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard/projects"
            className="p-1.5 rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#f0f6fc] hover:bg-[#eaeef2] dark:hover:bg-[#30363d] transition-colors"
            title="Back to Projects list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#24292f] dark:text-[#f0f6fc] truncate">
                {isNew ? "New Project Showcase" : formData.title || "Edit Project"}
              </h1>
              {formData.slug && (
                <span className="text-xs font-mono text-[#57606a] dark:text-[#8b949e] hidden sm:inline">
                  ({formData.slug})
                </span>
              )}
            </div>
          </div>

          <div className="hidden sm:flex items-center">
            {isDirty ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#fff8c5] dark:bg-[#3b2300] text-[#9a6700] dark:text-[#f5d90a] border border-[#d4a72c]/40">
                <Sparkles className="w-3 h-3 animate-pulse" />
                Unsaved Draft Changes
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#dafbe1] dark:bg-[#112a1c] text-[#1a7f37] dark:text-[#3fb950] border border-[#2da44e]/30">
                <CheckCircle2 className="w-3 h-3" />
                Canonical Sync Active
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#eaeef2] dark:hover:bg-[#30363d] transition-colors shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#0969da] dark:text-[#58a6ff]" />
            <span>Preview</span>
          </button>

          {isDirty && (
            <button
              type="button"
              onClick={handleDiscard}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#cf222e] dark:text-[#ff7b72] hover:bg-[#ffebe9] dark:hover:bg-[#2b1011] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Discard</span>
            </button>
          )}

          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-semibold rounded-lg bg-[#1f883d] text-white hover:bg-[#1a7f37] transition-all shadow-xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saveMutation.isPending ? "Saving..." : "Save Project"}</span>
          </button>
        </div>
      </div>

      {/* Global Notification */}
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

      {/* ========================================================================= */}
      {/* SECTION 1: PROJECT IDENTITY & CLASSIFICATION */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs">
        <h2 className="flex items-center gap-2 text-xs font-mono font-bold text-[#0969da] dark:text-[#58a6ff] uppercase tracking-wider border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
          <FolderGit2 className="w-4 h-4" />
          <span>1. Project Identity & Classification</span>
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={formData.title || ""}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="e.g. Constellation"
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug || ""}
              onChange={(e) => handleFieldChange("slug", e.target.value)}
              placeholder="e.g. constellation"
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] mb-1">
              Project Classification Archetype
            </label>
            <select
              value={formData.project_type || "application"}
              onChange={(e) => handleFieldChange("project_type", e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            >
              <option value="application">Application / Product</option>
              <option value="infrastructure">Infrastructure & Homelab</option>
              <option value="platform">Platform & Tooling</option>
              <option value="open_source">Open Source Library</option>
              <option value="experiment">Research & Experiment</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] mb-1">
              Development Lifecycle Status
            </label>
            <select
              value={formData.status || "active"}
              onChange={(e) => handleFieldChange("status", e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            >
              <option value="in_development">In Development (Active Engineering)</option>
              <option value="active">Active (Baseline Established)</option>
              <option value="deployed">Deployed (Production Ready)</option>
              <option value="archived">Archived (Reference Only)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] mb-1">
              Timeline Display String
            </label>
            <input
              type="text"
              value={formData.timeline || ""}
              onChange={(e) => handleFieldChange("timeline", e.target.value)}
              placeholder="e.g. 2026 – Present (v0.9.2 Baseline)"
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] mb-1">
              Display Sort Order
            </label>
            <input
              type="number"
              value={formData.order ?? 0}
              onChange={(e) => handleFieldChange("order", parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: PUBLICATION & SHOWCASE VISIBILITY */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs">
        <h2 className="flex items-center gap-2 text-xs font-mono font-bold text-[#0969da] dark:text-[#58a6ff] uppercase tracking-wider border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
          <Eye className="w-4 h-4" />
          <span>2. Publication & Showcase Visibility</span>
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-start gap-3 p-3 rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/50 dark:bg-[#0d1117]/50 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_published !== false}
              onChange={(e) => handleFieldChange("is_published", e.target.checked)}
              className="mt-0.5 rounded border-[#d0d7de] dark:border-[#30363d] text-[#0969da]"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-mono font-bold text-[#24292f] dark:text-[#f0f6fc] block">
                Publicly Published
              </span>
              <span className="text-[11px] text-[#57606a] dark:text-[#8b949e] block">
                When enabled, project is rendered on the public showcase. When disabled, only visible to authenticated admin.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/50 dark:bg-[#0d1117]/50 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(formData.featured)}
              onChange={(e) => handleFieldChange("featured", e.target.checked)}
              className="mt-0.5 rounded border-[#d0d7de] dark:border-[#30363d] text-[#0969da]"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-mono font-bold text-[#24292f] dark:text-[#f0f6fc] block">
                Featured on Homepage Showcase
              </span>
              <span className="text-[11px] text-[#57606a] dark:text-[#8b949e] block">
                Elevates this project into the top featured grid of the public portfolio.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: POSITIONING & TECHNICAL SUMMARY */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs">
        <h2 className="flex items-center gap-2 text-xs font-mono font-bold text-[#0969da] dark:text-[#58a6ff] uppercase tracking-wider border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
          <Sparkles className="w-4 h-4" />
          <span>3. Positioning & Technical Summary</span>
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] mb-1">
              Elevator Pitch / Summary * (1–2 sentences)
            </label>
            <textarea
              required
              rows={2}
              value={formData.summary || ""}
              onChange={(e) => handleFieldChange("summary", e.target.value)}
              placeholder="Self-hosted infrastructure platform for securely running and managing containerized services on a personal homelab."
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] mb-1">
              Comprehensive Technical Narrative (Markdown supported)
            </label>
            <textarea
              rows={4}
              value={formData.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Built on Ubuntu Linux with Cloudflare Tunnels, Traefik reverse proxy, shared PostgreSQL/Redis storage, and automated encrypted daily S3 backups..."
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: PROBLEM, SOLUTION & TECHNICAL OUTCOME */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs">
        <h2 className="flex items-center gap-2 text-xs font-mono font-bold text-[#0969da] dark:text-[#58a6ff] uppercase tracking-wider border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
          <Zap className="w-4 h-4 text-[#d97706] dark:text-[#f59e0b]" />
          <span>4. Problem, Solution & Technical Outcome</span>
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-mono font-semibold text-[#cf222e] dark:text-[#ff7b72] mb-1 uppercase tracking-wider">
              Engineering Problem / Bottleneck
            </label>
            <textarea
              rows={2}
              value={formData.problem || ""}
              onChange={(e) => handleFieldChange("problem", e.target.value)}
              placeholder="Exposing self-hosted services directly to the internet creates firewall attack surfaces..."
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-[#0969da] dark:text-[#58a6ff] mb-1 uppercase tracking-wider">
              Architectural Solution
            </label>
            <textarea
              rows={2}
              value={formData.solution || ""}
              onChange={(e) => handleFieldChange("solution", e.target.value)}
              placeholder="Built an automated infrastructure setup with zero open inbound ports using Cloudflare Tunnels, Traefik v3..."
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-[#1f883d] dark:text-[#39d353] mb-1 uppercase tracking-wider">
              High-Level Technical Outcome / Impact (Single concise statement)
            </label>
            <textarea
              rows={2}
              value={formData.technical_outcome || ""}
              onChange={(e) => handleFieldChange("technical_outcome", e.target.value)}
              placeholder="Zero inbound attack surface, 100% automated encrypted daily backups with 14-day retention, and real-time Telegram alerts."
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 5: SYSTEM ARCHITECTURE & DATA FLOW */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
          <h2 className="flex items-center gap-2 text-xs font-mono font-bold text-[#0969da] dark:text-[#58a6ff] uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>5. System Architecture & Data Flow</span>
          </h2>
          <button
            type="button"
            onClick={handleAddFlowStep}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-[#0969da]/10 text-[#0969da] dark:text-[#58a6ff] hover:bg-[#0969da]/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Step</span>
          </button>
        </div>

        <p className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e]">
          Semantic flow steps stored in PostgreSQL. Styling and visual connectors are managed strictly by the presentation layer.
        </p>

        <div className="space-y-3">
          {(formData.architecture_flow || []).map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/60 dark:bg-[#0d1117]/60"
            >
              <span className="px-2 py-1 text-[11px] font-mono font-bold rounded bg-white dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] text-[#0969da] dark:text-[#58a6ff] flex-shrink-0">
                Step {step.step || idx + 1}
              </span>

              <div className="grid gap-2 sm:grid-cols-2 flex-1 min-w-0">
                <input
                  type="text"
                  value={step.title || ""}
                  onChange={(e) => handleUpdateFlowStep(idx, "title", e.target.value)}
                  placeholder="Step Title (e.g. Zero-Trust Ingress)"
                  className="w-full px-2.5 py-1 text-xs font-mono rounded border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] text-[#24292f] dark:text-[#f0f6fc]"
                />
                <input
                  type="text"
                  value={step.detail || ""}
                  onChange={(e) => handleUpdateFlowStep(idx, "detail", e.target.value)}
                  placeholder="Detail subtitle (e.g. Secure Gateway Routing)"
                  className="w-full px-2.5 py-1 text-xs font-mono rounded border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] text-[#24292f] dark:text-[#f0f6fc]"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveFlowStep(idx)}
                className="p-1 text-[#cf222e] dark:text-[#ff7b72] hover:bg-[#ffebe9] dark:hover:bg-[#2b1011] rounded"
                title="Remove step"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {(!formData.architecture_flow || formData.architecture_flow.length === 0) && (
            <div className="p-4 text-center text-xs font-mono text-[#57606a] dark:text-[#8b949e] border border-dashed border-[#d0d7de] dark:border-[#30363d] rounded-lg">
              No architecture steps defined. Click &ldquo;+ Add Step&rdquo; to build the system flow diagram.
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 6: KEY ARCHITECTURAL FEATURES */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
          <h2 className="flex items-center gap-2 text-xs font-mono font-bold text-[#0969da] dark:text-[#58a6ff] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>6. Key Architectural Features</span>
          </h2>
          <button
            type="button"
            onClick={handleAddFeature}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-[#0969da]/10 text-[#0969da] dark:text-[#58a6ff] hover:bg-[#0969da]/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Feature</span>
          </button>
        </div>

        <div className="space-y-3">
          {(formData.key_features || []).map((feat, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/60 dark:bg-[#0d1117]/60 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={feat.title || ""}
                  onChange={(e) => handleUpdateFeature(idx, "title", e.target.value)}
                  placeholder="Feature Title (e.g. Standardized Service Templates)"
                  className="w-full px-2.5 py-1 text-xs font-mono font-semibold rounded border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] text-[#24292f] dark:text-[#f0f6fc]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(idx)}
                  className="p-1 text-[#cf222e] dark:text-[#ff7b72] hover:bg-[#ffebe9] dark:hover:bg-[#2b1011] rounded"
                  title="Remove feature"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                rows={2}
                value={feat.desc || ""}
                onChange={(e) => handleUpdateFeature(idx, "desc", e.target.value)}
                placeholder="Technical feature description..."
                className="w-full px-2.5 py-1 text-xs font-mono rounded border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] text-[#57606a] dark:text-[#8b949e]"
              />
            </div>
          ))}

          {(!formData.key_features || formData.key_features.length === 0) && (
            <div className="p-4 text-center text-xs font-mono text-[#57606a] dark:text-[#8b949e] border border-dashed border-[#d0d7de] dark:border-[#30363d] rounded-lg">
              No architectural features added yet. Click &ldquo;+ Add Feature&rdquo; to add capability cards.
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 7: ACHIEVEMENT & EVIDENCE BANK ⭐ */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
          <div>
            <h2 className="flex items-center gap-2 text-xs font-mono font-bold text-[#1f883d] dark:text-[#39d353] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>7. Achievement & Evidence Bank ⭐</span>
            </h2>
            <p className="text-[11px] text-[#57606a] dark:text-[#8b949e] mt-0.5">
              Structured engineering evidence points ready for future Milestone V3.0 Resume Studio LaTeX export.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddHighlight}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-[#1f883d]/10 text-[#1f883d] dark:text-[#39d353] hover:bg-[#1f883d]/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Bullet</span>
          </button>
        </div>

        <div className="space-y-3">
          {(formData.highlights || []).map((hl, idx) => {
            const text = typeof hl === "string" ? hl : hl.text;
            const isPublic = typeof hl === "string" ? true : hl.is_public !== false;

            return (
              <div
                key={idx}
                className="p-3 rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/60 dark:bg-[#0d1117]/60 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <textarea
                    rows={2}
                    value={text}
                    onChange={(e) => handleUpdateHighlight(idx, "text", e.target.value)}
                    placeholder="e.g. Architected zero-trust homelab infrastructure utilizing Cloudflare Tunnels and Traefik v3..."
                    className="w-full px-2.5 py-1 text-xs font-mono rounded border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] text-[#24292f] dark:text-[#f0f6fc]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(idx)}
                    className="p-1 text-[#cf222e] dark:text-[#ff7b72] hover:bg-[#ffebe9] dark:hover:bg-[#2b1011] rounded"
                    title="Remove evidence bullet"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-[#57606a] dark:text-[#8b949e]">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => handleUpdateHighlight(idx, "is_public", e.target.checked)}
                      className="rounded border-[#d0d7de] dark:border-[#30363d] text-[#1f883d]"
                    />
                    <span>Public Evidence (Visible on Portfolio)</span>
                  </label>

                  <span className="text-[10px] text-[#8b949e]">
                    Order #{idx + 1}
                  </span>
                </div>
              </div>
            );
          })}

          {(!formData.highlights || formData.highlights.length === 0) && (
            <div className="p-4 text-center text-xs font-mono text-[#57606a] dark:text-[#8b949e] border border-dashed border-[#d0d7de] dark:border-[#30363d] rounded-lg">
              No evidence bullets registered yet. Click &ldquo;+ Add Bullet&rdquo; to create recruiter proof points.
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 8: TECHNOLOGY STACK */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs">
        <h2 className="flex items-center gap-2 text-xs font-mono font-bold text-[#0969da] dark:text-[#58a6ff] uppercase tracking-wider border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
          <Cpu className="w-4 h-4" />
          <span>8. Technology Stack & Canonical Links</span>
        </h2>

        <p className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e]">
          Select canonical technologies associated with this project.
        </p>

        <div className="space-y-4">
          {techCategories.map((category) => {
            const catTechs = technologies.filter((t) => (t.category || "General") === category);
            if (catTechs.length === 0) return null;

            return (
              <div key={category} className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-[#57606a] dark:text-[#8b949e] block">
                  {category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {catTechs.map((tech) => {
                    const isSelected = formData.tech_stack?.includes(tech.id);
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
      {/* SECTION 9: REPOSITORY, DEPLOYMENT & PRIVATE CAREER INTELLIGENCE */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs">
        <h2 className="flex items-center gap-2 text-xs font-mono font-bold text-[#0969da] dark:text-[#58a6ff] uppercase tracking-wider border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2.5">
          <Globe className="w-4 h-4" />
          <span>9. Repository, Deployment & Private Career Intelligence</span>
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] mb-1">
              GitHub / Source Repository URL
            </label>
            <input
              type="url"
              value={formData.repository || ""}
              onChange={(e) => handleFieldChange("repository", e.target.value)}
              placeholder="https://github.com/Harsh324/constellation"
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] mb-1">
              Live System / Demo URL (Keep empty if not deployed)
            </label>
            <input
              type="url"
              value={formData.demo || ""}
              onChange={(e) => handleFieldChange("demo", e.target.value)}
              placeholder="https://portal.constellationhq.dev/"
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            />
            <span className="text-[10px] font-mono text-[#57606a] dark:text-[#8b949e] mt-0.5 block">
              &ldquo;Live System&rdquo; button will render ONLY if this field contains a valid non-empty URL.
            </span>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] mb-1">
              Architecture Docs / Wiki URL
            </label>
            <input
              type="url"
              value={formData.docs_url || ""}
              onChange={(e) => handleFieldChange("docs_url", e.target.value)}
              placeholder="https://docs.constellationhq.dev"
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
            />
          </div>
        </div>

        {/* Target Roles Tags */}
        <div className="pt-2 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60 space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
            <Lock className="w-3 h-3 text-[#d97706]" />
            <span>Target Role Positioning Tags (Private Career Intelligence)</span>
          </label>

          <div className="flex flex-wrap items-center gap-2">
            {(formData.target_roles || []).map((role) => (
              <span
                key={role}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-[#f6f8fa] dark:bg-[#21262d] text-[#24292f] dark:text-[#f0f6fc] border border-[#d0d7de] dark:border-[#30363d]"
              >
                <span>{role}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTargetRole(role)}
                  className="text-[#57606a] hover:text-[#cf222e]"
                >
                  ×
                </button>
              </span>
            ))}

            <div className="inline-flex items-center gap-1">
              <input
                type="text"
                value={targetRoleInput}
                onChange={(e) => setTargetRoleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTargetRole();
                  }
                }}
                placeholder="Add role (e.g. Backend Engineering)"
                className="px-2.5 py-1 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc]"
              />
              <button
                type="button"
                onClick={handleAddTargetRole}
                className="px-2 py-1 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#24292f] dark:text-[#f0f6fc]"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Private Internal Notes */}
        <div className="pt-2 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60 space-y-1">
          <label className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
            <Lock className="w-3 h-3 text-[#d97706]" />
            <span>Private Architecture & Interview Notes (Staff Only)</span>
          </label>
          <p className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e]">
            Masked from anonymous visitors and recruiters. Use for real trade-off rationales, interview prep, and technical debt notes.
          </p>
          <textarea
            rows={3}
            value={formData.internal_notes || ""}
            onChange={(e) => handleFieldChange("internal_notes", e.target.value)}
            placeholder="Confidential architecture trade-offs, scalability bottlenecks, or interview talking points..."
            className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:border-[#0969da]"
          />
        </div>
      </div>

      {/* Live Preview Modal */}
      {isPreviewOpen && (
        <ProjectPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          project={previewProjectObject}
          isDirty={isDirty}
        />
      )}
    </form>
  );
}
