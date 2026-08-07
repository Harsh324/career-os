# 8. Backend-Driven Platform Architecture (Career OS v2)

* Status: Accepted
* Deciders: Harsh Tripathi, AI Agent (Antigravity)
* Date: July 2026

## Context and Problem Statement

Career OS v1 was built as a static, content-driven monorepo application where plain markdown files in `content/raw/` were parsed at build time via `@career-os/content-parser` and `@career-os/sdk`. While effective for initial portfolio generation, it lacked dynamic management capabilities, backend persistence, real-time admin content updates, and modern SaaS architecture.

We need to transform Career OS into a Personal Engineering CMS platform where the backend becomes the canonical single source of truth, content is dynamically managed via an admin dashboard, and the Next.js frontend acts purely as a presentation layer consuming REST APIs.

## Decision Drivers

* **Backend as Single Source of Truth:** Content must be stored in a relational PostgreSQL database and edited dynamically via a rich admin CMS.
* **Separation of Concerns:** Frontend (`frontend/`) and Backend (`backend/`) must be cleanly decoupled into distinct standalone applications.
* **Modern Python & Frontend Tooling:** Adopt `uv` for ultra-fast Python package resolution and virtualenv isolation, `ruff` for code quality/formatting, `npm` for frontend dependency management, and `docker-compose` for orchestration.
* **Preserve Visual Excellence:** Retain existing visual UI design, Tailwind styling, dark mode, routing, SEO, and responsiveness without visual regression.

## Considered Options

1. **Option 1 (Chosen): Backend-Driven Platform with Django REST Framework, PostgreSQL, Next.js, `uv`, and `npm`**
2. Option 2: Headless CMS third-party integration (e.g. Strapi or Contentful)
3. Option 3: Continue with static monorepo and markdown build pipeline

## Decision Outcome

Chosen Option: **Option 1**.

### Consequences

* **Positive:**
  * Complete CMS capabilities: Projects, experiences, companies, skills, technologies, blog, timeline, education, certifications, and media are editable in real-time.
  * Fast backend setup and build caching powered by `uv` and `docker-compose`.
  * Standardized code quality enforced by `ruff`.
  * Clean, simplified repository layout (`frontend/`, `backend/`, `docker/`, `docs/`) removing complex monorepo tooling (`pnpm`, `Turborepo`, `packages/*`).
  * JWT-secured admin endpoints and public read-only REST APIs versioned at `/api/v1/`.

* **Negative / Migration Overhead:**
  * Existing static markdown parser, SDK, and monorepo packages are deprecated and removed.
  * Initial seed data script required to import existing markdown content into PostgreSQL models.

## Architectural Trade-Offs & Principles Compliance

* **Principle 1 (Single Source of Truth):** Content transitions from Git markdown files to PostgreSQL. Reproducibility is preserved via Django database migrations and seed management commands committed in Git.
* **Principle 2 & 4 (Single Ownership & No Duplicated Logic):** Data models are defined exclusively in `backend/` Django models and serializers.
* **Principle 5 (Single Responsibility):** Clear separation into `backend` (CMS & REST APIs) and `frontend` (UI & React Query state).
