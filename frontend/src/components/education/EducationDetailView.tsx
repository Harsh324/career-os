import React from "react";
import {
  GraduationCap,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import type { Education } from "@/lib/api/types";

interface EducationDetailViewProps {
  education: Education;
  isDraftPreview?: boolean;
}

export function EducationDetailView({ education, isDraftPreview = false }: EducationDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* Institution & Degree Header Card */}
      <div className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-[#dafbe1] dark:bg-[#1f883d]/20 text-[#1a7f37] dark:text-[#3fb950] border border-[#1a7f37]/30 dark:border-[#3fb950]/30">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{education.currently_studying ? "Currently Studying" : "Degree Conferred"}</span>
            </span>

            {education.grade && (
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-[#f6f8fa] dark:bg-[#21262d] text-[#0969da] dark:text-[#58a6ff] border border-[#d0d7de] dark:border-[#30363d]">
                {education.grade}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-[#57606a] dark:text-[#8b949e]">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {education.start_date} – {education.currently_studying ? "Present" : education.end_date}
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#24292f] dark:text-[#f0f6fc] tracking-tight">
            {education.degree}
          </h1>
          <p className="text-sm sm:text-base font-semibold text-[#0969da] dark:text-[#58a6ff] mt-1">
            {education.institution}
          </p>
          {education.location && (
            <p className="text-xs font-mono text-[#57606a] dark:text-[#8b949e] flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{education.location}</span>
            </p>
          )}
        </div>

        {education.description && (
          <p className="text-sm text-[#24292f] dark:text-[#c9d1d9] leading-relaxed pt-2 border-t border-[#d0d7de]/60 dark:border-[#30363d]/60">
            {education.description}
          </p>
        )}
      </div>

      {/* Key Achievements */}
      {education.achievements && education.achievements.length > 0 && (
        <section className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-3 shadow-xs">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#57606a] dark:text-[#8b949e] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#d97706] dark:text-[#f59e0b]" />
            <span>Key Accomplishments & Focus Areas</span>
          </h2>
          <ul className="space-y-2 text-sm text-[#24292f] dark:text-[#c9d1d9]">
            {education.achievements.map((ach, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1a7f37] dark:text-[#3fb950] shrink-0 mt-0.5" />
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Relevant Coursework */}
      {education.relevant_courses && education.relevant_courses.length > 0 && (
        <section className="rounded-2xl border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#161b22] p-5 space-y-3 shadow-xs">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#57606a] dark:text-[#8b949e] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0969da] dark:text-[#58a6ff]" />
            <span>Relevant Coursework & Systems Studies</span>
          </h2>
          <div className="flex flex-wrap gap-2 pt-1">
            {education.relevant_courses.map((course, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-[#f6f8fa] dark:bg-[#21262d] text-[#24292f] dark:text-[#c9d1d9] border border-[#d0d7de] dark:border-[#30363d]"
              >
                {course}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
