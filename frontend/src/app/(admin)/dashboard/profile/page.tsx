"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
} from "lucide-react";
import { getProfileSettings, updateProfileSettings } from "@/lib/api/admin-client";
import type { SiteSettings } from "@/lib/api/types";

export default function ProfileManagementPage() {
  const [initialData, setInitialData] = useState<SiteSettings | null>(null);
  const [formData, setFormData] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header & Sticky Action Toolbar */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-8 px-4 sm:px-8 py-3 bg-[#f6f8fa]/95 dark:bg-[#0d1117]/95 backdrop-blur-md border-b border-[#d0d7de] dark:border-[#30363d] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#24292f] dark:text-[#f0f6fc]">
              Profile Management
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-[#0969da]/10 text-[#0969da] dark:bg-[#58a6ff]/15 dark:text-[#58a6ff]">
              V2.1 Control Plane
            </span>
          </div>
          <p className="text-xs text-[#57606a] dark:text-[#8b949e] font-sans">
            Authoritative source of truth for identity, positioning, availability, and social links.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          {isDirty ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[#fff8c5] dark:bg-[#382800] text-[#9a6700] dark:text-[#f2cc60] border border-[#d4a72c]/40">
              <span className="w-2 h-2 rounded-full bg-[#d4a72c] animate-pulse" />
              Unsaved changes
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[#dafbe1] dark:bg-[#112a1c] text-[#1a7f37] dark:text-[#3fb950] border border-[#4ac26b]/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Canonical sync active
            </span>
          )}

          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty || isSaving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Discard
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-[#0969da] text-white hover:bg-[#085ac1] disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all font-mono"
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

      {/* Main 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Editor Form Sections (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Professional Identity */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#d0d7de]/60 dark:border-[#30363d]/60">
              <User className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
              <h2 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
                1. Professional Identity
              </h2>
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
                  className={`w-full px-3 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border ${
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
                  className={`w-full px-3 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border ${
                    fieldErrors.title
                      ? "border-red-500"
                      : "border-[#d0d7de] dark:border-[#30363d]"
                  } text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] transition-colors font-sans`}
                />
                {fieldErrors.title && (
                  <p className="text-[11px] text-red-500 font-mono">{fieldErrors.title}</p>
                )}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleFieldChange("location", e.target.value)}
                  placeholder="e.g. Tokyo, Japan"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] transition-colors font-sans"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                  Elevator Tagline
                </label>
                <textarea
                  rows={2}
                  value={formData.tagline}
                  onChange={(e) => handleFieldChange("tagline", e.target.value)}
                  placeholder="Short one-line professional positioning..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] transition-colors font-sans resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Professional Positioning & Bio */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#d0d7de]/60 dark:border-[#30363d]/60">
              <FileText className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
              <h2 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
                2. Professional Positioning & Bio
              </h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                  Narrative Bio Summary
                </label>
                <textarea
                  rows={5}
                  value={formData.summary}
                  onChange={(e) => handleFieldChange("summary", e.target.value)}
                  placeholder="Detailed professional summary, technical focus, and recent accomplishments..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] transition-colors font-sans"
                />
              </div>

              {/* Engineering Focus Chips */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                  Engineering Focus Specializations (Structured Array)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.engineering_focus.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0969da]/10 dark:bg-[#58a6ff]/15 text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/20 dark:border-[#58a6ff]/30 text-xs font-mono font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveFocus(tag)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {formData.engineering_focus.length === 0 && (
                    <p className="text-xs text-[#57606a] dark:text-[#8b949e] font-mono italic">
                      No focus specializations defined.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
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
                    placeholder="e.g. Distributed Systems"
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddFocus}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#e1e4e8] dark:hover:bg-[#30363d]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Focus
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Career Availability & Preferences */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#d0d7de]/60 dark:border-[#30363d]/60">
              <Sparkles className="w-4 h-4 text-[#1f883d] dark:text-[#39d353]" />
              <h2 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
                3. Career Availability & Preferences
              </h2>
            </div>

            <div className="space-y-4">
              {/* Open to Work Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d]">
                <div>
                  <h3 className="text-xs font-bold text-[#24292f] dark:text-[#f0f6fc]">
                    Open to Opportunities Status
                  </h3>
                  <p className="text-[11px] text-[#57606a] dark:text-[#8b949e]">
                    Controls whether the public portfolio displays your active availability status.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.open_to_work}
                    onChange={(e) => handleFieldChange("open_to_work", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#d0d7de] peer-focus:outline-none rounded-full peer dark:bg-[#30363d] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1f883d] dark:peer-checked:bg-[#238636]"></div>
                </label>
              </div>

              {/* Target Roles Tags (Career Preference Data) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                    Target Career Roles (Private Career Data)
                  </label>
                  <span className="text-[10px] font-mono text-[#57606a] dark:text-[#8b949e]">
                    Private Control Plane Only
                  </span>
                </div>
                <p className="text-[11px] text-[#57606a] dark:text-[#8b949e]">
                  Structured career preference stored for dashboard tracking and future resume matching.
                </p>

                <div className="flex flex-wrap gap-2 mb-2">
                  {(formData.target_roles || []).map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#8957e5]/10 dark:bg-[#a371f7]/15 text-[#8957e5] dark:text-[#a371f7] border border-[#8957e5]/20 dark:border-[#a371f7]/30 text-xs font-mono font-medium"
                    >
                      {role}
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(role)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {(!formData.target_roles || formData.target_roles.length === 0) && (
                    <p className="text-xs text-[#57606a] dark:text-[#8b949e] font-mono italic">
                      No target career roles defined.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
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
                    placeholder="e.g. Backend Engineering"
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddRole}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#c9d1d9] hover:bg-[#e1e4e8] dark:hover:bg-[#30363d]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Role
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Contact & Social Online Presence */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#d0d7de]/60 dark:border-[#30363d]/60">
              <Globe className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
              <h2 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
                4. Contact & Online Presence
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                  Primary Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  placeholder="tripathiharsh324@gmail.com"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#24292f] dark:text-[#c9d1d9]">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => handleFieldChange("github_url", e.target.value)}
                  placeholder="https://github.com/Harsh324"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] font-mono"
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
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] font-mono"
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
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] font-mono"
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
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-[#24292f] dark:text-[#f0f6fc] focus:outline-none focus:ring-1 focus:ring-[#0969da] font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Focused Live Profile Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-20 space-y-6">
            {/* Live Profile Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#d0d7de]/60 dark:border-[#30363d]/60">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-[#57606a] dark:text-[#8b949e]">
                    Focused Live Preview
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#57606a] dark:text-[#8b949e]">
                  Reactivity: Active
                </span>
              </div>

              {/* Avatar + Identity */}
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#21262d] flex-shrink-0">
                  {formData.avatar_url ? (
                    <Image
                      src={formData.avatar_url}
                      alt={formData.name || "Avatar"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-lg text-[#57606a] dark:text-[#8b949e]">
                      {formData.name.charAt(0) || "U"}
                    </div>
                  )}
                </div>

                <div className="space-y-1 min-w-0">
                  <h4 className="text-base font-bold text-[#24292f] dark:text-[#f0f6fc] truncate">
                    {formData.name || "Your Name"}
                  </h4>
                  <p className="text-xs font-semibold text-[#0969da] dark:text-[#58a6ff] font-mono truncate">
                    {formData.title || "Your Professional Title"}
                  </p>
                  <p className="text-[11px] text-[#57606a] dark:text-[#8b949e] line-clamp-2">
                    {formData.tagline || "Your elevator tagline..."}
                  </p>
                </div>
              </div>

              {/* Availability Status Badge Preview */}
              {formData.open_to_work ? (
                <div className="rounded-xl border border-[#1f883d]/30 dark:border-[#39d353]/30 bg-[#1f883d]/10 dark:bg-[#238636]/20 px-3 py-2 text-xs font-mono text-[#1f883d] dark:text-[#39d353] flex items-center gap-2">
                  <span className="relative flex h-2 w-2 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39d353] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1f883d] dark:bg-[#39d353]" />
                  </span>
                  <span className="font-semibold">Open to Backend & Cloud Roles</span>
                </div>
              ) : (
                <div className="rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#21262d] px-3 py-2 text-xs font-mono text-[#57606a] dark:text-[#8b949e] flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#57606a] dark:bg-[#8b949e]" />
                  <span>Not Actively Looking</span>
                </div>
              )}

              {/* Location & Contact Meta */}
              <div className="space-y-2 text-xs text-[#57606a] dark:text-[#8b949e] border-t border-[#d0d7de]/60 dark:border-[#30363d]/60 pt-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{formData.location || "Location not set"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-mono text-[#24292f] dark:text-[#c9d1d9]">
                    {formData.email || "email@example.com"}
                  </span>
                </div>
              </div>

              {/* Bio Summary Snippet */}
              {formData.summary && (
                <div className="space-y-1.5 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60 pt-3">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#57606a] dark:text-[#8b949e] font-mono">
                    Bio Summary
                  </h5>
                  <p className="text-xs text-[#24292f] dark:text-[#c9d1d9] leading-relaxed line-clamp-3 font-sans">
                    {formData.summary}
                  </p>
                </div>
              )}

              {/* Engineering Focus Preview */}
              {formData.engineering_focus.length > 0 && (
                <div className="space-y-1.5 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60 pt-3">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#57606a] dark:text-[#8b949e] font-mono">
                    Engineering Focus
                  </h5>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {formData.engineering_focus.map((tech, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-[#f6f8fa] dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] px-2 py-0.5 text-[#24292f] dark:text-[#c9d1d9]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Read-Only Resume Reference Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#8957e5] dark:text-[#a371f7]" />
                  <h4 className="text-xs font-bold text-[#24292f] dark:text-[#f0f6fc]">
                    Active Resume Reference
                  </h4>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-[#8957e5]/10 text-[#8957e5] dark:bg-[#a371f7]/15 dark:text-[#a371f7]">
                  Read-Only (V3.0)
                </span>
              </div>

              <p className="text-xs text-[#57606a] dark:text-[#8b949e] leading-relaxed">
                Resume compilation, LaTeX editing, and variant generation are managed in{" "}
                <span className="font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                  Milestone V3.0 (Resume Studio)
                </span>
                . Profile settings serve as the canonical data source for resume variables.
              </p>

              {formData.resume_url ? (
                <a
                  href={formData.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#0969da] dark:text-[#58a6ff] hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View current resume PDF
                </a>
              ) : (
                <p className="text-xs font-mono text-[#57606a] dark:text-[#8b949e] italic">
                  No resume PDF link configured.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
