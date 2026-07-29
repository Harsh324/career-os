# Branch Protection Rules — `main`

This document specifies the exact GitHub branch protection settings to apply to the `main` branch.
These settings enforce the project's quality gate and prevent accidental direct pushes.

> **How to apply:** GitHub → Settings → Branches → Add branch protection rule → branch name: `main`

---

## Required Settings

### Pull Request Reviews
- [x] **Require a pull request before merging**
- [x] **Require approvals** — Minimum: `1`
- [x] **Dismiss stale pull request approvals when new commits are pushed**
- [ ] Require review from Code Owners (enable when `CODEOWNERS` file is added)

### Status Checks
- [x] **Require status checks to pass before merging**
- [x] **Require branches to be up to date before merging**

Required status checks (must be listed by exact CI job name):
- `ci / type-check`
- `ci / lint`
- `ci / build`

### Merge Settings (Repository-level, not branch-level)
> Apply under: GitHub → Settings → General → Pull Requests

- [x] **Allow squash merging** — Default commit message: `Pull request title and description`
- [ ] Allow merge commits (disabled — all merges must be squash)
- [ ] Allow rebase merging (disabled)

### Other
- [x] **Require conversation resolution before merging**
- [x] **Do not allow bypassing the above settings** (applies to admins too)
- [ ] Allow force pushes (never enabled)
- [ ] Allow deletions (never enabled for `main`)

---

## Branch Naming Convention

Branches must follow the pattern: `type/short-description`

| Type | Purpose | Example |
|------|---------|---------|
| `feat/` | New feature or capability | `feat/resume-generator` |
| `fix/` | Bug fix | `fix/date-normalization` |
| `chore/` | Build, tooling, or config | `chore/upgrade-typescript` |
| `docs/` | Documentation only | `docs/add-adr-004` |
| `refactor/` | Code refactor | `refactor/content-parser-errors` |

---

## Commit Message Convention

All commits on feature branches follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`  
**Scopes:** `content-schema`, `content-parser`, `shared-utils`, `website-generator`,
`resume-generator`, `github-generator`, `website`, `api`, `ci`, `docker`, `github`, `root`

---

## Merge Strategy

All PRs are merged via **Squash and Merge**. The squash commit message must follow Conventional Commits using the PR title.

This produces a clean, linear `main` history where each commit represents a complete, self-contained change.

---

*Apply these settings manually in GitHub Settings → Branches after the repository has been made non-empty.*
