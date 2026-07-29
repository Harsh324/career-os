# ADR-0004 — Canonical Content Graph and Query SDK Layer

* **Status:** Accepted
* **Impacted Areas:** `packages/content-schema`, `packages/content-parser`, `packages/sdk`, `apps/website`, `apps/api`
* **Date:** July 2026

---

## Context and Problem Statement

Career OS powers multiple output targets (Website, Resume PDF, GitHub Profile, AI Recruiter Assets, API). Without a unified data-access abstraction, each application or generator might parse Markdown directly or write duplicate filtering, sorting, and category grouping functions (e.g. `getFeaturedProjects()`, `getSkillsByCategory()`).

This violates **Principle 4** (*"No duplicated business logic"*) and **Principle 6** (*"Consumers never mutate content"*).

Originally, data-loading helpers were placed in `@career-os/website-generator`. However, that package name suggested it was specific to the Next.js portfolio website, when in reality all platform consumers (website, API server, CLI, AI agents) require identical data query capabilities.

---

## Decision Drivers

* **P2 — One Owner:** A single package owns query and data-access semantics over the `ContentGraph`.
* **P4 — No Duplicated Business Logic:** Filtering logic (e.g. `resumeInclude`, `featured`) is defined once.
* **P5 — Single Responsibility:** Separates raw Markdown parsing (`content-parser`) from application queries (`sdk`).
* **P6 — Immutability:** Consumers query the `ContentGraph` read-only.

---

## Considered Options

1. **Option 1: Allow applications to import `content-parser` directly.**  
   *Bad:* Applications must manually filter arrays and sort dates, duplicating business logic across apps.
2. **Option 2: Keep data query functions in `@career-os/website-generator`.**  
   *Bad:* Misleading package name. The API server or CLI importing `website-generator` violates P5.
3. **Option 3: Repurpose `website-generator` to `@career-os/sdk`.**  
   *Good:* `@career-os/sdk` becomes the canonical read-only data query layer for all platform consumers.

---

## Decision Outcome

**Option 3 chosen.** Repurpose `packages/website-generator` into **`packages/sdk` (`@career-os/sdk`)**.

### Package Responsibilities:
* **Input:** Immutable `ContentGraph` parsed by `@career-os/content-parser`.
* **Output:** Typed, filtered, sorted, and category-grouped domain data (`getExperience()`, `getFeaturedProjects()`, `getSkillsByCategory()`, `getTimeline()`).
* **Consumers:** `apps/website`, `apps/api`, CLI commands, and AI workflows.

---

## Consequences

* **Positive:** All consumers share byte-identical query and sorting logic. Zero code duplication.
* **Positive:** Clean single responsibility per package (P5).
* **Negative:** Workspace references updated from `@career-os/website-generator` to `@career-os/sdk`.
