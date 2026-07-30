/**
 * @career-os/content-parser
 *
 * Responsibility (P5): Transforms raw Markdown files from content/raw/ into a validated,
 * normalized ContentGraph. The ONLY package that reads from content/raw/ — consumers
 * never touch raw content directly (P6).
 *
 * Architecture reference: ARCHITECTURE.md §Package Architecture
 */

export { parseContent, ContentValidationError } from "./parser";
