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
 * Public API (Milestone 2 implementation):
 *   career.getContentGraph()       → ContentGraph
 *   career.getExperience(filter?)  → Experience[]
 *   career.getFeaturedProjects()   → Project[]
 *   career.getSkillsByCategory()   → Record<SkillCategory, Skill[]>
 *   career.getTimeline()           → TimelineEvent[]
 */

export type { ContentGraph } from "@career-os/content-schema";

// TODO: Implement SDK query functions in Milestone 2
