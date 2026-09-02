"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Image as ImageIcon,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List as ListIcon,
  FileText,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  Sparkles,
  Download,
  Check,
  RotateCcw,
} from "lucide-react";
import type { MediaAsset, MediaAssetType } from "@/lib/api/types";
import {
  getAdminMediaAssets,
  updateAdminMediaAsset,
  deleteAdminMediaAsset,
} from "@/lib/api/admin-client";
import { MediaPreviewModal, formatBytes } from "@/components/media/MediaPreviewModal";

export default function MediaAssetsDashboardPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "published" | "draft">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal State
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [deleteAsset, setDeleteAsset] = useState<MediaAsset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load assets
  const loadAssets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAdminMediaAssets();
      setAssets(data);
    } catch (err: any) {
      setError(err.message || "Failed to load media assets.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  // Quick toggle publish state
  const handleTogglePublish = async (asset: MediaAsset) => {
    try {
      const updated = await updateAdminMediaAsset(asset.slug, {
        is_published: !asset.is_published,
      });
      setAssets((prev) =>
        prev.map((a) => (a.slug === asset.slug ? { ...a, is_published: updated.is_published } : a))
      );
    } catch (err: any) {
      alert(`Failed to update publish state: ${err.message}`);
    }
  };

  // Delete handler
  const handleDeleteConfirm = async () => {
    if (!deleteAsset) return;
    setIsDeleting(true);
    try {
      await deleteAdminMediaAsset(deleteAsset.slug);
      setAssets((prev) => prev.filter((a) => a.slug !== deleteAsset.slug));
      setDeleteAsset(null);
    } catch (err: any) {
      alert(`Failed to delete asset: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // 1. Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = asset.title.toLowerCase().includes(q);
        const matchFilename = asset.original_filename?.toLowerCase().includes(q);
        const matchAlt = asset.alt_text?.toLowerCase().includes(q);
        const matchDesc = asset.description?.toLowerCase().includes(q);
        const matchSlug = asset.slug.toLowerCase().includes(q);
        if (!matchTitle && !matchFilename && !matchAlt && !matchDesc && !matchSlug) {
          return false;
        }
      }

      // 2. Type filter
      if (selectedType !== "all" && asset.asset_type !== selectedType) {
        return false;
      }

      // 3. Status filter
      if (selectedStatus === "published" && !asset.is_published) return false;
      if (selectedStatus === "draft" && asset.is_published) return false;

      return true;
    });
  }, [assets, searchQuery, selectedType, selectedStatus]);

  // Telemetry counts
  const telemetry = useMemo(() => {
    const total = assets.length;
    const published = assets.filter((a) => a.is_published).length;
    const featured = assets.filter((a) => a.is_featured).length;
    const images = assets.filter((a) => a.is_image).length;
    const documents = total - images;
    return { total, published, featured, images, documents };
  }, [assets]);

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-primary" />
            Media Assets Control Plane
          </h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            Canonical Media & Document Management • Milestone V2.6
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAssets}
            className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Reload Media"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <Link
            href="/dashboard/media/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Media Asset
          </Link>
        </div>
      </div>

      {/* Telemetry Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-card border border-border shadow-xs">
          <span className="text-xs font-mono text-muted-foreground uppercase">Total Assets</span>
          <p className="text-2xl font-bold text-foreground font-mono mt-1">{telemetry.total}</p>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 shadow-xs">
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase">Published</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1">{telemetry.published}</p>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 shadow-xs">
          <span className="text-xs font-mono text-amber-600 dark:text-amber-400 uppercase">Featured</span>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono mt-1">{telemetry.featured}</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 shadow-xs">
          <span className="text-xs font-mono text-blue-600 dark:text-blue-400 uppercase">Visuals / Images</span>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono mt-1">{telemetry.images}</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 shadow-xs">
          <span className="text-xs font-mono text-purple-600 dark:text-purple-400 uppercase">Documents / PDFs</span>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono mt-1">{telemetry.documents}</p>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 bg-card border border-border rounded-xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, filename, alt text, or slug..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Asset Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 text-xs font-mono bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Types</option>
            <option value="project_image">Project Screenshots</option>
            <option value="architecture_diagram">Architecture Diagrams</option>
            <option value="project_logo">Project Logos</option>
            <option value="certification">Certifications</option>
            <option value="education">Education / Diplomas</option>
            <option value="company_logo">Company Logos</option>
            <option value="resume">Resumes / CVs</option>
            <option value="document">Technical Docs</option>
            <option value="profile">Profile / Avatars</option>
            <option value="social_preview">Social Cards</option>
            <option value="other">Other Assets</option>
          </select>

          {/* Visibility Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-1.5 text-xs font-mono bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden bg-muted/20">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 transition-colors ${
                viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 transition-colors ${
                viewMode === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Table View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-3 bg-card border border-border rounded-xl">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-muted-foreground">Loading canonical media records...</p>
        </div>
      ) : error ? (
        <div className="p-6 text-center space-y-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive">
          <p className="text-sm font-medium">{error}</p>
          <button
            onClick={loadAssets}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="p-12 text-center space-y-4 bg-card border border-dashed border-border rounded-xl">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-base font-semibold text-foreground">No media assets found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {assets.length === 0
                ? "No media assets have been registered yet. Upload architecture diagrams, project visuals, or resumes to get started."
                : "No media assets match your active filter criteria."}
            </p>
          </div>
          {assets.length === 0 && (
            <Link
              href="/dashboard/media/new"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add First Asset
            </Link>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => {
            const isImg = asset.is_image || (asset.mime_type && asset.mime_type.startsWith("image/"));
            return (
              <div
                key={asset.slug}
                className="group flex flex-col bg-card border border-border hover:border-primary/50 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200"
              >
                {/* Thumbnail Preview Area */}
                <div
                  onClick={() => setPreviewAsset(asset)}
                  className="h-44 bg-zinc-950/40 relative flex items-center justify-center p-3 cursor-pointer overflow-hidden border-b border-border/60"
                >
                  {isImg && asset.file_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset.file_url}
                      alt={asset.alt_text || asset.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-2">
                      <FileText className="w-12 h-12 text-primary/70 mb-2" />
                      <span className="text-[11px] font-mono text-muted-foreground truncate max-w-[180px]">
                        {asset.original_filename || "Document"}
                      </span>
                    </div>
                  )}

                  {/* Status & Featured badges */}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {asset.is_featured && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-amber-500/90 text-black font-bold shadow-xs">
                        FEATURED
                      </span>
                    )}
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono backdrop-blur-sm shadow-xs ${
                        asset.is_published
                          ? "bg-emerald-500/90 text-white font-medium"
                          : "bg-zinc-800/90 text-zinc-300 font-medium border border-zinc-700"
                      }`}
                    >
                      {asset.is_published ? "PUBLISHED" : "DRAFT"}
                    </span>
                  </div>

                  {/* Dimension pill */}
                  {asset.width && asset.height && (
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 text-[10px] font-mono rounded bg-black/70 text-white backdrop-blur-sm">
                      {asset.width}×{asset.height}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="flex-1 p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {asset.title}
                      </h3>
                    </div>
                    <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                      {asset.asset_type} • {formatBytes(asset.file_size)}
                    </p>
                  </div>

                  {/* Alt text check */}
                  {isImg && (
                    <div className="text-[11px]">
                      {asset.alt_text ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                          <Check className="w-3 h-3" /> Alt text set
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-mono">
                          <AlertTriangle className="w-3 h-3" /> Missing alt text
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <button
                      onClick={() => handleTogglePublish(asset)}
                      className={`text-[11px] font-mono transition-colors ${
                        asset.is_published
                          ? "text-muted-foreground hover:text-amber-500"
                          : "text-emerald-500 hover:text-emerald-400 font-semibold"
                      }`}
                    >
                      {asset.is_published ? "Set Draft" : "Publish"}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setPreviewAsset(asset)}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Live Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href={`/dashboard/media/${asset.slug}`}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit Asset"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setDeleteAsset(asset)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3">Taxonomy</th>
                  <th className="px-4 py-3">Dimensions / Size</th>
                  <th className="px-4 py-3">Accessibility</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAssets.map((asset) => (
                  <tr key={asset.slug} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                          {asset.is_image && asset.file_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={asset.file_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <FileText className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p className="font-semibold text-foreground truncate font-sans text-xs">{asset.title}</p>
                          <p className="text-muted-foreground text-[11px] truncate">{asset.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-semibold">{asset.asset_type}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {asset.width && asset.height ? `${asset.width}×${asset.height} px • ` : ""}
                      {formatBytes(asset.file_size)}
                    </td>
                    <td className="px-4 py-3">
                      {asset.alt_text ? (
                        <span className="text-emerald-500 inline-flex items-center gap-1">
                          <Check className="w-3 h-3" /> WCAG OK
                        </span>
                      ) : (
                        <span className="text-amber-500 inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Missing
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleTogglePublish(asset)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          asset.is_published
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}
                      >
                        {asset.is_published ? "PUBLISHED" : "DRAFT"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewAsset(asset)}
                          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/dashboard/media/${asset.slug}`}
                          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setDeleteAsset(asset)}
                          className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
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
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 bg-card border border-border rounded-xl shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Confirm Asset Deletion
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete <strong className="text-foreground">{deleteAsset.title}</strong>? This action is permanent.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteAsset(null)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete Record"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Preview Modal */}
      <MediaPreviewModal
        asset={previewAsset}
        isOpen={!!previewAsset}
        onClose={() => setPreviewAsset(null)}
      />
    </div>
  );
}
