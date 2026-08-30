# Career OS — Product Vision

> "Career OS is a personal career operating system that acts as the single source of truth for a person's professional identity, career history, projects, skills, certifications, resumes, applications, and eventually career intelligence."

---

## 1. Executive Summary

Most software engineers manage their professional presence through disconnected silos: a static resume PDF updated once a year, a LinkedIn profile with generic bullet points, an uncurated GitHub account, scattered notes from interviews, and bookmark folders of job postings. 

**Career OS fundamentally changes this model.**

Career OS is not merely a portfolio website. The public portfolio is only **one presentation layer** of Career OS. The private dashboard will eventually become the **primary control plane**, with the backend and database serving as the **authoritative single source of truth** for all career data.

```
                         CAREER OS
                             │
                   ┌─────────┴─────────┐
                   │                   │
               DASHBOARD           PORTFOLIO
            (Private Control)   (Public Presentation)
                   │                   │
                   └─────────┬─────────┘
                             │
                             ▼
                        CAREER DATA
                        (REST APIs)
                             │
                             ▼
                         PostgreSQL
```

---

## 2. Fundamental Product Lifecycle

Career OS operates on a continuous professional lifecycle:

```
CAREER DATA  ──►  PRESENTATION  ──►  MANAGEMENT  ──►  ANALYSIS  ──►  ACTION  ──►  OPTIMIZATION
 (Structured        (Portfolio,        (Private         (JD Match,        (Job App,       (Career Growth,
   Records)          Resume)          Dashboard)        Skill Gaps)       Interview)       Intelligence)
```

1. **Career Data (Store):** Canonical records of experience, architecture decisions, metrics, projects, skills, certifications, and timeline milestones.
2. **Presentation (Present):** Dynamic rendering into tailored public portfolios, LaTeX resumes, and public profiles.
3. **Management (Manage):** Full administrative control via a private dashboard with edit, preview, and publish workflows without code edits.
4. **Analysis (Analyze):** Evaluating job descriptions against real career data to determine fit scores, strong matches, and skill gaps without hallucination.
5. **Action (Act):** Tracking job applications, managing tailored resume versions, and documenting interview rounds and questions.
6. **Optimization (Optimize):** Extracting insights across applications, interviews, and outcomes to identify high-value skills and career trajectories.

---

## 3. Core Product Principles

### I. The Dashboard is the Control Plane; The Portfolio is a Presentation Layer
The public portfolio presents published information to recruiters and peers. The private dashboard allows the developer to manage, curate, and configure this data. Internal operational complexity belongs exclusively in the dashboard.

### II. Authoritative Single Source of Truth
All career information lives in the central database. Resume generators, portfolio pages, and export tools consume this canonical data rather than defining isolated copies.

### III. Evidence-Based Engineering Representation
Career representations must emphasize architectural decisions, technical trade-offs, quantifiable metrics, and problem-solution-impact narratives. Credibility takes precedence over marketing jargon.

### IV. Grounded AI (Zero Hallucination)
AI features (such as the Career Copilot or JD Analyzer) must be strictly grounded in verified Career OS data. The system must never invent metrics, skills, dates, or responsibilities.

### V. User as First Customer
Career OS is built first and foremost as a high-utility personal system for the owner. It validates real-world workflow efficiency before any speculative generalization.

---

## 4. Target User & Positioning

- **Primary Persona:** Software Engineers & Backend/Cloud Engineers seeking a disciplined, centralized system for their professional identity and career growth.
- **Current Owner Positioning:** Backend & Cloud Engineer (Python, Django, Celery, PostgreSQL, Redis, AWS, Docker, distributed backend systems, with AI/data extraction as a supporting capability).
- **Recruiter/Viewer Experience:** High-signal, technically credible, recruiter-friendly presentation with clear architectural breakdowns and live demonstrations.

---

## 5. Horizon: Personal Tool to Potential Product

Career OS begins as an owned, self-hosted personal operating system. 

```
┌────────────────────────────────────────────────────────┐
│ Phase 1: Personal Career Operating System (Current)   │
│ - Single user (owner)                                  │
│ - Solves immediate career & resume workflow problems  │
│ - High-conviction engineering iteration                │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ Phase 2: Open Architecture & Proven Workflows          │
│ - Validated resume compilation & JD intelligence       │
│ - Refined dashboard control plane                      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ Phase 3: Exploratory SaaS / Multi-User Product         │
│ - Multi-tenant auth & workspaces                       │
│ - Hosted portfolio generation & ATS integrations       │
│ (Explicitly deferred until Phase 1 & 2 are complete)   │
└────────────────────────────────────────────────────────┘
```

*Premature SaaS architecture is strictly avoided. Every feature must deliver direct, concrete utility to the developer today.*
