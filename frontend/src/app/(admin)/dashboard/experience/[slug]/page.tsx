"use client";

import React, { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import { getAdminExperienceBySlug } from "@/lib/api/admin-client";
import { ExperienceEditorForm } from "@/components/experience/ExperienceEditorForm";
import type { Experience } from "@/lib/api/types";

interface EditExperiencePageProps {
  params: Promise<{ slug: string }>;
}

export default function EditExperiencePage({ params }: EditExperiencePageProps) {
  const { slug } = use(params);

  const { data: experience, isLoading, error } = useQuery<Experience>({
    queryKey: ["admin-experience", slug],
    queryFn: () => getAdminExperienceBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] max-w-5xl mx-auto">
        <RefreshCw className="h-6 w-6 animate-spin text-[#0969da] dark:text-[#58a6ff]" />
        <p className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
          Loading canonical experience data for {slug}...
        </p>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="rounded-xl border border-[#cf222e]/30 bg-[#ffebe9] dark:bg-[#2b1011] p-6 text-center space-y-3 max-w-5xl mx-auto text-[#cf222e] dark:text-[#ff7b72]">
        <AlertCircle className="h-6 w-6 mx-auto" />
        <h2 className="text-sm font-bold font-mono">Experience Record Not Found</h2>
        <p className="text-xs text-[#57606a] dark:text-[#8b949e]">
          {(error as Error)?.message || `Could not find an experience with slug "${slug}".`}
        </p>
        <Link
          href="/dashboard/experience"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#21262d] text-[#24292f] dark:text-[#c9d1d9] no-underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Experience List</span>
        </Link>
      </div>
    );
  }

  return <ExperienceEditorForm initialData={experience} isNew={false} />;
}
