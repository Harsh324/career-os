/**
 * @career-os/content-parser
 *
 * Responsibility (P5): Transform raw Markdown files into a validated,
 * normalized ContentGraph. This is the ONLY package that reads from
 * content/raw/. Consumers receive the ContentGraph and never touch
 * raw files (P6 — consumers never mutate content).
 *
 * Pipeline:
 *   content/raw/**\/*.md
 *     → discover (find all .md files)
 *     → parse (extract YAML front matter + body)
 *     → validate (Zod schemas from @career-os/content-schema)
 *     → normalize (resolve dates, derive slugs, sort)
 *     → ContentGraph
 *
 * Public API:
 *   parseContent(rawDir: string, options?: ParseOptions): Promise<ContentGraph>
 *
 * @see packages/content-schema for the schema definitions
 * @milestone Milestone 1 — Content Pipeline
 */

export type { ContentGraph } from "@career-os/content-schema";

// TODO: Implement parseContent in Milestone 1
// import { parseContent } from "./parse.js";
// export { parseContent };
// export type { ParseOptions } from "./options.js";
