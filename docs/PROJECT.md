# Career OS — Project Definition

> This document captures the authoritative vision, scope, goals, and guiding principles of Career OS. It is the canonical reference for contributors and maintainers making architectural and product decisions.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Vision](#vision)
- [Target Audience](#target-audience)
- [Goals](#goals)
- [Non-Goals](#non-goals)
- [Guiding Principles](#guiding-principles)
- [Success Metrics](#success-metrics)
- [Project Governance](#project-governance)

---

## Problem Statement

Software engineers have a fragmented professional presence. A developer's work history exists simultaneously in:

- A résumé PDF edited in Word or Overleaf, saved locally and rarely updated.
- A LinkedIn profile maintained separately with different wording.
- A GitHub profile README that may be years out of date.
- A portfolio website — if it exists at all — built as a separate project with its own maintenance burden.
- A handful of blog posts scattered across Medium, DEV.to, or a long-forgotten Jekyll site.
- Recruiter emails answered with ad-hoc, inconsistently written bios.

Each of these surfaces describes the same underlying career, yet none of them share data. When a developer changes jobs, learns a new skill, or ships an impactful project, they must manually propagate that change across every surface. Most do not. The result is a professional identity that is perpetually stale, inconsistent, and misaligned with the developer's actual experience.

**Career OS is the engineering solution to this human problem.**

---

## Vision

Career OS envisions a future where a developer's professional identity is treated with the same discipline as their code:

- **Version-controlled.** Every change is tracked, attributed, and reversible.
- **Composable.** Each output (resume, portfolio, GitHub profile) is a derived artifact, not a standalone document.
- **AI-augmented.** Language models fill the gaps that humans inevitably leave: tailored summaries, contextual bios, gap analysis, and cover letter drafts — all generated from structured, human-curated data.
- **Open and portable.** No vendor lock-in. No proprietary format. A developer can take their `content/` directory and move it to any compatible platform, or build their own generator on top of the schema.

The long-term vision is for Career OS to become a community standard — a shared schema and toolchain that the developer community can build upon, the way OpenAPI standardized API description or CHANGELOG.md standardized release notes.

---

## Target Audience

Career OS is built for three distinct audiences:

### Primary: Software Engineers

Developers who want a disciplined, low-friction way to maintain a complete and accurate professional presence without context-switching between tools. They are comfortable with Git, Markdown, and command-line tooling.

### Secondary: Open-Source Contributors

Engineers interested in contributing to a platform that is itself about engineering craft. Career OS is an opportunity to build AI-powered content pipelines, static site generators, structured data schemas, and developer tooling.

### Tertiary: Recruiters and Hiring Managers

Recruiters who interact with Career OS outputs — the generated portfolio website, PDF resume, GitHub profile README, and recruiter package. They do not use the tool directly but are an important consumer of its artifacts.

---

## Goals

The following goals define the scope of work for Career OS:

### G1 — Single Source of Truth

All professional data must live in `content/` as structured Markdown files with YAML front matter. No data should need to be entered into multiple places to appear in multiple outputs.

### G2 — Comprehensive Output Coverage

Career OS must generate outputs for every major professional surface: portfolio website, PDF resume, GitHub profile README, career timeline, blog, and a recruiter-ready downloadable package.

### G3 — AI-Augmented Generation

LLM integration must be first-class. AI-generated content — summaries, bios, tailored cover letters — must be generated from structured data, stored in the repository for human review, and never published without explicit approval.

### G4 — Zero SaaS Dependency for Core Function

The core content parsing and generation pipeline must work entirely locally without any mandatory cloud service. LLM integration is opt-in, not a hard dependency.

### G5 — Extensible Package Architecture

Career OS must be built as a collection of independently usable packages (`packages/`). A developer should be able to use just the resume generator, or just the content parser, without adopting the entire platform.

### G6 — Open-Source by Design

All logic — including AI prompts, generation scripts, and schema definitions — must be open and auditable. Nothing that affects a user's professional representation should be a black box.

### G7 — Minimal Maintenance Burden

Once set up, Career OS should require minimal ongoing effort. Pushing a commit with updated content should be sufficient to trigger re-generation and re-deployment of all outputs.

---

## Non-Goals

The following are explicitly outside the scope of Career OS:

| Non-Goal | Rationale |
|----------|-----------|
| **A SaaS platform or hosted service** | Career OS is a self-hosted developer tool, not a product with user accounts and a database. |
| **A no-code visual editor** | The primary interface is structured Markdown and Git. A GUI layer may come later as a community contribution. |
| **A job board or application tracker** | Career OS manages professional presence, not the job search workflow itself. |
| **Multi-user or team features** | Career OS manages one developer's professional identity. Team/organization use cases are out of scope. |
| **Real-time data sync with LinkedIn or external platforms** | Career OS is the source; it publishes to external surfaces but does not consume from them. |
| **A résumé builder with drag-and-drop UI** | The resume is a generated artifact, not a design canvas. |

---

## Guiding Principles

These principles govern decisions made by maintainers and contributors:

1. **Explicit over Implicit.** Content schemas should be verbose and explicit. Inference and "magic" are bugs waiting to happen when applied to professional data.

2. **Separation of Data and Presentation.** The `content/` directory is pure data. Presentation concerns — templates, themes, styling — live in apps and packages, never in content files.

3. **Human in the Loop for AI.** AI generation always produces a draft. The developer reviews and approves before any AI-generated content is committed or published. This is non-negotiable.

4. **Backwards Compatibility.** Content schema changes must be additive. A content file that was valid in v0.1 must remain valid in v1.0 with graceful degradation.

5. **Fail Loudly on Invalid Content.** The content parser must validate all front matter strictly and produce actionable error messages. Silent failures that produce malformed output are unacceptable.

6. **Performance as a Feature.** All generated sites and assets must be static. Page weight, load time, and Lighthouse scores matter.

---

## Success Metrics

Career OS will be considered successful when:

- A developer can go from a fresh clone to a fully generated portfolio and PDF resume in under 30 minutes.
- The generated portfolio site scores ≥ 95 on Google Lighthouse across all four categories.
- The content schema supports all standard professional data without requiring workarounds.
- The AI generation pipeline produces first-draft quality summaries that require only minor editing by the developer.
- The project has an active open-source community: regular contributors, reproducible issues, and documented RFC processes.

---

## Project Governance

Career OS follows a **Benevolent Dictator For Life (BDFL)** model in its early stages. In practice this means a single maintainer has final say on architectural and product decisions while the project is pre-v1.0. The expectation is a gradual transition to a consensus-based, multi-maintainer model as the contributor community grows.

- **Maintainer:** [Harsh324](https://github.com/Harsh324)
- **Decision Process:** Major decisions are documented as Architecture Decision Records (ADRs) in `docs/adr/`.
- **RFC Process:** Significant feature proposals must be submitted as GitHub Issues with the `RFC` label and allow a 14-day comment period before any implementation begins.
- **Breaking Changes:** Any change to the `content/` schema that breaks existing content files requires a major version bump and a documented migration guide.

---

*Last updated: July 2026*
