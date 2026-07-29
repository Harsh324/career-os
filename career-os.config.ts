import { defineConfig } from "@career-os/content-schema";

/**
 * Career OS Core Platform Configuration
 *
 * Governs content directory locations, active output generators,
 * and global pipeline options.
 */
export default defineConfig({
  contentDir: "content/raw",
  outputDir: "output",
  generators: [],
});
