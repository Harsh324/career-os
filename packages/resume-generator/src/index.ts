/**
 * @career-os/resume-generator
 *
 * Responsibility (P5): Transform ContentGraph into resume artifacts.
 * Implements: Generator<ResumeConfig> from @career-os/content-schema
 *
 * Outputs (written to output/resume/, never committed per P3):
 *   - LaTeX source (.tex)
 *   - Compiled PDF (.pdf) — requires latexmk in the container
 *
 * Design constraints:
 *   - Never reads from content/raw/ directly (P6 — consumers don't touch raw)
 *   - Given identical ContentGraph + config → identical output (P7)
 *   - resumeInclude field on each content entry gates inclusion
 *
 * @milestone Milestone 3 — Resume Generation
 */

import type { Generator, GeneratorResult, ContentGraph } from "@career-os/content-schema";

export interface ResumeConfig {
  outputDir: string;
  template: "classic" | "modern" | "compact";
  locale: string;
}

// TODO: Implement ResumeGenerator in Milestone 3
export class ResumeGenerator implements Generator<ResumeConfig> {
  readonly name = "resume";
  readonly version = "0.0.0";

  async generate(_graph: ContentGraph, _config: ResumeConfig): Promise<GeneratorResult> {
    throw new Error("ResumeGenerator is not yet implemented. See Milestone 3.");
  }
}
