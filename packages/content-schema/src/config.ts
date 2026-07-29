import type { Generator } from "./generator.js";

/**
 * Career OS Core Platform Configuration
 */
export interface CareerOSConfig {
  /** Path to raw Markdown content directory (relative to workspace root). Default: "content/raw" */
  contentDir: string;

  /** Path to generated output directory (relative to workspace root). Default: "output" */
  outputDir: string;

  /** Registered output generators */
  generators: Generator[];
}

/**
 * Helper function for defining a type-safe Career OS configuration in career-os.config.ts.
 * Provides IDE autocomplete and compile-time validation (P2).
 *
 * @example
 * import { defineConfig } from "@career-os/content-schema";
 *
 * export default defineConfig({
 *   contentDir: "content/raw",
 *   outputDir: "output",
 *   generators: [],
 * });
 */
export function defineConfig(config: CareerOSConfig): CareerOSConfig {
  return config;
}
