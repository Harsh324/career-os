# Career OS — Agent Rules

These rules are automatically loaded for every AI-assisted session in this repository.
They are non-negotiable and take precedence over any general defaults.

---

## Architecture Principles

The following ten principles govern every technical decision, code change, documentation update,
and architectural conversation in this repository. Apply them without exception.

1. **Git is the single source of truth.**
   All authoritative data lives in the repository as plain text.
   No data source outside this repo has authority over what is in it.

2. **Every piece of information has exactly one owner.**
   A content type, a schema, a type definition, a business rule — each is defined in exactly
   one place. If you find yourself duplicating a definition, stop and refactor.

3. **Everything else is generated.**
   If a file can be derived from another file, it must be derived — not hand-authored.
   Generated files are never committed unless there is an explicit, documented reason.

4. **No duplicated business logic.**
   A parsing rule, a validation rule, a formatting rule — defined once in a shared package
   and imported everywhere. Copy-pasted logic is a defect, not a shortcut.

5. **Every package has one responsibility.**
   Before adding a capability to an existing package, confirm it fits the package's single
   stated responsibility. If it does not, create a new package or propose a restructure via ADR.

6. **Consumers never mutate content.**
   Packages that read the ContentGraph (website, resume generator, GitHub generator) must
   treat it as immutable. Mutations happen only in the content pipeline, never in consumers.

7. **Generated artifacts are reproducible.**
   Given the same input content, running the pipeline must produce byte-identical output.
   Non-determinism in generation (timestamps, random IDs) is a defect.

8. **AI assists generation but never owns canonical data.**
   AI-generated content is always staged in `output/ai-drafts/` for human review.
   No AI output is ever written directly to `content/raw/` or committed without explicit
   human approval. The developer is always the final authority on what enters the repository.

9. **Every architectural change requires an ADR.**
   Any decision that affects the package structure, the content schema, the generator interface,
   the CI pipeline, or the technology stack must be documented as an ADR in `docs/adr/`
   before implementation begins.

10. **Backward compatibility is preferred over breaking changes.**
    Content files authored under an older schema must continue to parse correctly under newer
    versions. If a breaking change is unavoidable, a migration guide in `docs/migrations/`
    and a major version bump are both required.

---

## Enforcement Rules for Agent Behaviour

- **Before proposing any architectural change:** state which principles it satisfies or violates,
  and whether an ADR is required.
- **Before writing any new package or module:** confirm its single responsibility aligns with
  principle 5 and that no existing package already owns that responsibility (principle 4).
- **Before generating or staging any file:** confirm whether it belongs in `content/raw/`
  (human-owned, principles 1–2) or `output/` (generated, principle 3).
- **Before any AI-assisted content generation:** confirm the output goes to `output/ai-drafts/`
  and is never auto-committed (principle 8).
- **Before any schema change:** confirm it is additive (principle 10) or, if breaking,
  that an ADR and migration guide are part of the same PR.
- **If a request would violate any principle:** say so explicitly, explain which principle
  is at risk, and propose an alternative that preserves it.

---

## Project Context

- **Repository:** career-os
- **Branch model:** trunk-based with short-lived feature branches off `main`
- **Commit standard:** Conventional Commits (`type(scope): description`)
- **All dev tooling runs inside Docker** — never install packages or run build commands locally
- **Package manager:** pnpm workspaces
- **Build orchestrator:** Turborepo
- **Type authority:** `packages/content-schema` (Zod schemas → inferred TypeScript types)
- **No AI packages exist yet** — AI architecture is a future milestone, do not scaffold stubs

---

*Last updated: July 2026*
