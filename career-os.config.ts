import type { Generator } from "@career-os/content-schema";

/**
 * Career OS Core Platform Configuration
 *
 * This configuration governs content locations, active generators,
 * and global pipeline options.
 */
export interface CareerOSConfig {
  /** Path to raw Markdown content directory (relative to workspace root). Default: "content/raw" */
  contentDir: string;

  /** Path to generated output directory (relative to workspace root). Default: "output" */
  outputDir: string;

  /** Registered output generators */
  generators: Generator[];
}

const config: CareerOSConfig = {
  contentDir: "content/raw",
  outputDir: "output",
  generators: [],
};

export default config;
