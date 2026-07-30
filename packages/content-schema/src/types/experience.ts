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

export const ChallengeSchema = z.object({
  problem: z.string(),
  solution: z.string(),
  impact: z.string(),
});

export const MetricSchema = z.object({
  label: z.string(),
  value: z.string(),
});

/**
 * A single work experience entry.
 * Sourced from: content/raw/experience/<slug>.md (front matter + body)
 */
export const ExperienceSchema = z.object({
  title: z.string().min(1, "title is required"),
  company: z.string().min(1, "company is required"),
  companySlug: z.string().optional(),
  location: z.string().optional(),
  startDate: YearMonthSchema,
  endDate: z.union([YearMonthSchema, z.literal("present")]),
  employmentType: EmploymentTypeSchema.optional(),
  featured: z.boolean().default(false),
  resumeInclude: z.boolean().default(true),
  description: z.string().optional(),
  subtitle: z.string().optional(),
  mission: z.string().optional(),
  roleSummary: z.string().optional(),
  highlights: z.array(z.string()).default([]),
  coreStack: z.array(z.string()).default([]),
  focusAreas: z.array(z.string()).default([]),
  techGroups: z.record(z.array(z.string())).optional(),
  challenges: z.array(ChallengeSchema).default([]),
  metrics: z.array(MetricSchema).default([]),
  team: z.string().optional(),
  ownership: z.string().optional(),
  lessonsLearned: z.array(z.string()).default([]),
  relatedProjects: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  /** Markdown body — the narrative description of the role */
  body: z.string().optional(),
  /** Derived slug — inferred from filename, not authored */
  slug: z.string().optional(),
});

export type Experience = z.infer<typeof ExperienceSchema>;
export type EmploymentType = z.infer<typeof EmploymentTypeSchema>;
export type Challenge = z.infer<typeof ChallengeSchema>;
export type Metric = z.infer<typeof MetricSchema>;
