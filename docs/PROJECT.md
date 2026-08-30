# Career OS — Project Definition & Evolution

> This document captures the authoritative definition, current state, historical journey, and core engineering principles of Career OS.

---

## 1. Project Purpose & Current State

### Career OS V1 — Public Engineering Portfolio

Today, Career OS is implemented as a high-performance, backend-driven engineering portfolio platform designed to showcase verified engineering capability, distributed systems experience, and technical depth.

```
┌─────────────────────────────────────────┐
│           Next.js 15 Frontend           │
│   (Server & Client Components, React    │
│    Query, Tailwind CSS, Dark Theme)     │
└────────────────────┬────────────────────┘
                     │  HTTP / REST JSON
                     ▼
┌─────────────────────────────────────────┐
│     Django REST Framework API Engine     │
│   (Modular Django Apps, OpenAPI Schema,  │
│    JWT Auth, CORS, Data Serializers)    │
└────────────────────┬────────────────────┘
                     │  SQL Queries (psycopg3)
                     ▼
┌─────────────────────────────────────────┐
│          PostgreSQL Database            │
│   (Relational Schema, Migrations,       │
│    Relational Constraints, Indexes)     │
└─────────────────────────────────────────┘
```

### Current Public Capabilities

The public portfolio delivers a technical representation of career experience across the following surfaces:

- **Professional Profile:** Canonical bio, headline, contact channels, and verified public profiles (GitHub, LinkedIn).
- **Work Experience & Architecture:** In-depth breakdown of employment history, including system architecture descriptions, technical challenges, problem-solution-impact frameworks, and quantifiable business/engineering metrics.
- **Featured Projects:** Deep technical reviews of production and showcase projects including architectural diagrams, design decisions, trade-offs, and repository links.
- **Curated Skills Taxonomy:** Grouped skills categorized by domain (Backend, Cloud/DevOps, Databases, Languages, AI/Data) with context-specific proficiency.
- **Certifications & Licensure:** Verified professional certifications (e.g., AWS Certified Solutions Architect, AWS Certified Developer) with issuer details, verification URLs, and credential IDs.
- **Education:** Academic background and relevant coursework.
- **Career Timeline:** Interactive chronological milestones mapping key transitions, accomplishments, and professional growth.
- **Resume Presentation:** ATS-aligned digital resume view and downloadable formats.
- **Public Professional Links:** Direct access to code repositories, live systems, and external publications.

### Featured Engineering Projects

1. **FinTrack AI:** AI-assisted personal finance platform with transaction management, automated transaction processing, bill splitting, and OCR-based automated bill splitting currently in development.
2. **Constellation:** Self-hosted infrastructure platform for running containerized services with private networking, reverse proxying, monitoring, and automated backups.
3. **Career OS:** Backend-driven engineering portfolio and career management platform (underlying career platform with the public portfolio serving as its current presentation layer).

### Professional Positioning & Technical Identity

- **Primary Professional Role:** **Backend & Cloud Engineer**
- **Core Technical Stack:**
  - *Languages & Frameworks:* Python, Django, Django REST Framework, TypeScript, Next.js
  - *Data & Storage:* PostgreSQL, Redis, Celery (asynchronous task execution)
  - *Cloud & Infrastructure:* AWS (ECS/Fargate, RDS, S3, CloudFormation), Docker, Docker Compose, Linux, Nginx
  - *Architectural Focus:* Asynchronous processing, distributed backend systems, RESTful API design, database modeling, queue architectures, data scraping/extraction pipelines
- **Role of AI:** AI is utilized as a **supporting engineering capability** (e.g., automated parsing, retrieval, synthesis), **NOT** the primary professional identity.

---

## 2. Project Evolution & Journey

The development of Career OS progressed through distinct evolutionary phases:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     PHASE 0     │  ──►  │     PHASE 1     │  ──►  │     PHASE 2     │  ──►  │     PHASE 3     │
│   The Problem   │       │ Structured Data │       │ Backend Platform│       │ Engineering V1  │
└─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘
```

### Phase 0 — The Problem: Fragmented Professional Presence
Career information was fragmented across multiple disconnected silos:
- A resume PDF manually updated in Overleaf / Word and rarely kept in sync.
- A LinkedIn profile with summarized, inconsistently worded bullet points.
- A GitHub profile with outdated README files.
- Project notes, certifications, and architectural learnings scattered across Notion, local text files, and repositories.

Updating one surface required tedious manual synchronization across all others. Inevitably, information became stale, inconsistent, and under-represented. The initial hypothesis was clear: **centralize career data into a single source of truth.**

### Phase 1 — Structured Career Data: Moving to Schemas
To eliminate hardcoded frontend strings and layout-coupled text, career records were structured into formalized schemas. 
- Introduced the concept of the **Single Source of Truth**.
- Defined strict schemas for experiences, projects, skills, education, and credentials.
- Separated raw data from visual presentation logic.

### Phase 2 — Backend-Driven Portfolio: Relational Persistence & REST API
Career OS evolved from static flat files into an extensible, backend-driven architecture.
- Adopted **PostgreSQL** for relational integrity, indexable queries, and foreign-key consistency (e.g., linking technologies to specific experiences and projects).
- Implemented **Django REST Framework** as a robust, secure API layer providing OpenAPI documentation and modular domain apps.
- Decoupled the **Next.js** frontend into a pure presentation layer consuming versioned `/api/v1/` endpoints.

### Phase 3 — Engineering Portfolio: Evidence Over Buzzwords
The public portfolio was refined into an evidence-based engineering showcase:
- Shifted focus from simple feature lists to **system architecture, engineering challenges, problem-solution-impact narratives, and measurable metrics**.
- Embedded technical diagrams, infrastructure layouts, and decision rationales.
- Integrated a comprehensive career timeline and verified AWS certification credentials.

### Current State — Career OS V1
The current public portfolio represents **V1** of Career OS. It remains concise, high-signal, technical, and recruiter-friendly. The public portfolio is not the entire product—it is the first public window into the Career OS data layer.

---

## 3. Core Architectural Principle

> **THE DASHBOARD IS THE CONTROL PLANE. THE PORTFOLIO IS A PRESENTATION LAYER.**

```
                        CAREER OS
                            │
                  ┌─────────┴─────────┐
                  │                   │
              DASHBOARD           PORTFOLIO
              (Private)           (Public)
                  │                   │
                  └─────────┬─────────┘
                            │
                            ▼
                       CAREER DATA
                            │
                            ▼
                       PostgreSQL
```

- **The Private Dashboard (Control Plane):** The administrative interface where the engineer creates, edits, previews, and publishes career records without modifying source code.
- **The Public Portfolio (Presentation Layer):** A read-only consumer of published backend data, optimized for speed, aesthetics, SEO, and recruiter engagement.
- **The Backend & Database (Authoritative Authority):** The central repository for all career history, project metadata, resume variants, and future intelligence logs.

---

## 4. Engineering & Product Principles

1. **Career Data is the Source of Truth:** Never hardcode career records in frontend components or duplicate constants when the database owns them.
2. **Separation of Concerns:** Keep the public portfolio focused and recruiter-friendly; confine operational complexity to the private dashboard.
3. **Evidence Over Marketing:** Communicate technical realities, trade-offs, and metrics accurately without hyperbole.
4. **Zero Fabrication:** Never invent metrics, user figures, technologies, or employment dates.
5. **Simplicity Over Speculation:** Avoid unnecessary infrastructure (e.g., Kubernetes, event buses, microservices) until real traffic or functional requirements demand it.
