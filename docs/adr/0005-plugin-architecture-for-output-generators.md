# ADR-0005 — Plugin Architecture for Output Generators

* **Status:** Accepted
* **Impacted Areas:** `packages/content-schema`, `packages/resume-generator`, `packages/github-generator`, `career-os.config.ts`
* **Date:** July 2026

---

## Context and Problem Statement

Career OS aims to support extensible output targets (Portfolio Website, Resume PDF, GitHub Profile, LinkedIn Posts, Recruiter Package) and third-party integrations without requiring modifications to core platform code.

If output generators are tightly coupled to the filesystem or core platform packages, adding a new output target requires modifying internal engine logic.

---

## Decision Drivers

* **P1 — Single Source of Truth:** Generators consume the canonical `ContentGraph` — never read raw disk files directly.
* **P5 — Single Responsibility:** Each generator package is an independent plugin responsible only for producing its specific output artifact.
* **Extensibility:** Third-party community generators must be pluggable via standard TypeScript interfaces.

---

## Decision Outcome

**Decoupled Plugin Architecture via `Generator<TConfig>` interface.**

1. **Plugin Contract (`packages/content-schema/src/generator.ts`):**
   ```typescript
   export interface Generator<TConfig = unknown> {
     readonly name: string;
     readonly description: string;
     generate(graph: ContentGraph, config?: TConfig): Promise<GeneratorResult>;
   }
   ```
2. **Stateless Execution:** Generators receive an immutable `ContentGraph` and options config. They return `GeneratedFile[]` objects (path + content).
3. **Plugin Registration:** Output generators are registered in `career-os.config.ts`:
   ```typescript
   import { defineConfig } from "@career-os/content-schema";
   import { ResumeGenerator } from "@career-os/resume-generator";
   import { GitHubGenerator } from "@career-os/github-generator";

   export default defineConfig({
     contentDir: "content/raw",
     outputDir: "output",
     generators: [
       new ResumeGenerator({ template: "modern" }),
       new GitHubGenerator(),
     ],
   });
   ```

---

## Consequences

* **Positive:** Adding a new output target (e.g. LinkedIn generator) requires zero core code changes — simply write a package implementing `Generator` and register it in `career-os.config.ts`.
* **Positive:** High cohesion, zero coupling between generators.
* **Negative:** Generators must strictly adhere to the `GeneratorResult` return contract.
