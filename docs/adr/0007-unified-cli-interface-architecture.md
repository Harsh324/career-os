# ADR-0007 — Unified CLI Interface Architecture

* **Status:** Accepted
* **Impacted Areas:** `packages/cli` (Milestone 6), Developer Tools, CI Scripts
* **Date:** July 2026

---

## Context and Problem Statement

Currently, developer operations use `Makefile` and `scripts/` targets (`make dev`, `make build`, `make content:validate`). While effective for containerized development, non-developer end users installing Career OS via npm/pnpm need a single binary entrypoint (`npx career build`).

---

## Decision Drivers

* **User Experience:** End users need single-command CLI interaction (`career validate`, `career build`, `career doctor`).
* **Simplicity Today:** Avoid building a CLI framework prematurely before core schema and parser logic stabilize.

---

## Decision Outcome

**Phase 1 (Milestones 1–5):** `Makefile` + Docker container commands remain the primary developer interface.

**Phase 2 (Milestone 6):** Scaffold `@career-os/cli` package exposing the `career` binary.

### Target CLI Command Specification:
* `career validate` — Validate content in `content/raw/` against Zod schemas.
* `career build` — Execute registered output generators from `career-os.config.ts`.
* `career dev` — Launch development server for Next.js website.
* `career doctor` — Environment & schema diagnostic check.

---

## Consequences

* **Positive:** Developer experience remains fast and containerized today without premature CLI code.
* **Positive:** Clear roadmap path to end-user npm package distribution in Milestone 6.
