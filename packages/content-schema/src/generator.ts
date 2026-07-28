import type { ContentGraph } from "./graph.js";

/**
 * A file produced by a generator run.
 */
export interface GeneratedFile {
  /** Absolute path where the file was written. */
  path: string;
  /** Size in bytes of the written file. */
  sizeBytes: number;
}

/**
 * The result of a single generator invocation.
 */
export interface GeneratorResult {
  /** Files written to disk during this run. */
  outputs: GeneratedFile[];
  /** Non-fatal warnings to surface to the developer. */
  warnings: string[];
}

/**
 * The shared contract for all Career OS output generators (P5 — single responsibility).
 *
 * Generators are stateless — they receive the full ContentGraph and return files.
 * They never mutate the ContentGraph (P6) or write to content/raw/ (P1).
 * Given identical inputs, generate() must return identical outputs (P7).
 *
 * Registered in: career-os.config.ts
 * Defined in: packages/content-schema (P2 — one owner for this interface)
 *
 * @example
 * class ResumeGenerator implements Generator<ResumeConfig> {
 *   readonly name = "resume";
 *   readonly version = "0.1.0";
 *   async generate(graph, config) { ... }
 * }
 */
export interface Generator<TConfig = unknown> {
  /** Unique, stable identifier (e.g., "resume", "website", "github"). */
  readonly name: string;
  /** Semantic version of this generator implementation. */
  readonly version: string;
  /**
   * Execute the generator.
   * @param graph - The immutable ContentGraph (do not mutate)
   * @param config - Generator-specific configuration from career-os.config.ts
   */
  generate(graph: ContentGraph, config: TConfig): Promise<GeneratorResult>;
}
