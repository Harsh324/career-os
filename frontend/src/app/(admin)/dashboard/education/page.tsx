"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Plus,
  Search,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import type { Education } from "@/lib/api/types";
import {
  getAdminEducation,
  updateAdminEducation,
  deleteAdminEducation,
} from "@/lib/api/admin-client";
import { EducationPreviewModal } from "@/components/education/EducationPreviewModal";

export default function EducationDashboardPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Preview & Delete Modals
  const [previewEdu, setPreviewEdu] = useState<Education | null>(null);
  const [deletingEdu, setDeletingEdu] = useState<Education | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEdu = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAdminEducation();
      setEducations(data);
    } catch (err: any) {
      setError(err.message || "Failed to load education records.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEdu();
  }, []);

  const filteredEdu = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return educations.filter(
      (e) =>
        !q ||
        e.institution.toLowerCase().includes(q) ||
        e.degree.toLowerCase().includes(q) ||
        e.field_of_study?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q)
    );
  }, [educations, searchQuery]);

  const handleTogglePublish = async (edu: Education) => {
    const nextState = !edu.is_published;
    try {
      await updateAdminEducation(edu.slug, { is_published: nextState });
      setEducations((prev) =>
        prev.map((e) => (e.slug === edu.slug ? { ...e, is_published: nextState } : e))
      );
    } catch (err: any) {
      alert(`Failed to update publication status: ${err.message}`);
    }
  };

  const handleToggleFeatured = async (edu: Education) => {
    const nextState = !edu.is_featured;
    try {
      await updateAdminEducation(edu.slug, { is_featured: nextState });
      setEducations((prev) =>
        prev.map((e) => (e.slug === edu.slug ? { ...e, is_featured: nextState } : e))
      );
    } catch (err: any) {
      alert(`Failed to update featured status: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deletingEdu) return;
    setIsDeleting(true);
    try {
      await deleteAdminEducation(deletingEdu.slug);
      setEducations((prev) => prev.filter((e) => e.slug !== deletingEdu.slug));
      setDeletingEdu(null);
    } catch (err: any) {
      alert(`Failed to delete education record: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-[#d0d7de] dark:border-[#30363d]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#24292f] dark:text-white tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-[#0969da] dark:text-[#58a6ff]" />
            <span>Education Management</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-[#0969da]/10 text-[#0969da] dark:text-[#58a6ff] border border-[#0969da]/30">
              V2.5 Active
            </span>
          </h1>
          <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-1">
            Authoritative university degrees, coursework, and academic milestone records.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={fetchEdu}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#21262d] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] border border-[#d0d7de] dark:border-[#30363d] text-xs font-medium text-[#24292f] dark:text-[#c9d1d9] transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#0969da] dark:text-[#58a6ff]" : ""}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/dashboard/education/new"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0969da] hover:bg-[#0859b8] text-xs font-semibold text-white transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Education</span>
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
          <button onClick={fetchEdu} className="text-xs font-semibold underline hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {/* Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
          <div className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">TOTAL DEGREES</div>
          <div className="text-2xl font-bold text-[#24292f] dark:text-white font-mono mt-1">
            {isLoading ? "-" : educations.length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
          <div className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">FEATURED</div>
          <div className="text-2xl font-bold text-[#0969da] dark:text-[#58a6ff] font-mono mt-1">
            {isLoading ? "-" : educations.filter((e) => e.is_featured).length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
          <div className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">PUBLISHED</div>
          <div className="text-2xl font-bold text-[#1a7f37] dark:text-[#3fb950] font-mono mt-1">
            {isLoading ? "-" : educations.filter((e) => e.is_published).length}
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="p-3 rounded-xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#57606a] dark:text-[#8b949e]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search education by degree, institution, location..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-xs text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
          />
        </div>
      </div>

      {/* Education Records List */}
      {filteredEdu.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] text-center space-y-3 shadow-xs">
          <GraduationCap className="w-10 h-10 text-[#57606a] dark:text-[#8b949e] mx-auto opacity-50" />
          <div className="text-sm font-semibold text-[#24292f] dark:text-white">
            No education records found
          </div>
          <p className="text-xs text-[#57606a] dark:text-[#8b949e]">
            {searchQuery
              ? "Try adjusting your search query."
              : "Add your formal degree or university credential."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEdu.map((edu) => (
            <div
              key={edu.slug || edu.id}
              className="group rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs hover:border-[#0969da]/50 dark:hover:border-[#58a6ff]/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base text-[#24292f] dark:text-[#f0f6fc] group-hover:text-[#0969da] dark:group-hover:text-[#58a6ff] transition-colors">
                    {edu.degree}
                  </h3>
                  <p className="text-sm font-semibold text-[#0969da] dark:text-[#58a6ff] mt-0.5">
                    {edu.institution}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#57606a] dark:text-[#8b949e] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {edu.start_date} – {edu.currently_studying ? "Present" : edu.end_date}
                    </span>
                  </span>
                  {edu.grade && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#f6f8fa] dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff] border border-[#d0d7de] dark:border-[#30363d]">
                      {edu.grade}
                    </span>
                  )}
                </div>
              </div>

              {edu.location && (
                <p className="text-xs font-mono text-[#57606a] dark:text-[#8b949e] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{edu.location}</span>
                </p>
              )}

              {edu.description && (
                <p className="text-xs text-[#57606a] dark:text-[#8b949e] leading-relaxed">
                  {edu.description}
                </p>
              )}

              {edu.relevant_courses && edu.relevant_courses.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {edu.relevant_courses.map((course, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d]"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-3 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTogglePublish(edu)}
                    className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border cursor-pointer transition-colors ${
                      edu.is_published
                        ? "bg-[#dafbe1] dark:bg-[#1f883d]/20 text-[#1a7f37] dark:text-[#3fb950] border-[#1a7f37]/30"
                        : "bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border-[#d0d7de] dark:border-[#30363d]"
                    }`}
                  >
                    {edu.is_published ? "Published" : "Draft"}
                  </button>

                  <button
                    onClick={() => handleToggleFeatured(edu)}
                    className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border cursor-pointer transition-colors ${
                      edu.is_featured
                        ? "bg-[#0969da]/10 text-[#0969da] dark:text-[#58a6ff] border-[#0969da]/30"
                        : "bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border-[#d0d7de] dark:border-[#30363d]"
                    }`}
                  >
                    {edu.is_featured ? "Featured" : "Standard"}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewEdu(edu)}
                    className="p-1.5 rounded-md hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff] cursor-pointer"
                    title="Live Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/dashboard/education/${edu.slug}`}
                    className="p-1.5 rounded-md hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff]"
                    title="Edit Record"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setDeletingEdu(edu)}
                    className="p-1.5 rounded-md hover:bg-[#ffebe9] dark:hover:bg-red-950/40 text-[#cf222e] dark:text-red-400 cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live Preview Modal */}
      {previewEdu && (
        <EducationPreviewModal
          education={previewEdu}
          isOpen={true}
          onClose={() => setPreviewEdu(null)}
          isDirty={false}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-[#cf222e] dark:text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-[#24292f] dark:text-white">
                Delete Education Record?
              </h3>
            </div>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-[#24292f] dark:text-white">{deletingEdu.degree}</strong> at{" "}
              <strong className="text-[#24292f] dark:text-white">{deletingEdu.institution}</strong>? This action
              cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingEdu(null)}
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
