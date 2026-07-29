<div align="center">

<h1>⚡ Career OS</h1>

<p><strong>Your entire professional identity, version-controlled.</strong></p>

<p>Career OS is an AI-powered engineering platform that manages a developer's complete professional presence from a single Git repository. Write your career data once — in structured Markdown — and generate everything else automatically: portfolio website, resume, GitHub profile, project documentation, career timeline, blog, and recruiter-ready assets.</p>

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Status: Alpha](https://img.shields.io/badge/Status-Alpha-orange.svg)]()
[![Made with Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4-red.svg)]()

</div>

---

## Table of Contents

- [Overview](#overview)
- [Core Philosophy](#core-philosophy)
- [What Career OS Generates](#what-career-os-generates)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Most developers manage their professional presence as a patchwork of disconnected tools — a LinkedIn profile here, a résumé PDF there, a stale portfolio website, and a GitHub bio that was last updated two jobs ago. Every time something changes, they have to update everything manually, inconsistently, and often not at all.

**Career OS solves this.** It treats your professional identity as structured data stored in a Git repository. Every role, project, skill, certification, and blog post lives as a Markdown file with YAML front matter. From this single source of truth, Career OS uses AI to synthesize, tailor, and publish your professional presence across every surface that matters.

Think of it as **Infrastructure as Code, but for your career.**

---

## Core Philosophy

| Principle | Description |
|-----------|-------------|
| **Git as Source of Truth** | All career data is plain text, version-controlled, and fully portable. No vendor lock-in. |
| **Write Once, Publish Everywhere** | Define your experience once; generate output for every target platform automatically. |
| **AI-Augmented, Human-Controlled** | AI generates summaries, tailors content, and catches gaps — but you approve every output. |
| **Open by Default** | The platform, the prompts, and the generation logic are all open source and auditable. |
| **Zero Runtime Dependency** | All outputs are static assets. No database, no server, no SaaS subscription required. |
| **Composable & Extensible** | Built as a collection of independent packages. Use only what you need. |

---

## What Career OS Generates

Career OS transforms your structured Markdown content into:

| Output | Description |
|--------|-------------|
| 🌐 **Portfolio Website** | A statically generated, fully responsive personal site |
| 📄 **Resume / CV** | LaTeX and PDF resume with role-specific tailoring |
| 🐙 **GitHub Profile README** | A dynamic `README.md` for your GitHub profile page |
| 📚 **Project Documentation** | Auto-generated docs pages for each project you list |
| 🕰️ **Career Timeline** | An interactive visual timeline of your professional journey |
| ✍️ **Blog** | A Markdown-driven blog published alongside your portfolio |
| 🤖 **AI Summaries** | LLM-generated professional bios, taglines, and cover letter drafts |
| 📦 **Recruiter Assets** | One-click export of a recruiter-ready package (PDF resume + cover letter + bio) |

---

## Repository Structure

```
career-os/
│
├── content/raw/              # Source of truth — all career data lives here (P1)
│   ├── experience/           # Work history (one .md file per role)
│   ├── projects/             # Projects and open-source contributions
│   ├── education/            # Degrees, courses, and academic history
│   ├── skills/               # Technical and soft skills taxonomy
│   ├── certifications/       # Licenses and certifications
│   ├── awards/               # Achievements and recognitions
│   ├── blog/                 # Long-form writing and technical posts
│   ├── publications/         # External articles, talks, and conference papers
│   ├── timeline/             # Career milestones and life events
│   └── assets/               # Raw static media (images, logos, brand)
│
├── apps/
│   ├── website/              # Portfolio website (Next.js 16 + Tailwind v4 + shadcn/ui)
│   └── api/                  # Future REST/GraphQL API server (marker)
│
├── packages/                 # Shared internal libraries
│   ├── content-schema/       # Zod schemas + TypeScript types (root type authority)
│   ├── content-parser/       # Parses and validates Markdown content → ContentGraph
│   ├── website-generator/    # Data-access layer for the Next.js website
│   ├── resume-generator/     # Builds resume artifacts (PDF, LaTeX)
│   ├── github-generator/     # Generates GitHub profile README
│   ├── ai-engine/            # LLM provider abstraction, prompts (prompts/), orchestration
│   └── shared-utils/         # Zero-dependency shared utilities
│
├── infra/                    # Container infrastructure (Dockerfile.dev, compose, .env.example)
│
├── output/                   # Generated artifacts — gitignored, never committed
│   ├── resume/               # Generated PDF and LaTeX resume files
│   ├── github-profile/       # Generated GitHub profile README
│   ├── recruiter-package/    # Bundled recruiter ZIP files
│   └── ai-drafts/            # AI-generated content staged for human review
│
├── scripts/                  # CLI scripts for generation and publishing
│   ├── generate/             # Output generation scripts
│   ├── publish/              # Publishing scripts (GitHub, deployment)
│   └── validate/             # Content validation and linting
│
├── tests/                    # Cross-package integration tests
│
├── docs/                     # Extended project documentation
│   ├── adr/                  # Architecture Decision Records
│   ├── architecture/         # Diagrams and system design notes
│   ├── migrations/           # Breaking change migration guides
│   ├── requirements/         # Feature and non-functional requirements
│   ├── schemas/              # JSON Schema files for all content types
│   ├── PROJECT.md            # Vision, goals, non-goals, guiding principles
│   └── ROADMAP.md            # Versioned development roadmap
│
├── .agents/                  # Agent rules and orchestration definitions
├── .github/                  # GitHub Actions workflows and issue templates
│
├── Makefile                  # 1-command developer interface (make dev, make install)
├── career-os.config.ts       # Platform configuration (generators, paths, providers)
│
├── README.md                 # Primary project landing doc
├── ARCHITECTURE.md           # System architecture and design decisions
├── CONTRIBUTING.md           # Contribution guide for collaborators
├── CHANGELOG.md              # Version-tagged changelog
└── LICENSE                   # MIT License
```

---

## Getting Started

> **Note:** Career OS is currently in the **Alpha** phase. The project scaffolding is in place, and active development is underway.

### Prerequisites

| Tool | Minimum Version |
|------|----------------|
| [Docker](https://docs.docker.com/get-docker/) | 24.x |
| [Git](https://git-scm.com) | 2.x |

That's it. Node.js, pnpm, and all build tools run **inside Docker**. Nothing is installed on your host machine.

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/Harsh324/career-os.git
cd career-os

# 2. Build the dev container and install all dependencies
make install

# 3. Start the development server
make dev
```

### Available Commands

```bash
make dev          # Start Next.js dev server (http://localhost:3000)
make shell        # Open a shell inside the dev container
make build        # Production build
make lint         # Run ESLint across all packages
make type-check   # TypeScript type check across all packages
make test         # Run all tests (Vitest)
make format       # Auto-format with Prettier
make clean        # Remove all build artifacts
```

### Populating Your Content

Career OS content lives in the `content/raw/` directory. Each subdirectory corresponds to a domain of your professional life. Add one Markdown file per entry with YAML front matter. See [ARCHITECTURE.md](ARCHITECTURE.md) for the full schema specification.

### Generating Outputs

```bash
# Validate all content against schemas
make content:validate

# Generate all configured outputs
make generate
```

---

## Documentation

| Document | Purpose |
|----------|---------|
| [docs/PROJECT.md](docs/PROJECT.md) | Vision, goals, non-goals, and guiding principles |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design, data flow, and technical decisions |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Versioned feature roadmap and milestone planning |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute, coding standards, and PR process |
| [CHANGELOG.md](CHANGELOG.md) | Release notes and version history |
| [docs/adr/](docs/adr/) | Architecture Decision Records |

---

## Roadmap

Career OS follows a milestone-based roadmap. See [docs/ROADMAP.md](docs/ROADMAP.md) for the full plan.

| Milestone | Status | Description |
|-----------|--------|-------------|
| **v0.1 — Foundation** | 🔄 In Progress | Repository structure, content schema, and parsing pipeline |
| **v0.2 — Resume Generator** | 📋 Planned | PDF/LaTeX resume generation from content |
| **v0.3 — Portfolio Website** | 📋 Planned | Static portfolio site generation |
| **v0.4 — AI Synthesis Layer** | 📋 Planned | LLM-powered bio, summary, and tailoring features |
| **v0.5 — Publishing Automation** | 📋 Planned | Automated GitHub profile and project README publishing |
| **v1.0 — Public Release** | 📋 Planned | Stable API, full documentation, and community launch |

---

## Contributing

Career OS is built to be an open platform, not a personal website generator. Contributions are welcome — whether you're fixing a bug, improving documentation, adding a new output generator, or proposing a new content schema.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

---

## License

Career OS is released under the [MIT License](LICENSE). Copyright © 2026 Harsh324.

You are free to use, modify, and distribute this software for personal and commercial purposes. See the [LICENSE](LICENSE) file for full terms.

---

<div align="center">
  <sub>Built with intention. Managed with Git. Powered by AI.</sub>
</div>