# Career OS — Product Roadmap & Milestone Execution

> This document defines the versioned, staged roadmap for Career OS.
> Milestones are categorized by readiness: **CURRENT**, **PLANNED**, **FUTURE**, and **EXPLORATORY**.
> **Future features must NOT be pre-implemented.** Each phase must be built in vertical, usable increments.

---

## Roadmap Overview

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [CURRENT]     V1: Public Engineering Portfolio                                   │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [PLANNED]     V2: Private Career Dashboard (NEXT MILESTONE)                      │
│ [PLANNED]     V3: Resume Studio (LaTeX Editor & Compiler)                        │
│ [PLANNED]     V3.x: Career Data / Resume Integration (Variable-driven LaTeX)     │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [FUTURE]      V4: Job & Application Pipeline Management                          │
│ [FUTURE]      V5: Job Description Intelligence & Gap Analysis                    │
│ [FUTURE]      V6: Interview Management & Question Bank                           │
│ [FUTURE]      V7: Grounded AI Career Copilot                                     │
│ [FUTURE]      V8: Longitudinal Career Intelligence                               │
├──────────────────────────────────────────────────────────────────────────────────┤
│ [EXPLORATORY] Multi-Tenant SaaS Platform & External Integrations                 │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Milestone Specifications

---

### [CURRENT] Career OS V1 — Public Engineering Portfolio

**Status:** ✅ **Implemented & Operating**  
**Focus:** Public-facing, high-signal engineering portfolio backed by a relational database and REST API.

#### Core Deliverables
- [x] **Relational Schema:** PostgreSQL models for experiences, projects, skills, technologies, certifications, education, timeline, and profile metadata.
- [x] **Backend API:** Django REST Framework API versioned under `/api/v1/` with OpenAPI / Swagger documentation (`drf-spectacular`).
- [x] **Frontend Presentation:** Next.js 15 App Router interface using Tailwind CSS and React Query for client state management.
- [x] **Engineering Experience Pages:** Detailed architecture breakdowns, technical challenges, problem-solution-impact narratives, and metrics.
- [x] **Featured Projects Showcase:** Architecture diagrams, engineering decisions, and technical deep-dives for FinTrack AI, Constellation, and Career OS.
- [x] **Skills & Credentials:** Domain-grouped technical skills, verified AWS certifications with verification URLs, and education.
- [x] **Career Timeline:** Interactive chronological milestones.
- [x] **Docker Infrastructure:** Modular compose configuration (`infra/docker-compose.yml`) for database, backend, and frontend.

---

### [CURRENT] Career OS V2 — Private Career Dashboard

**Status:** 🚀 **IN PROGRESS (V2.0, V2.1 & V2.2 COMPLETED • V2.3 NEXT)**  
**Focus:** Administrative control plane allowing the owner to manage, preview, and publish career records without touching source code or re-running database seed scripts.

#### Milestone Sub-Phases:
- [x] **V2.0 — Control Plane Shell & Secure JWT Authentication:** Authenticated dashboard shell, telemetry stats, and token lifecycle.
- [x] **V2.1 — Profile & Site Settings Management:** Full-width profile editor, desktop single-row toolbar, dirty state tracking, and on-demand `ProfilePreviewModal`.
- [x] **V2.2 — Work Experience Management:**
  - Canonical PostgreSQL experience model with derived chronology (`start_year_month`), publication flag (`is_published`), and private career intelligence (`internal_notes`, `target_roles`).
  - Structured achievement bullets (`highlights`) for granular public/private exposure and direct Resume Studio (V3.0) readiness.
  - Public vs. private data masking in DRF serializer.
  - Reusable presentation layer (`ExperienceDetailView`) and on-demand live draft preview (`ExperiencePreviewModal`).
  - Focused 9-section editor with single-row desktop action bar and inline company creation dialog.
- [ ] **V2.3 — Projects Showcase Management (Next Milestone):** CRUD for projects, architecture breakdowns, engineering decisions, and live links.
- [ ] **V2.4 — Skills, Certifications, Education & Timeline Management.**
- [ ] **V2.5 — Media & Document Asset Management.**

---

### [PLANNED] Career OS V3 — Resume Studio

**Status:** 📋 **Planned (High Priority)**  
**Focus:** Integrated private LaTeX resume editing, compilation, versioning, and export workspace (eliminating dependency on external tools like Overleaf).

```
┌────────────────────────────────────────────────────────┐
│                   Private Dashboard                     │
│  ┌───────────────────────┐   ┌──────────────────────┐  │
│  │ Monaco / CodeMirror   │   │ Live PDF Viewer /    │  │
│  │ LaTeX Source Editor   │──►│ Preview Panel        │  │
│  └───────────┬───────────┘   └──────────────────────┘  │
└──────────────┼──────────────────────────────────────────┘
               │ Compile Request
               ▼
┌────────────────────────────────────────────────────────┐
│        Isolated LaTeX Compilation Service              │
│  (Dockerized TinyTeX / tectonic environment)            │
│  LaTeX Source ──► Compilation ──► PDF Artifact         │
└────────────────────────────────────────────────────────┘
```

