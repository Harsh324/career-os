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
  GraduationCap,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  Lock,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { Education } from "@/lib/api/types";
import {
  createAdminEducation,
  updateAdminEducation,
} from "@/lib/api/admin-client";
import { EducationPreviewModal } from "./EducationPreviewModal";

interface EducationEditorFormProps {
  initialEducation?: Education;
  isNew?: boolean;
}

export function EducationEditorForm({
  initialEducation,
  isNew = false,
}: EducationEditorFormProps) {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState<Partial<Education>>({
    institution: initialEducation?.institution || "",
    degree: initialEducation?.degree || "",
    field_of_study: initialEducation?.field_of_study || "",
    slug: initialEducation?.slug || "",
    location: initialEducation?.location || "",
    start_date: initialEducation?.start_date || "",
    end_date: initialEducation?.end_date || "",
    currently_studying: initialEducation?.currently_studying || false,
    grade: initialEducation?.grade || "",
    description: initialEducation?.description || "",
    achievements: initialEducation?.achievements || [],
    relevant_courses: initialEducation?.relevant_courses || [],
    is_published: initialEducation?.is_published ?? true,
    is_featured: initialEducation?.is_featured ?? true,
    order: initialEducation?.order ?? 0,
    target_roles: initialEducation?.target_roles || [],
    internal_notes: initialEducation?.internal_notes || "",
  });

  // Dynamic input buffers
  const [newAchievementInput, setNewAchievementInput] = useState("");
  const [newCourseInput, setNewCourseInput] = useState("");
  const [newRoleInput, setNewRoleInput] = useState("");

  // UX State
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleChange = (field: keyof Education, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setError(null);
  };

  const handleAddAchievement = () => {
    const trimmed = newAchievementInput.trim();
    if (!trimmed) return;
    const current = formData.achievements || [];
    handleChange("achievements", [...current, trimmed]);
    setNewAchievementInput("");
  };

  const handleRemoveAchievement = (idx: number) => {
    const current = formData.achievements || [];
    handleChange(
      "achievements",
      current.filter((_, i) => i !== idx)
    );
  };

  const handleAddCourse = () => {
    const trimmed = newCourseInput.trim();
    if (!trimmed) return;
    const current = formData.relevant_courses || [];
    if (!current.includes(trimmed)) {
      handleChange("relevant_courses", [...current, trimmed]);
    }
    setNewCourseInput("");
  };

  const handleRemoveCourse = (course: string) => {
    const current = formData.relevant_courses || [];
    handleChange(
      "relevant_courses",
      current.filter((c) => c !== course)
    );
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
      if (initialEducation) {
        setFormData({
          institution: initialEducation.institution || "",
          degree: initialEducation.degree || "",
          field_of_study: initialEducation.field_of_study || "",
          slug: initialEducation.slug || "",
          location: initialEducation.location || "",
          start_date: initialEducation.start_date || "",
          end_date: initialEducation.end_date || "",
          currently_studying: initialEducation.currently_studying || false,
          grade: initialEducation.grade || "",
          description: initialEducation.description || "",
          achievements: initialEducation.achievements || [],
          relevant_courses: initialEducation.relevant_courses || [],
          is_published: initialEducation.is_published ?? true,
          is_featured: initialEducation.is_featured ?? true,
          order: initialEducation.order ?? 0,
          target_roles: initialEducation.target_roles || [],
          internal_notes: initialEducation.internal_notes || "",
        });
      } else {
        router.push("/dashboard/education");
      }
      setIsDirty(false);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.institution?.trim()) {
      setError("Institution name is required.");
      return;
    }
    if (!formData.degree?.trim()) {
      setError("Degree or qualification name is required.");
      return;
    }
    if (!formData.start_date?.trim()) {
      setError("Start date is required.");
      return;
    }
    if (!formData.currently_studying && !formData.end_date?.trim()) {
      setError("End date is required (or check 'Currently Studying').");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      if (isNew) {
        const created = await createAdminEducation(formData);
        setIsDirty(false);
        setSuccessMessage("Education record created successfully.");
        router.push(`/dashboard/education/${created.slug}`);
      } else if (initialEducation?.slug) {
        await updateAdminEducation(initialEducation.slug, formData);
        setIsDirty(false);
        setSuccessMessage("Education record updated successfully.");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save education record.");
    } finally {
      setIsSaving(false);
    }
  };

  const previewEdu: Education = {
    id: initialEducation?.id || 0,
    institution: formData.institution || "Institution Name",
    degree: formData.degree || "Degree Title",
    field_of_study: formData.field_of_study,
    slug: formData.slug || "preview-edu",
    location: formData.location,
    start_date: formData.start_date || "2020",
    end_date: formData.end_date || "2024",
    currently_studying: formData.currently_studying,
    grade: formData.grade,
    description: formData.description,
    achievements: formData.achievements,
    relevant_courses: formData.relevant_courses,
    is_published: formData.is_published,
    is_featured: formData.is_featured,
    order: formData.order,
    target_roles: formData.target_roles,
    internal_notes: formData.internal_notes,
  };

  return (
    <div className="space-y-6">
      {/* Sticky Desktop Action Bar */}
      <div className="sticky top-0 z-20 bg-[#f6f8fa]/95 dark:bg-[#0d1117]/95 backdrop-blur-xs py-3 border-b border-[#d0d7de] dark:border-[#30363d] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/education"
            className="p-1.5 rounded-lg bg-white dark:bg-[#21262d] border border-[#d0d7de] dark:border-[#30363d] text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#f0f6fc] transition-colors"
            title="Back to Education"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-[#24292f] dark:text-white tracking-tight flex items-center gap-2">
              <span>{isNew ? "New Education Record" : formData.degree || "Edit Education"}</span>
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
            <span>{isSaving ? "Saving..." : isNew ? "Create Education" : "Save Changes"}</span>
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
        {/* Section 1: Institution & Degree */}
        <section className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <h2 className="text-sm font-bold text-[#24292f] dark:text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
              <span>1. Institution & Degree Title</span>
            </h2>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-0.5">
              University or college name, degree conferred, and field of study.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Institution Name *
              </label>
              <input
                type="text"
                value={formData.institution || ""}
                onChange={(e) => handleChange("institution", e.target.value)}
                placeholder="e.g. Indian Institute of Information Technology (IIIT Nagpur)"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-sm text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Degree / Qualification *
              </label>
              <input
                type="text"
                value={formData.degree || ""}
                onChange={(e) => handleChange("degree", e.target.value)}
                placeholder="e.g. B.Tech in Computer Science and Engineering"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-sm text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Field of Study
              </label>
              <input
                type="text"
                value={formData.field_of_study || ""}
                onChange={(e) => handleChange("field_of_study", e.target.value)}
                placeholder="e.g. Computer Science and Engineering"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-sm text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
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
                placeholder="iiit-nagpur"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] font-mono text-xs text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="e.g. Nagpur, India"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-sm text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Dates & Academic Details */}
        <section className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <h2 className="text-sm font-bold text-[#24292f] dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
              <span>2. Dates, Timeline & Classification</span>
            </h2>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-0.5">
              Attendance period, grade classification, and active study flag.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Start Date *
              </label>
              <input
                type="text"
                value={formData.start_date || ""}
                onChange={(e) => handleChange("start_date", e.target.value)}
                placeholder="e.g. Dec 2020"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-sm text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                End Date
              </label>
              <input
                type="text"
                disabled={formData.currently_studying}
                value={formData.currently_studying ? "" : formData.end_date || ""}
                onChange={(e) => handleChange("end_date", e.target.value)}
                placeholder="e.g. Jun 2024"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-sm text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff] disabled:opacity-40"
              />
            </div>

            <div className="pb-2">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono text-[#24292f] dark:text-[#f0f6fc]">
                <input
                  type="checkbox"
                  checked={formData.currently_studying || false}
                  onChange={(e) => handleChange("currently_studying", e.target.checked)}
                  className="rounded border-[#d0d7de] dark:border-[#30363d] text-[#0969da] focus:ring-0 cursor-pointer"
                />
                <span>Currently Enrolled</span>
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Grade / Classification
              </label>
              <input
                type="text"
                value={formData.grade || ""}
                onChange={(e) => handleChange("grade", e.target.value)}
                placeholder="e.g. First Class, 3.8 GPA"
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-sm text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
                Program Description
              </label>
              <input
                type="text"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="4-year undergraduate engineering program focusing on computer systems..."
                className="w-full px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-sm text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Achievements & Coursework */}
        <section className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 sm:p-6 space-y-5 shadow-xs">
          <div className="border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-3">
            <h2 className="text-sm font-bold text-[#24292f] dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-[#d97706] dark:text-[#f59e0b]" />
              <span>3. Key Achievements & Relevant Coursework</span>
            </h2>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-0.5">
              Highlight academic milestones and core subject areas.
            </p>
          </div>

          {/* Key Achievements */}
          <div className="space-y-3">
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc]">
              Key Accomplishments ({formData.achievements?.length || 0})
            </label>
            <div className="space-y-2">
              {formData.achievements?.map((ach, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-xs"
                >
                  <span className="text-[#24292f] dark:text-[#c9d1d9]">{ach}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAchievement(idx)}
                    className="text-[#cf222e] hover:text-red-700 p-1 cursor-pointer shrink-0"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newAchievementInput}
                onChange={(e) => setNewAchievementInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAchievement();
                  }
                }}
                placeholder="Add an achievement (e.g. Graduated First Class in CSE)..."
                className="flex-1 px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-xs text-[#24292f] dark:text-[#f0f6fc]"
              />
              <button
                type="button"
                onClick={handleAddAchievement}
                className="px-3.5 py-2 rounded-lg bg-[#21262d] text-white hover:bg-black text-xs font-mono font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Relevant Courses */}
          <div className="space-y-3 pt-3 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60">
            <label className="block text-xs font-mono font-semibold text-[#24292f] dark:text-[#f0f6fc] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#0969da] dark:text-[#58a6ff]" />
                <span>Relevant Coursework ({formData.relevant_courses?.length || 0})</span>
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {formData.relevant_courses?.map((course) => (
                <span
                  key={course}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] border border-[#d0d7de] dark:border-[#30363d]"
                >
                  <span>{course}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCourse(course)}
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
                value={newCourseInput}
                onChange={(e) => setNewCourseInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCourse();
                  }
                }}
                placeholder="e.g. Distributed Systems, Database Management Systems..."
                className="flex-1 px-3 py-2 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-xs text-[#24292f] dark:text-[#f0f6fc]"
              />
              <button
                type="button"
                onClick={handleAddCourse}
                className="px-3.5 py-2 rounded-lg bg-[#21262d] text-white hover:bg-black text-xs font-mono font-semibold cursor-pointer"
              >
                Add Course
              </button>
            </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono text-[#24292f] dark:text-[#f0f6fc]">
                <input
                  type="checkbox"
                  checked={formData.is_published ?? true}
                  onChange={(e) => handleChange("is_published", e.target.checked)}
                  className="rounded border-[#d0d7de] dark:border-[#30363d] text-[#0969da] focus:ring-0 cursor-pointer"
                />
                <span>Published on Public Resume</span>
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
                <span>Featured Degree</span>
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
                placeholder="e.g. Backend Engineering, Platform Engineering"
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
              Staff Internal Notes
            </label>
            <textarea
              rows={3}
              value={formData.internal_notes || ""}
              onChange={(e) => handleChange("internal_notes", e.target.value)}
              placeholder="Private degree verification notes, official transcript locations, or academic honors..."
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] text-xs text-[#24292f] dark:text-[#f0f6fc]"
            />
          </div>
        </section>
      </form>

      {/* Live Preview Modal */}
      <EducationPreviewModal
        education={previewEdu}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        isDirty={isDirty}
      />
    </div>
  );
}
