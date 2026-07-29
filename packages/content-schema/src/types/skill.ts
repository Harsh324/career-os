import { z } from "zod";

export const SkillLevelSchema = z.enum(["beginner", "intermediate", "advanced", "expert"]);

export const SkillCategorySchema = z.enum([
  "languages",
  "frameworks",
  "databases",
  "cloud",
  "devops",
  "tools",
  "methodologies",
  "soft-skills",
  "other",
]);

/**
 * A single skill entry.
 * Sourced from: content/raw/skills/<slug>.md
 */
export const SkillSchema = z.object({
  name: z.string().min(1, "name is required"),
  category: SkillCategorySchema,
  level: SkillLevelSchema.optional(),
  yearsOfExperience: z.number().int().min(0).optional(),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export type Skill = z.infer<typeof SkillSchema>;
export type SkillLevel = z.infer<typeof SkillLevelSchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
