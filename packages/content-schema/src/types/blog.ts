import { z } from "zod";

const YearMonthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Date must be in YYYY-MM format");

/**
 * A blog post.
 * Sourced from: content/raw/blog/<slug>.md (front matter + body)
 */
export const BlogPostSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().min(1, "description is required"),
  publishedDate: YearMonthSchema,
  updatedDate: YearMonthSchema.optional(),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  /** Estimated reading time in minutes — derived by content-parser, not authored */
  readingTimeMinutes: z.number().int().positive().optional(),
  body: z.string().optional(),
  slug: z.string().optional(),
});

export type BlogPost = z.infer<typeof BlogPostSchema>;
