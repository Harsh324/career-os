# Contributing to Career OS

> Thank you for your interest in contributing to Career OS. This document is the definitive guide for contributors at all levels — whether you're fixing a typo in the docs, adding a new output generator, or proposing a change to the content schema.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Branching and Workflow](#branching-and-workflow)
- [Commit Message Standards](#commit-message-standards)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation Standards](#documentation-standards)
- [Content Schema Changes](#content-schema-changes)
- [ADR Process](#adr-process)
- [Release Process](#release-process)
- [Getting Help](#getting-help)

---

## Code of Conduct

Career OS is committed to providing a welcoming, inclusive environment for all contributors. All participants are expected to uphold the following standards:

- **Be respectful.** Critique ideas, not people. Assume good faith.
- **Be constructive.** Disagreements are welcome; hostility is not.
- **Be inclusive.** Welcome contributors of all experience levels and backgrounds.
- **Be patient.** Maintainers are humans with limited time. Responses may not be immediate.

Unacceptable behavior — including harassment, discrimination, or personal attacks — will result in a permanent ban from the project. To report an issue, email the project maintainer directly.

---

## Ways to Contribute

There are many ways to contribute to Career OS, regardless of your skill level:

| Type | Description |
|------|-------------|
| 🐛 **Bug Reports** | Open a GitHub Issue describing the bug, reproduction steps, and expected behavior |
| 📝 **Documentation** | Improve existing docs, fix typos, or write missing documentation |
| 💡 **Feature Proposals** | Open a GitHub Issue with the `RFC` label before writing any code |
| 🔧 **Bug Fixes** | Pick up an open issue labeled `good first issue` or `bug` |
| ✨ **New Features** | Implement an approved RFC or a roadmap item |
| 🧪 **Tests** | Write missing tests or improve test coverage in any package |
| 🎨 **Content Schema** | Propose additions or improvements to the content schema (requires ADR) |
| 🔌 **New Generators** | Build a new output generator as a package (blog exporter, Notion sync, etc.) |

---

## Development Setup

### Prerequisites

| Tool | Minimum Version | Installation |
|------|----------------|-------------|
| Node.js | 20.x LTS | [nodejs.org](https://nodejs.org) |
| npm | 10.x | Bundled with Node.js |
| Git | 2.x | [git-scm.com](https://git-scm.com) |

### Local Setup

```bash
# 1. Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/career-os.git
cd career-os

# 2. Add the upstream remote
git remote add upstream https://github.com/Harsh324/career-os.git

# 3. Install all workspace dependencies
npm install

# 4. Copy the environment configuration
cp .env.example .env
# Edit .env if you need LLM API keys for AI synthesis features
```

### Verifying Your Setup

```bash
# Validate that all example content parses correctly
npm run content:validate

# Run all test suites across all packages
npm test

# Run the linter
npm run lint
```

If all three commands complete without errors, your environment is correctly set up.

---

## Project Structure

Familiarize yourself with the repository layout before contributing:

```
career-os/
├── content/               # Live career data — the single source of truth
├── apps/
│   └── website/           # Portfolio website (Next.js)
├── packages/
│   ├── content-parser/    # Core: Markdown + YAML parsing and validation
│   ├── resume-generator/  # Resume artifact generation
│   ├── ai-engine/         # LLM integration and prompt orchestration
│   └── publisher/         # Publishing to GitHub and other surfaces
├── ai/
│   ├── agents/            # AI agent definitions and orchestration configs
│   └── prompts/           # Versioned LLM prompt templates
├── assets/                # Committed static assets (images, logos, brand)
├── output/                # Generated artifacts — gitignored, never committed
│   ├── resume/            # Generated PDF and LaTeX resume files
│   ├── github-profile/    # Generated GitHub profile README
│   ├── recruiter-package/ # Bundled recruiter ZIP files
│   └── ai-drafts/         # AI-generated content staged for human review
├── scripts/
│   ├── generate/          # Output generation scripts
│   ├── publish/           # Publishing scripts
│   └── validate/          # Content validation and linting
├── tests/                 # Cross-package integration tests
├── docs/
│   ├── adr/               # Architecture Decision Records
│   ├── architecture/      # Diagrams and design documents
│   ├── migrations/        # Breaking change migration guides
│   ├── requirements/      # Feature and non-functional requirements
│   └── schemas/           # JSON Schema files for all content types
└── career-os.config.ts    # Platform configuration (outputs, providers, deployment)
```

Each package under `packages/` is an independent npm workspace with its own `package.json`, `src/`, and `tests/` directory. Changes to one package should not break another unless there is an intentional API change.

---

## Branching and Workflow

Career OS uses a **trunk-based development** model with short-lived feature branches.

### Branch Naming

| Pattern | Purpose |
|---------|---------|
| `main` | Production-ready code. Never commit directly. |
| `feat/<short-description>` | New features (e.g., `feat/resume-latex-template`) |
| `fix/<short-description>` | Bug fixes (e.g., `fix/date-parsing-edge-case`) |
| `docs/<short-description>` | Documentation changes (e.g., `docs/update-contributing`) |
| `chore/<short-description>` | Maintenance tasks (e.g., `chore/upgrade-typescript`) |
| `test/<short-description>` | Adding or improving tests |
| `refactor/<short-description>` | Code refactoring without behavior change |

### Workflow

```bash
# 1. Sync your fork with upstream before starting work
git fetch upstream
git checkout main
git merge upstream/main

# 2. Create a feature branch
git checkout -b feat/my-contribution

# 3. Make your changes
# ... edit files ...

# 4. Run tests and linting
npm test && npm run lint

# 5. Commit with a conventional commit message (see below)
git commit -m "feat(resume-generator): add two-column layout template"

# 6. Push your branch to your fork
git push origin feat/my-contribution

# 7. Open a Pull Request on GitHub
```

---

## Commit Message Standards

Career OS uses [Conventional Commits](https://www.conventionalcommits.org/). All commit messages must follow this format:

```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

### Types

| Type | When to Use |
|------|------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Formatting, missing semicolons — no logic change |
| `refactor` | Code restructuring without behavior change |
| `test` | Adding or updating tests |
| `chore` | Build process, dependency updates, tooling |
| `perf` | Performance improvements |
| `ci` | Changes to CI/CD configuration |
| `revert` | Reverts a previous commit |

### Scopes

Use the package or area of the codebase affected:

- `content-parser`, `resume-generator`, `ai-engine`, `publisher`
- `website`, `scripts`, `docs`, `schema`, `prompts`, `agents`

### Examples

```
feat(resume-generator): add JSON Resume output format
fix(content-parser): handle missing end_date in experience entries
docs(architecture): add LLM provider abstraction diagram
chore(deps): upgrade typescript to 5.4
test(content-parser): add edge cases for date normalization
```

### Breaking Changes

Breaking changes must be indicated in the commit footer:

```
feat(schema)!: add required 'featured' field to experience entries

BREAKING CHANGE: All existing experience entries must add a 'featured' field.
Migration guide: docs/migrations/v0.1-to-v0.2.md
```

---

## Pull Request Process

### Before Submitting

- [ ] Your branch is based on the latest `main`.
- [ ] `npm test` passes with no failures.
- [ ] `npm run lint` passes with no errors.
- [ ] `npm run content:validate` passes.
- [ ] You have written or updated tests for your changes.
- [ ] You have updated relevant documentation.
- [ ] Your commit messages follow the Conventional Commits standard.

### PR Title

PR titles must follow the same format as commit messages:

```
feat(resume-generator): add two-column layout template
```

### PR Description

Use the PR template provided in `.github/PULL_REQUEST_TEMPLATE.md`. At minimum, include:

- **What this PR does** — A clear description of the change.
- **Why this change is needed** — Context and motivation.
- **How to test** — Steps a reviewer can follow to verify the change works.
- **Breaking changes** — Any changes that break backwards compatibility.

### Review Process

1. All PRs require at least **one approving review** from a maintainer before merging.
2. Maintainers aim to review PRs within **5 business days** of submission.
3. If a PR has no activity for **30 days**, it will be marked `stale` and may be closed.
4. Maintainers may request changes. Address all comments before re-requesting review.
5. PRs are merged using **Squash and Merge** to maintain a clean `main` history.

---

## Coding Standards

### TypeScript

- **Strict mode is required.** All packages have `"strict": true` in their `tsconfig.json`. Do not add `@ts-ignore` without a documented justification.
- **No `any`.** Use `unknown` for truly unknown types and narrow with type guards.
- **Explicit return types.** All exported functions must have explicit return type annotations.
- **Interfaces over types for object shapes.** Use `type` for unions, intersections, and utility types.
- **No barrel re-exports.** Import from the specific file, not from an `index.ts` that re-exports everything.

### Formatting and Linting

The project uses ESLint and Prettier with configuration files at the repository root. No formatting debates — the formatter is the authority.

```bash
# Auto-format all files
npm run format

# Check linting without fixing
npm run lint

# Fix auto-fixable lint errors
npm run lint:fix
```

Do not commit code with outstanding lint errors. CI will fail and the PR will not be mergeable.

### Error Handling

- **Never swallow errors silently.** Catch errors only when you can handle them meaningfully.
- **User-facing errors must be actionable.** Error messages should tell the user what went wrong and what to do about it.
- **Use typed errors.** Create custom error classes for domain-specific error conditions (e.g., `ContentValidationError`, `SchemaParseError`).

---

## Testing

### Testing Philosophy

Every package must have tests. Career OS uses **Vitest** as the test runner across all packages.

### Test Categories

| Category | Location | Purpose |
|----------|----------|---------|
| **Unit tests** | `packages/<name>/tests/unit/` | Test individual functions in isolation |
| **Integration tests** | `packages/<name>/tests/integration/` | Test package behavior end-to-end with real content |
| **Cross-package tests** | `tests/` | Test interactions between packages |

### Running Tests

```bash
# Run all tests across all workspaces
npm test

# Run tests for a specific package
npm test --workspace packages/content-parser

# Run tests in watch mode during development
npm run test:watch

# Generate a coverage report
npm run test:coverage
```

### Coverage Requirements

- All new code must achieve ≥ 80% test coverage.
- Coverage is checked in CI and enforced as a merge requirement.
- Coverage reports are generated to `coverage/` and uploaded to the CI summary.

### Writing Good Tests

- Test behavior, not implementation. Tests should not break when internal implementation details change.
- Use descriptive test names: `it('returns an error when end_date is before start_date')`, not `it('works correctly')`.
- Use the `content/` example files as fixtures in integration tests — they serve as the canonical test corpus.

---

## Documentation Standards

All documentation is written in Markdown. Follow these guidelines:

- **Use title case for headings.** `## Getting Started` not `## getting started`. This applies to all `##` and deeper headings.
- **One sentence per line for prose.** This makes Git diffs readable.
- **Use reference-style links** for URLs that appear more than once.
- **Code blocks must have a language identifier.** ` ```typescript `, not ` ``` `.
- **Tables for comparisons.** Use tables when comparing three or more items across two or more dimensions.
- **ADRs for architectural decisions.** If your change involves a significant design decision, write an ADR (see below).

### Updating Documentation with Code

If your code change affects:

- A public API → update the relevant package `README.md`.
- The content schema → update `ARCHITECTURE.md` and the relevant schema file.
- The overall workflow → update `README.md` and/or `ARCHITECTURE.md`.
- A CLI command → update the `scripts/` documentation and the top-level `README.md`.

Documentation updates must be included in the same PR as the code change. PRs that change behavior without updating documentation will not be merged.

---

## Content Schema Changes

The content schema (YAML front matter format for `content/` files) is a **public, versioned API**. Changes to it affect every user's content.

### Rules for Schema Changes

1. **Additive changes only** until v1.0. You may add new optional fields; you may not remove or rename existing fields.
2. **All new fields must be optional** with a clearly documented default value.
3. **Breaking changes** (after v1.0) require a major version bump and a migration guide in `docs/migrations/`.
4. **Every schema change requires an ADR** (see below).
5. **Example content must be updated** to reflect any new fields.

### Schema Change Process

1. Open a GitHub Issue with the `schema-change` label describing the proposed field.
2. Allow a 14-day community comment period.
3. Write an ADR documenting the decision.
4. Implement the change: update the JSON Schema file in `docs/schemas/`, the TypeScript types in `packages/content-parser/src/types/`, the content parser, and the example content.
5. Update `ARCHITECTURE.md` with any schema table changes.
6. If the change is a breaking change post-v1.0, write a migration guide in `docs/migrations/`.

### AI-Generated Content Workflow

If you are contributing to the `packages/ai-engine` package, be aware of the staging workflow. AI-generated content is **never** written directly to `content/`. Instead:

1. AI output is staged in `output/ai-drafts/` (gitignored — not committed).
2. The developer runs `npm run ai:review` to open a diff view between the draft and any existing content.
3. Approved content is manually promoted to the appropriate `content/` path and committed.

This policy is non-negotiable. PRs that allow AI content to bypass the review step will not be merged.

---

## ADR Process

Significant architectural decisions are documented as Architecture Decision Records (ADRs) in `docs/adr/`. An ADR is required for:

- Any content schema change (required or optional fields)
- Any change to the `ContentGraph` public interface
- Any change to the build toolchain or package manager
- Any new package added to `packages/`
- Any generator added to the system

### Creating an ADR

```bash
# Copy the template
cp docs/adr/template.md docs/adr/XXXX-your-decision-title.md

# Edit the ADR
# Fill in: title, status, context, decision, consequences
```

ADR files are named with a zero-padded four-digit number and a kebab-case title: `0004-adopt-turbo-for-build-pipeline.md`.

ADR status values:
- `Proposed` — Under discussion, not yet implemented.
- `Accepted` — Decision made and implementation is in progress or complete.
- `Deprecated` — Was accepted but is no longer relevant.
- `Superseded by ADR-XXXX` — Replaced by a newer decision.

---

## Release Process

> This section is for maintainers only.

Career OS follows [Semantic Versioning](https://semver.org/):

- **Patch** (`0.1.x`) — Bug fixes and documentation corrections.
- **Minor** (`0.x.0`) — New features, backwards-compatible changes.
- **Major** (`x.0.0`) — Breaking changes to the content schema or public package API.

### Release Steps

1. Ensure `main` is in a stable, fully-tested state.
2. Update `CHANGELOG.md` with all changes since the last release.
3. Bump the version in the root `package.json` and all affected workspace `package.json` files.
4. Commit with message: `chore(release): v0.2.0`.
5. Create an annotated Git tag: `git tag -a v0.2.0 -m "Release v0.2.0"`.
6. Push the tag: `git push upstream v0.2.0`.
7. The `release.yml` GitHub Actions workflow will automatically create a GitHub Release.

---

## Getting Help

| Channel | Use For |
|---------|--------|
| [GitHub Issues](https://github.com/Harsh324/career-os/issues) | Bug reports and feature requests |
| [GitHub Discussions](https://github.com/Harsh324/career-os/discussions) | Questions, ideas, and general discussion |

When asking for help, please:
- Include your OS, Node.js version, and npm version.
- Provide the exact command you ran and the full error output.
- Include a minimal reproduction if reporting a bug.

---

*Thank you for contributing to Career OS. Every contribution, no matter how small, moves the project forward.*

*Last updated: July 2026*
