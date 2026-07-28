# Career OS — Roadmap

> This document describes the planned milestones, features, and timeline for Career OS. It is a living document updated at the start of each milestone cycle. Community input is welcome via GitHub Issues with the `roadmap` label.

---

## Table of Contents

- [Roadmap Philosophy](#roadmap-philosophy)
- [Milestone Overview](#milestone-overview)
- [v0.1 — Foundation](#v01--foundation)
- [v0.2 — Resume Generator](#v02--resume-generator)
- [v0.3 — Portfolio Website](#v03--portfolio-website)
- [v0.4 — AI Synthesis Layer](#v04--ai-synthesis-layer)
- [v0.5 — Publishing Automation](#v05--publishing-automation)
- [v1.0 — Public Release](#v10--public-release)
- [Post-1.0 Vision](#post-10-vision)
- [Dropped & Deferred Features](#dropped--deferred-features)

---

## Roadmap Philosophy

Career OS follows a milestone-based development model. Each milestone is:

- **Self-contained.** Each version delivers standalone, usable functionality. You should be able to stop at any milestone and have a working tool.
- **Incrementally valuable.** Later milestones build on earlier ones but do not require rework of prior deliverables.
- **Community-transparent.** Milestone scope is defined publicly, and scope changes are documented.

Milestones do not have fixed release dates in the early alpha phase. Dates will be added once a stable development cadence is established.

---

## Milestone Overview

| Milestone | Status | Focus Area |
|-----------|--------|-----------|
| [v0.1 — Foundation](#v01--foundation) | 🔄 **In Progress** | Repository structure, content schema, validation |
| [v0.2 — Resume Generator](#v02--resume-generator) | 📋 Planned | PDF/LaTeX resume from content |
| [v0.3 — Portfolio Website](#v03--portfolio-website) | 📋 Planned | Static portfolio site generation |
| [v0.4 — AI Synthesis Layer](#v04--ai-synthesis-layer) | 📋 Planned | LLM-powered content generation |
| [v0.5 — Publishing Automation](#v05--publishing-automation) | 📋 Planned | CI/CD pipelines, GitHub profile publishing |
| [v1.0 — Public Release](#v10--public-release) | 📋 Planned | Stable API, full docs, community launch |

---

## v0.1 — Foundation

**Status:** 🔄 In Progress  
**Goal:** Establish the repository structure, content schema, and parsing pipeline that all future milestones depend on.

### Deliverables

#### Repository Structure
- [x] Define top-level directory layout (`content/`, `apps/`, `packages/`, `agents/`, etc.)
- [x] Initialize Git repository with `.gitignore`, `LICENSE`, and placeholder files
- [ ] Create `.github/` workflow stubs for CI/CD
- [ ] Create Issue and Pull Request templates

#### Documentation
- [x] `README.md` — Project overview and getting started guide
- [x] `PROJECT.md` — Vision, goals, and non-goals
- [x] `ARCHITECTURE.md` — System design and data flow
- [x] `ROADMAP.md` — This document
- [x] `CONTRIBUTING.md` — Contribution guide
- [ ] `docs/adr/template.md` — ADR template for contributors
- [ ] `docs/adr/0001-content-schema-format.md` — First ADR documenting the schema decision

#### Content Schema
- [ ] Define YAML front matter specification for `experience/`
- [ ] Define YAML front matter specification for `projects/`
- [ ] Define YAML front matter specification for `education/`
- [ ] Define YAML front matter specification for `skills/`
- [ ] Define YAML front matter specification for `certifications/`, `awards/`, `timeline/`
- [ ] Define YAML front matter specification for `publications/`
- [ ] Write JSON Schema validators for all content types (stored in `docs/schemas/`)
- [ ] Create example content files in each `content/` subdirectory

#### Content Parser Package (`packages/content-parser`)
- [ ] Initialize package with TypeScript and build tooling
- [ ] Implement Markdown + YAML front matter parsing
- [ ] Implement schema validation with actionable error messages
- [ ] Implement content type inference and normalization
- [ ] Write unit tests for all parser functions
- [ ] Write integration tests against example content

#### Developer Experience
- [ ] `npm run content:validate` — Validates all content against schemas
- [ ] `npm run content:lint` — Lints Markdown style and front matter consistency
- [ ] Define `career-os.config.ts` platform configuration schema (outputs, LLM provider, deployment target)

---

## v0.2 — Resume Generator

**Status:** 📋 Planned  
**Goal:** Generate a professional, print-ready PDF resume from content directory data.

### Deliverables

#### Resume Generator Package (`packages/resume-generator`)
- [ ] Define the `Generator` interface in `packages/content-parser/src/types/generator.ts` (shared contract for all generators)
- [ ] Define resume layout engine (likely LaTeX-based for typographic quality)
- [ ] Implement template system with at least two named templates
- [ ] Implement role-based content filtering (include/exclude sections by target role)
- [ ] Generate LaTeX source from structured content
- [ ] Compile LaTeX to PDF in CI environment
- [ ] Generate JSON Resume format output (for interoperability)
- [ ] Write tests for template rendering and PDF compilation

#### Resume Templates
- [ ] **Classic** — Clean single-column layout, ATS-optimized
- [ ] **Technical** — Two-column layout with skills sidebar

#### CLI Script
- [ ] `npm run generate:resume` — Build all resume formats into `assets/resume/`
- [ ] Support `--template`, `--role`, and `--output` flags

#### Content Schema Additions
- [ ] Add `featured: true/false` field to experience and project entries for resume inclusion
- [ ] Add `resume_summary` field to skills entries

---

## v0.3 — Portfolio Website

**Status:** 📋 Planned  
**Goal:** Generate a statically deployable, high-performance portfolio website from content directory data.

### Deliverables

#### Website Application (`apps/website`)
- [ ] Choose and initialize static site generator (Next.js with static export)
- [ ] Implement data layer that reads from `packages/content-parser`
- [ ] Build core pages: Home, About, Experience, Projects, Blog, Contact
- [ ] Build project detail pages (auto-generated from `content/projects/`)
- [ ] Build experience detail pages (auto-generated from `content/experience/`)
- [ ] Build blog post pages (auto-generated from `content/blog/`)
- [ ] Implement career timeline visualization
- [ ] Implement a responsive, accessible design system
- [ ] Target Lighthouse score ≥ 95 across Performance, Accessibility, Best Practices, SEO

#### SEO and Metadata
- [ ] Implement Open Graph and Twitter card meta tags
- [ ] Generate `sitemap.xml` and `robots.txt`
- [ ] Add JSON-LD structured data for Person and Article schemas

#### Deployment
- [ ] GitHub Actions workflow for building and deploying to GitHub Pages
- [ ] Document alternative deployment targets (Vercel, Netlify, Cloudflare Pages)

---

## v0.4 — AI Synthesis Layer

**Status:** 📋 Planned  
**Goal:** Integrate LLM-based content generation for bios, summaries, tailored cover letters, and gap analysis.

### Deliverables

#### AI Engine Package (`packages/ai-engine`)
- [ ] Implement LLM provider abstraction (support OpenAI, Anthropic, and local Ollama)
- [ ] Implement prompt template system with versioning
- [ ] Implement output persistence — all AI drafts written to `output/ai-drafts/` for human review
- [ ] Implement diff-based review workflow (compare AI draft vs. current content)

#### Prompt Library (`ai/prompts/`)
- [ ] `professional-bio.md` — Generate a professional bio from experience + skills data
- [ ] `project-summary.md` — Generate a one-paragraph project summary from front matter
- [ ] `role-tailored-summary.md` — Tailor resume summary for a specific job description
- [ ] `cover-letter-draft.md` — Generate a cover letter draft given a job description input
- [ ] `gap-analysis.md` — Identify skills gaps between content and a target role

#### Agents (`ai/agents/`)
- [ ] `career-synthesizer` agent — Orchestrates bio, summary, and profile generation
- [ ] `resume-tailor` agent — Takes a job description URL and produces a tailored resume variant

#### Human Review Flow
- [ ] AI outputs are staged in `output/ai-drafts/` (gitignored)
- [ ] `npm run ai:review` — Opens a diff interface to review and approve AI outputs
- [ ] Approved outputs are promoted to the appropriate `content/` path

---

## v0.5 — Publishing Automation

**Status:** 📋 Planned  
**Goal:** Automate the propagation of Career OS outputs to external surfaces via CI/CD.

### Deliverables

#### Publisher Package (`packages/publisher`)
- [ ] Implement GitHub Profile README generator
- [ ] Implement per-repository README generator from `content/projects/` data
- [ ] Implement GitHub Actions workflow for automated publishing on `main` push

#### CI/CD Pipelines (`.github/workflows/`)
- [ ] `validate.yml` — Validate all content on every push and PR
- [ ] `generate-resume.yml` — Generate resume artifacts on tag push
- [ ] `deploy-website.yml` — Build and deploy portfolio website on `main` push
- [ ] `publish-github-profile.yml` — Update GitHub profile README on content changes

#### Recruiter Package
- [ ] `npm run generate:recruiter-package` — Bundle PDF resume + bio + cover letter into a single ZIP in `output/recruiter-package/`
- [ ] Support per-role recruiter packages with tailored content

---

## v1.0 — Public Release

**Status:** 📋 Planned  
**Goal:** Stable API, complete documentation, and a community-ready public launch.

### Deliverables

#### Stability
- [ ] Freeze content schema v1 (commit to backwards compatibility)
- [ ] Comprehensive test coverage across all packages (target ≥ 80%)
- [ ] Full TypeScript types exported from all packages
- [ ] Zero critical or high-severity open issues

#### Documentation
- [ ] Full content schema reference documentation
- [ ] Getting started guide (< 30 minutes to first generated portfolio)
- [ ] Package API reference documentation
- [ ] Video walkthrough / demo

#### Community
- [ ] CHANGELOG.md with all changes since v0.1
- [ ] `SECURITY.md` with responsible disclosure policy
- [ ] Community discussion forum setup (GitHub Discussions)
- [ ] `GOVERNANCE.md` with community maintainer onboarding process
- [ ] Curated list of example Career OS repositories from community members

---

## Post-1.0 Vision

The following features are on the long-term horizon but are not yet scoped to a specific milestone:

- **Plugin System** — A formal plugin API for community-contributed output generators (e.g., Notion exporter, DEV.to cross-poster, DocSend package).
- **Content Analytics** — Optional analytics integration for portfolio website (privacy-respecting, self-hosted).
- **Version-Tagged Career Snapshots** — Git-tag your content at a point in time to generate a "career as of date X" artifact.
- **Job Application Tracker Integration** — Optional integration with open-source ATS tools.
- **Multi-Language / Internationalization** — Generate outputs in multiple languages from a single content source.
- **Community Schema Registry** — A shared registry of content schema extensions contributed by the community.
- **VS Code Extension** — A first-party extension providing schema validation, front matter autocomplete, and generation commands within the editor.

---

## Dropped & Deferred Features

Features that were considered and explicitly excluded from the current roadmap:

| Feature | Decision | Reason |
|---------|----------|--------|
| Real-time LinkedIn sync | ❌ Dropped | LinkedIn API restrictions make this unmaintainable |
| Hosted SaaS version | ⏸️ Deferred | Out of scope for v1.0; may be a community fork |
| WYSIWYG content editor | ⏸️ Deferred | Adds significant scope; Markdown editors handle this well |
| Mobile application | ❌ Dropped | Not aligned with the developer-first, Git-native philosophy |

---

*Last updated: July 2026*
