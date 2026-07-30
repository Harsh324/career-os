import type { CareerMeta } from "./types/meta.js";
import type { Company } from "./types/company.js";
import type { Experience } from "./types/experience.js";
import type { Project } from "./types/project.js";
import type { Education } from "./types/education.js";
import type { Skill } from "./types/skill.js";
import type { Certification } from "./types/certification.js";
import type { Award } from "./types/award.js";
import type { BlogPost } from "./types/blog.js";
import type { Publication } from "./types/publication.js";
import type { TimelineEvent } from "./types/timeline.js";

/**
 * ContentGraph — the canonical, in-memory representation of all career data.
 *
 * Produced by: packages/content-parser
 * Consumed by: all generators and apps (read-only, per P6)
 *
 * Design constraints:
 * - This interface is the single authoritative type (P2)
 * - Consumers must treat it as immutable (P6)
 * - The extensions field provides a stable plugin point (P5, P10)
 */
export interface ContentGraph {
  meta: CareerMeta;
  companies: Company[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  awards: Award[];
  blog: BlogPost[];
  publications: Publication[];
  timeline: TimelineEvent[];

  /**
   * Extension point for community-contributed content types (P10 — backward compatible).
   * Community generators register their content type name and populate this field
   * at parse time. The core ContentGraph interface never needs modification for new types.
   *
   * @example
   * // A community "patents" content type:
   * graph.extensions["patents"] // → PatentEntry[]
   */
  extensions: Record<string, unknown[]>;
}
