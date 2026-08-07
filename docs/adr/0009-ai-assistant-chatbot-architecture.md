# ADR-0009 — AI Assistant Chatbot Architecture ("Ask AI About Harsh")

**Date:** 2026-08-03  
**Status:** Proposed  
**Deciders:** Harsh Tripathi (Lead Engineer & Developer)

---

## Context

Visitors (recruiters, engineering managers, and developers) exploring the Career OS portfolio require fast, natural language answers about Harsh Tripathi's technical experience, AI/scraping work at SMS DataTech in Tokyo, AWS certifications, and system architecture background.

Integrating an interactive **"Ask AI About Harsh"** chatbot widget directly showcases Harsh's backend engineering expertise with LLMs, RAG, and API design while offering a modern interactive user experience.

## Decision Drivers

- **Dynamic Context Ingestion**: The AI must answer using live data from the PostgreSQL `ContentGraph` (Experiences, Skills, Certifications, Education, Projects) without hardcoded static text.
- **Strict Scope Boundaries**: The AI must respond professionally exclusively regarding Harsh Tripathi's career, technical skills, certifications, and portfolio projects.
- **Zero Raw Mutation**: AI responses must remain transient and consumer-facing, never mutating canonical database records (Principle 6 & 8).
- **GitHub Primer UI Aesthetics**: The frontend chat interface must adhere to GitHub Primer design tokens (`#0969da`, `#161b22`, `#30363d`).

## Considered Options

1. **Option A: Client-Side Only Mock / Static Prompting**
   - *Description:* Hardcoding prompt context inside Next.js frontend and calling external LLM directly from browser.
   - *Cons:* Exposes API keys on frontend, duplicates content definitions, violates Principle 2 & 4.

2. **Option B: Backend-Driven RAG Service (`apps/ai_assistant`) in Django (CHOSEN)**
   - *Description:* A new isolated Django app (`apps/ai_assistant`) exposing `POST /api/v1/chat/`. It queries the `ContentGraph` (Django ORM), assembles structured system context dynamically, and calls the LLM API securely with streaming responses.

## Decision Outcome

**Chosen option:** **Option B**, because it preserves single-responsibility (`apps/ai_assistant`), keeps API keys secure on the backend, dynamically queries canonical PostgreSQL data (Principles 1 & 2), and satisfies all architecture principles.

### Positive Consequences

- **Secure API Key Management**: LLM keys remain encrypted in server environment variables.
- **Single Source of Truth**: Chatbot context updates automatically whenever database records are modified or re-seeded.
- **Streamlined User Experience**: Fast streaming natural language answers with quick-click suggestion pills on frontend.

### Negative Consequences / Trade-offs

- **External API Dependency**: Requires configured API key (`GEMINI_API_KEY` or `OPENAI_API_KEY`) for live LLM responses. A structured fallback engine handles offline/dev mode gracefully.

## Architecture Principles Compliance

- **Principle 1 & 2**: Content originates strictly from PostgreSQL `ContentGraph`.
- **Principle 5**: `apps/ai_assistant` single responsibility for chat orchestration.
- **Principle 8**: AI output is generated for client consumption and never mutates canonical data.
- **Principle 9**: Documented via this ADR prior to implementation.

---

*This ADR follows the [Markdown Architectural Decision Records](https://adr.github.io/madr/) format.*
