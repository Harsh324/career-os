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
├── content/                  # Source of truth — all career data lives here
│   ├── experience/           # Work history (one .md file per role)
│   ├── projects/             # Projects and open-source contributions
│   ├── education/            # Degrees, courses, and academic history
│   ├── skills/               # Technical and soft skills taxonomy
│   ├── certifications/       # Licenses and certifications
│   ├── awards/               # Achievements and recognitions
│   ├── blog/                 # Long-form writing and technical posts
│   ├── publications/         # External articles, talks, and conference papers
│   └── timeline/             # Career milestones and life events
│
├── apps/
│   └── website/              # Portfolio website application
│
├── packages/                 # Shared internal libraries
│   ├── content-parser/       # Parses and validates Markdown content
│   ├── resume-generator/     # Builds resume artifacts (PDF, LaTeX, JSON)
│   ├── ai-engine/            # AI prompt orchestration and output generation
│   └── publisher/            # Publishes generated assets to external surfaces
│
├── ai/                       # AI layer — agents and versioned prompt templates
│   ├── agents/               # Agent definitions and orchestration configs
│   └── prompts/              # LLM prompt templates (versioned and auditable)
│
├── assets/                   # Committed static assets (images, logos, brand)
│   ├── images/               # Profile photos and project screenshots
│   └── logos/                # Brand assets and icons
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
│   └── schemas/              # JSON Schema files for all content types
│
├── public/                   # Static public files (favicons, robots.txt, etc.)
├── .github/                  # GitHub Actions workflows and issue templates
│
├── career-os.config.ts       # Platform configuration (outputs, providers, deployment)
│
├── README.md                 # This file
├── PROJECT.md                # Project vision, goals, and non-goals
├── ROADMAP.md                # Versioned development roadmap
├── ARCHITECTURE.md           # System architecture and design decisions
├── CONTRIBUTING.md           # Contribution guide for collaborators
├── CHANGELOG.md              # Version-tagged changelog
└── LICENSE                   # MIT License
```

---

## Getting Started

> **Note:** Career OS is currently in the **Alpha** phase. The project scaffolding is in place, and active development is underway. The following steps will be updated as the tooling matures.

### Prerequisites

- Node.js ≥ 20.x
- Git ≥ 2.x
- An OpenAI or compatible LLM API key (for AI generation features)

### Installation

```bash
# Clone the repository
git clone https://github.com/Harsh324/career-os.git
cd career-os

# Install dependencies (available once packages are initialized)
npm install

# Copy environment configuration
cp .env.example .env
# Add your LLM API key to .env
```

### Populating Your Content

Career OS content lives in the `content/` directory. Each subdirectory corresponds to a domain of your professional life. See the [Content Schema documentation](docs/architecture/) for the full YAML front matter specification for each content type.

### Generating Outputs

```bash
# Validate and parse all content
npm run content:validate

# Generate all outputs
npm run generate

# Start the portfolio website locally
npm run dev

# Build static portfolio for deployment
npm run build
```

---

## Documentation

| Document | Purpose |
|----------|---------|
| [PROJECT.md](PROJECT.md) | Vision, goals, non-goals, and guiding principles |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design, data flow, and technical decisions |
| [ROADMAP.md](ROADMAP.md) | Versioned feature roadmap and milestone planning |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute, coding standards, and PR process |
| [CHANGELOG.md](CHANGELOG.md) | Release notes and version history |
| [docs/adr/](docs/adr/) | Architecture Decision Records |

---

## Roadmap

Career OS follows a milestone-based roadmap. See [ROADMAP.md](ROADMAP.md) for the full plan.

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