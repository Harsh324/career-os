/**
 * @career-os/shared-utils
 *
 * Responsibility (P5): Zero-domain utility functions shared across all
 * packages and apps. No business logic — pure utilities, constants, and
 * error types. No dependency on content-schema or any domain package.
 *
 * Utilities to implement:
 *   - Date: resolveDate, formatDate, isoToDisplay, compareDates
 *   - String: slugify, truncate, toTitleCase, estimateReadingTime
 *   - File: ensureDir, writeJsonAtomic, readJsonFile
 *   - Logger: createLogger (structured, with levels)
 *   - Errors: CareerOSError (typed base class)
 *   - Constants: DATE_FORMAT, CONTENT_TYPES
 *
 * @milestone Milestone 1 — Content Pipeline
 */

// TODO: Implement utilities in Milestone 1
// export { slugify, truncate, toTitleCase } from "./string.js";
// export { resolveDate, formatDate, compareDates } from "./date.js";
// export { ensureDir, writeJsonAtomic } from "./fs.js";
// export { createLogger } from "./logger.js";
// export { CareerOSError } from "./errors.js";
// export { DATE_FORMAT, CONTENT_TYPES } from "./constants.js";

export const VERSION = "0.0.0" as const;