#### Target Scope
- **Monaco / CodeMirror LaTeX Editor:** In-browser code editing with LaTeX syntax highlighting, line numbers, and error annotations.
- **Isolated Compilation Service:** Fast, containerized engine producing standard PDF outputs.
- **Side-by-Side PDF Preview:** Instant preview pane with zoom and page navigation.
- **Resume Version Control:** Save named versions (e.g., `Backend-Cloud-2026-v1.tex`), compare historical diffs, and set the active published resume.
- **One-Click Export:** Download PDF artifacts or raw LaTeX source files.

> [!IMPORTANT]
> Career OS V3 is **NOT** a full Overleaf clone. Its initial scope is strictly: **Edit → Compile → Preview → Save Version → Download**.

---

### [PLANNED] Career OS V3.x — Career Data / Resume Integration

**Status:** 📋 **Planned**  
**Focus:** Unifying structured career database records with LaTeX resume generation via template variables.

```
Career Database (PostgreSQL)  ──►  Resume Template Engine  ──►  LaTeX Rendering  ──►  Compiled PDF
```

#### Target Scope
- Dynamic template tags linking directly to canonical database records (`{{ experience.sms_datatech.metrics }}`, `{{ skills.backend }}`).
- Guarantees that updating a metric or project in the dashboard automatically updates resume generation targets.
- Preserves manual typographic overrides while eliminating data drift across portfolio and resume.

---

### [FUTURE] Career OS V4 — Job & Application Pipeline Management

**Status:** ⏳ **Future Milestone**  
**Focus:** Private CRM for job applications, recruiters, requirements, and resume version attribution.

#### Target Scope
- **Job Opportunity Schema:**
  - Company name, role title, job description (raw text & URL), location, salary band.
  - Specific filters: Japanese language proficiency requirement, visa sponsorship status.
  - Recruiter contact info, source channel, application date, custom notes.
- **Application Pipeline Stages:**
  ```
  Saved  ──►  Considering  ──►  Applied  ──►  Recruiter Screen  ──►  Interview Rounds  ──►  Offer / Closed
  ```
- **Resume Attribution:** Explicitly record which Resume Studio version was submitted for each application.

---

### [FUTURE] Career OS V5 — Job Description Intelligence & Gap Analysis

**Status:** ⏳ **Future Milestone**  
**Focus:** Grounded comparison between target job descriptions and structured career data.

#### Target Scope
- **JD Parser & Evaluator:** Ingest pasted job descriptions and cross-reference required skills, years of experience, and technologies against the Career OS database.
- **Match Matrix:**
  - *Strong Matches (✓):* Direct evidence in projects/experience (e.g., Python, Django, AWS ECS).
  - *Moderate / Adjacent (△):* Related tools (e.g., Terraform mapped from CloudFormation).
  - *Skill Gaps (✗):* Missing technologies or requirements (e.g., Kubernetes).
- **Grounded Recommendations:** Suggestions for which real experiences/projects to emphasize without fabricating credentials.

---

### [FUTURE] Career OS V6 — Interview Management & Question Bank

**Status:** ⏳ **Future Milestone**  
**Focus:** Tracking interview pipelines, technical discussions, system design questions, and personal performance.

#### Target Scope
- **Round Documentation:** Round number, date, interviewers, focus area (System Design, DSA, Cultural, Architecture).
- **Question Repository:** Centralized log of questions asked, answers provided, architectural diagrams sketched, and interviewer feedback.
- **Personal Question Bank:** Tagged database of recurring technical questions and refined personal answers.

---

### [FUTURE] Career OS V7 — Grounded AI Career Copilot

**Status:** ⏳ **Future Milestone**  
**Focus:** Natural language conversational assistant grounded exclusively in verified Career OS records.

#### Target Scope
- Dynamic context ingestion from PostgreSQL ORM into system prompts.
- Answers complex queries accurately (e.g., *"What AWS projects demonstrate high availability?"*, *"Explain the Celery worker architecture used at SMS DataTech"*).
- Prepares role-specific interview summaries and answers without hallucinating facts.

---

### [FUTURE] Career OS V8 — Longitudinal Career Intelligence

**Status:** ⏳ **Future Milestone**  
**Focus:** High-level pattern analysis across applications, market requirements, skills, and career trajectory.

#### Target Scope
- **Conversion Analytics:** Analyze interview conversion rates across different resume versions, target company types, and technical stacks.
- **Skill Demand Trends:** Identify which missing skills appear most frequently across rejected or target positions to guide future learning.
- Completes the loop: **Store → Present → Manage → Analyze → Act → Optimize**.

---

### [EXPLORATORY] Multi-Tenant SaaS Platform & Integrations

**Status:** 🔬 **Exploratory (Do NOT Build Now)**  
**Focus:** Evaluating Career OS as a generalizable platform for other engineers.

- Multi-tenant data isolation and user authentication.
- Automated portfolio subdomain provisioning.
- External import/export connectors (GitHub repositories, LinkedIn profile data where legally/technically feasible).
- **Rule:** Career OS must first be completely validated as a high-utility personal system for the owner before any SaaS abstraction is introduced.
