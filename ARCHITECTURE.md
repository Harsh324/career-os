# Career OS — System Architecture

> This document provides the authoritative technical architecture, system design, domain models, and operational boundaries of Career OS.

---

## 1. Architectural Foundation & Overview

Career OS is architected as a **decoupled, backend-driven platform** where the database serves as the canonical single source of truth, Django REST Framework provides structured business logic and APIs, and Next.js acts as a high-performance presentation layer.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                            │
│                        Next.js 15 (App Router)                         │
│  - Public Portfolio (/experience, /projects, /skills, /timeline, etc.) │
│  - React Query for state hydration & API caching                      │
│  - Tailwind CSS + Dark Mode Design Tokens                              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST JSON (/api/v1/)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                             API ENGINE                                 │
│                     Django REST Framework (DRF)                        │
│  - Modular Domain Apps (Experiences, Projects, Skills, Timeline, etc.) │
│  - drf-spectacular (OpenAPI 3.0 / Swagger / Redoc Documentation)       │
│  - SimpleJWT Authentication & Permission Scopes                        │
│  - Django ORM Data Access & Query Optimization                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ SQL Connection (psycopg 3)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         PERSISTENCE LAYER                              │
│                        PostgreSQL 16 Engine                            │
│  - Relational Integrity, Foreign Keys, Unique Slugs, Constraints       │
│  - Ordered Indexes for Timeline, Displays, and Featured Entities       │
│  - Media & Static Asset Storage                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Principle: Control Plane vs. Presentation Layer

> **THE DASHBOARD IS THE CONTROL PLANE. THE PORTFOLIO IS A PRESENTATION LAYER.**

```
                              CAREER OS
                                  │
                  ┌───────────────┴───────────────┐
                  │                               │
        PRIVATE DASHBOARD                 PUBLIC PORTFOLIO
         (Control Plane)                (Presentation Layer)
     - Manage & Edit Records          - Fast, Read-Only Rendering
     - Save & Preview Drafts          - Optimized for Recruiters/Engineers
     - Publish to Public API          - High-Impact Architecture Details
                  │                               │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                         REST API (/api/v1/)
                                  │
                                  ▼
                        PostgreSQL Database
```

- **Control Plane (Private Dashboard — Planned V2):** The administrative interface where the owner edits records, uploads assets, configures display preferences, and triggers publishes.
- **Presentation Layer (Public Portfolio — Current V1):** A consumer of published backend data. It contains no hardcoded career facts and performs no unauthenticated state mutations.
- **Authoritative Data Authority:** PostgreSQL stores the definitive version of every career record.

---

## 3. Backend Architecture & Domain Models

The backend is built with Python 3.11 and Django 5.x, managed via `uv` for ultra-fast dependency resolution and isolated virtual environments.

### Domain Apps (`backend/apps/`)

| App Directory | Core Responsibilities & Domain Entities |
|---|---|
| `apps/accounts` | Custom user model, SimpleJWT authentication, token refresh, admin permissions. |
| `apps/companies` | Organizations, company names, logo assets, company website URLs. |
| `apps/experiences` | Professional employment history, roles, dates, summary, responsibilities, quantifiable metrics, technical challenges, solutions, and architectural breakdowns. |
| `apps/projects` | Showcase engineering projects, slugged URLs, repository links, live demos, architectural diagrams, technical decisions, trade-offs, and featured flags. |
| `apps/technologies` | Normalized technical catalog (languages, frameworks, tools) with icons and categorization. |
| `apps/skills` | Categorized skills taxonomy (Backend, Cloud, Databases, Languages, etc.) linked to technologies with proficiency levels and ordering. |
| `apps/certifications` | Professional credentials (e.g. AWS Solutions Architect), issuers, credential IDs, verification links, and issue/expiry dates. |
| `apps/education` | Academic institutions, degrees, fields of study, graduation dates, and relevant academic achievements. |
| `apps/timeline` | Interactive chronological milestones, milestone categories, descriptions, and importance weighting. |
| `apps/site_settings` | Global profile metadata, engineer name, professional headline, contact details, social URLs, and active resume links. |
| `apps/media_assets` | Image and document asset management with media storage. |
| `apps/seo` | Page-specific SEO metadata, OpenGraph cards, meta descriptions, and indexing controls. |
| `apps/ai_assistant` | AI assistant endpoints (`POST /api/v1/assistant/chat/`), dynamic ORM context aggregation, and streaming provider abstraction. |

### API Routing Convention

