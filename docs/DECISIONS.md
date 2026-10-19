# AI Studio — Architecture Decisions

## ADR-001 — Separate Frontend and Backend Repositories

Decision:

Use two repositories.

- ai-studio-frontend
- ai-studio-backend

Reason:

- Clear separation of responsibilities
- Independent deployment
- Easier development
- More realistic production architecture
- Better portfolio demonstration

---

## ADR-002 — Frontend Technology

Decision:

React + Vite + TypeScript

Reason:

This is the selected frontend stack for the project.

---

## ADR-003 — Backend Technology

Decision:

FastAPI + Python

Reason:

FastAPI has already been studied and provides the backend foundation for
the AI engineering project.

---

## ADR-004 — Database

Decision:

Supabase PostgreSQL

Reason:

Use PostgreSQL as the primary relational database while keeping the
initial infrastructure simple.

---

## ADR-005 — Hosting

Frontend:

Vercel

Backend:

Render

Database:

Supabase

Reason:

Simple deployment architecture suitable for learning, development and
portfolio use.

---

## ADR-006 — Progressive Architecture

Decision:

Do not create the complete final AI architecture at the beginning.

New layers will be introduced when their corresponding project phase
requires them.

Examples:

- LLM layer during Module 3
- RAG during Module 4
- Agents during the agent phase
- MCP when required
- Full Evals and observability later

Reason:

The project should reinforce learning instead of hiding the architecture
behind premature abstraction.

---

## ADR-007 — Streaming Chat Through the Service Layer

Decision:

Use the browser Fetch API and `ReadableStream` in the frontend service layer
for `POST /chat/stream` responses.

Reason:

- Keeps backend communication out of UI components
- Renders assistant output progressively
- Avoids introducing SSE or WebSocket infrastructure for the current scope

---

## ADR-008 — In-Memory Conversation State

Decision:

Keep Chat conversation state in `ChatConversationPanel` memory and send only
completed turns as future request history.

Reason:

- Supports multi-turn chat without persistence infrastructure
- Prevents partial or failed assistant output from being sent back to the backend
- Matches the current Sprint 3 scope

---

## ADR-009 — Backend-Owned Evaluation Results

Decision:

Keep evaluation datasets in frontend page memory and send them through the
service layer to `POST /evaluations/run`. Display the backend-returned expected
output, actual output, criteria, and pass/fail result without calculating the
result in the frontend.

Reason:

- Keeps evaluation logic and result criteria owned by the backend
- Supports multiple editable cases without persistence infrastructure
- Establishes the Sprint 4 evaluation workflow without creating a full eval system

---

## ADR-010 — Format-Aware, Safe Response Rendering

Decision:

Use a single `FormattedChatOutput` component for Sprint 5 formatted responses.
Render Markdown and Tables with the existing safe Markdown stack, pretty-print
JSON, preserve Email text layout, and display HTML as escaped source.

Reason:

- Reuses the existing Markdown renderer and GFM support
- Makes each backend response format readable without duplicating model logic
- Prevents untrusted model-generated HTML from being injected into the DOM

---

## ADR-011 — Backend-Owned Tool and Media Generation

Decision:

Expose Tool Calling, Image Generation, and Audio Generation as frontend demos
that call backend endpoints through `src/services/api.ts`. The frontend sends
user input and renders only backend-returned results.

Reason:

- Keeps tool choice, execution, provider configuration, and generation logic
  in the backend
- Preserves the repository boundary between UI/API consumption and AI logic
- Lets the frontend display provider-neutral Base64 media using returned MIME
  types and native browser media elements

---

## ADR-012 — Local Feature Tabs with Retained Panel State

Decision:

Keep the Sprint 5 workflows under `/chat` as local tabs. Split each workflow
into a focused feature panel and keep inactive panels mounted with `hidden`.

Reason:

- Keeps the existing route structure small
- Makes each workflow easier to use without adding a design-system dependency
- Retains form values, generated media, and completed responses when users
  switch between tabs

---

## ADR-013 — Prompt Library Server State Through React Query

Decision:

Use React Query for Prompt Library server state, with feature-scoped query keys
and hooks around `src/services/promptLibrary.ts`.

Reason:

- Keeps HTTP communication in the service layer while keeping page components
  focused on UI composition
- Separates cached backend data from local filter, pagination, and modal state
- Lets mutations invalidate the relevant lists, records, and content histories
  without duplicating synchronization logic in components

---

## ADR-014 — Content-Only Prompt Version History

Decision:

Treat `PromptVersion` as an immutable historical snapshot of prompt `content`.
Creating a prompt creates Version 1. Create another version only when the
content changes.

Title, description, category, favorite status, and template status remain
current Prompt fields and do not create or alter historical versions.

Reason:

- Makes version history a precise record of reusable prompt text
- Avoids noisy versions for organizational or presentation-only changes
- Keeps favorite and template as current metadata rather than incorrectly
  presenting them as historical content state
