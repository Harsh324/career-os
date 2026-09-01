"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Award,
  Plus,
  Search,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  LayoutGrid,
  List,
  Layers,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import type { Certification } from "@/lib/api/types";
import {
  getAdminCertifications,
  updateAdminCertification,
  deleteAdminCertification,
} from "@/lib/api/admin-client";
import { CertificationPreviewModal } from "@/components/certifications/CertificationPreviewModal";

export default function CertificationsDashboardPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Preview & Delete Modals
  const [previewCert, setPreviewCert] = useState<Certification | null>(null);
  const [deletingCert, setDeletingCert] = useState<Certification | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCerts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAdminCertifications();
      setCerts(data);
    } catch (err: any) {
      setError(err.message || "Failed to load certifications.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    certs.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [certs]);

  const filteredCerts = useMemo(() => {
    return certs.filter((c) => {
      const matchesCategory =
        selectedCategory === "all" ||
        c.category?.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.issuer.toLowerCase().includes(q) ||
        c.credential_id?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [certs, selectedCategory, searchQuery]);

  const handleTogglePublish = async (cert: Certification) => {
    const nextState = !cert.is_published;
    try {
      await updateAdminCertification(cert.slug, { is_published: nextState });
      setCerts((prev) =>
        prev.map((c) => (c.slug === cert.slug ? { ...c, is_published: nextState } : c))
      );
    } catch (err: any) {
      alert(`Failed to update publication status: ${err.message}`);
    }
  };

  const handleToggleFeatured = async (cert: Certification) => {
    const nextState = !cert.is_featured;
    try {
      await updateAdminCertification(cert.slug, { is_featured: nextState });
      setCerts((prev) =>
        prev.map((c) => (c.slug === cert.slug ? { ...c, is_featured: nextState } : c))
      );
    } catch (err: any) {
      alert(`Failed to update featured status: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deletingCert) return;
    setIsDeleting(true);
    try {
      await deleteAdminCertification(deletingCert.slug);
      setCerts((prev) => prev.filter((c) => c.slug !== deletingCert.slug));
      setDeletingCert(null);
    } catch (err: any) {
      alert(`Failed to delete certification: ${err.message}`);
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
            <Award className="w-6 h-6 text-[#d97706] dark:text-[#f59e0b]" />
            <span>Certifications Management</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-[#d97706]/10 text-[#d97706] dark:text-[#f59e0b] border border-[#d97706]/30">
              V2.5 Active
            </span>
          </h1>
          <p className="text-xs text-[#57606a] dark:text-[#8b949e] mt-1">
            Authoritative industry credentials, verification metadata, and validated competency mapping.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={fetchCerts}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#21262d] hover:bg-[#f6f8fa] dark:hover:bg-[#30363d] border border-[#d0d7de] dark:border-[#30363d] text-xs font-medium text-[#24292f] dark:text-[#c9d1d9] transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#0969da] dark:text-[#58a6ff]" : ""}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/dashboard/certifications/new"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0969da] hover:bg-[#0859b8] text-xs font-semibold text-white transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Certification</span>
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
          <button onClick={fetchCerts} className="text-xs font-semibold underline hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {/* Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
          <div className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">TOTAL CREDENTIALS</div>
          <div className="text-2xl font-bold text-[#24292f] dark:text-white font-mono mt-1">
            {isLoading ? "-" : certs.length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
          <div className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">VERIFIED ACTIVE</div>
          <div className="text-2xl font-bold text-[#1a7f37] dark:text-[#3fb950] font-mono mt-1">
            {isLoading ? "-" : certs.filter((c) => c.verification_status === "verified").length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
          <div className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">FEATURED</div>
          <div className="text-2xl font-bold text-[#0969da] dark:text-[#58a6ff] font-mono mt-1">
            {isLoading ? "-" : certs.filter((c) => c.is_featured).length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
          <div className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">PUBLISHED</div>
          <div className="text-2xl font-bold text-[#8957e5] dark:text-[#a371f7] font-mono mt-1">
            {isLoading ? "-" : certs.filter((c) => c.is_published).length}
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xs">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#57606a] dark:text-[#8b949e]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search certifications by name, issuer, credential ID..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-xs text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden focus:border-[#0969da] dark:focus:border-[#58a6ff]"
          />
        </div>

        <div className="flex items-center gap-2">
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#f6f8fa] dark:bg-[#0d1117] border border-[#d0d7de] dark:border-[#30363d] text-xs font-mono text-[#24292f] dark:text-[#f0f6fc] focus:outline-hidden"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center rounded-lg border border-[#d0d7de] dark:border-[#30363d] p-0.5 bg-[#f6f8fa] dark:bg-[#0d1117]">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff] shadow-2xs"
                  : "text-[#57606a] dark:text-[#8b949e]"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "table"
                  ? "bg-white dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff] shadow-2xs"
                  : "text-[#57606a] dark:text-[#8b949e]"
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Certifications Grid / Table */}
      {filteredCerts.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] text-center space-y-3 shadow-xs">
          <Award className="w-10 h-10 text-[#57606a] dark:text-[#8b949e] mx-auto opacity-50" />
          <div className="text-sm font-semibold text-[#24292f] dark:text-white">
            No certifications found
          </div>
          <p className="text-xs text-[#57606a] dark:text-[#8b949e]">
            {searchQuery || selectedCategory !== "all"
              ? "Try adjusting your search query or category filter."
              : "Add your first professional industry certification."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCerts.map((cert) => (
            <div
              key={cert.slug || cert.id}
              className="group rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-4 shadow-xs hover:border-[#0969da]/50 dark:hover:border-[#58a6ff]/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#dafbe1] dark:bg-[#1f883d]/20 text-[#1a7f37] dark:text-[#3fb950] border border-[#1a7f37]/30 dark:border-[#3fb950]/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{cert.verification_status || "Verified"}</span>
                  </span>

                  {cert.category && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d]">
                      {cert.category}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-base text-[#24292f] dark:text-[#f0f6fc] group-hover:text-[#0969da] dark:group-hover:text-[#58a6ff] transition-colors">
                    {cert.name}
                  </h3>
                  <p className="text-xs font-mono font-medium text-[#0969da] dark:text-[#58a6ff] mt-0.5">
                    {cert.issuer}
                  </p>
                </div>

                {cert.credential_id && (
                  <p className="text-xs font-mono text-[#57606a] dark:text-[#8b949e] truncate">
                    ID: {cert.credential_id}
                  </p>
                )}

                {cert.description && (
                  <p className="text-xs text-[#57606a] dark:text-[#8b949e] line-clamp-2 leading-relaxed">
                    {cert.description}
                  </p>
                )}

                <div className="flex items-center gap-3 text-xs font-mono text-[#57606a] dark:text-[#8b949e] pt-2 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60">
                  <span>Issued: {cert.issue_date}</span>
                  <span>&bull;</span>
                  <span>{cert.does_not_expire ? "No Exp" : `Exp: ${cert.expiry_date || "N/A"}`}</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-3 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTogglePublish(cert)}
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full border cursor-pointer transition-colors ${
                      cert.is_published
                        ? "bg-[#dafbe1] dark:bg-[#1f883d]/20 text-[#1a7f37] dark:text-[#3fb950] border-[#1a7f37]/30"
                        : "bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border-[#d0d7de] dark:border-[#30363d]"
                    }`}
                  >
                    {cert.is_published ? "Published" : "Draft"}
                  </button>

                  <button
                    onClick={() => handleToggleFeatured(cert)}
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full border cursor-pointer transition-colors ${
                      cert.is_featured
                        ? "bg-[#0969da]/10 text-[#0969da] dark:text-[#58a6ff] border-[#0969da]/30"
                        : "bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border-[#d0d7de] dark:border-[#30363d]"
                    }`}
                  >
                    {cert.is_featured ? "Featured" : "Standard"}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewCert(cert)}
                    className="p-1.5 rounded-md hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff] cursor-pointer"
                    title="Live Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/dashboard/certifications/${cert.slug}`}
                    className="p-1.5 rounded-md hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] dark:hover:text-[#58a6ff]"
                    title="Edit Record"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setDeletingCert(cert)}
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
      ) : (
        /* Table View */
        <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f8fa] dark:bg-[#21262d] border-b border-[#d0d7de] dark:border-[#30363d] font-mono text-[#57606a] dark:text-[#8b949e]">
              <tr>
                <th className="p-3">Certification</th>
                <th className="p-3">Issuer</th>
                <th className="p-3">Category</th>
                <th className="p-3">Dates</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d0d7de]/60 dark:divide-[#30363d]/60">
              {filteredCerts.map((cert) => (
                <tr key={cert.slug || cert.id} className="hover:bg-[#f6f8fa]/50 dark:hover:bg-[#21262d]/50">
                  <td className="p-3">
                    <div className="font-bold text-[#24292f] dark:text-[#f0f6fc]">{cert.name}</div>
                    {cert.credential_id && (
                      <div className="font-mono text-[11px] text-[#57606a] dark:text-[#8b949e]">
                        {cert.credential_id}
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-mono font-medium text-[#0969da] dark:text-[#58a6ff]">
                    {cert.issuer}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d] font-mono text-[11px]">
                      {cert.category || "General"}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-[#57606a] dark:text-[#8b949e]">
                    <div>{cert.issue_date}</div>
                    <div className="text-[10px] text-[#57606a]/70">
                      {cert.does_not_expire ? "No Exp" : cert.expiry_date}
                    </div>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleTogglePublish(cert)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border cursor-pointer ${
                        cert.is_published
                          ? "bg-[#dafbe1] dark:bg-[#1f883d]/20 text-[#1a7f37] dark:text-[#3fb950] border-[#1a7f37]/30"
                          : "bg-[#f6f8fa] dark:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] border-[#d0d7de] dark:border-[#30363d]"
                      }`}
                    >
                      {cert.is_published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewCert(cert)}
                        className="p-1 rounded hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da] cursor-pointer"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href={`/dashboard/certifications/${cert.slug}`}
                        className="p-1 rounded hover:bg-[#f6f8fa] dark:hover:bg-[#21262d] text-[#57606a] dark:text-[#8b949e] hover:text-[#0969da]"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setDeletingCert(cert)}
                        className="p-1 rounded hover:bg-[#ffebe9] dark:hover:bg-red-950/40 text-[#cf222e] dark:text-red-400 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewCert && (
        <CertificationPreviewModal
          cert={previewCert}
          isOpen={true}
          onClose={() => setPreviewCert(null)}
          isDirty={false}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-[#cf222e] dark:text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-[#24292f] dark:text-white">
                Delete Certification?
              </h3>
            </div>
            <p className="text-xs text-[#57606a] dark:text-[#8b949e] leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-[#24292f] dark:text-white">{deletingCert.name}</strong>? This action
              cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCert(null)}
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
