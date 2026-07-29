/**
 * @career-os/ai-engine
 *
 * Responsibility (P5): Orchestrate LLM calls to enrich a ContentGraph with
 * AI-generated content. This package is the ONLY entry point to any LLM API.
 *
 * Design constraints:
 *   - All AI output is staged to output/ai-drafts/ — never written to content/raw/ (P1, P8)
 *   - LLM providers are abstracted behind LLMProvider — switching providers is a config change (P4)
 *   - All prompts live in packages/ai-engine/prompts/ as versioned Markdown files — never hardcoded (P1)
 *
 * Architecture reference: ARCHITECTURE.md §AI Integration Architecture
 *
 * @milestone Milestone 5 — AI Synthesis Layer
 */

// ─── Provider Abstraction ────────────────────────────────────────────────────

/**
 * Options for a single LLM completion request.
 * All fields are optional to avoid breaking changes as capabilities expand (P10).
 */
export interface CompletionOptions {
  /** Maximum tokens to generate. Caps cost in CI environments with metered keys. */
  maxTokens?: number;
  /** Sampling temperature. Defaults to 0.7. Lower = more deterministic (P7). */
  temperature?: number;
  /**
   * If true, return a cost estimate instead of making a real API call.
   * Use before committing to metered operations in CI.
   */
  dryRun?: boolean;
  /**
   * Reserved for streaming support — not yet implemented.
   * Field present so future addition is non-breaking (P10).
   */
  stream?: false;
}

/**
 * The shared contract for all LLM provider implementations.
 *
 * Implementations: OpenAIProvider, AnthropicProvider, OllamaProvider
 * Registered in: career-os.config.ts (future — post Milestone 5)
 *
 * @example
 * const provider: LLMProvider = new OpenAIProvider({ apiKey: process.env.OPENAI_KEY });
 * const bio = await provider.complete(prompt, { maxTokens: 500, temperature: 0.6 });
 */
export interface LLMProvider {
  /** Complete a prompt and return the generated text. */
  complete(prompt: string, options?: CompletionOptions): Promise<string>;
  /** Identifier of the model being used (e.g., "gpt-4o", "claude-3-5-sonnet"). */
  readonly model: string;
  /** Maximum context window in tokens for this model. */
  readonly contextWindow: number;
}

// ─── Prompt System ───────────────────────────────────────────────────────────

/**
 * Metadata declared in the YAML front matter of every prompt file in packages/ai-engine/prompts/.
 *
 * Prompt files are versioned Markdown: packages/ai-engine/prompts/professional-bio.v1.md
 * They use Handlebars-style {{variable}} placeholders for dynamic data injection.
 */
export interface PromptMetadata {
  /** Prompt identifier (matches filename stem, e.g., "professional-bio.v1"). */
  id: string;
  /** Human-readable description of what this prompt generates. */
  description: string;
  /** Input variable names required by this prompt (used for validation before call). */
  inputs: string[];
  /** Expected output format (e.g., "markdown", "plain-text", "json"). */
  outputFormat: "markdown" | "plain-text" | "json";
  /** Recommended model for this prompt (informational — actual model set by provider). */
  recommendedModel?: string;
}

// ─── Staging ─────────────────────────────────────────────────────────────────

/**
 * Result of a single AI generation run.
 * Output is always written to output/ai-drafts/ — never to content/raw/ (P8).
 */
export interface AIGenerationResult {
  /** Absolute path to the staged draft file in output/ai-drafts/. */
  draftPath: string;
  /** The prompt ID that produced this output. */
  promptId: string;
  /** Token usage for cost tracking. */
  tokensUsed?: number;
}

// TODO: Implement AIEngine class in Milestone 5
// export class AIEngine { ... }
