# Career OS — AI Agent Rules & Engineering Governance

These rules are automatically loaded for every AI-assisted session in this repository.
They are non-negotiable and take precedence over any general defaults.

---

## 1. Permanent Engineering & Product Principles

Future AI coding agents working on Career OS **MUST** strictly adhere to the following 10 principles:

### Principle 1 — Career Data is the Source of Truth
The PostgreSQL database and Django REST Framework API serve as the canonical single source of truth. Never hardcode career information, project details, metrics, or credentials directly into frontend components or constants. Always maintain the pipeline:
`Database ──► API (/api/v1/) ──► Frontend Component`.

### Principle 2 — Public Portfolio ≠ Career Dashboard
- **The Public Portfolio** is a presentation layer: concise, professional, fast, recruiter-friendly, and technically credible.
- **The Private Dashboard** is the control plane: detailed, operational, data-heavy, and administrative.
- Never expose internal management complexity or administrative controls on the public portfolio website.

### Principle 3 — Never Fabricate Career Information
Never invent or hallucinate:
- Metrics or performance numbers
- Job responsibilities or accomplishments
- Technologies, frameworks, or tools
- Company details, projects, or live links
- Users, traffic volume, or benchmarks
- Certifications, licenses, or graduation dates
If information is missing or ambiguous, ask the developer or leave the field empty.

### Principle 4 — Evidence Over Marketing
Prioritize concrete technical credibility over promotional buzzwords:
- *Acceptable:* `"Implemented queue-based asynchronous processing using Celery and Redis."`
- *Unacceptable:* `"Architected a revolutionary next-gen enterprise distributed powerhouse."`
Always represent engineering architecture, trade-offs, and metrics with grounded technical precision.

### Principle 5 — Do Not Overengineer
Do not introduce unnecessary complexity (e.g., Kubernetes clusters, complex event brokers, multi-service meshes, or speculative AI pipelines) unless explicitly required by real architectural bottlenecks. Prefer the simplest robust solution that solves the current problem.

### Principle 6 — Build in Vertical Milestones
Each feature or milestone must deliver an immediately usable vertical capability. Do not scaffold non-functional stubs or attempt to implement the entire multi-phase vision in a single session.

### Principle 7 — User is the First Customer
Career OS is engineered first and foremost as an owned personal system to solve the owner's immediate workflow challenges (career management, LaTeX resume generation, JD matching). Features must demonstrate personal utility before considering general SaaS applicability.

### Principle 8 — Preserve the Public Portfolio
Do not redesign, reskin, or break the public portfolio UI unless explicitly requested by the user. The existing visual aesthetic (GitHub Primer-inspired dark palette, technical breakdowns) is approved. Future administrative dashboards must be designed as separate control-plane experiences.

### Principle 9 — Resume Data Must Remain Consistent
The public portfolio, private dashboard, and future Resume Studio must consume the same underlying career data. Never create divergent or contradictory representations of work history, projects, or technical skills.

### Principle 10 — Future Features Must Respect the Architecture
Future capabilities must build upon and extend the established foundation:
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, React Query
- **Backend:** Django 5.x, Django REST Framework, Python 3.11 (`uv`), PostgreSQL 16
- **Tooling:** Docker Compose, `Makefile`

---

## 2. Architecture Evolution Rule

Before introducing any new service, library, dependency, or architectural abstraction, evaluate it against these five questions:

1. **Does this solve an existing problem?**
2. **Will this still be valuable in one year?**
3. **Can the same result be achieved with less complexity?**
4. **Does this reduce future maintenance?**
5. **Is there another package or app already responsible for this concern?**

> **If any answer is "No", prefer the simpler solution.**

---

## 3. Enforcement Rules for Agent Behavior

- **Before modifying any data layer:** Ensure the change is backed by Django models and migrations in `backend/apps/`.
- **Before adding frontend displays:** Ensure the data is fetched dynamically from `/api/v1/` via React Query hooks.
- **Before implementing new milestones:** Check [docs/ROADMAP.md](file:///home/harsh/personal/career-os/docs/ROADMAP.md) to confirm milestone priority. Do not build future milestones (V3–V8) prematurely.
- **Before generating content:** Verify facts against existing database models or ask the user directly (Principle 3).
- **Branch & PR Workflow:** Never merge feature or doc branches locally into `dev` or `main` unless explicitly instructed. Always push the branch to `origin` and prepare the GitHub Pull Request creation link.
- **If a requested change violates any principle:** Explicitly state the conflict, cite the principle at risk, and propose an alternative that preserves architectural integrity.

---

## 4. Project Context & Environment

- **Repository:** `career-os`
- **Current Version:** V1 (Public Engineering Portfolio)
- **Next Implementation Milestone:** V2 (Private Career Dashboard)
- **Branch Model:** `main` (production / protected), `dev` (staging / default integration), short-lived feature branches (`feat/`, `fix/`, `docs/`) branched off `dev`
- **Commit Standard:** Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`)
- **Execution Environment:** Docker-first (`make up`, `make migrate`, `make seed`, `make test`)
- **Backend Engine:** Django REST Framework + PostgreSQL 16 (`backend/`)
- **Frontend Engine:** Next.js 15 + React Query + Tailwind CSS (`frontend/`)

---

*Last updated: August 2026*
