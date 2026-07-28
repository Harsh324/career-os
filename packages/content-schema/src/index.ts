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
} from "./types/meta.js";

export {
  ExperienceSchema,
  EmploymentTypeSchema,
  type Experience,
  type EmploymentType,
} from "./types/experience.js";

export {
  ProjectSchema,
  ProjectStatusSchema,
  type Project,
  type ProjectStatus,
} from "./types/project.js";

export {
  EducationSchema,
  DegreeTypeSchema,
  type Education,
  type DegreeType,
} from "./types/education.js";

export {
  SkillSchema,
  SkillLevelSchema,
  SkillCategorySchema,
  type Skill,
  type SkillLevel,
  type SkillCategory,
} from "./types/skill.js";

export { CertificationSchema, type Certification } from "./types/certification.js";

export { AwardSchema, type Award } from "./types/award.js";

export { BlogPostSchema, type BlogPost } from "./types/blog.js";

export {
  PublicationSchema,
  PublicationTypeSchema,
  type Publication,
  type PublicationType,
} from "./types/publication.js";

export {
  TimelineEventSchema,
  TimelineEventTypeSchema,
  type TimelineEvent,
  type TimelineEventType,
} from "./types/timeline.js";

// ── ContentGraph ──────────────────────────────────────────────────────────────

export type { ContentGraph } from "./graph.js";

// ── Generator Interface ───────────────────────────────────────────────────────

export type { Generator, GeneratorResult, GeneratedFile } from "./generator.js";
