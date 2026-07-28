/**
 * @career-os/website-generator
 *
 * Responsibility (P5): Provide typed data-loading functions for the Next.js
 * portfolio website. This is NOT a file-writing generator — it is a
 * server-side data-access layer that Next.js React Server Components call.
 *
 * Design: The website app is a thin UI shell. All data logic lives here,
 * making it independently testable without spinning up Next.js.
 *
 * Public API (to be implemented):
 *   getContentGraph()           → ContentGraph  (full graph, cached)
 *   getExperience(filter?)      → Experience[]
 *   getFeaturedExperience()     → Experience[]
 *   getProjects(filter?)        → Project[]
 *   getFeaturedProjects()       → Project[]
 *   getBlogPosts(filter?)       → BlogPost[]
 *   getSkillsByCategory()       → Record<SkillCategory, Skill[]>
 *   getTimeline()               → TimelineEvent[]
 *
 * @milestone Milestone 2 — Portfolio Website
 */

export type { ContentGraph } from "@career-os/content-schema";

// TODO: Implement data-access functions in Milestone 2
