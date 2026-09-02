"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  RotateCcw,
  Image as ImageIcon,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FolderGit2,
  Briefcase,
  Award,
  GraduationCap,
  Cpu,
  Trash2,
  AlertCircle,
  Plus,
  X,
  ExternalLink,
} from "lucide-react";
import type {
  MediaAsset,
  MediaAssetType,
  Project,
  Experience,
  Certification,
  Education,
  Skill,
} from "@/lib/api/types";
import {
  createAdminMediaAsset,
  updateAdminMediaAsset,
  deleteAdminMediaAsset,
  getAdminProjects,
  getAdminExperiences,
  getAdminCertifications,
  getAdminEducation,
  getAdminSkills,
} from "@/lib/api/admin-client";
import { MediaPreviewModal, formatBytes } from "./MediaPreviewModal";

interface MediaEditorFormProps {
  initialAsset?: MediaAsset;
  isNew?: boolean;
}

const ASSET_TYPE_OPTIONS: Array<{ value: MediaAssetType; label: string; description: string }> = [
  { value: "project_image", label: "Project Screenshot / Visual", description: "UI screenshots, mockups, or project visuals" },
  { value: "architecture_diagram", label: "Architecture / System Diagram", description: "System topology, data pipelines, AWS architecture" },
  { value: "project_logo", label: "Project Logo / Icon", description: "Project brand marks and vector icons" },
  { value: "certification", label: "Certification Badge / Credential", description: "AWS, Kubernetes, or technical certificate badges" },
  { value: "education", label: "Education / Degree / Diploma", description: "Diplomas, transcripts, graduation documentation" },
  { value: "company_logo", label: "Company Logo", description: "Employer and client organizational logos" },
  { value: "resume", label: "Resume / CV Document", description: "PDF resumes and tailored CV exports" },
  { value: "document", label: "Technical Document / Whitepaper", description: "RFCs, design docs, research papers" },
  { value: "profile", label: "Profile Image / Avatar", description: "Professional headshots and profile avatars" },
  { value: "social_preview", label: "Social Preview / OpenGraph Card", description: "Twitter cards and LinkedIn share previews" },
  { value: "other", label: "Other Asset", description: "Miscellaneous media or downloadables" },
];

