# AI Studio Frontend — Codex Instructions

## Project

This repository contains the frontend for AI Studio.

AI Studio is being built progressively as a production-style AI engineering
platform.

The frontend is responsible for:

- User interface
- User interactions
- Prompt construction
- API communication
- Displaying backend results
- Loading and error states

The frontend must NOT contain backend business logic, LLM orchestration,
RAG logic, agent logic, MCP implementation, evaluation logic, or secrets.

## Technology

- React
- Vite
- TypeScript

## Architecture

The frontend communicates with the separate AI Studio Backend repository.

Frontend:
React + TypeScript
↓
API service layer
↓
FastAPI Backend

The backend owns:

- API/business logic
- LLM integration
- RAG
- Vector database
- Agents
- Tools
- MCP
- Evals
- Observability

## Project Structure

src/
├── components/
├── pages/
├── services/
├── types/
├── App.tsx
└── main.tsx

Additional directories should only be introduced when they are required
by an implemented feature.

Do not create future architecture folders prematurely.

## Development Rules

1. Use TypeScript.
2. Prefer simple, readable React components.
3. Keep API calls inside the service layer.
4. Do not put API calls directly throughout UI components.
5. Keep reusable UI components inside `components/`.
6. Keep page-level composition inside `pages/`.
7. Keep shared TypeScript types inside `types/`.
8. Use environment variables for backend URLs and configuration.
9. Never hardcode secrets.
10. Do not introduce unnecessary libraries.
11. Do not refactor unrelated code while implementing a feature.
12. Preserve the existing architecture unless there is a documented reason
    to change it.

## Current Project Phase

Current work:

Phase 6 — Sprint 6: Prompt Library (Complete)

Completed learning:

- Python
- FastAPI
- AI Module 1
- AI Module 2

Sprint 4 delivered:

- Prompt experiments and two-variant prompt/output comparison
- In-memory evaluation datasets with multiple cases and criteria
- Backend-owned expected/actual output and pass/fail evaluation results

Sprint 5 delivered:

- Format-aware chat output for JSON, Markdown, Table, Email, and HTML
- Backend-controlled tool-calling demo
- Image generation and browser image display
- Text-to-speech generation and browser audio playback
- Loading, validation, error, and empty states across Sprint 5 workflows

Sprint 6 delivered:

- Persistent prompt library with search, filters, pagination, and categories
- Prompt creation, editing, deletion, favorites, and reusable-template metadata
- Read-only history of content versions

Next:

Sprint 7 — RAG + RAG Evals

## Codex Behaviour

Before making architectural changes:

1. Read this file.
2. Read relevant files under `docs/`.
3. Inspect the existing implementation.
4. Make the smallest appropriate change.
5. Do not invent architecture that has not been planned.
6. Explain important architectural changes before implementing them.

When implementing a feature, prefer incremental changes over large rewrites.
