"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Image as ImageIcon,
  FileText,
  ExternalLink,
  Copy,
  Check,
  Download,
  AlertTriangle,
  CheckCircle2,
  FolderGit2,
  Briefcase,
  Award,
  GraduationCap,
  Cpu,
  Eye,
  Maximize2,
  Minimize2,
} from "lucide-react";
import type { MediaAsset } from "@/lib/api/types";

interface MediaPreviewModalProps {
  asset: MediaAsset | null;
  isOpen: boolean;
  onClose: () => void;
}

export function formatBytes(bytes: number, decimals = 1) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function MediaPreviewModal({
  asset,
  isOpen,
  onClose,
}: MediaPreviewModalProps) {
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !asset) return null;

  const handleCopyUrl = () => {
    if (!asset.file_url) return;
    navigator.clipboard.writeText(asset.file_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isImage = asset.is_image || (asset.mime_type && asset.mime_type.startsWith("image/"));
  const isPdf = asset.mime_type === "application/pdf" || (asset.original_filename && asset.original_filename.endsWith(".pdf"));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              {isImage ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-foreground truncate flex items-center gap-2">
                {asset.title}
                {asset.is_featured && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    FEATURED
                  </span>
                )}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono border ${
                    asset.is_published
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  }`}
                >
                  {asset.is_published ? "PUBLISHED" : "DRAFT"}
                </span>
              </h2>
              <p className="text-xs font-mono text-muted-foreground truncate">
                slug: {asset.slug} • {asset.asset_type}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/80 transition-colors"
            aria-label="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content: Split View */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* Main Visual Display (Left 7-8 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-zinc-950/50 min-h-[360px] relative overflow-hidden">
            {isImage && asset.file_url ? (
              <div className="relative flex flex-col items-center justify-center w-full h-full max-h-[500px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.file_url}
                  alt={asset.alt_text || asset.title}
                  className={`max-w-full rounded-lg object-contain transition-all duration-300 shadow-lg ${
                    isZoomed ? "max-h-none scale-125" : "max-h-[440px]"
                  }`}
                />
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm border border-white/10 transition-colors"
                  title={isZoomed ? "Zoom Out" : "Zoom In"}
                >
                  {isZoomed ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            ) : isPdf && asset.file_url ? (
              <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-6 text-center space-y-4 bg-muted/20 border border-border/50 rounded-xl">
                <FileText className="w-16 h-16 text-primary animate-pulse" />
                <div>
                  <h3 className="text-base font-medium text-foreground">{asset.original_filename || "PDF Document"}</h3>
                  <p className="text-xs font-mono text-muted-foreground mt-1">{formatBytes(asset.file_size)} • PDF</p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={asset.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open in New Tab
                  </a>
                  <a
                    href={asset.file_url}
                    download={asset.original_filename || `${asset.slug}.pdf`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-muted/20 border border-border/50 rounded-xl">
                <FileText className="w-14 h-14 text-muted-foreground" />
                <div>
                  <h3 className="text-base font-medium text-foreground">{asset.title}</h3>
                  <p className="text-xs font-mono text-muted-foreground mt-1">
                    {asset.original_filename || "External Reference"} • {asset.mime_type || "asset"}
                  </p>
                </div>
                {asset.file_url && (
                  <a
                    href={asset.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Asset URL
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Metadata & Associations Sidebar (Right 5 cols) */}
          <div className="lg:col-span-5 p-6 space-y-6 bg-card overflow-y-auto">
            {/* Accessibility Assessment */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Accessibility</h3>
              {asset.alt_text ? (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Alt Text Configured</span>
                  </div>
                  <p className="text-muted-foreground font-sans text-xs italic">
                    &quot;{asset.alt_text}&quot;
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-medium">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Missing Alt Text</span>
                  </div>
                  <p className="text-muted-foreground font-sans text-xs">
                    This asset has no descriptive alt text. Providing alt text improves SEO and accessibility.
                  </p>
                </div>
              )}
            </div>

            {/* Storage & Technical Specs */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Technical Specs</h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-muted/30 p-3 rounded-lg border border-border">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-semibold text-foreground truncate">{asset.asset_type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">File Size:</span>
                  <p className="font-semibold text-foreground">{formatBytes(asset.file_size)}</p>
                </div>
                {asset.width && asset.height && (
                  <div>
                    <span className="text-muted-foreground">Dimensions:</span>
                    <p className="font-semibold text-foreground">{asset.width} × {asset.height} px</p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">MIME:</span>
                  <p className="font-semibold text-foreground truncate">{asset.mime_type || "unknown"}</p>
                </div>
              </div>

              {/* URL & Copy Action */}
              {asset.file_url && (
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground font-mono">Canonical File URL:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={asset.file_url}
                      className="flex-1 px-3 py-1.5 text-xs font-mono bg-muted border border-border rounded-lg text-muted-foreground focus:outline-none"
                    />
                    <button
                      onClick={handleCopyUrl}
                      className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors shrink-0"
                      title="Copy URL"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Presentation Details */}
            {(asset.caption || asset.description) && (
              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Content Details</h3>
                {asset.caption && (
                  <div>
                    <span className="text-xs text-muted-foreground">Caption:</span>
                    <p className="text-sm font-medium text-foreground">{asset.caption}</p>
                  </div>
                )}
                {asset.description && (
                  <div>
                    <span className="text-xs text-muted-foreground">Description:</span>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{asset.description}</p>
                  </div>
                )}
              </div>
            )}

            {/* Associated Career Entities */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Associated Entities</h3>
              <div className="space-y-2">
                {asset.related_projects_detail && asset.related_projects_detail.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                      <FolderGit2 className="w-3.5 h-3.5 text-blue-500" /> Projects:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {asset.related_projects_detail.map((proj) => (
                        <span
                          key={proj.id}
                          className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-mono"
                        >
                          {proj.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {asset.related_experiences_detail && asset.related_experiences_detail.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                      <Briefcase className="w-3.5 h-3.5 text-purple-500" /> Experiences:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {asset.related_experiences_detail.map((exp) => (
                        <span
                          key={exp.id}
                          className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-mono"
                        >
                          {exp.title} ({exp.company_name})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {asset.related_certifications_detail && asset.related_certifications_detail.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> Certifications:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {asset.related_certifications_detail.map((cert) => (
                        <span
                          key={cert.id}
                          className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono"
                        >
                          {cert.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {asset.related_education_detail && asset.related_education_detail.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-500" /> Education:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {asset.related_education_detail.map((edu) => (
                        <span
                          key={edu.id}
                          className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono"
                        >
                          {edu.degree} ({edu.institution})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {asset.related_skills_detail && asset.related_skills_detail.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                      <Cpu className="w-3.5 h-3.5 text-cyan-500" /> Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {asset.related_skills_detail.map((sk) => (
                        <span
                          key={sk.id}
                          className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-mono"
                        >
                          {sk.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(!asset.related_projects_detail || asset.related_projects_detail.length === 0) &&
                  (!asset.related_experiences_detail || asset.related_experiences_detail.length === 0) &&
                  (!asset.related_certifications_detail || asset.related_certifications_detail.length === 0) &&
                  (!asset.related_education_detail || asset.related_education_detail.length === 0) &&
                  (!asset.related_skills_detail || asset.related_skills_detail.length === 0) && (
                    <p className="text-xs text-muted-foreground italic">No canonical entities linked yet.</p>
                  )}
              </div>
            </div>

            {/* Staff-only Intelligence callout if present */}
            {(asset.target_roles?.length || asset.internal_notes) && (
              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 space-y-2">
                <span className="text-xs font-mono uppercase font-semibold text-orange-500">
                  Staff Intelligence (Private)
                </span>
                {asset.target_roles && asset.target_roles.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground font-mono">Target Roles:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {asset.target_roles.map((r, i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-mono">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {asset.internal_notes && (
                  <div>
                    <span className="text-xs text-muted-foreground font-mono">Internal Notes:</span>
                    <p className="text-xs text-muted-foreground mt-0.5 italic">{asset.internal_notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/30">
          <span className="text-xs text-muted-foreground font-mono">
            Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-foreground">ESC</kbd> to exit
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
