"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Briefcase,
  MapPin,
  Mail,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  X,
  FileText,
  ShieldCheck,
  Globe,
  Loader2,
  Eye,
  Check,
} from "lucide-react";
import { getProfileSettings, updateProfileSettings } from "@/lib/api/admin-client";
import { ProfilePreviewModal } from "@/components/profile/ProfilePreviewModal";
import type { SiteSettings } from "@/lib/api/types";

export default function ProfileManagementPage() {
  const [initialData, setInitialData] = useState<SiteSettings | null>(null);
  const [formData, setFormData] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Input states for chip additions
  const [newFocusInput, setNewFocusInput] = useState("");
  const [newRoleInput, setNewRoleInput] = useState("");

  // Load canonical profile data
  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        const data = await getProfileSettings();
        setInitialData(data);
        setFormData(data);
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to load canonical profile data.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  // Compute dirty state
  const isDirty =
    Boolean(initialData && formData) &&
    JSON.stringify(initialData) !== JSON.stringify(formData);

  // Field change handler
  const handleFieldChange = (field: keyof SiteSettings, value: any) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [field]: value,
    });
    setSaveSuccess(false);
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Add tag to engineering_focus
  const handleAddFocus = () => {
    if (!formData || !newFocusInput.trim()) return;
    const trimmed = newFocusInput.trim();
    if (!formData.engineering_focus.includes(trimmed)) {
      handleFieldChange("engineering_focus", [...formData.engineering_focus, trimmed]);
    }
    setNewFocusInput("");
  };

  // Remove tag from engineering_focus
  const handleRemoveFocus = (tag: string) => {
    if (!formData) return;
    handleFieldChange(
      "engineering_focus",
      formData.engineering_focus.filter((t) => t !== tag)
    );
  };

  // Add tag to target_roles
  const handleAddRole = () => {
    if (!formData || !newRoleInput.trim()) return;
    const trimmed = newRoleInput.trim();
    const currentRoles = formData.target_roles || [];
    if (!currentRoles.includes(trimmed)) {
      handleFieldChange("target_roles", [...currentRoles, trimmed]);
    }
    setNewRoleInput("");
  };

  // Remove tag from target_roles
  const handleRemoveRole = (role: string) => {
    if (!formData) return;
    const currentRoles = formData.target_roles || [];
    handleFieldChange(
      "target_roles",
      currentRoles.filter((r) => r !== role)
    );
  };

  // Reset form to canonical state
  const handleReset = () => {
    if (initialData) {
      setFormData({ ...initialData });
      setErrorMessage(null);
      setFieldErrors({});
      setSaveSuccess(false);
    }
  };

  // Save changes to backend
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    // Client validation
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Professional name is required.";
    if (!formData.title.trim()) errors.title = "Professional headline is required.";
    if (!formData.email.trim()) errors.email = "Email address is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage("Please resolve the highlighted validation errors.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);
      setFieldErrors({});

      const payload: Partial<SiteSettings> = {
        name: formData.name,
        title: formData.title,
        location: formData.location,
        tagline: formData.tagline,
        summary: formData.summary,
        engineering_focus: formData.engineering_focus,
        open_to_work: formData.open_to_work,
        target_roles: formData.target_roles || [],
        email: formData.email,
        github_url: formData.github_url,
        linkedin_url: formData.linkedin_url,
        twitter_url: formData.twitter_url,
        avatar_url: formData.avatar_url,
      };

      const updated = await updateProfileSettings(payload);
      setInitialData(updated);
      setFormData(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to persist profile changes to PostgreSQL.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#0969da] dark:text-[#58a6ff]" />
        <p className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
          Loading canonical profile data from PostgreSQL...
        </p>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="p-6 rounded-2xl bg-[#fff8c5] dark:bg-[#382800] border border-[#d4a72c] text-xs font-mono text-[#24292f] dark:text-[#f0f6fc]">
        Failed to load profile record. Check backend connection.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header & Sticky Action Toolbar */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-8 px-4 sm:px-8 py-3 bg-[#f6f8fa]/95 dark:bg-[#0d1117]/95 backdrop-blur-md border-b border-[#d0d7de] dark:border-[#30363d] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#24292f] dark:text-[#f0f6fc] truncate">
              Profile Management
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-[#0969da]/10 text-[#0969da] dark:bg-[#58a6ff]/15 dark:text-[#58a6ff] shrink-0">
              V2.1 Control Plane
            </span>
          </div>
          <p className="text-xs text-[#57606a] dark:text-[#8b949e] font-sans truncate">
            Authoritative source of truth for identity, positioning, availability, and social links.
          </p>
        </div>

        {/* Action Controls - Guaranteed single row on desktop */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
          {/* Status Indicator */}
          {isDirty ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono font-medium bg-[#fff8c5] dark:bg-[#382800] text-[#9a6700] dark:text-[#f2cc60] border border-[#d4a72c]/40 shrink-0 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-[#d4a72c] animate-pulse" />
              Unsaved changes
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono font-medium bg-[#dafbe1] dark:bg-[#112a1c] text-[#1a7f37] dark:text-[#3fb950] border border-[#4ac26b]/30 shrink-0 whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5" />
              Canonical sync active
            </span>
          )}

          {/* Discard Button */}
          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty || isSaving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Discard
          </button>

          {/* Preview Button */}
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium border border-[#0969da]/40 dark:border-[#58a6ff]/40 bg-[#0969da]/5 dark:bg-[#58a6ff]/10 text-[#0969da] dark:text-[#58a6ff] hover:bg-[#0969da]/10 dark:hover:bg-[#58a6ff]/20 transition-all font-mono shrink-0 whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          {/* Save Profile Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-[#0969da] text-white hover:bg-[#085ac1] disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all font-mono shrink-0 whitespace-nowrap"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-[#dafbe1] dark:bg-[#112a1c] border border-[#4ac26b]/40 flex items-center justify-between text-xs text-[#1a7f37] dark:text-[#3fb950] font-sans">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Profile successfully updated in PostgreSQL and synchronized to public API.</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccess(false)}
            className="text-[#1a7f37] dark:text-[#3fb950] hover:opacity-75"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#ffebe9] dark:bg-[#3d1416] border border-[#ff8182]/40 flex items-center justify-between text-xs text-[#cf222e] dark:text-[#ff7b72] font-sans">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-[#cf222e] dark:text-[#ff7b72] hover:opacity-75"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Full-Width Editor Form */}
      <div className="space-y-6">
        {/* Section 1: Professional Identity */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#d0d7de]/60 dark:border-[#30363d]/60">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
              <h2 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
                1. Professional Identity
              </h2>
            </div>
            <span className="text-[11px] text-[#57606a] dark:text-[#8b949e]">
              Public Hero Information
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                Professional Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                placeholder="e.g. Harsh Tripathi"
                className={`w-full px-3.5 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border ${
                  fieldErrors.name
                    ? "border-red-500"
                    : "border-[#d0d7de] dark:border-[#30363d]"
                } text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] transition-colors font-sans`}
              />
              {fieldErrors.name && (
                <p className="text-[11px] text-red-500 font-mono">{fieldErrors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                Professional Headline / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                placeholder="e.g. Backend & Cloud Engineer"
                className={`w-full px-3.5 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border ${
                  fieldErrors.title
                    ? "border-red-500"
                    : "border-[#d0d7de] dark:border-[#30363d]"
                } text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] transition-colors font-sans`}
              />
              {fieldErrors.title && (
                <p className="text-[11px] text-red-500 font-mono">{fieldErrors.title}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleFieldChange("location", e.target.value)}
                placeholder="e.g. Tokyo, Japan"
                className="w-full px-3.5 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                Primary Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                placeholder="e.g. harsh@example.com"
                className={`w-full px-3.5 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border ${
                  fieldErrors.email
                    ? "border-red-500"
                    : "border-[#d0d7de] dark:border-[#30363d]"
                } text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] font-mono`}
              />
              {fieldErrors.email && (
                <p className="text-[11px] text-red-500 font-mono">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                Elevator Tagline
              </label>
              <textarea
                rows={2}
                value={formData.tagline}
                onChange={(e) => handleFieldChange("tagline", e.target.value)}
                placeholder="Concise, 1-2 sentence engineering value proposition (e.g. 3 Years of Backend Engineering Experience building high-throughput systems)."
                className="w-full px-3.5 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] font-sans leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Positioning & Bio */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#d0d7de]/60 dark:border-[#30363d]/60">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
              <h2 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
                2. Professional Positioning & Bio
              </h2>
            </div>
            <span className="text-[11px] text-[#57606a] dark:text-[#8b949e]">
              Engineering Narrative & Focus
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                Narrative Bio Summary
              </label>
              <textarea
                rows={4}
                value={formData.summary}
                onChange={(e) => handleFieldChange("summary", e.target.value)}
                placeholder="Comprehensive overview of your technical background, engineering philosophies, distributed architecture experience, and system-level focus."
                className="w-full px-3.5 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] font-sans leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                  Engineering Focus Specializations
                </label>
                <span className="text-[10px] font-mono text-[#57606a] dark:text-[#8b949e]">
                  Structured Array • Public Presentation
                </span>
              </div>

              {/* Tag Chips Display */}
              <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de]/60 dark:border-[#30363d]/60 min-h-[48px] items-center">
                {formData.engineering_focus.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] text-xs font-mono text-[#24292f] dark:text-[#c9d1d9] shadow-2xs group"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFocus(tag)}
                      aria-label={`Remove focus ${tag}`}
                      className="text-[#57606a] dark:text-[#8b949e] hover:text-red-500 dark:hover:text-red-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                {formData.engineering_focus.length === 0 && (
                  <span className="text-xs text-[#57606a] dark:text-[#8b949e] italic font-sans">
                    No engineering focus specializations added yet.
                  </span>
                )}
              </div>

              {/* Tag Input Add Form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFocusInput}
                  onChange={(e) => setNewFocusInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFocus();
                    }
                  }}
                  placeholder="e.g. Distributed Systems, AWS Cloud, Kubernetes, Celery Queues"
                  className="flex-1 px-3.5 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddFocus}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-white dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Focus
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Career Availability & Preferences */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#d0d7de]/60 dark:border-[#30363d]/60">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
              <h2 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
                3. Career Availability & Preferences
              </h2>
            </div>
            <span className="text-[11px] text-[#57606a] dark:text-[#8b949e]">
              Opportunity Status & Target Roles
            </span>
          </div>

          <div className="space-y-4">
            {/* Open to Work Toggle Card */}
            <div className="p-4 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/50 dark:bg-[#0d1117]/50 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#24292f] dark:text-[#f0f6fc]">
                    Open to New Opportunities
                  </span>
                  {formData.open_to_work ? (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-[#1f883d]/10 text-[#1f883d] dark:bg-[#39d353]/15 dark:text-[#39d353]">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-[#57606a]/10 text-[#57606a] dark:bg-[#8b949e]/15 dark:text-[#8b949e]">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#57606a] dark:text-[#8b949e]">
                  Controls the live availability badge on the public portfolio header and JSON Resume.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={formData.open_to_work}
                  onChange={(e) => handleFieldChange("open_to_work", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#d0d7de] dark:bg-[#30363d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1f883d] dark:peer-checked:bg-[#238636]"></div>
              </label>
            </div>

            {/* Target Roles (Private Career Data) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                  Target Career Roles
                </label>
                <span className="text-[10px] font-mono text-[#0969da] dark:text-[#58a6ff]">
                  Private Career Preference Data
                </span>
              </div>
              <p className="text-[11px] text-[#57606a] dark:text-[#8b949e] font-sans">
                Internal career preference data stored canonically in PostgreSQL. Excluded from anonymous public API responses.
              </p>

              {/* Roles Chips Display */}
              <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de]/60 dark:border-[#30363d]/60 min-h-[48px] items-center">
                {(formData.target_roles || []).map((role, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-[#21262d] border border-[#0969da]/30 dark:border-[#58a6ff]/30 text-xs font-mono text-[#0969da] dark:text-[#58a6ff] shadow-2xs group"
                  >
                    <span>{role}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(role)}
                      aria-label={`Remove role ${role}`}
                      className="text-[#57606a] dark:text-[#8b949e] hover:text-red-500 dark:hover:text-red-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                {(!formData.target_roles || formData.target_roles.length === 0) && (
                  <span className="text-xs text-[#57606a] dark:text-[#8b949e] italic font-sans">
                    No target roles specified.
                  </span>
                )}
              </div>

              {/* Tag Input Add Form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRoleInput}
                  onChange={(e) => setNewRoleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddRole();
                    }
                  }}
                  placeholder="e.g. Backend Engineering, Cloud Architecture, Platform Engineering"
                  className="flex-1 px-3.5 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddRole}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-white dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Role
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Contact & Online Presence */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#d0d7de]/60 dark:border-[#30363d]/60">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
              <h2 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
                4. Contact & Online Presence
              </h2>
            </div>
            <span className="text-[11px] text-[#57606a] dark:text-[#8b949e]">
              Public Links & Social Channels
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => handleFieldChange("github_url", e.target.value)}
                placeholder="https://github.com/Harsh324"
                className="w-full px-3.5 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => handleFieldChange("linkedin_url", e.target.value)}
                placeholder="https://linkedin.com/in/harsh324"
                className="w-full px-3.5 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                X / Twitter Profile URL
              </label>
              <input
                type="url"
                value={formData.twitter_url}
                onChange={(e) => handleFieldChange("twitter_url", e.target.value)}
                placeholder="https://x.com/harsh324"
                className="w-full px-3.5 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={formData.avatar_url}
                onChange={(e) => handleFieldChange("avatar_url", e.target.value)}
                placeholder="https://github.com/Harsh324.png"
                className="w-full px-3.5 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Active Resume Reference (Read-Only) */}
        <div className="p-5 rounded-2xl bg-[#f6f8fa]/60 dark:bg-[#0d1117]/60 border border-[#d0d7de] dark:border-[#30363d] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#8957e5] dark:text-[#a371f7]" />
              <h4 className="text-xs font-bold text-[#24292f] dark:text-[#f0f6fc]">
                Active Resume Reference
              </h4>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-[#8957e5]/10 text-[#8957e5] dark:bg-[#a371f7]/15 dark:text-[#a371f7]">
                Milestone V3.0
              </span>
            </div>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e]">
              Resume compilation, LaTeX editing, and variant generation are managed in Milestone V3.0 (Resume Studio).
            </p>
          </div>

          {formData.resume_url ? (
            <a
              href={formData.resume_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-xs font-mono font-semibold text-[#0969da] dark:text-[#58a6ff] hover:underline flex-shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Current Resume PDF
            </a>
          ) : (
            <span className="text-xs font-mono text-[#57606a] dark:text-[#8b949e] italic flex-shrink-0">
              No resume PDF link configured.
            </span>
          )}
        </div>
      </div>

      {/* On-Demand Preview Modal */}
      <ProfilePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={formData}
        isDraft={isDirty}
      />
    </div>
  );
}
