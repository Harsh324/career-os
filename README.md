<div align="center">

# ⚡ Career OS

**A Personal Career Operating System & High-Signal Engineering Showcase**

<p>Career OS is a decoupled, backend-driven platform that acts as the single source of truth for professional identity, career history, technical architectures, skills, certifications, and resumes.</p>

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status: V1 Active](https://img.shields.io/badge/Status-V1%20Active-brightgreen.svg)]()
[![Stack: Next.js + Django](https://img.shields.io/badge/Stack-Next.js%2015%20%7C%20Django%205%20%7C%20PostgreSQL-0969da.svg)]()

</div>

---

## 📖 Table of Contents

- [Overview & Vision](#overview--vision)
- [System Architecture](#system-architecture)
- [Repository Structure](#repository-structure)
- [Featured Engineering Projects](#featured-engineering-projects)
- [Quick Start with Docker](#quick-start-with-docker)
- [Documentation Index](#documentation-index)
- [Roadmap & Next Milestone](#roadmap--next-milestone)
- [License](#license)

---

## 🎯 Overview & Vision

Most engineers manage their professional presence across fragmented platforms: an outdated resume file, inconsistent LinkedIn bullets, an uncurated GitHub profile, and disconnected notes.

**Career OS transforms this model into an integrated engineering system:**

```
CAREER DATA  ──►  PRESENTATION  ──►  MANAGEMENT  ──►  ANALYSIS  ──►  ACTION  ──►  OPTIMIZATION
 (PostgreSQL)      (Public Portfolio)   (Private Dashboard)  (JD Matching)   (Job Apps)      (Intelligence)
```

- **The Public Portfolio is a presentation layer** designed for high-density technical credibility, architecture breakdowns, and recruiter review.
- **The Private Dashboard (Planned V2) is the control plane** allowing complete career curation without editing source code.
- **The Relational Database is the single source of truth** powering all presentation surfaces.

For full product philosophy and evolution, see [docs/PRODUCT-VISION.md](docs/PRODUCT-VISION.md) and [docs/PROJECT.md](docs/PROJECT.md).

---

## 🏗️ System Architecture

Career OS follows a decoupled, three-tier architecture:

```
┌────────────────────────────────────────────────────────┐
│                  Next.js 15 Frontend                   │
│   (App Router, React Query, Tailwind CSS, Dark Theme)  │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / REST JSON (/api/v1/)
                            ▼
┌────────────────────────────────────────────────────────┐
│            Django REST Framework API Engine            │
│   (Modular Domain Apps, drf-spectacular, SimpleJWT)    │
└───────────────────────────┬────────────────────────────┘
                            │ SQL (psycopg 3)
                            ▼
┌────────────────────────────────────────────────────────┐
│                  PostgreSQL 16 Engine                  │
│   (Relational Career Graph, Migrations, Indexes)       │
└────────────────────────────────────────────────────────┘
```

For complete technical specifications, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 📁 Repository Structure

```
career-os/
├── backend/                  # Django REST Framework API Engine
│   ├── apps/                 # Modular Domain Applications
│   │   ├── accounts/         # Authentication & user management
│   │   ├── companies/        # Companies & organizations
│   │   ├── experiences/      # Work history, architectures, metrics
│   │   ├── projects/         # Engineering project showcase
│   │   ├── skills/           # Skills taxonomy & proficiency
│   │   ├── technologies/     # Tech stack & tooling registry
│   │   ├── certifications/   # AWS & industry credentials
│   │   ├── education/        # Academic degrees & history
│   │   ├── timeline/         # Chronological milestones
│   │   ├── site_settings/    # Profile metadata & social links
│   │   ├── media_assets/     # Asset uploads & media storage
│   │   ├── seo/              # SEO configurations
│   │   └── ai_assistant/     # Career copilot query engine
│   ├── config/               # Django project settings & URL routing
│   └── manage.py             # Django management CLI
│
├── frontend/                 # Next.js 15 Presentation Layer
│   ├── src/
│   │   ├── app/              # App Router Pages (/experience, /projects, /skills, /timeline, /resume)
│   │   ├── components/       # Reusable UI & Domain Components
│   │   ├── lib/              # API Client & React Query Hooks
│   │   └── providers/        # Theme & Query Context Providers
│   └── package.json          # Frontend dependencies
│
├── infra/                    # Docker & Infrastructure
│   ├── docker-compose.yml    # Root Compose definition
│   ├── docker-compose.backend.yml
│   ├── docker-compose.frontend.yml
│   └── docker/               # Container Dockerfiles
│
├── docs/                     # Authoritative Documentation
│   ├── PRODUCT-VISION.md     # Long-term vision & product lifecycle
│   ├── PROJECT.md            # Current purpose, technical identity & journey
│   ├── ROADMAP.md            # Versioned milestones (V1–V8, Exploratory)
│   └── adr/                  # Architecture Decision Records
│
├── .agents/                  # Agent Governance & AI Rules
│   └── AGENTS.md             # 10 Permanent AI Coding Principles
│
├── Makefile                  # Developer CLI (make up, make migrate, make seed)
├── README.md                 # Primary Landing Documentation
└── ARCHITECTURE.md           # System Architecture & Technical Specifications
```

---

## 🚀 Featured Engineering Projects

1. **FinTrack AI:** AI-assisted personal finance platform with transaction management, automated transaction processing, bill splitting, and OCR-based automated bill splitting currently in development.
2. **Constellation:** Self-hosted infrastructure platform for running containerized services with private networking, reverse proxying, monitoring, and automated backups.
3. **Career OS:** Backend-driven engineering portfolio and career management platform (the underlying platform with the public portfolio serving as its current presentation layer).

---

## ⚡ Quick Start with Docker

```bash
# 1. Clone repository
git clone https://github.com/Harsh324/career-os.git
cd career-os

# 2. Start full stack (Database + Backend + Frontend)
make up

# 3. Apply database migrations
make migrate

# 4. Seed initial career data
make seed
```

- **Frontend:** [http://localhost:3002](http://localhost:3002)
- **Backend API:** [http://localhost:8002/api/v1/](http://localhost:8002/api/v1/)
- **Interactive Swagger Docs:** [http://localhost:8002/api/docs/](http://localhost:8002/api/docs/)
- **Django Admin:** [http://localhost:8002/admin/](http://localhost:8002/admin/)

---

## 📚 Documentation Index

| Document | Purpose |
|---|---|
| [docs/PRODUCT-VISION.md](docs/PRODUCT-VISION.md) | Vision statement, product lifecycle, and control plane vs presentation layer |
| [docs/PROJECT.md](docs/PROJECT.md) | Current V1 scope, technical identity, and 4-phase evolutionary journey |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Staged milestones (V1 Current, V2 Dashboard, V3 Resume Studio, V4–V8, Exploratory SaaS) |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Deep technical architecture, domain models, APIs, and container setup |
| [.agents/AGENTS.md](.agents/AGENTS.md) | 10 permanent engineering principles and strict governance rules for AI coding agents |
| [docs/adr/](docs/adr/) | Architecture Decision Records |

---

## 🗺️ Roadmap & Next Milestone

- ✅ **V1 — Public Engineering Portfolio (CURRENT):** Fully functional backend-driven showcase.
- 🎯 **V2 — Private Career Dashboard (NEXT MILESTONE):** Full CRUD management for career data, preview, and publish workflows without code modification.
- 📋 **V3 — Resume Studio (PLANNED):** In-browser LaTeX workspace with isolated compilation.

*See [docs/ROADMAP.md](docs/ROADMAP.md) for the complete milestone plan.*

---

## 📄 License

Career OS is released under the [MIT License](LICENSE). Copyright © 2026 Harsh Tripathi.