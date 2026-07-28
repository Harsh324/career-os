import { z } from "zod";

const YearMonthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Date must be in YYYY-MM format");

export const PublicationTypeSchema = z.enum([
  "article",
  "conference-paper",
  "talk",
  "podcast",
  "workshop",
  "other",
]);

/**
 * An external publication, talk, or article.
 * Sourced from: content/raw/publications/<slug>.md
 *
 * Distinct from blog/ — publications are external (on other platforms, conferences, etc.)
 */
export const PublicationSchema = z.object({
  title: z.string().min(1, "title is required"),
  type: PublicationTypeSchema,
  venue: z.string().min(1, "venue is required"),
  date: YearMonthSchema,
  url: z.string().url().optional(),
  abstract: z.string().optional(),
  featured: z.boolean().default(false),
  resumeInclude: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  slug: z.string().optional(),
});

export type Publication = z.infer<typeof PublicationSchema>;
export type PublicationType = z.infer<typeof PublicationTypeSchema>;
