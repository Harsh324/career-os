/**
 * @career-os/sdk
 *
 * Responsibility (P5): Canonical, typed query SDK over the ContentGraph.
 * Serves all platform consumers: portfolio website, future API server, CLI, AI agents.
 *
 * Design constraints:
 *   - Read-only data access layer (P6 — consumers never mutate content)
 *   - Wraps ContentGraph with high-level filtering, sorting, and category grouping (P4 — no duplicated query logic)
 *   - Decoupled from application frameworks (Next.js, Express, Hono)
 *
 * Architecture reference: ARCHITECTURE.md §SDK Layer & ADR-0004
 *
 * Usage:
 *   import { createCareerOS } from "@career-os/sdk";
 *   const career = createCareerOS(graph);
 *   const projects = career.projects({ featured: true });
 */

export { CareerOS, createCareerOS } from "./sdk.js";
export type { ProjectFilter, ExperienceFilter, BlogFilter } from "./sdk.js";
export type { ContentGraph } from "@career-os/content-schema";
