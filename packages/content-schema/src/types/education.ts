import { z } from "zod";

const YearMonthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/, "Date must be in YYYY-MM or YYYY-MM-DD format");

export const DegreeTypeSchema = z.enum([
  "bachelor",
  "master",
  "phd",
  "associate",
  "diploma",
  "certificate",
  "bootcamp",
  "online-course",
  "self-study",
]);

/**
 * An education entry (degree, course, bootcamp, or self-study).
 * Sourced from: content/raw/education/<slug>.md
 */
export const EducationSchema = z.object({
  institution: z.string().min(1, "institution is required"),
  degree: DegreeTypeSchema,
  field: z.string().min(1, "field of study is required"),
  startDate: YearMonthSchema.optional(),
  endDate: z.union([YearMonthSchema, z.literal("present")]).optional(),
  gpa: z.number().min(0).max(4.0).optional(),
  honors: z.string().optional(),
  featured: z.boolean().default(false),
  resumeInclude: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  body: z.string().optional(),
  slug: z.string().optional(),
});

export type Education = z.infer<typeof EducationSchema>;
export type DegreeType = z.infer<typeof DegreeTypeSchema>;
