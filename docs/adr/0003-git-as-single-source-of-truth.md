# ADR-0003 — Git as the Single Source of Truth for Career Data

**Date:** 2026-07-28  
**Status:** Accepted  
**Deciders:** BDFL (Harsh)

---

## Context

A developer's career data (work experience, projects, skills, education, certifications,
publications, blog posts) typically exists in a fragmented, inconsistent state across:

- LinkedIn profile
- PDF resume (one version per job application variant)
- GitHub profile README
- Personal portfolio website
- Resume builder tools (Resumé.io, Enhancv, etc.)
- Local documents and notes

Each of these representations drifts independently. Updating one does not update the others.
The result is career data that is inaccurate, inconsistent, and difficult to maintain.

Career OS needs a canonical source of truth from which all representations are derived.

## Decision Drivers

- **Single ownership (P2):** Each piece of career information should exist in exactly one place.
  Any duplication is a maintenance burden and a source of inconsistency.
- **Human readability:** The canonical format must be editable by a human with a text editor,
  without requiring a database, CMS, or proprietary tool.
- **Version history:** Career data should be versioned. The developer should be able to see
  the evolution of their career over time.
- **Portability:** The data must not be locked into any vendor's format or platform.
- **Offline-first:** The source of truth must be accessible without internet access.
- **Derived outputs (P3):** All representations (resume, portfolio, GitHub README) must be
  derived from the canonical source — never independently maintained.

## Considered Options

1. **Git repository with Markdown + YAML front matter** — plain text, human-writable,
   fully version-controlled
2. **Headless CMS (Contentful, Sanity)** — structured content API, rich editing UI
3. **Database (PostgreSQL, SQLite)** — relational model, queryable
4. **JSON files in Git** — structured but less human-writable than Markdown
5. **Resume builder SaaS (Resumé.io, Enhancv)** — specialized tool

## Decision Outcome

**Chosen option:** Git repository with Markdown + YAML front matter (option 1).

This is captured as **Architecture Principle P1** — the highest-priority principle in the
Career OS architecture.

### Positive Consequences

- Every career change is a Git commit — full audit trail, rollback, and history
- Markdown is human-readable and writable with any text editor
- YAML front matter provides structured, schema-validatable metadata
- The repository itself is the backup — no external backup system needed
- Branching enables experimentation (e.g., a `feat/new-role` branch to draft a role before
  accepting it)
- The content pipeline (content-parser → ContentGraph → generators) derives all outputs
  deterministically from this single source (P3, P7)
- GitHub, GitLab, or any Git host can be used — no vendor lock-in

### Negative Consequences / Trade-offs

- Editing requires familiarity with Git and Markdown (higher barrier than a CMS UI)
- Structured data (dates, lists) requires YAML discipline — malformed front matter
  is a validation error caught by content-parser
- Binary assets (images, PDFs) are less suited to Git — `content/raw/assets/` directory handles
  committed images; generated PDFs live in `output/` and are never committed

## Architecture Implications

This decision establishes the content directory structure:

```
content/
└── raw/                  ← ONLY human-authored Markdown (P1 — Git is truth)
    ├── experience/
    ├── projects/
    ├── education/
    ├── skills/
    ├── certifications/
    ├── awards/
    ├── blog/
    ├── publications/
    └── timeline/

output/                   ← ALL generated artifacts (P3 — never committed)
```

All generated outputs (portfolio website, resume PDF, GitHub README) are derived from
`content/raw/` via the content pipeline. They are reproducible (P7) and never committed
to the repository (P3).

## Links

- [content/raw/](../../content/raw/) — canonical content directory
- [ARCHITECTURE.md — Architecture Principles](../../ARCHITECTURE.md#architecture-principles)
- [packages/content-schema](../../packages/content-schema/) — Zod schemas for content validation
- [ADR-0001 — Turborepo](./0001-turborepo-monorepo.md)
- [ADR-0002 — Docker-First Development](./0002-docker-first-development.md)
