import { z } from "zod";

const YearMonthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/, "Date must be in YYYY-MM or YYYY-MM-DD format");

/**
 * An award or recognition entry.
 * Sourced from: content/raw/awards/<slug>.md
 */
export const AwardSchema = z.object({
  title: z.string().min(1, "title is required"),
  issuer: z.string().min(1, "issuer is required"),
  date: YearMonthSchema,
  description: z.string().optional(),
  url: z.string().url().optional(),
  featured: z.boolean().default(false),
  /**
   * Controls whether this award appears in generated resume output.
   * YAML key: resume_include (snake_case) — normalised to resumeInclude by content-parser.
   */
  resumeInclude: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  slug: z.string().optional(),
});

export type Award = z.infer<typeof AwardSchema>;
