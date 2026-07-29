/**
 * @career-os/github-generator
 *
 * Responsibility (P5): Transform ContentGraph into GitHub-flavored Markdown.
 * Implements: Generator<GitHubConfig> from @career-os/content-schema
 *
 * Outputs (written to output/github-profile/, never committed per P3):
 *   - README.md for the GitHub profile (username/username repo)
 *   - Per-project README fragments (optional)
 *
 * Design constraints:
 *   - Never reads from content/raw/ directly (P6)
 *   - Given identical ContentGraph + config → identical output (P7)
 *   - featured field on content entries determines what is surfaced
 *
 * @milestone Milestone 4 — GitHub Profile Generation
 */

import type { Generator, GeneratorResult, ContentGraph } from "@career-os/content-schema";

export interface GitHubConfig {
  outputDir: string;
  username: string;
  includeStats: boolean;
}

// TODO: Implement GitHubGenerator in Milestone 4
export class GitHubGenerator implements Generator<GitHubConfig> {
  readonly name = "github";
  readonly version = "0.0.0";

  async generate(_graph: ContentGraph, _config: GitHubConfig): Promise<GeneratorResult> {
    throw new Error("GitHubGenerator is not yet implemented. See Milestone 4.");
  }
}
