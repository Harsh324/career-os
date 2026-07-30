import { z } from "zod";

/**
 * Company entity schema.
 * Sourced from: content/raw/companies/<slug>.md
 */
export const CompanySchema = z.object({
  name: z.string().min(1, "company name is required"),
  legalName: z.string().optional(),
  logo: z.string().optional(),
  website: z.string().url("website must be a valid URL"),
  careers: z.string().url("careers link must be a valid URL").optional(),
  linkedin: z.string().url("linkedin link must be a valid URL").optional(),
  industry: z.string().min(1, "industry is required"),
  companySize: z.string().min(1, "company size is required"),
  headquarters: z.string().min(1, "headquarters is required"),
  founded: z.union([z.number(), z.string()]).optional(),
  description: z.string().min(1, "description is required"),
  shortDescription: z.string().min(1, "shortDescription is required"),
  slug: z.string().optional(),
  body: z.string().optional(),
});

export type Company = z.infer<typeof CompanySchema>;
