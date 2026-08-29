"use client";

import { useState, useEffect, useRef } from "react";
import {
  FileText,
  Download,
  Briefcase,
  GraduationCap,
  Award,
  MapPin,
  Mail,
  FileCode,
  FileSpreadsheet,
  Loader2,
  Maximize2,
  X,
} from "lucide-react";
import { sendTelemetryEvent } from "@/lib/analytics";

import type { Experience, Certification, Education } from "@/lib/api/types";

interface ResumeViewSwitcherProps {
  meta: {
    name: string;
    title: string;
    location: string;
    email: string;
    summary: string;
  };
  experiences: Experience[];
  certs: Certification[];
  education: Education[];
}

function PdfCanvasViewer({
  pdfUrl,
  name,
  onOpenFullscreen,
}: {
  pdfUrl: string;
  name: string;
  onOpenFullscreen: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadPdf = async () => {
      try {
        if (!(window as any)["pdfjs-dist/build/pdf"]) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = resolve;
            script.onerror = reject;
            (document.head || document.body)?.appendChild(script);
          });
        }

        const pdfjsLib = (window as any)["pdfjs-dist/build/pdf"];
        if (!pdfjsLib) throw new Error("PDF.js library not loaded");

        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        const getDocFn = pdfjsLib["getDocument"];
        const loadingTask = getDocFn.call(pdfjsLib, pdfUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        if (!isMounted) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const containerWidth = canvas.parentElement?.clientWidth || 800;
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const scale = Math.min(2.0, (containerWidth * 2) / unscaledViewport.width);
        const viewport = page.getViewport({ scale });

        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.style.width = "100%";
        canvas.style.height = "auto";

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        if (isMounted) setLoading(false);
      } catch (err) {
        console.error("PDF Canvas rendering error:", err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
    };
  }, [pdfUrl]);

  if (error) {
    return (
      <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-8 text-center space-y-4">
        <p className="text-sm text-[#57606a] dark:text-[#8b949e]">
          Unable to render PDF preview directly on screen.
        </p>
        <a
          href={pdfUrl}
          download="Harsh_Tripathi_Resume.pdf"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0969da] text-white px-4 py-2 text-xs font-mono font-bold"
        >
          <Download className="h-4 w-4" />
          <span>Download PDF Document</span>
        </a>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#161b22] p-4 sm:p-6 shadow-sm overflow-hidden flex flex-col items-center animate-in fade-in duration-200">
      {/* Top Banner Action */}
      <div className="w-full flex items-center justify-between gap-2 pb-4 text-xs font-mono text-[#57606a] dark:text-[#8b949e] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 mb-4 print:hidden">
        <span>Official Printable Document</span>
        <button
          type="button"
          onClick={onOpenFullscreen}
          className="inline-flex items-center gap-1.5 text-[#0969da] dark:text-[#58a6ff] hover:underline font-semibold"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span>Expand Fullscreen</span>
        </button>
      </div>

      {loading && (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#0969da] dark:text-[#58a6ff] print:hidden">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-xs font-mono">Rendering PDF Document Canvas...</span>
        </div>
      )}

      <div
        onClick={onOpenFullscreen}
        className={`w-full max-w-4xl transition-opacity duration-300 cursor-pointer group relative ${
          loading ? "opacity-0 h-0" : "opacity-100"
        }`}
      >
        <canvas
          ref={canvasRef}
          className="w-full rounded-xl shadow-md border border-[#d0d7de] dark:border-[#30363d] bg-white transition-transform group-hover:scale-[1.005]"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center print:hidden">
          <span className="bg-[#161b22]/90 text-white text-xs font-mono font-semibold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
            <Maximize2 className="h-4 w-4 text-[#58a6ff]" />
            Click to View Fullscreen
          </span>
        </div>
      </div>
    </div>
  );
}

