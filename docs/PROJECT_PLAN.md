# AI Studio — Project Plan

## Project

AI Prompt Playground → AI Studio

## Final Goal

Build a production-style AI platform combining:

- LLMs
- RAG
- Vector database
- Tools
- Agents
- MCP
- Observability
- Evals

The project will be developed progressively rather than building the entire
final architecture upfront.

---

# Current Progress

## Completed

- Python
- FastAPI
- AI Module 1
- AI Module 2
- Sprint 1 — Project Setup
- Sprint 2 — Prompt Builder
- Sprint 3 — LLM Integration
- Sprint 4 — Prompt Experiments + Basic Evals
- Sprint 5 — Structured AI
- Sprint 6 — Prompt Library

## Current

Phase 6 — Sprint 6 complete

## Next

Sprint 7 — RAG + RAG Evals

---

# 12-Sprint Roadmap

## Sprint 1 — Project Setup

AI Module: Module 2

Focus:

- React
- Vite
- TypeScript
- FastAPI project setup
- Uvicorn
- Project structure
- GET / POST
- Pydantic request/response models
- CORS
- Environment variables
- API service layer
- Health endpoint
- Mock chat API
- React ↔ FastAPI communication

Project features:

- React UI
- FastAPI backend
- `/health`
- Mock `/chat`
- Basic API service layer

---

## Sprint 2 — Prompt Builder

AI Module: Module 2

Focus:

- Prompt structure
- System instructions
- User instructions
- Context
- Examples

The frontend will provide the initial prompt-building experience and the
backend will expose the required API contract.

---

## Sprint 3 — LLM Integration

Module 3 begins.

Status: Complete

Focus:

- Connect the application to an actual LLM
- Establish the model abstraction
- Replace mock AI responses with real model responses

Delivered:

- Backend-connected Chat page with multi-turn in-memory conversation state
- Streaming `POST /chat/stream` responses through the frontend service layer
- Loading, safe error, and disabled-send states
- Safe assistant Markdown rendering, including GFM tables and soft line breaks

---

## Sprint 4 — Prompt Experiments + Basic Evals

Status: Complete

Focus:

- Prompt experimentation
- Comparing outputs
- Initial evaluation concepts
- Expected output vs actual output

Delivered:

- Prompt experiments with zero-shot, one-shot, and few-shot modes
- Two-variant prompt/output comparison against shared user instructions
- In-memory evaluation datasets with multiple cases and criteria
- Evaluation results showing expected output, actual output, and backend pass/fail status

---

## Sprint 5 — Structured AI

Status: Complete

Focus:

- Structured outputs
- Reliable response formats
- Backend validation
- Application-level handling of structured AI responses

Delivered:

- FE-1: Chat output-format selection and formatted-output API integration
- FE-2: Format-aware, safe chat response rendering
- FE-3: Backend-controlled tool-calling demo UI
- FE-4: Image-generation prompt and image display UI
- FE-5: Text-to-speech prompt and browser audio playback UI
- FE-6: Consistent request loading, validation, empty, success, and error states
- FE-7: Final frontend implementation and regression-test review

---

## Sprint 6 — Prompt Library

Status: Complete

Focus:

- Saving prompts
- Organizing prompts
- Reusing prompts
- Prompt management

Delivered:

- Persistent prompt creation, editing, deletion, search, filtering, category
  discovery, and pagination
- Current favorite and reusable-template metadata controls
- Read-only content-version history

---

## Sprint 7 — RAG + RAG Evals

Focus:

- RAG
- Document ingestion
- Embeddings
- Vector database
- Retrieval
- RAG evaluation

---

## Sprint 8 — Search / Retrieval Evaluation

Focus:

- Retrieval quality
- Search evaluation
- Improving retrieved context
- Measuring retrieval behaviour

---

## Sprint 9 — Agents + MCP

Focus:

- Agents
- Tools
- MCP
- Tool execution

---

## Sprint 10 — Multi-Agent + Advanced Evals

Focus:

- Multi-agent workflows
- Advanced evaluation
- Trajectory evaluation

---

## Sprint 11 — Production + Full Evaluation System

Focus:

- Production architecture
- Full evaluation system
- Observability
- Reliability

---

## Sprint 12 — Portfolio + Regression Dashboard

Focus:

- Portfolio polish
- Regression testing
- Evaluation dashboard
- Documentation
- Final project quality

---

# Development Principle

Do not build future layers before they are required.

The project should evolve approximately as:

Python
↓
FastAPI
↓
React + FastAPI
↓
LLM
↓
Prompt system
↓
Evals
↓
RAG
↓
Agents
↓
MCP
↓
Production
↓
Observability + full Evals
