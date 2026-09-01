"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import type { Certification } from "@/lib/api/types";
import { getAdminCertificationBySlug } from "@/lib/api/admin-client";
import { CertificationEditorForm } from "@/components/certifications/CertificationEditorForm";

export default function EditCertificationPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [cert, setCert] = useState<Certification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCert() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const data = await getAdminCertificationBySlug(slug);
        setCert(data);
      } catch (err: any) {
        setError(err.message || "Failed to load certification record.");
      } finally {
        setIsLoading(false);
      }
    }
    loadCert();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#0969da] dark:text-[#58a6ff]" />
        <p className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
          Loading Certification Record...
        </p>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="p-6 rounded-xl bg-[#ffebe9] dark:bg-red-950/40 border border-[#ff8182]/50 dark:border-red-800/60 text-[#cf222e] dark:text-red-300 text-xs flex items-center gap-3">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span>{error || "Certification record not found."}</span>
      </div>
    );
  }

  return <CertificationEditorForm initialCertification={cert} isNew={false} />;
}
