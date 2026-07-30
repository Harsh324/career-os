---
title: Career OS
category: Platform Engineering
description: Career OS is an engineering platform that manages and generates a software engineer's professional identity from structured content with Git as the single source of truth.
status: active
featured: true
start_date: "2024-01"
github_url: https://github.com/Harsh324/career-os
demo_url: https://career-os.dev
technologies:
  - Next.js
  - TypeScript
  - Turborepo
  - pnpm
  - Docker
  - Zod
  - Markdown
  - SDK Architecture
  - Content Graph
  - Generator Pipeline
slug: career-os
---

Career OS treats professional identity as an open engineering platform rather than a static portfolio website.

### System Architecture & Pipeline

- **Git Source of Truth (`content/raw/`)**: All canonical data lives as version-controlled Markdown and YAML files in the repository.

- **Zod Schema Engine (`@career-os/content-schema`)**: Strictly typed validation and type inference over raw frontmatter and content graphs.

- **Content Parser (`@career-os/content-parser`)**: Assembles raw Markdown into an in-memory immutable ContentGraph.

- **SDK Query Layer (`@career-os/sdk`)**: Provides typed, read-only data access for consumers.

- **Generator Pipeline (`output/`)**: Generates byte-identical, deterministic consumer artifacts including the Next.js Website, ATS Resumes, GitHub Profiles, and Recruiter Summaries.
