import { z } from "zod";

/**
 * Social links for a career profile.
 * All fields are optional — only add what you publicly share.
 */
export const SocialLinksSchema = z.object({
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  twitter: z.string().url().optional(),
  bluesky: z.string().url().optional(),
  website: z.string().url().optional(),
  email: z.string().email().optional(),
});

/**
 * Top-level career metadata.
 * This is the single identity record for the platform.
 * Sourced from: content/raw/meta.md (front matter)
 */
export const CareerMetaSchema = z.object({
  name: z.string().min(1, "name is required"),
  title: z.string().min(1, "title is required"),
  location: z.string().optional(),
  tagline: z.string().max(160).optional(),
  summary: z.string().optional(),
  social: SocialLinksSchema.optional(),
  avatarUrl: z.string().url().optional(),
});

export type CareerMeta = z.infer<typeof CareerMetaSchema>;
export type SocialLinks = z.infer<typeof SocialLinksSchema>;