function FullscreenPdfModal({
  pdfUrl,
  onClose,
}: {
  pdfUrl: string;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    let isMounted = true;
    const renderModalPdf = async () => {
      try {
        const pdfjsLib = (window as any)["pdfjs-dist/build/pdf"];
        if (!pdfjsLib) return;

        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const page = await pdf.getPage(1);
        if (!isMounted) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const viewport = page.getViewport({ scale: 2.2 });
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        if (isMounted) setLoading(false);
      } catch (err) {
        console.error("Modal PDF render error:", err);
      }
    };

    renderModalPdf();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      isMounted = false;
    };
  }, [pdfUrl, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b0e14]/95 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200 print:hidden">
      {/* Top Modal Controls */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between gap-4 pb-4 border-b border-[#30363d] text-white">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#58a6ff]" />
          <span className="font-mono text-sm font-bold">Harsh Tripathi &mdash; Official Resume</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={pdfUrl}
            download="Harsh_Tripathi_Resume.pdf"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0969da] hover:bg-[#085ac1] text-white px-3.5 py-1.5 text-xs font-mono font-bold transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-colors"
            aria-label="Close Fullscreen View"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Fullscreen Document Canvas */}
      <div className="flex-1 flex flex-col items-center justify-start py-6 w-full max-w-5xl mx-auto">
        {loading && (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#58a6ff]">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-xs font-mono">Loading Fullscreen High-Res Canvas...</span>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className={`w-full max-w-4xl rounded-xl shadow-2xl bg-white transition-opacity duration-300 ${
            loading ? "opacity-0 h-0" : "opacity-100"
          }`}
        />
      </div>
    </div>
  );
}

export function ResumeViewSwitcher({
  meta,
  experiences,
  certs,
  education,
}: ResumeViewSwitcherProps) {
  const [activeTab, setActiveTab] = useState<"web" | "pdf">("web");
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Fullscreen Lightbox Modal */}
      {isFullscreenOpen && (
        <FullscreenPdfModal
          pdfUrl="/resume.pdf"
          onClose={() => setIsFullscreenOpen(false)}
        />
      )}

      {/* Top Header & View Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d0d7de] dark:border-[#30363d] pb-6 print:hidden">
        <div className="space-y-1.5">
          <h1 className="flex items-center gap-2.5 text-lg font-bold tracking-tight sm:text-xl text-[#24292f] dark:text-[#f0f6fc]">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[#0969da] dark:text-[#58a6ff]" />
            <span>Curriculum Vitae / Resume</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e]">
            Official resume of {meta.name} ({meta.title}).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="/resume.pdf"
            download="Harsh_Tripathi_Resume.pdf"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0969da] hover:bg-[#085ac1] text-white px-4 py-2.5 text-xs font-mono font-bold shadow-xs transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      {/* Segmented View Switcher Control */}
      <div className="flex items-center justify-between gap-4 bg-[#f6f8fa] dark:bg-[#161b22] p-1.5 rounded-xl border border-[#d0d7de] dark:border-[#30363d] print:hidden">
        <div className="flex items-center gap-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("web")}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-mono font-semibold rounded-lg transition-all ${
              activeTab === "web"
                ? "bg-white dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff] shadow-xs border border-[#d0d7de]/80 dark:border-[#30363d]"
                : "text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#f0f6fc]"
            }`}
          >
            <FileCode className="h-4 w-4" />
            <span>Interactive Web View</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pdf")}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-mono font-semibold rounded-lg transition-all ${
              activeTab === "pdf"
                ? "bg-white dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff] shadow-xs border border-[#d0d7de]/80 dark:border-[#30363d]"
                : "text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#f0f6fc]"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>PDF Document View</span>
          </button>
        </div>

      </div>

      {/* Main Display Area */}
      {activeTab === "pdf" ? (
        <PdfCanvasViewer
          pdfUrl="/resume.pdf"
          name={meta.name}
          onOpenFullscreen={() => setIsFullscreenOpen(true)}
        />
      ) : (
        /* Web Document View */
        <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-6 sm:p-8 space-y-6 shadow-sm print:border-0 print:p-0 print:shadow-none animate-in fade-in duration-200">
          {/* Header Block */}
          <div className="border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-5 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-[#24292f] dark:text-[#f0f6fc]">
                {meta.name}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#57606a] dark:text-[#8b949e]" />
                  <span>{meta.location}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-[#57606a] dark:text-[#8b949e]" />
                  <span>{meta.email}</span>
                </span>
              </div>
            </div>
            <p className="text-sm font-mono text-[#0969da] dark:text-[#58a6ff]">
              {meta.title}
            </p>
            <p className="text-xs sm:text-sm text-[#57606a] dark:text-[#8b949e] leading-relaxed pt-2">
              {meta.summary}
            </p>
          </div>

          {/* Work Experience Section */}
          {experiences.length > 0 && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2">
                <Briefcase className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
                <span>Work Experience</span>
              </h3>

              <div className="space-y-5">
                {experiences.map((exp: Experience, idx: number) => {
                  return (
                    <div
                      key={exp.slug || idx}
                      className="space-y-2 transition-all duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="text-sm font-bold text-[#24292f] dark:text-[#f0f6fc]">
                          {exp.title}{" "}
                          <span className="text-[#0969da] dark:text-[#58a6ff]">
                            @ {exp.company_detail?.name || exp.title}
                          </span>
                        </h4>
                        <span className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
                          {exp.start_date} &mdash; {exp.end_date || "Present"}
                        </span>
                      </div>

                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-xs text-[#57606a] dark:text-[#8b949e] leading-relaxed pl-2">
                          {exp.highlights.map((h: string, hIdx: number) => (
                            <li key={hIdx}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AWS Certifications Section */}
          {certs.length > 0 && (
            <div className="space-y-4 pt-2">
              <h3 className="flex items-center gap-2 text-sm font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2">
                <Award className="h-4 w-4 text-[#d97706] dark:text-[#f59e0b]" />
                <span>AWS Certifications</span>
              </h3>

              <div className="space-y-3">
                {certs.map((c: Certification, cIdx: number) => {
                  return (
                    <div key={c.slug || cIdx} className="space-y-0.5 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between font-bold text-[#24292f] dark:text-[#f0f6fc]">
                        <span>{c.name}</span>
                        <span className="font-mono text-[#57606a] dark:text-[#8b949e]">
                          {c.issue_date}
                        </span>
                      </div>
                      <p className="text-[#57606a] dark:text-[#8b949e]">{c.issuer}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Education Section */}
          {education.length > 0 && (
            <div className="space-y-4 pt-2">
              <h3 className="flex items-center gap-2 text-sm font-bold text-[#24292f] dark:text-[#f0f6fc] border-b border-[#d0d7de]/60 dark:border-[#30363d]/60 pb-2">
                <GraduationCap className="h-4 w-4 text-[#0969da] dark:text-[#58a6ff]" />
                <span>Education</span>
              </h3>

              {education.map((edu: Education, eIdx: number) => (
                <div key={edu.slug || eIdx} className="space-y-1 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between font-bold text-[#24292f] dark:text-[#f0f6fc]">
                    <span>
                      {edu.degree} ({edu.field_of_study})
                    </span>
                    <span className="font-mono text-[#57606a] dark:text-[#8b949e]">
                      {edu.start_date} &mdash; {edu.end_date}
                    </span>
                  </div>
                  <p className="text-[#57606a] dark:text-[#8b949e]">
                    {edu.institution} &bull; {edu.grade}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
