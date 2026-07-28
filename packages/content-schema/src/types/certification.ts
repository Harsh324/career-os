import { z } from "zod";

const YearMonthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Date must be in YYYY-MM format");

/**
 * A certification or license entry.
 * Sourced from: content/raw/certifications/<slug>.md
 */
export const CertificationSchema = z.object({
  name: z.string().min(1, "name is required"),
  issuer: z.string().min(1, "issuer is required"),
  issuedDate: YearMonthSchema,
  expiryDate: YearMonthSchema.optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
  resumeInclude: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  slug: z.string().optional(),
});

export type Certification = z.infer<typeof CertificationSchema>;
