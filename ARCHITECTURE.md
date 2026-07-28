# Career OS — Architecture

> This document describes the system architecture, data model, design decisions, and technical rationale of Career OS. It is intended for contributors, maintainers, and developers building on top of the platform.

---

## Table of Contents

- [Architecture Principles](#architecture-principles)
- [System Overview](#system-overview)
- [Core Data Model](#core-data-model)
- [Content Schema](#content-schema)
- [Package Architecture](#package-architecture)
- [Generator Interface](#generator-interface)
- [Data Flow](#data-flow)
- [AI Integration Architecture](#ai-integration-architecture)
- [Output Generation Pipeline](#output-generation-pipeline)
- [CI/CD Architecture](#cicd-architecture)
- [Technology Decisions](#technology-decisions)
- [Scalability Considerations](#scalability-considerations)
- [Failure Modes](#failure-modes)
- [Architecture Decision Records](#architecture-decision-records)

---

## Architecture Principles

These principles govern every technical decision in Career OS — from package design to schema changes to AI integration. They are non-negotiable. Any proposal that violates a principle must either be revised or accompanied by a documented rationale explaining the exception, filed as an ADR.

| # | Principle | Implication |
|---|-----------|-------------|
| **P1** | **Git is the single source of truth.** | All authoritative data lives in this repository as plain text. No external system has authority over what is in `content/raw/`. |
| **P2** | **Every piece of information has exactly one owner.** | A schema, a type, a business rule — defined in one place, imported everywhere. Duplication is a defect. |
| **P3** | **Everything else is generated.** | If a file can be derived from source data, it is generated — not hand-authored. Generated files are never committed unless explicitly justified. |
| **P4** | **No duplicated business logic.** | Parsing rules, validation rules, formatting rules — live in a shared package and are imported by consumers. Copy-pasted logic is a bug. |
| **P5** | **Every package has one responsibility.** | Before adding a capability to an existing package, verify it fits the package's stated responsibility. If it does not, create a new package or file an ADR. |
| **P6** | **Consumers never mutate content.** | Packages that read the `ContentGraph` (website, resume generator, GitHub generator) treat it as immutable. Mutations occur only in the content pipeline. |
| **P7** | **Generated artifacts are reproducible.** | Given identical input, the pipeline must produce identical output. Non-determinism in generation is a defect, not a feature. |
| **P8** | **AI assists generation but never owns canonical data.** | AI output is staged in `output/ai-drafts/` for human review. No AI-generated content is written to `content/raw/` or committed without explicit human approval. |
| **P9** | **Every architectural change requires an ADR.** | Decisions affecting package structure, content schema, generator interfaces, CI pipeline, or technology stack are documented as an ADR in `docs/adr/` before implementation begins. |
| **P10** | **Backward compatibility is preferred over breaking changes.** | Content files authored under an older schema must parse correctly under newer versions. Breaking changes require a migration guide in `docs/migrations/` and a major version bump. |

---

## System Overview

Career OS is a content transformation platform. It does not run as a server, does not manage a database, and does not require a cloud account to function. At its core, it is a **pipeline** that:

1. Reads structured Markdown + YAML content from the `content/` directory.
2. Validates, parses, and normalizes that content into a typed data graph.
3. Passes the data graph through one or more **generators** — each producing a specific output artifact.
4. Optionally enriches the data with AI-generated content before passing it to generators.
5. Publishes generated artifacts to their target surfaces (website, GitHub, PDF).

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           content/ (Source)                             │
│  experience/  projects/  education/  skills/  blog/  publications/  ... │
└─────────────────────────┬───────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────┐
│         packages/content-parser         │
│  - Parse Markdown + YAML front matter   │
│  - Validate against JSON Schema         │
│  - Normalize into typed ContentGraph    │
└─────────────────────────┬───────────────┘
                          │
              ┌───────────┴────────────┐
              │                        │
              ▼                        ▼
┌─────────────────────┐    ┌───────────────────────┐
│  packages/ai-engine │    │  ContentGraph (typed)  │
│  (optional enrichm.)│    │                        │
└──────────┬──────────┘    └─────────────┬──────────┘
           │                             │
           └────────────┬────────────────┘
                        │
           ┌────────────┼─────────────────────┐
           │            │                     │
           ▼            ▼                     ▼
  ┌──────────────┐ ┌──────────┐   ┌───────────────────┐
  │ Resume Gen.  │ │ Website  │   │  packages/publisher│
  │ (PDF/LaTeX)  │ │(Next.js) │   │  (Profile README)  │
  └──────────────┘ └──────────┘   └───────────────────┘
           │            │                     │
           ▼            ▼                     ▼
    output/resume/  apps/website/     github.com/profile
```

---

## Core Data Model

The **ContentGraph** is the central data structure of Career OS. It is an in-memory, typed representation of all content in the repository, produced by `packages/content-parser` and consumed by all generators.

### ContentGraph Shape

```typescript
interface ContentGraph {
  meta: CareerMeta;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  skills: Skill[];              // flat array of skill entries
  certifications: Certification[];
  awards: Award[];
  blog: BlogPost[];
  publications: Publication[];
  timeline: TimelineEvent[];
  /**
   * Extension point for community-contributed content types.
   * Typed extension schemas narrow `unknown[]` at runtime via registered validators.
   * This field is stable: adding a new content type never requires modifying the
   * core ContentGraph interface.
   */
  extensions: Record<string, unknown[]>;
}

interface CareerMeta {
  name: string;
  title: string;
  email: string;              // required — primary contact address
  location?: string;          // optional — not all authors publish location
  tagline?: string;           // max 160 characters
  summary?: string;
  avatarUrl?: string;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    bluesky?: string;
    website?: string;
    email?: string;           // secondary/public email alias (distinct from top-level email)
  };
}
```

All types are defined in `packages/content-schema/src/types/` (not `content-parser`). Generators
consume the `ContentGraph` interface — they are never coupled to the Markdown file format directly.

---

## Content Schema

All career data lives in the `content/` directory as Markdown files with YAML front matter. The body of each Markdown file is free-form prose; the front matter contains structured, machine-readable metadata.

### Front Matter Example — Experience Entry

```markdown
---
title: Senior Software Engineer
company: Acme Corporation
location: San Francisco, CA
start_date: 2023-03
end_date: present
employment_type: full-time
featured: true
resume_include: true
technologies: [TypeScript, React, Go, Kubernetes]
tags: [distributed-systems, platform-engineering]
---

Led the design and implementation of a real-time event ingestion pipeline processing 2M events/day...
```

### Field Semantics: `featured` vs. `resume_include`

These two fields are distinct and serve different purposes:

| Field | Type | Purpose |
|-------|------|---------|
| `featured: true` | Display weight | Marks the entry as a highlight. Featured entries are surfaced prominently in the portfolio website (e.g., pinned to the top of the projects page). Does not gate resume inclusion. |
| `resume_include: true` | Inclusion gate | Binary gate that controls whether an entry appears in any generated resume output. An entry can be `resume_include: true` without being `featured`, and vice versa. |

A typical pattern: a developer may have 20 projects in `content/projects/`, only 5 of which are `resume_include: true`, and 2 of which are additionally `featured: true`. The resume generator uses `resume_include`; the website generator uses `featured` for ordering; both fields may be used together without conflict.

### Content Types and Schema Files

JSON Schema files for all content types live in `docs/schemas/`. They are the authoritative definition of what fields are valid, required, and optional. Generators must never assume fields that are not in the schema.

| Content Type | Directory | Schema File |
|-------------|-----------|-------------|
| Work Experience | `content/experience/` | `docs/schemas/experience.schema.json` |
| Projects | `content/projects/` | `docs/schemas/project.schema.json` |
| Education | `content/education/` | `docs/schemas/education.schema.json` |
| Skills | `content/skills/` | `docs/schemas/skills.schema.json` |
| Certifications | `content/certifications/` | `docs/schemas/certification.schema.json` |
| Awards | `content/awards/` | `docs/schemas/award.schema.json` |
| Blog Posts | `content/blog/` | `docs/schemas/blog.schema.json` |
| Publications | `content/publications/` | `docs/schemas/publication.schema.json` |
| Timeline Events | `content/timeline/` | `docs/schemas/timeline.schema.json` |

### Schema Versioning

Pre-v1.0, the schema is treated as unstable. Post-v1.0, a `schema_version` field in a root-level `content/meta.yaml` file will declare the schema version for the entire content directory. This enables the content parser to apply the correct validation rules and produce accurate deprecation warnings for older fields. Breaking schema changes after v1.0 require a migration guide in `docs/migrations/`.

---

## Package Architecture

Career OS is structured as a **monorepo** with independent, composable packages under `packages/`. Each package has a single, well-defined responsibility and can be used independently.

### `packages/content-schema`

**Responsibility:** Defining all Zod schemas and inferred TypeScript types for career content. This is the
root of the dependency graph — zero external runtime dependencies. The single authoritative location
for `ContentGraph`, `Generator`, and all domain types (P2).

**Key design decisions:**
- Zod is used instead of JSON Schema/Ajv: schemas produce both runtime validators and TypeScript types
  from a single definition, eliminating the risk of type/schema drift.
- All schemas are exported as both a Zod schema (e.g., `ExperienceSchema`) and an inferred TypeScript
  type (`Experience`). Generators import only the TypeScript type.
- The `Generator<TConfig>` interface is defined here — not in `content-parser` — so generators can
  depend on this package without depending on parsing logic.

### `packages/content-parser`

**Responsibility:** Reading raw Markdown files from `content/raw/`, validating front matter against schemas
from `packages/content-schema`, normalising fields, and returning a `ContentGraph`.

**Key design decisions:**
- Strict validation — any invalid front matter causes a hard error with a precise, actionable message
  including file path, field name, and expected type.
- Normalisation includes: resolving relative dates (`present` → current date), deriving slugs from
  filenames, sorting entries chronologically, and translating snake_case YAML keys (e.g., `resume_include`)
  to camelCase TypeScript fields (e.g., `resumeInclude`).
- Public API: `parseContent(rawDir: string, options?: ParseOptions): Promise<ContentGraph>`.
- This is the ONLY package that reads from `content/raw/`. All other packages receive a `ContentGraph`.

### `packages/resume-generator`

**Responsibility:** Transforming a `ContentGraph` into resume artifacts (PDF, LaTeX, JSON Resume).

**Key design decisions:**
- Uses LaTeX as the intermediate representation for typographic quality and ATS compatibility.
- Template system is file-based: each template is a directory with LaTeX partials and a config file.
- Filtering is content-driven: `resumeInclude` gates inclusion; `featured` influences ordering.
  See [Field Semantics](#field-semantics-featured-vs-resume_include).
- Implements the `Generator<ResumeConfig>` interface.

### `packages/ai-engine`

**Responsibility:** Orchestrating LLM calls to enrich a `ContentGraph` with AI-generated content.

**Key design decisions:**
- LLM provider is abstracted behind a `LLMProvider` interface. Switching from OpenAI to Anthropic
  requires only a configuration change — no code changes in consumers.
- All prompts live in `ai/prompts/` as versioned Markdown files with YAML front matter. Prompts are
  never hardcoded in source.
- All AI outputs are staged in `output/ai-drafts/` for human review. The package never writes
  to `content/raw/` (P8).
- Deferred to Milestone 5.

### `packages/github-generator`

**Responsibility:** Transforming a `ContentGraph` into GitHub-flavoured Markdown artifacts.

**Key design decisions:**
- Initial output: a `README.md` for the GitHub profile repository (username/username).
- The `featured` field on content entries determines what is surfaced in the profile.
- Output is written to `output/github-profile/` (gitignored), then pushed to the profile repo
  by a separate publishing step in CI.
- Implements the `Generator<GitHubConfig>` interface.
- Deferred to Milestone 4.

### `packages/website-generator`

**Responsibility:** Providing typed data-access functions for the Next.js portfolio website.

**Key design decisions:**
- This is NOT a file-writing generator. It is a server-side data layer that Next.js React Server
  Components call at build time.
- The website app (`apps/website`) is a thin UI shell. All data logic lives here, making it
  independently testable without spinning up Next.js.
- Public API: `getExperience()`, `getProjects()`, `getFeaturedProjects()`, `getTimeline()`, etc.
- Deferred to Milestone 2.

### `packages/shared-utils`

**Responsibility:** Zero-dependency utility functions shared across all packages (date formatting,
string manipulation, slug generation, etc.).

**Key design decisions:**
- No runtime dependencies — pure TypeScript utilities.
- Importable by any package without introducing circular dependencies.

---

## Generator Interface

All output generators implement the `Generator` interface, defined in `packages/content-schema/src/generator.ts`. This is the single authoritative location (P2) for the shared contract that enables the plugin system planned for post-v1.0.

```typescript
interface Generator<TConfig = unknown> {
  /** Unique, stable identifier for this generator (e.g., 'resume', 'website'). */
  readonly name: string;
  /** Semantic version of this generator implementation. */
  readonly version: string;
  /** Execute the generator and return produced files and any non-fatal warnings. */
  generate(graph: ContentGraph, config: TConfig): Promise<GeneratorResult>;
}

interface GeneratorResult {
  /** Files written to disk by this generator. */
  outputs: GeneratedFile[];
  /** Non-fatal warnings that should be surfaced to the developer. */
  warnings: string[];
}

interface GeneratedFile {
  /** Absolute path where the file was written. */
  path: string;
  /** Size in bytes of the written file. */
  sizeBytes: number;
}
```

Generators are stateless. They receive the full `ContentGraph` on every invocation and apply their own filtering logic internally. The orchestration layer (invoked by `npm run generate`) discovers all registered generators from `career-os.config.ts` and calls them in parallel unless ordering dependencies are declared.

---

## Data Flow

The following sequence diagram illustrates the complete data flow from content to published artifact:

```
Developer           content/         content-parser       Generator        Target
    │                   │                  │                   │              │
    │  git commit       │                  │                   │              │
    │──────────────────►│                  │                   │              │
    │                   │                  │                   │              │
    │  npm run generate │                  │                   │              │
    │──────────────────────────────────────────────────────────►              │
    │                   │                  │                   │              │
    │                   │  parse()         │                   │              │
    │                   │─────────────────►│                   │              │
    │                   │                  │                   │              │
    │                   │  validate()      │                   │              │
    │                   │─────────────────►│                   │              │
    │                   │                  │                   │              │
    │                   │  ContentGraph    │                   │              │
    │                   │◄─────────────────│                   │              │
    │                   │                  │                   │              │
    │                   │         ContentGraph                 │              │
    │                   │─────────────────────────────────────►│              │
    │                   │                  │                   │              │
    │                   │                  │             generate()           │
    │                   │                  │─────────────────────────────────►│
    │                   │                  │                   │              │
    │◄──────────────────────────────────────────── artifact   │              │
```

---

## AI Integration Architecture

AI integration in Career OS follows a **human-in-the-loop** pattern. The system is designed so that AI assistance accelerates content creation without ever autonomously publishing content.

### Provider Abstraction

```typescript
interface LLMProvider {
  complete(prompt: string, options?: CompletionOptions): Promise<string>;
  readonly model: string;
  readonly contextWindow: number;
}

interface CompletionOptions {
  /** Maximum tokens to generate. Caps cost in CI environments with metered API keys. */
  maxTokens?: number;
  /** Temperature for sampling. Defaults to 0.7. */
  temperature?: number;
  /**
   * If true, return a cost estimate instead of making an API call.
   * Useful for dry-run validation before committing to a metered operation.
   */
  dryRun?: boolean;
  /**
   * Reserved for streaming support in a future release.
   * When true, the provider should stream tokens rather than returning a single string.
   * Callers must check provider capability before setting this flag.
   */
  stream?: false; // streaming is not yet implemented; field reserved for non-breaking addition
}

// Implementations: OpenAIProvider, AnthropicProvider, OllamaProvider
```

### Prompt System

Prompts are Markdown files in the `ai/prompts/` directory. Each prompt file:
- Has YAML front matter declaring its inputs, expected output format, and recommended model.
- Uses Handlebars-style `{{variable}}` placeholders for dynamic data injection.
- Is versioned using semantic versioning in its filename (e.g., `professional-bio.v1.md`).

### Staging and Review

AI-generated content is never written to `content/` directly. Instead:

1. AI output is written to `output/ai-drafts/` (gitignored — never committed automatically).
2. `npm run ai:review` opens a diff view between the draft and any existing content at the target path.
3. The developer approves, edits, or rejects the draft.
4. Approved drafts are committed to `content/` by the developer.

This ensures that every piece of content in the repository — AI-assisted or not — has been explicitly approved by a human.

---

## Output Generation Pipeline

Each generator follows the same three-phase pattern:

### Phase 1: Resolve

The generator receives the full `ContentGraph` and applies its filtering rules. For example, the resume generator selects only entries where `resume_include: true`. The website generator may select all entries but applies different sorting and grouping based on the `featured` flag.

### Phase 2: Transform

The filtered content is passed through a template engine appropriate to the output format:
- **Resume:** LaTeX template rendering via a custom engine.
- **Website:** React Server Components (Next.js App Router) with content loaded at build time via async component data fetching.
- **GitHub Profile:** Handlebars templates producing Markdown.

### Phase 3: Emit

The rendered output is written to its target location under `output/`:
- `output/resume/resume.pdf` — PDF resume
- `apps/website/.next/` → deployed to hosting provider
- `output/github-profile/README.md` → pushed to GitHub profile repository

---

## CI/CD Architecture

Career OS uses GitHub Actions for all automation. Workflows are defined in `.github/workflows/`.

| Workflow | Trigger | Action |
|----------|---------|--------|
| `validate.yml` | Every push, every PR | Parse and validate all content |
| `generate-resume.yml` | Push to `main`, or manual | Generate PDF resume artifacts |
| `deploy-website.yml` | Push to `main` | Build and deploy portfolio website |
| `publish-github.yml` | Push to `main`, or manual | Update GitHub profile README |
| `release.yml` | Push to a `v*` tag | Create GitHub Release with artifacts |

All workflows use pinned, hash-versioned action dependencies to prevent supply-chain attacks.

---

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Primary Language** | TypeScript | Type safety is essential when operating on structured career data. Schema types serve as both validation and documentation. |
| **Monorepo Tool** | Turborepo (ADR-0001) | Task pipeline with local + remote caching, topological execution order, and first-class pnpm workspace support. Adopted from day one — not deferred. |
| **Package Manager** | pnpm 9.x | Strict hoisting, workspace protocol, fast installs with content-addressable store. |
| **Dev Environment** | Docker-first (ADR-0002) | Zero host dependencies beyond Docker + Git. Guarantees CI/local parity. All commands run via `make` targets. |
| **Content Format** | Markdown + YAML Front Matter | Human-readable, Git-diffable, widely supported, and compatible with most static site generators. |
| **Schema Validation** | Zod | Single definition produces both a runtime validator and a TypeScript type. Eliminates schema/type drift. More ergonomic than JSON Schema + Ajv for TypeScript-first projects. |
| **Resume Generation** | LaTeX → PDF | LaTeX produces typographically superior output and is ATS-compatible. Pandoc is used for format conversion. |
| **Website Framework** | Next.js App Router | First-class TypeScript support, React Server Components for build-time data fetching, and wide deployment target support. Uses Tailwind CSS v4 + shadcn/ui. |
| **LLM Abstraction** | Custom `LLMProvider` interface | Avoids coupling to any single LLM vendor's SDK. The interface is deliberately minimal with reserved fields for non-breaking future additions (streaming, dry-run). |
| **Testing** | Vitest | Fast, TypeScript-native, ES module compatible. Planned for Milestone 1. |

---

## Scalability Considerations

While Career OS is fundamentally a single-developer tool, the architecture is designed to scale in several dimensions:

### Content Volume Scalability

The content parser reads all content into memory. For a single developer's career data, this is not a concern — a comprehensive career rarely exceeds a few hundred kilobytes of Markdown. However, the `ContentGraph` type is designed to support lazy loading and streaming in the future if content volume grows (e.g., a blog with thousands of posts).

**Build caching:** The content parse step is the most expensive operation for large blogs. The canonical caching strategy is filesystem-level caching keyed by a hash of the `content/` directory contents. If Turborepo is adopted as the build tool, its remote caching handles this transparently. Until then, generators check a `.cache/content-graph.json` file and skip re-parsing if no content files have changed since the last run (based on mtime or content hash).

### Generator Scalability

Generators are stateless functions that implement the `Generator` interface. Adding a new output target requires implementing a new generator package — it does not require modifying any existing code. This is an explicit architectural goal. Generators are registered in `career-os.config.ts` and discovered at runtime.

### AI Provider Scalability

The `LLMProvider` abstraction means that adopting a new AI provider (or routing between multiple providers based on task) requires only a new implementation of the `LLMProvider` interface. The `CompletionOptions.dryRun` flag allows cost estimation before committing to metered API calls in CI environments.

### Community/Multi-User Scalability

Career OS is designed for a single developer. If the community wishes to build a multi-user hosted version, the clean separation between the `content/` directory (the "instance data") and the platform code makes this feasible — each user's `content/` becomes an isolated tenant. This architectural affordance is intentional, even though a hosted version is not on the current roadmap.

### Plugin Scalability

Post-v1.0, the generator layer will be formalized as a plugin API. Third-party generators will implement the `Generator` interface and be registered via `career-os.config.ts`. This enables the community to build output generators (Notion exporter, DEV.to cross-poster, etc.) without forking the core repository.

The `ContentGraph.extensions` field provides a stable extension point for community-contributed content types. New content type parsers can register their type with the content-parser at runtime and populate `extensions[typeName]` without modifying the core `ContentGraph` interface.

---

## Failure Modes

### Generator Failure Behavior

If a single generator throws an unhandled error, the pipeline:
1. Catches the error and logs it with full stack trace.
2. Marks that generator as failed in the run summary.
3. **Continues running all remaining generators** — a resume generation failure does not abort the website build.
4. Exits with a non-zero code after all generators have been attempted, so CI correctly marks the run as failed.
5. Does not clean up partial outputs automatically. The developer must re-run after fixing the root cause.

### Partial Output Behavior

Partial outputs from a failed generator are left in place (not rolled back) to aid debugging. When a generator is re-run successfully, it overwrites any partial output. The `output/` directory is gitignored, so partial outputs never contaminate the repository.

### Content Validation Failure Behavior

If the content parser encounters invalid front matter, it halts immediately with an actionable error message that includes:
- The file path containing the invalid content.
- The specific field name and validation failure reason.
- The expected type or enum values.

Content validation failures are always fatal — no generators run until all content passes validation. This is intentional: generating output from malformed data produces worse results than failing fast.

### Error Surfacing in CI

In GitHub Actions, generator errors and content validation failures are emitted as [workflow annotations](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions#setting-an-error-message) so they appear directly in the PR diff view, not just buried in logs.

---

## Architecture Decision Records

Significant architectural decisions are documented as ADRs in `docs/adr/`. Each ADR follows the [MADR format](https://adr.github.io/madr/).

| ADR | Title | Status |
|-----|-------|--------|
| [ADR-0001](docs/adr/0001-content-schema-format.md) | Use Markdown + YAML front matter as the content format | Proposed |
| [ADR-0002](docs/adr/0002-monorepo-structure.md) | Use npm Workspaces for monorepo management | Proposed |
| [ADR-0003](docs/adr/0003-llm-provider-abstraction.md) | Abstract LLM providers behind a common interface | Proposed |

> ADRs are created when a decision is first made (status: `Proposed`), updated when implemented (status: `Accepted`), and marked obsolete if superseded (status: `Superseded by ADR-XXXX`).

---

*Last updated: July 2026*
