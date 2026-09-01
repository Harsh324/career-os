"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  Calendar,
  Layers,
  Cpu,
  Briefcase,
  FolderGit2,
  Lock,
  Plus,
  Trash2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import type {
  Certification,
  Skill,
  Technology,
  Experience,
  Project,
} from "@/lib/api/types";
import {
  createAdminCertification,
  updateAdminCertification,
  getAdminSkills,
  getAdminTechnologies,
  getAdminExperiences,
  getAdminProjects,
} from "@/lib/api/admin-client";
import { CertificationPreviewModal } from "./CertificationPreviewModal";

interface CertificationEditorFormProps {
  initialCertification?: Certification;
  isNew?: boolean;
}

export function CertificationEditorForm({
  initialCertification,
  isNew = false,
}: CertificationEditorFormProps) {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState<Partial<Certification>>({
    name: initialCertification?.name || "",
    slug: initialCertification?.slug || "",
    issuer: initialCertification?.issuer || "Amazon Web Services",
    credential_id: initialCertification?.credential_id || "",
    credential_url: initialCertification?.credential_url || "",
    issue_date: initialCertification?.issue_date || "",
    expiry_date: initialCertification?.expiry_date || "",
    does_not_expire: initialCertification?.does_not_expire || false,
    verification_status: initialCertification?.verification_status || "verified",
    category: initialCertification?.category || "Cloud & Infrastructure",
    is_published: initialCertification?.is_published ?? true,
    is_featured: initialCertification?.is_featured ?? true,
    order: initialCertification?.order ?? 0,
    description: initialCertification?.description || "",
    related_skills: initialCertification?.related_skills || [],
    related_technologies: initialCertification?.related_technologies || [],
    related_experiences: initialCertification?.related_experiences || [],
    related_projects: initialCertification?.related_projects || [],
    target_roles: initialCertification?.target_roles || [],
    internal_notes: initialCertification?.internal_notes || "",
  });

  // Reference data for selectors
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [allTechnologies, setAllTechnologies] = useState<Technology[]>([]);
  const [allExperiences, setAllExperiences] = useState<Experience[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  // UX & Flow state
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // New target role input buffer
  const [newRoleInput, setNewRoleInput] = useState("");

  useEffect(() => {
    async function loadReferenceData() {
      try {
        const [skills, techs, exps, projs] = await Promise.all([
          getAdminSkills().catch(() => []),
          getAdminTechnologies().catch(() => []),
          getAdminExperiences().catch(() => []),
          getAdminProjects().catch(() => []),
        ]);
        setAllSkills(skills);
        setAllTechnologies(techs);
        setAllExperiences(exps);
        setAllProjects(projs);
      } catch {
        // gracefully fall back to empty selectors
      }
    }
    loadReferenceData();
  }, []);

  const handleChange = (field: keyof Certification, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setError(null);
  };

  const handleToggleArrayId = (
    field: "related_skills" | "related_technologies" | "related_experiences" | "related_projects",
    id: number
  ) => {
    const current = (formData[field] as number[]) || [];
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    handleChange(field, next);
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
      if (initialCertification) {
        setFormData({
          name: initialCertification.name || "",
          slug: initialCertification.slug || "",
          issuer: initialCertification.issuer || "Amazon Web Services",
          credential_id: initialCertification.credential_id || "",
          credential_url: initialCertification.credential_url || "",
          issue_date: initialCertification.issue_date || "",
          expiry_date: initialCertification.expiry_date || "",
          does_not_expire: initialCertification.does_not_expire || false,
          verification_status: initialCertification.verification_status || "verified",
          category: initialCertification.category || "Cloud & Infrastructure",
          is_published: initialCertification.is_published ?? true,
          is_featured: initialCertification.is_featured ?? true,
          order: initialCertification.order ?? 0,
          description: initialCertification.description || "",
          related_skills: initialCertification.related_skills || [],
          related_technologies: initialCertification.related_technologies || [],
          related_experiences: initialCertification.related_experiences || [],
          related_projects: initialCertification.related_projects || [],
          target_roles: initialCertification.target_roles || [],
          internal_notes: initialCertification.internal_notes || "",
        });
      } else {
        router.push("/dashboard/certifications");
      }
      setIsDirty(false);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setError("Certification name is required.");
      return;
    }
    if (!formData.issuer?.trim()) {
      setError("Issuing organization is required.");
      return;
    }
    if (!formData.issue_date?.trim()) {
      setError("Issue date is required.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      if (isNew) {
        const created = await createAdminCertification(formData);
        setIsDirty(false);
        setSuccessMessage("Certification created successfully.");
        router.push(`/dashboard/certifications/${created.slug}`);
      } else if (initialCertification?.slug) {
        await updateAdminCertification(initialCertification.slug, formData);
        setIsDirty(false);
        setSuccessMessage("Certification updated successfully.");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save certification.");
    } finally {
      setIsSaving(false);
    }
  };

  // Construct enriched object for live preview modal
  const previewCert: Certification = {
    id: initialCertification?.id || 0,
    name: formData.name || "Untitled Certification",
    slug: formData.slug || "preview-cert",
    issuer: formData.issuer || "Amazon Web Services",
    credential_id: formData.credential_id,
    credential_url: formData.credential_url,
    issue_date: formData.issue_date || "",
    expiry_date: formData.expiry_date,
    does_not_expire: formData.does_not_expire,
    verification_status: formData.verification_status,
    category: formData.category,
    is_published: formData.is_published,
    is_featured: formData.is_featured,
    order: formData.order,
    description: formData.description,
    related_skills: formData.related_skills,
    related_skills_detail: allSkills.filter((s) => formData.related_skills?.includes(s.id!)),
    related_technologies: formData.related_technologies,
    related_technologies_detail: allTechnologies.filter((t) =>
      formData.related_technologies?.includes(t.id!)
    ),
    related_experiences: formData.related_experiences,
    related_experiences_detail: allExperiences
      .filter((e) => formData.related_experiences?.includes(e.id!))
      .map((e) => ({
        id: e.id!,
        title: e.title,
        company_name: e.company_detail?.name || "",
        start_date: e.start_date,
        end_date: e.end_date,
        current_position: e.current_position,
        slug: e.slug,
      })),
    related_projects: formData.related_projects,
    related_projects_detail: allProjects
      .filter((p) => formData.related_projects?.includes(p.id!))
      .map((p) => ({
        id: p.id!,
        title: p.title,
        slug: p.slug,
        project_type: p.project_type || "platform",
        status: p.status || "active",
      })),
    target_roles: formData.target_roles,
    internal_notes: formData.internal_notes,
  };

  return (
    <div className="space-y-6">
      {/* Sticky Desktop Action Bar */}
      <div className="sticky top-0 z-20 bg-[#f6f8fa]/95 dark:bg-[#0d1117]/95 backdrop-blur-xs py-3 border-b border-[#d0d7de] dark:border-[#30363d] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/certifications"
            className="p-1.5 rounded-lg bg-white dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#f0f6fc] transition-colors"
            title="Back to Certifications"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-[#24292f] dark:text-white tracking-tight flex items-center gap-2">
              <span>{isNew ? "New Certification" : formData.name || "Edit Certification"}</span>
              {isDirty && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#fff8c5] dark:bg-[#9e6a03]/20 text-[#9a6700] dark:text-[#d29922] border border-[#9a6700]/30 dark:border-[#d29922]/30">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Unsaved Changes</span>
                </span>
              )}
            </h1>
            <p className="text-[11px] font-mono text-[#57606a] dark:text-[#8b949e]">
              Canonical Career Record &bull; PostgreSQL 16
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
            <span>{isSaving ? "Saving..." : isNew ? "Create Certification" : "Save Changes"}</span>
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

      {/* Multi-Section Workspace Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Certification Identity */}
        <section className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <h2 className="text-sm font-bold text-[#24292f] dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-[#d97706] dark:text-[#f59e0b]" />
              <span>1. Certification Identity & Classification</span>
            </h2>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-0.5">
              Official credential title, category classification, and URL slug.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Certification Name *
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. AWS Certified Solutions Architect – Associate"
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
                placeholder="aws-solutions-architect"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] font-mono text-xs text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Category / Domain
              </label>
              <input
                type="text"
                value={formData.category || ""}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="e.g. Cloud & Infrastructure, DevOps, Security"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-sm text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Issuer & Credential Verification */}
        <section className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <h2 className="text-sm font-bold text-[#24292f] dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1a7f37] dark:text-[#3fb950]" />
              <span>2. Issuer & Credential Verification</span>
            </h2>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-0.5">
              Authority, credential ID, public verification link, and validation status.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Issuing Organization *
              </label>
              <input
                type="text"
                value={formData.issuer || ""}
                onChange={(e) => handleChange("issuer", e.target.value)}
                placeholder="e.g. Amazon Web Services, Linux Foundation"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-sm text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Verification Status
              </label>
              <select
                value={formData.verification_status || "verified"}
                onChange={(e) => handleChange("verification_status", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-sm text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
              >
                <option value="verified">Verified</option>
                <option value="in_progress">In Progress</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Credential ID
              </label>
              <input
                type="text"
                value={formData.credential_id || ""}
                onChange={(e) => handleChange("credential_id", e.target.value)}
                placeholder="e.g. 9c0287d7cbf04661a24c19a061a02e76"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] font-mono text-xs text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Credential Verification URL
              </label>
              <input
                type="url"
                value={formData.credential_url || ""}
                onChange={(e) => handleChange("credential_url", e.target.value)}
                placeholder="https://cp.certmetrics.com/amazon/..."
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-sm text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Dates & Expiration */}
        <section className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <h2 className="text-sm font-bold text-[#24292f] dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
              <span>3. Dates & Expiration Schedule</span>
            </h2>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-0.5">
              Issue date and credential lifecycle management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Issue Date *
              </label>
              <input
                type="text"
                value={formData.issue_date || ""}
                onChange={(e) => handleChange("issue_date", e.target.value)}
                placeholder="2025-08-19 or Aug 2025"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-sm text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Expiration Date
              </label>
              <input
                type="text"
                disabled={formData.does_not_expire}
                value={formData.does_not_expire ? "" : formData.expiry_date || ""}
                onChange={(e) => handleChange("expiry_date", e.target.value)}
                placeholder="2028-08-19"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-sm text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff] disabled:opacity-40"
              />
            </div>

            <div className="pb-2">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono text-[#24292f] dark:text-[#f0f6fc]">
                <input
                  type="checkbox"
                  checked={formData.does_not_expire || false}
                  onChange={(e) => handleChange("does_not_expire", e.target.checked)}
                  className="rounded border-[#d0d7de] dark:border-[#30363d] text-[#0969da] focus:ring-0 cursor-pointer"
                />
                <span>Does Not Expire</span>
              </label>
            </div>
          </div>
        </section>

        {/* Section 4: Narrative Description */}
        <section className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <h2 className="text-sm font-bold text-[#24292f] dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
              <span>4. Competency Narrative & Scope</span>
            </h2>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-0.5">
              Technical summary of skills and capabilities certified by this credential.
            </p>
          </div>

          <div className="space-y-1.5">
            <textarea
              rows={4}
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Validates technical proficiency in designing resilient, highly available, secure, and cost-optimized distributed systems on AWS..."
              className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-sm text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
            />
          </div>
        </section>

        {/* Section 5: Connected Evidence Graph */}
        <section className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 sm:p-6 space-y-5 shadow-xs">
          <div className="border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <h2 className="text-sm font-bold text-[#24292f] dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#8957e5] dark:text-[#a371f7]" />
              <span>5. Connected Evidence Graph</span>
            </h2>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-0.5">
              Map this credential to canonical skills, technologies, experiences, and projects.
            </p>
          </div>

          {/* Validated Skills Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#8957e5] dark:text-[#a371f7]" />
                <span>Validated Skills ({formData.related_skills?.length || 0} selected)</span>
              </span>
            </label>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] max-h-40 overflow-y-auto">
              {allSkills.map((sk) => {
                const selected = formData.related_skills?.includes(sk.id!);
                return (
                  <button
                    key={sk.id}
                    type="button"
                    onClick={() => handleToggleArrayId("related_skills", sk.id!)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                      selected
                        ? "bg-[#0969da] text-white dark:bg-[#58a6ff] dark:text-[#0d1117] font-semibold"
                        : "bg-white dark:bg-[#161b22] text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d] hover:text-[#0969da] dark:hover:text-[#58a6ff]"
                    }`}
                  >
                    {sk.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Technologies Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#0969da] dark:text-[#58a6ff]" />
                <span>Associated Technologies ({formData.related_technologies?.length || 0} selected)</span>
              </span>
            </label>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117] max-h-40 overflow-y-auto">
              {allTechnologies.map((tech) => {
                const selected = formData.related_technologies?.includes(tech.id!);
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => handleToggleArrayId("related_technologies", tech.id!)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                      selected
                        ? "bg-[#0969da] text-white dark:bg-[#58a6ff] dark:text-[#0d1117] font-semibold"
                        : "bg-white dark:bg-[#161b22] text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d] hover:text-[#0969da] dark:hover:text-[#58a6ff]"
                    }`}
                  >
                    {tech.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Experience Records */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#1a7f37] dark:text-[#3fb950]" />
                <span>Applied in Work Roles ({formData.related_experiences?.length || 0} selected)</span>
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117]">
              {allExperiences.map((exp) => {
                const selected = formData.related_experiences?.includes(exp.id!);
                return (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => handleToggleArrayId("related_experiences", exp.id!)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-colors cursor-pointer border ${
                      selected
                        ? "border-[#0969da] bg-[#0969da]/10 dark:border-[#58a6ff] dark:bg-[#58a6ff]/10 text-[#0969da] dark:text-[#58a6ff] font-semibold"
                        : "border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] text-[#57606a] dark:text-[#8b949e]"
                    }`}
                  >
                    <div className="font-bold text-[#24292f] dark:text-[#f0f6fc]">{exp.title}</div>
                    <div className="text-[11px] font-mono mt-0.5">{exp.company_detail?.name || "Company"}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-[#0969da] dark:text-[#58a6ff]" />
                <span>Demonstrated in Projects ({formData.related_projects?.length || 0} selected)</span>
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#0d1117]">
              {allProjects.map((proj) => {
                const selected = formData.related_projects?.includes(proj.id!);
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => handleToggleArrayId("related_projects", proj.id!)}
                    className={`p-2.5 rounded-lg text-left text-xs transition-colors cursor-pointer border ${
                      selected
                        ? "border-[#0969da] bg-[#0969da]/10 dark:border-[#58a6ff] dark:bg-[#58a6ff]/10 text-[#0969da] dark:text-[#58a6ff] font-semibold"
                        : "border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] text-[#57606a] dark:text-[#8b949e]"
                    }`}
                  >
                    <div className="font-bold text-[#24292f] dark:text-[#f0f6fc] truncate">{proj.title}</div>
                    <div className="text-[11px] font-mono mt-0.5 capitalize">{proj.project_type || "Project"}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 6: Staff-Only Private Career Intelligence */}
        <section className="rounded-2xl border border-[#d97706]/40 dark:border-[#f59e0b]/40 bg-[#fff8c5]/20 dark:bg-[#d97706]/5 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="border-b border-[#d97706]/30 dark:border-[#f59e0b]/30 pb-3">
            <h2 className="text-sm font-bold text-[#9a6700] dark:text-[#d29922] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#d97706] dark:text-[#f59e0b]" />
              <span>6. Visibility & Private Career Intelligence (Staff-Only)</span>
            </h2>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-0.5">
              These fields are server-masked and NEVER rendered on public pages or exposed to non-staff API clients.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono text-[#24292f] dark:text-[#f0f6fc]">
                <input
                  type="checkbox"
                  checked={formData.is_published ?? true}
                  onChange={(e) => handleChange("is_published", e.target.checked)}
                  className="rounded border-[#d0d7de] dark:border-[#30363d] text-[#0969da] focus:ring-0 cursor-pointer"
                />
                <span>Published on Public Portfolio</span>
              </label>
            </div>

            <div>
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono text-[#24292f] dark:text-[#f0f6fc]">
                <input
                  type="checkbox"
                  checked={formData.is_featured ?? true}
                  onChange={(e) => handleChange("is_featured", e.target.checked)}
                  className="rounded border-[#d0d7de] dark:border-[#30363d] text-[#0969da] focus:ring-0 cursor-pointer"
                />
                <span>Featured Credential</span>
              </label>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Display Sort Order
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
                placeholder="e.g. Cloud Architecture, DevOps, Platform Engineering"
                className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] text-xs text-[#24292f] dark:text-[#f0f6fc]"
              />
              <button
                type="button"
                onClick={handleAddTargetRole}
                className="px-3 py-1.5 rounded-lg bg-[#21262d] text-white hover:bg-black text-xs font-mono font-semibold cursor-pointer"
              >
                Add Role
              </button>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="space-y-1.5 pt-2 border-t border-[#d97706]/20">
            <label className="block text-xs font-mono font-semibold text-[#9a6700] dark:text-[#d29922]">
              Staff Internal Notes & Exam Intelligence
            </label>
            <textarea
              rows={3}
              value={formData.internal_notes || ""}
              onChange={(e) => handleChange("internal_notes", e.target.value)}
              placeholder="Confidential exam scores, verification notes, renewal dates, or interview talking points..."
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] text-xs text-[#24292f] dark:text-[#f0f6fc]"
            />
          </div>
        </section>
      </form>

      {/* Live Preview Modal */}
      <CertificationPreviewModal
        cert={previewCert}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        isDirty={isDirty}
      />
    </div>
  );
}