export function MediaEditorForm({ initialAsset, isNew = false }: MediaEditorFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<MediaAsset>>({
    title: initialAsset?.title || "",
    slug: initialAsset?.slug || "",
    asset_type: initialAsset?.asset_type || "project_image",
    file_url: initialAsset?.file_url || "",
    external_url: initialAsset?.external_url || "",
    original_filename: initialAsset?.original_filename || "",
    mime_type: initialAsset?.mime_type || "",
    file_size: initialAsset?.file_size || 0,
    width: initialAsset?.width ?? null,
    height: initialAsset?.height ?? null,
    alt_text: initialAsset?.alt_text || "",
    caption: initialAsset?.caption || "",
    description: initialAsset?.description || "",
    tags: initialAsset?.tags || [],
    is_published: initialAsset ? initialAsset.is_published : true,
    is_featured: initialAsset ? initialAsset.is_featured : false,
    display_order: initialAsset?.display_order || 0,
    related_projects: initialAsset?.related_projects || [],
    related_experiences: initialAsset?.related_experiences || [],
    related_certifications: initialAsset?.related_certifications || [],
    related_education: initialAsset?.related_education || [],
    related_skills: initialAsset?.related_skills || [],
    target_roles: initialAsset?.target_roles || [],
    internal_notes: initialAsset?.internal_notes || "",
  });

  // Selected File for Upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>(initialAsset?.file_url || "");

  // Tag Inputs
  const [tagInput, setTagInput] = useState("");
  const [roleInput, setRoleInput] = useState("");

  // Relational Entities state
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [experiencesList, setExperiencesList] = useState<Experience[]>([]);
  const [certificationsList, setCertificationsList] = useState<Certification[]>([]);
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [skillsList, setSkillsList] = useState<Skill[]>([]);

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Load relational entities for associations
  useEffect(() => {
    async function loadEntities() {
      try {
        const [proj, exp, cert, edu, sk] = await Promise.all([
          getAdminProjects().catch(() => []),
          getAdminExperiences().catch(() => []),
          getAdminCertifications().catch(() => []),
          getAdminEducation().catch(() => []),
          getAdminSkills().catch(() => []),
        ]);
        setProjectsList(proj);
        setExperiencesList(exp);
        setCertificationsList(cert);
        setEducationList(edu);
        setSkillsList(sk);
      } catch {
        // Soft fail
      }
    }
    loadEntities();
  }, []);

  // Auto-slugify on title change if new
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, title: val };
      if (isNew) {
        updated.slug = val
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
      return updated;
    });
  };

  // Handle file selection
  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setFilePreviewUrl(objectUrl);

    setFormData((prev) => ({
      ...prev,
      original_filename: file.name,
      mime_type: file.type || prev.mime_type || "application/octet-stream",
      file_size: file.size,
      title: prev.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
    }));

    // If image, attempt client-side dimension extraction for preview
    if (file.type.startsWith("image/")) {
      const img = new Image();
      img.onload = () => {
        setFormData((prev) => ({
          ...prev,
          width: img.width,
          height: img.height,
        }));
      };
      img.src = objectUrl;
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Tag helper
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const clean = tagInput.trim();
    if (!formData.tags?.includes(clean)) {
      setFormData((prev) => ({ ...prev, tags: [...(prev.tags || []), clean] }));
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags?.filter((t) => t !== tag) || [] }));
  };

  // Role helper
  const handleAddRole = () => {
    if (!roleInput.trim()) return;
    const clean = roleInput.trim();
    if (!formData.target_roles?.includes(clean)) {
      setFormData((prev) => ({ ...prev, target_roles: [...(prev.target_roles || []), clean] }));
    }
    setRoleInput("");
  };

  const handleRemoveRole = (role: string) => {
    setFormData((prev) => ({ ...prev, target_roles: prev.target_roles?.filter((r) => r !== role) || [] }));
  };

  // ManyToMany toggles
  const toggleRelation = (
    field: "related_projects" | "related_experiences" | "related_certifications" | "related_education" | "related_skills",
    id: number
  ) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      const updated = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      return { ...prev, [field]: updated };
    });
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!formData.title?.trim()) {
        throw new Error("Asset title is required.");
      }

      if (isNew && !selectedFile && !formData.external_url) {
        throw new Error("Please upload a file or specify an external URL.");
      }

      // Build payload: use FormData if a file is uploaded
      let payload: FormData | Partial<MediaAsset>;
      if (selectedFile) {
        const data = new FormData();
        data.append("title", formData.title || "");
        if (formData.slug) data.append("slug", formData.slug);
        data.append("asset_type", formData.asset_type || "project_image");
        data.append("file", selectedFile);
        if (formData.external_url) data.append("external_url", formData.external_url);
        data.append("alt_text", formData.alt_text || "");
        data.append("caption", formData.caption || "");
        data.append("description", formData.description || "");
        data.append("is_published", String(formData.is_published));
        data.append("is_featured", String(formData.is_featured));
        data.append("display_order", String(formData.display_order || 0));
        data.append("tags", JSON.stringify(formData.tags || []));
        data.append("target_roles", JSON.stringify(formData.target_roles || []));
        data.append("internal_notes", formData.internal_notes || "");

        // Relational IDs
        data.append("related_projects", JSON.stringify(formData.related_projects || []));
        data.append("related_experiences", JSON.stringify(formData.related_experiences || []));
        data.append("related_certifications", JSON.stringify(formData.related_certifications || []));
        data.append("related_education", JSON.stringify(formData.related_education || []));
        data.append("related_skills", JSON.stringify(formData.related_skills || []));

        payload = data;
      } else {
        payload = {
          ...formData,
        };
      }

      let savedAsset: MediaAsset;
      if (isNew) {
        savedAsset = await createAdminMediaAsset(payload);
        setSuccessMessage("Media asset created successfully.");
        setTimeout(() => {
          router.push(`/dashboard/media/${savedAsset.slug}`);
        }, 800);
      } else {
        const slug = initialAsset?.slug || formData.slug || "";
        savedAsset = await updateAdminMediaAsset(slug, payload);
        setFormData((prev) => ({ ...prev, ...savedAsset }));
        setSuccessMessage("Media asset updated successfully.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save media asset.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    if (!initialAsset?.slug) return;
    setIsDeleting(true);
    try {
      await deleteAdminMediaAsset(initialAsset.slug);
      router.push("/dashboard/media");
    } catch (err: any) {
      setError(err.message || "Failed to delete media asset.");
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const isImage =
    formData.mime_type?.startsWith("image/") ||
    (formData.original_filename &&
      /\.(png|jpg|jpeg|webp|gif|svg|avif)$/i.test(formData.original_filename));

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/media"
            className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {isNew ? "New Media Asset" : `Edit Asset: ${formData.title || formData.slug}`}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-0.5">
              PostgreSQL Canonical Media Record • Milestone V2.6
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </button>

          {!isNew && (
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}

          <button
            type="submit"
            form="media-asset-form"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving..." : isNew ? "Create Asset" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form id="media-asset-form" onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: File & Binary Storage */}
        <div className="p-6 rounded-xl bg-card border border-border space-y-6">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-border">
            <UploadCloud className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">1. File & Binary Storage</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Drag and Drop Zone (7 cols) */}
            <div className="md:col-span-7">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 text-center ${
                  dragOver
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-border hover:border-primary/50 hover:bg-muted/30 bg-muted/10"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />
                <UploadCloud className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground">
                  Click to select file or drag & drop here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports PNG, JPG, WebP, SVG, GIF, PDF, DOCX, ZIP (up to 50MB)
                </p>
              </div>

              {/* External URL option */}
              <div className="mt-4 space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5" /> External URL / CDN Reference (Optional)
                </label>
                <input
                  type="url"
                  value={formData.external_url || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, external_url: e.target.value }))}
                  placeholder="https://assets.example.com/images/architecture.png"
                  className="w-full px-3 py-2 text-xs font-mono bg-muted/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* File Info & Thumbnail Preview (5 cols) */}
            <div className="md:col-span-5 p-4 rounded-xl bg-muted/20 border border-border space-y-4">
              <span className="text-xs font-mono uppercase text-muted-foreground">Attached Binary Specs</span>

              {filePreviewUrl ? (
                <div className="space-y-3">
                  {isImage ? (
                    <div className="w-full h-40 bg-zinc-950/60 rounded-lg flex items-center justify-center p-2 border border-border/60 overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={filePreviewUrl}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain rounded"
                      />
                      {formData.width && formData.height && (
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[10px] font-mono rounded bg-black/70 text-white backdrop-blur-sm">
                          {formData.width} × {formData.height} px
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-muted/30 rounded-lg flex flex-col items-center justify-center p-4 border border-border text-center">
                      <FileText className="w-10 h-10 text-primary mb-2" />
                      <p className="text-xs font-mono text-foreground truncate max-w-full">
                        {formData.original_filename || "Document File"}
                      </p>
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs font-mono text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Filename:</span>
                      <span className="text-foreground font-semibold truncate max-w-[160px]">
                        {formData.original_filename || "Not attached"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span className="text-foreground">{formatBytes(formData.file_size || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MIME:</span>
                      <span className="text-foreground truncate max-w-[160px]">{formData.mime_type || "auto-detected"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-center p-4 border border-dashed border-border rounded-lg text-muted-foreground text-xs font-mono">
                  No binary attached yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Asset Identity & Classification */}
        <div className="p-6 rounded-xl bg-card border border-border space-y-6">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-border">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">2. Asset Identity & Classification</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-mono text-muted-foreground">
                Asset Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title || ""}
                onChange={handleTitleChange}
                placeholder="e.g. AWS ECS Async Processing Architecture"
                className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground">
                Unique Slug <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.slug || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="aws-ecs-async-processing-architecture"
                className="w-full px-3 py-2 text-xs font-mono bg-muted/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground">
                Asset Taxonomy Type <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.asset_type || "project_image"}
                onChange={(e) => setFormData((prev) => ({ ...prev, asset_type: e.target.value as MediaAssetType }))}
                className="w-full px-3 py-2 text-xs font-mono bg-muted/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {ASSET_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-mono text-muted-foreground">Tags & Keywords</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="e.g. AWS, Architecture, Redis"
                  className="flex-1 px-3 py-1.5 text-xs bg-muted/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Metadata & Accessibility */}
        <div className="p-6 rounded-xl bg-card border border-border space-y-6">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-border">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">3. Metadata & Accessibility (WCAG 2.1)</h2>
          </div>

          <div className="space-y-4">
            {/* Alt Text Warning / Guide */}
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-medium text-foreground flex items-center gap-1.5">
                  <span>Alternative Text (Alt Text)</span>
                  {formData.alt_text ? (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">
                      WCAG Compliant
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono">
                      Recommended
                    </span>
                  )}
                </label>
              </div>
              <input
                type="text"
                value={formData.alt_text || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, alt_text: e.target.value }))}
                placeholder="Detailed description of what appears in the visual asset for screen readers and SEO"
                className="w-full px-3 py-2 text-xs bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-[11px] text-muted-foreground">
                Describe the key functional and technical elements visible in the graphic.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground">Caption</label>
                <input
                  type="text"
                  value={formData.caption || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, caption: e.target.value }))}
                  placeholder="Short visible caption below image"
                  className="w-full px-3 py-2 text-xs bg-muted/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-mono text-muted-foreground">Technical Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed breakdown of system architecture, diagram elements, or document purpose"
                  className="w-full px-3 py-2 text-xs bg-muted/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed font-sans"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Canonical Entity Associations */}
        <div className="p-6 rounded-xl bg-card border border-border space-y-6">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-border">
            <FolderGit2 className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">4. Canonical Entity Associations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Related Projects */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-blue-500" /> Linked Projects
              </label>
              <div className="max-h-40 overflow-y-auto p-2 rounded-lg bg-muted/20 border border-border space-y-1">
                {projectsList.map((proj) => {
                  const isChecked = formData.related_projects?.includes(proj.id);
                  return (
                    <label
                      key={proj.id}
                      className={`flex items-center space-x-2 p-1.5 rounded cursor-pointer text-xs font-mono transition-colors ${
                        isChecked ? "bg-blue-500/10 text-blue-500 font-semibold" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleRelation("related_projects", proj.id)}
                        className="rounded border-border text-primary focus:ring-primary/20"
                      />
                      <span className="truncate">{proj.title}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Related Experiences */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-purple-500" /> Linked Experiences
              </label>
              <div className="max-h-40 overflow-y-auto p-2 rounded-lg bg-muted/20 border border-border space-y-1">
                {experiencesList.map((exp) => {
                  const expId = exp.id || 0;
                  const isChecked = formData.related_experiences?.includes(expId);
                  return (
                    <label
                      key={expId}
                      className={`flex items-center space-x-2 p-1.5 rounded cursor-pointer text-xs font-mono transition-colors ${
                        isChecked ? "bg-purple-500/10 text-purple-500 font-semibold" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => expId && toggleRelation("related_experiences", expId)}
                        className="rounded border-border text-primary focus:ring-primary/20"
                      />
                      <span className="truncate">{exp.title} ({exp.company_detail?.name || ""})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Related Certifications */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" /> Linked Certifications
              </label>
              <div className="max-h-40 overflow-y-auto p-2 rounded-lg bg-muted/20 border border-border space-y-1">
                {certificationsList.map((cert) => {
                  const certId = cert.id || 0;
                  const isChecked = formData.related_certifications?.includes(certId);
                  return (
                    <label
                      key={certId}
                      className={`flex items-center space-x-2 p-1.5 rounded cursor-pointer text-xs font-mono transition-colors ${
                        isChecked ? "bg-amber-500/10 text-amber-500 font-semibold" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => certId && toggleRelation("related_certifications", certId)}
                        className="rounded border-border text-primary focus:ring-primary/20"
                      />
                      <span className="truncate">{cert.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Related Skills */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-500" /> Linked Skills
              </label>
              <div className="max-h-40 overflow-y-auto p-2 rounded-lg bg-muted/20 border border-border space-y-1">
                {skillsList.map((sk) => {
                  const skId = sk.id;
                  const isChecked = formData.related_skills?.includes(skId);
                  return (
                    <label
                      key={skId}
                      className={`flex items-center space-x-2 p-1.5 rounded cursor-pointer text-xs font-mono transition-colors ${
                        isChecked ? "bg-cyan-500/10 text-cyan-500 font-semibold" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleRelation("related_skills", skId)}
                        className="rounded border-border text-primary focus:ring-primary/20"
                      />
                      <span className="truncate">{sk.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Visibility & Publication */}
        <div className="p-6 rounded-xl bg-card border border-border space-y-6">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-border">
            <Eye className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">5. Visibility & Publication</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-muted/30 border border-border">
              <div>
                <span className="text-xs font-semibold text-foreground block">Publish Status</span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {formData.is_published ? "Visible on public APIs" : "Draft (Staff Only)"}
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_published: e.target.checked }))}
                className="w-4 h-4 rounded text-primary focus:ring-primary/20"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-muted/30 border border-border">
              <div>
                <span className="text-xs font-semibold text-foreground block">Featured Asset</span>
                <span className="text-[11px] text-muted-foreground font-mono">Highlight in media showcases</span>
              </div>
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))}
                className="w-4 h-4 rounded text-primary focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground">Display Order Priority</label>
              <input
                type="number"
                value={formData.display_order ?? 0}
                onChange={(e) => setFormData((prev) => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 text-xs font-mono bg-muted/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Section 6: Staff-only Intelligence */}
        <div className="p-6 rounded-xl bg-orange-500/5 border border-orange-500/20 space-y-6">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-orange-500/20">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h2 className="text-base font-semibold text-orange-500">6. Staff Career Intelligence (Private)</h2>
          </div>

          <p className="text-xs text-muted-foreground">
            The data in this section is strictly isolated from public endpoints and is never exposed to unauthenticated visitors.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground">Target Roles for this Asset</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddRole();
                    }
                  }}
                  placeholder="e.g. Senior Backend Engineer, Distributed Systems Architect"
                  className="flex-1 px-3 py-1.5 text-xs bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
                <button
                  type="button"
                  onClick={handleAddRole}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-colors"
                >
                  Add Role
                </button>
              </div>

              {formData.target_roles && formData.target_roles.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.target_roles.map((r, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono"
                    >
                      {r}
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(r)}
                        className="hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground">Internal Notes & Context</label>
              <textarea
                rows={3}
                value={formData.internal_notes || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, internal_notes: e.target.value }))}
                placeholder="Confidential context, architectural caveats, or interview discussion points"
                className="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 leading-relaxed font-sans"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 bg-card border border-border rounded-xl shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Confirm Asset Deletion
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete <strong className="text-foreground">{formData.title}</strong>? This will remove the canonical PostgreSQL record and associated file storage.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete Record"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      <MediaPreviewModal
        asset={
          {
            id: initialAsset?.id || 0,
            title: formData.title || "Untitled Asset",
            slug: formData.slug || "untitled-asset",
            asset_type: formData.asset_type || "project_image",
            file_url: filePreviewUrl,
            original_filename: formData.original_filename || "preview_file",
            mime_type: formData.mime_type || "image/png",
            file_size: formData.file_size || 0,
            width: formData.width,
            height: formData.height,
            is_image: isImage || false,
            is_document: !isImage,
            alt_text: formData.alt_text || "",
            caption: formData.caption,
            description: formData.description,
            tags: formData.tags,
            is_published: formData.is_published ?? true,
            is_featured: formData.is_featured ?? false,
            display_order: formData.display_order || 0,
            target_roles: formData.target_roles,
            internal_notes: formData.internal_notes,
            created_at: initialAsset?.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as MediaAsset
        }
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
