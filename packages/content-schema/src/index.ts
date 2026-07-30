/**
 * @career-os/content-schema
 *
 * The single type authority for the Career OS platform.
 * All packages and apps import domain types from here — never redefine them (P2, P4).
 *
 * Exports:
 * - Zod schemas (runtime validation)
 * - TypeScript types (inferred from schemas)
 * - ContentGraph (the canonical data aggregate)
 * - Generator interface (shared generator contract)
 */

// ── Zod Schemas + Inferred Types ─────────────────────────────────────────────

export {
  CareerMetaSchema,
  SocialLinksSchema,
  type CareerMeta,
  type SocialLinks,
} from "./types/meta";

export { CompanySchema, type Company } from "./types/company";

export {
  ExperienceSchema,
  EmploymentTypeSchema,
  type Experience,
  type EmploymentType,
  type Challenge,
  type Metric,
} from "./types/experience";

export {
  ProjectSchema,
  ProjectStatusSchema,
  type Project,
  type ProjectStatus,
} from "./types/project";

export {
  EducationSchema,
  DegreeTypeSchema,
  type Education,
  type DegreeType,
} from "./types/education";

export {
  SkillSchema,
  SkillLevelSchema,
  SkillCategorySchema,
  type Skill,
  type SkillLevel,
  type SkillCategory,
} from "./types/skill";

export { CertificationSchema, type Certification } from "./types/certification";

export { AwardSchema, type Award } from "./types/award";

export { BlogPostSchema, type BlogPost } from "./types/blog";

export {
  PublicationSchema,
  PublicationTypeSchema,
  type Publication,
  type PublicationType,
} from "./types/publication";

export {
  TimelineEventSchema,
  TimelineEventTypeSchema,
  type TimelineEvent,
  type TimelineEventType,
} from "./types/timeline";

// ── ContentGraph ──────────────────────────────────────────────────────────────

export type { ContentGraph } from "./graph";

// ── Generator Interface ───────────────────────────────────────────────────────

export type { Generator, GeneratorResult, GeneratedFile } from "./generator";

// ── Platform Configuration ────────────────────────────────────────────────────

export { defineConfig, type CareerOSConfig } from "./config";
