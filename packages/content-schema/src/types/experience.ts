import { z } from "zod";

/** YYYY-MM date format — the canonical date format for all content (P7 — reproducible). */
const YearMonthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/, "Date must be in YYYY-MM or YYYY-MM-DD format");

export const EmploymentTypeSchema = z.enum([
  "full-time",
  "part-time",
  "contract",
  "freelance",
  "internship",
  "volunteer",
]);

/**
 * A single work experience entry.
 * Sourced from: content/raw/experience/<slug>.md (front matter + body)
 *
 * featured: surface prominently on portfolio website (display weight)
 * resumeInclude: binary gate controlling resume output inclusion
 * These fields are intentionally separate — see ARCHITECTURE.md for semantics.
 */
export const ExperienceSchema = z.object({
  title: z.string().min(1, "title is required"),
  company: z.string().min(1, "company is required"),
  location: z.string().optional(),
  startDate: YearMonthSchema,
  endDate: z.union([YearMonthSchema, z.literal("present")]),
  employmentType: EmploymentTypeSchema.optional(),
  featured: z.boolean().default(false),
  /**
   * Controls whether this entry appears in any generated resume output.
   * YAML key: resume_include (snake_case) — normalised to resumeInclude by content-parser.
   * Distinct from featured: an entry can be resume_include: true without being featured.
   * See ARCHITECTURE.md §Field Semantics for full explanation.
   */
  resumeInclude: z.boolean().default(true),
  technologies: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  /** Markdown body — the narrative description of the role */
  body: z.string().optional(),
  /** Derived slug — inferred from filename, not authored */
  slug: z.string().optional(),
});

export type Experience = z.infer<typeof ExperienceSchema>;
export type EmploymentType = z.infer<typeof EmploymentTypeSchema>;
