# ADR-0001 — Use Turborepo as the Monorepo Build Orchestrator

**Date:** 2026-07-28  
**Status:** Accepted  
**Deciders:** BDFL (Harsh)

---

## Context

Career OS is a platform with multiple packages and applications that have build-time dependencies
on each other. The content pipeline flows: `content-schema` → `content-parser` → generators →
`apps/website`. Running `tsc` or `eslint` across all packages independently is error-prone and
slow; rebuilding packages that haven't changed wastes time.

A monorepo build orchestrator is needed to:
- Understand the dependency graph between packages
- Cache task outputs and skip unchanged packages
- Run tasks in topological order (e.g., build `content-schema` before `content-parser`)
- Run independent tasks in parallel

## Decision Drivers

- All dev tooling runs inside Docker — the orchestrator must work well in containerized environments
- The team is one person (BDFL model) — low configuration overhead is preferred
- Future remote caching support is desirable for CI speed
- The orchestrator must integrate cleanly with pnpm workspaces

## Considered Options

1. **Turborepo** — task runner by Vercel, tight pnpm integration, JSON config
2. **Nx** — full monorepo platform by Nrwl, plugin ecosystem, code generation
3. **Lerna** — original JS monorepo tool, now maintained by Nrwl
4. **Plain pnpm scripts** — `pnpm -r run build` with `--filter` flags

## Decision Outcome

**Chosen option:** Turborepo (option 1).

### Positive Consequences

- `turbo.json` pipeline is declarative and easy to understand at a glance
- Local task caching (`~/.turbo`) eliminates redundant rebuilds in development
- Remote caching (Vercel or self-hosted) can be enabled later without structural changes
- First-class pnpm workspace support — no additional config needed
- Terminal UI (`"ui": "tui"`) makes concurrent task output readable
- Minimal config — one `turbo.json` file governs the entire pipeline

### Negative Consequences / Trade-offs

- Turborepo is a Vercel product — vendor alignment, though not vendor lock-in (the JSON
  pipeline can be migrated to Nx if needed)
- Remote cache requires a Vercel account or self-hosted Turborepo server; not yet configured
- Less powerful than Nx for large teams with code-generation workflows

## Pros and Cons of Options

### Option 2 — Nx

**Pros:** Richer plugin ecosystem, code generation, graph visualisation.  
**Cons:** Higher config overhead; code generation features are premature at this stage;
`nx.json` + `project.json` per-package is more verbose than `turbo.json`.

### Option 3 — Lerna

**Pros:** Mature, widely understood.  
**Cons:** Primarily a versioning/publishing tool; task orchestration is secondary; now requires
Nx for caching, adding complexity.

### Option 4 — Plain pnpm scripts

**Pros:** Zero dependencies; no orchestrator needed.  
**Cons:** No caching; no topological ordering; parallel execution is manual; slowest option.

## Links

- [Turborepo documentation](https://turbo.build/repo/docs)
- [turbo.json configuration](../../turbo.json)
- [ADR-0002 — Docker-First Development](./0002-docker-first-development.md)
