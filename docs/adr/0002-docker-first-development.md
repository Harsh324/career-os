# ADR-0002 — Docker-First Development Environment

**Date:** 2026-07-28  
**Status:** Accepted  
**Deciders:** BDFL (Harsh)

---

## Context

Career OS requires a consistent, reproducible development environment across:
- The developer's local machine (Ubuntu 24.04)
- GitHub Actions CI
- Any future contributors

The target machine has no Node.js, pnpm, or build tools installed locally, and
installing them locally introduces version drift risk and "works on my machine" bugs.

A decision is needed about how to manage the development environment.

## Decision Drivers

- **Reproducibility (P7):** Given the same inputs, every developer and CI must produce
  identical outputs. Environment drift is the most common cause of non-reproducibility.
- **Zero local dependencies:** The host machine should require only Docker and Git.
  Nothing else should be installed or assumed.
- **CI parity:** The local dev environment and the CI environment must be identical.
  Divergence between them is a source of hidden bugs.
- **Low onboarding friction:** A new contributor should be able to run the project
  with a single command.

## Considered Options

1. **Docker-first** — all tooling runs inside a Docker container; host needs only Docker + Git
2. **Nix** — declarative, reproducible dev environments via `nix-shell` or `flake.nix`
3. **asdf / nvm** — version managers that install Node.js locally
4. **GitHub Codespaces** — cloud-hosted dev environment

## Decision Outcome

**Chosen option:** Docker-first (option 1).

### Positive Consequences

- Zero host dependencies beyond Docker 24+ and Git
- `Dockerfile.dev` is the single source of truth for the environment (P1, P2)
- CI uses the same `node:20-alpine` base image → guaranteed parity
- `Makefile` abstracts all `docker compose` commands behind short targets
- VS Code Dev Containers (`.devcontainer/devcontainer.json`) provides IDE integration
- pnpm store and Turborepo cache are named Docker volumes → fast container restarts
- Named volume `career-os-pnpm-store` is reused across all `docker compose run` invocations

### Negative Consequences / Trade-offs

- `docker compose run --rm dev <cmd>` is slower than running commands natively
  (container startup overhead ~1–2s per command)
- Files created inside the container are owned by `root` on the host; requires periodic
  `chown` to restore user ownership (documented: run `make fix-permissions` if needed)
- Debugging network issues inside the container adds a layer of indirection

## Pros and Cons of Options

### Option 2 — Nix

**Pros:** Fully reproducible, declarative, no Docker overhead.  
**Cons:** Steep learning curve; `flake.nix` is complex to maintain; limited macOS + Windows
support without workarounds; unfamiliar to most contributors.

### Option 3 — asdf / nvm

**Pros:** Familiar, lightweight, no Docker.  
**Cons:** Still installs tools locally; version drift possible if `.nvmrc` is not checked;
no CI parity guarantee; each contributor still manages their own environment.

### Option 4 — GitHub Codespaces

**Pros:** Zero local setup, pre-built environments, VS Code integration.  
**Cons:** Vendor dependency (GitHub/Microsoft); cost for extended use; offline development
is not possible; contributors must have GitHub accounts and Codespaces access.

## Implementation

- `Dockerfile.dev` — `node:20-alpine` + pnpm 9.15.0 (via corepack) + turbo global
- `docker-compose.yml` — `dev` service with named volumes
- `Makefile` — developer shortcuts (`make dev`, `make shell`, `make build`, etc.)
- `.devcontainer/devcontainer.json` — VS Code Dev Containers integration
- `.dockerignore` — excludes build artifacts from the image build context

## Links

- [Dockerfile.dev](../../Dockerfile.dev)
- [docker-compose.yml](../../docker-compose.yml)
- [Makefile](../../Makefile)
- [ADR-0001 — Turborepo](./0001-turborepo-monorepo.md)
- [ADR-0003 — Git as Single Source of Truth](./0003-git-as-single-source-of-truth.md)
