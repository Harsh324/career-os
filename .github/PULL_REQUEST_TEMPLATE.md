## Summary

<!-- A clear, one-paragraph description of what this PR changes and why. -->

## Type of Change

- [ ] `feat` — New feature or capability
- [ ] `fix` — Bug fix
- [ ] `chore` — Build, tooling, or configuration change
- [ ] `docs` — Documentation only
- [ ] `refactor` — Code refactor (no functional change)
- [ ] `test` — New or updated tests
- [ ] `perf` — Performance improvement

## Architecture Principles Check

Before merging, confirm this PR satisfies the project's architecture principles:

- [ ] **P1 — Git is truth:** No data defined outside the repo
- [ ] **P2 — One owner:** No schema, type, or rule is duplicated
- [ ] **P3 — Generated is generated:** No hand-authored files that should be derived
- [ ] **P4 — No duplicated logic:** Shared logic lives in a shared package
- [ ] **P5 — Single responsibility:** Each package touched has a clear, unchanged scope
- [ ] **P6 — Consumers are immutable:** No consumer mutates ContentGraph
- [ ] **P7 — Reproducible output:** No non-determinism introduced in generation
- [ ] **P8 — AI staging:** AI output (if any) goes to `output/ai-drafts/`, not `content/raw/`
- [ ] **P9 — ADR filed:** If this is an architectural change, an ADR is linked below
- [ ] **P10 — Backward compatible:** Schema changes are additive; breaking changes have a migration guide

## ADR Reference

<!-- If P9 applies, link the ADR here. -->
<!-- Example: docs/adr/0004-decision-title.md -->

## Changes

<!-- List the key files changed and why. -->

## How to Test

```bash
# Inside the dev container
make install
make type-check
make lint
make build
```

## Screenshots / Recordings

<!-- For UI changes, attach a screenshot or screen recording. -->

## Breaking Changes

- [ ] This PR introduces a breaking change

<!-- If yes, describe the migration path and link to docs/migrations/. -->

## Checklist

- [ ] Tests pass (`make test`)
- [ ] TypeScript compiles (`make type-check`)
- [ ] Lint passes (`make lint`)
- [ ] **Documentation Ownership Map consulted** — all required docs updated per `CONTRIBUTING.md`
- [ ] CHANGELOG.md updated (for user-facing changes)