All endpoints follow strict RESTful conventions under `/api/v1/`:
- `GET /api/v1/settings/profile/` — Site profile and primary metadata
- `GET /api/v1/experience/` — Work experience entries with architecture details
- `GET /api/v1/projects/` — Engineering projects (supports filtering by `is_featured`)
- `GET /api/v1/skills/` — Grouped skill taxonomy
- `GET /api/v1/certifications/` — Active certifications
- `GET /api/v1/timeline/` — Chronological career events
- `GET /api/v1/education/` — Education records
- `POST /api/v1/assistant/chat/` — Career copilot query endpoint
- `GET /api/docs/` — Swagger UI interactive API documentation

---

## 4. Frontend Architecture

The frontend is built using **Next.js 15 (App Router)** with **TypeScript**, styled via **Tailwind CSS**, and powered by **TanStack React Query** for robust client-side state hydration and caching.

```
frontend/src/
├── app/                      # Next.js App Router Pages
│   ├── page.tsx              # Home / Overview / Featured Projects / Technical Identity
│   ├── experience/           # Detailed Work Experience & Architecture Breakdowns
│   ├── projects/             # Deep Technical Showcase & Project Architecture
│   ├── skills/               # Curated Skills & Technology Taxonomy
│   ├── timeline/             # Interactive Career Milestones Timeline
│   ├── resume/               # Digital ATS-Friendly Resume Presentation
│   ├── layout.tsx            # Root Layout (Nav, Footer, Theme, Global Metadata)
│   ├── error.tsx             # Route-level error boundaries
│   └── sitemap.ts            # Dynamic sitemap generation
├── components/               # Reusable UI & Domain Components
│   ├── ui/                   # Base primitives (Cards, Badges, Buttons, Tabs)
│   ├── experience/           # Experience cards, architecture modal/drawers
│   ├── projects/             # Project cards, tech stack pills, architecture diagrams
│   └── navigation/           # Header, mobile navigation, theme switcher
├── lib/                      # Utilities & API Client
│   ├── api.ts                # Axios instance with base URL & interceptors
│   ├── queries.ts            # React Query hooks for fetching backend entities
│   └── utils.ts              # Class name merging (clsx/tailwind-merge)
└── providers/                # Theme and Query Client Context Providers
```

### Visual & UX Standards
- **GitHub Primer-Inspired Palette:** Dark mode default (`#0d1117`, `#161b22`, `#30363d`, `#58a6ff`).
- **High-Density Technical Layout:** Prioritizes architecture diagrams, metrics badges, and problem-solution narratives over generic marketing fluff.
- **Fast First Paint:** Clean server-rendered shells hydrated with client-side React Query data fetching.

---

## 5. Infrastructure & Container Orchestration

Development and execution are orchestrated using **Docker Compose** with multi-file modular configuration.

```
infra/
├── docker-compose.yml            # Root compose file including backend and frontend configs
├── docker-compose.backend.yml    # Database (PostgreSQL 16) + Django API container
├── docker-compose.frontend.yml   # Next.js frontend container
├── docker/
│   ├── backend.Dockerfile        # Python 3.11 + uv base image
│   └── frontend.Dockerfile       # Node.js 20 base image
└── .env.example                  # Environment template
```

### Unified Makefile Interface

The top-level `Makefile` exposes standard automation targets:

| Command | Action |
|---|---|
| `make up` | Starts full stack (db + backend + frontend) in detached mode |
| `make up-backend` | Starts database and Django backend only |
| `make up-frontend` | Starts Next.js frontend only |
| `make down` | Gracefully stops all containers |
| `make logs` | Streams live logs from all containers |
| `make migrate` | Generates and applies Django database migrations |
| `make seed` | Runs initial database seeding management command |
| `make lint` | Runs `ruff` on backend and `eslint` on frontend |
| `make format` | Runs `ruff format` on backend |
| `make test` | Executes backend test suite and frontend type-checking |

---

## 6. Future Architectural Evolution

The architecture is designed to evolve cleanly through planned milestones without breaking existing interfaces:

1. **Career OS V2 (Private Dashboard):**
   - Introduces authenticated admin routes under `/dashboard/` in the frontend (or as a separate admin workspace).
   - Utilizes existing Django REST Framework CRUD endpoints protected with JWT permission classes.
   - Implements draft/preview state transitions before records become publicly visible.

2. **Career OS V3 (Resume Studio):**
   - Adds Monaco/CodeMirror editor component to the private dashboard.
   - Introduces an isolated LaTeX compilation worker (Dockerized TinyTeX / tectonic) to compile LaTeX source into PDF artifacts on demand.
   - Stores versioned `.tex` and `.pdf` files in the backend media storage.

3. **Career OS V4–V8 (Job CRM, JD Analysis, Career Copilot):**
   - New database models for Job Applications, Interview Logs, and JD Parsers added via standard Django apps.
   - LLM integration utilizes backend worker queues (Celery/Redis) for compute-heavy analysis without blocking web requests.
