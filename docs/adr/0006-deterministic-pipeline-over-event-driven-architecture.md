# ADR-0006 — Deterministic Pipeline Over Event-Driven Architecture

* **Status:** Accepted
* **Impacted Areas:** Platform Architecture, Build Orchestration, CI/CD
* **Date:** July 2026

---

## Context and Problem Statement

As Career OS grows to support multiple outputs (Resume, Website, GitHub, AI Drafts), an architectural question arises: Should the build pipeline adopt an event-driven architecture (e.g. `ContentParsedEvent` → `ResumeUpdateListener` → `WebsiteUpdateListener`)?

---

## Decision Drivers

* **P7 — Reproducible Artifacts:** Given identical input, the pipeline must produce byte-identical output. Non-determinism in generation order is a defect.
* **Clarity & Simplicity:** Avoid speculative engineering and unneeded runtime state.
* **Build Speed:** Turborepo DAG already provides optimal parallel build orchestration.

---

## Considered Options

1. **Option 1: Runtime Event Bus (EventEmitter / Message Broker / RxJS).**  
   *Bad:* Introduces async order non-determinism, memory leaks, unhandled rejection risks, and complex debugging for a static asset generator.
2. **Option 2: Topologically Sorted Linear DAG Pipeline via Turborepo.**  
   *Good:* Pure functional transformation (`ContentGraph` → `OutputArtifacts`). Execution order is 100% deterministic, cached, and parallelized by Turborepo.

---

## Decision Outcome

**Option 2 chosen.** Career OS uses a **deterministic functional transformation pipeline** rather than a runtime event bus.

```
content/raw/ ──► content-parser ──► ContentGraph ──► Generators (Parallel) ──► output/
```

### Event-Driven Scope (Post-v1.0 Future Consideration):
Event-driven patterns are reserved exclusively for potential post-v1.0 live webhooks (e.g. GitHub Webhook triggering CI on `git push`). The internal transformation engine remains strictly deterministic.

---

## Consequences

* **Positive:** Byte-identical build output guaranteed (P7).
* **Positive:** Zero runtime event bus dependencies or memory overhead.
* **Positive:** Easy unit and integration testing without mocking event emitters.
