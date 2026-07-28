import { z } from "zod";

const YearMonthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Date must be in YYYY-MM format");

export const ProjectStatusSchema = z.enum(["active", "archived", "experimental", "wip"]);

/**
 * A single project entry.
 * Sourced from: content/raw/projects/<slug>.md (front matter + body)
 */
export const ProjectSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().min(1, "description is required"),
  status: ProjectStatusSchema.default("active"),
  startDate: YearMonthSchema.optional(),
  endDate: z.union([YearMonthSchema, z.literal("present")]).optional(),
  featured: z.boolean().default(false),
  resumeInclude: z.boolean().default(false),
  technologies: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  githubUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  body: z.string().optional(),
  slug: z.string().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;
