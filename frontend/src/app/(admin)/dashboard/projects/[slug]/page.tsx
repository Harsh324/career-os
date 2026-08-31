"use client";

import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import { getAdminProjectBySlug } from "@/lib/api/admin-client";
import { ProjectEditorForm } from "@/components/project/ProjectEditorForm";
import type { Project } from "@/lib/api/types";

interface EditProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const { slug } = use(params);

  const {
    data: project,
    isLoading,
    error,
  } = useQuery<Project>({
    queryKey: ["admin-project", slug],
    queryFn: () => getAdminProjectBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-3 rounded-xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] max-w-4xl mx-auto">
        <RefreshCw className="h-6 w-6 animate-spin text-[#0969da] dark:text-[#58a6ff]" />
        <p className="text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
          Loading canonical project record from PostgreSQL...
        </p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="rounded-xl border border-[#cf222e]/30 bg-[#ffebe9] dark:bg-[#2b1011] p-8 text-center space-y-4 max-w-xl mx-auto">
        <AlertCircle className="h-8 w-8 text-[#cf222e] dark:text-[#ff7b72] mx-auto" />
        <h2 className="text-base font-bold font-mono text-[#cf222e] dark:text-[#ff7b72]">
          Project Not Found
        </h2>
        <p className="text-xs text-[#57606a] dark:text-[#8b949e]">
          {(error as Error)?.message || `No project with slug "${slug}" exists in Career OS database.`}
        </p>
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-medium rounded-lg bg-[#24292f] dark:bg-[#f0f6fc] text-white dark:text-[#24292f] hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects List</span>
        </Link>
      </div>
    );
  }

  return <ProjectEditorForm initialProject={project} isNew={false} />;
}
