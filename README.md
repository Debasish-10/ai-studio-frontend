# AI Studio Frontend

React, Vite, and TypeScript frontend for AI Studio. It communicates only with
the separate FastAPI backend through the service layer in `src/services/`.

## Current capabilities

The `/chat` page uses local tabs for these completed workflows:

- Streaming chat, with optional formatted output
- Backend-controlled tool-calling demo
- Image generation
- Text-to-speech audio generation

Formatted output supports JSON, Markdown, Table, Email, and HTML. JSON is
pretty-printed; Markdown and Table use the safe Markdown renderer; Email
preserves its layout; and HTML is shown as escaped source rather than injected
into the page. Image and audio responses use backend-returned Base64 bytes and
MIME types to create native browser media sources.

The frontend does not choose or execute tools, generate media itself, or own
LLM/provider logic. Those responsibilities remain in the backend.

The `/prompt-library` page provides persistent prompt creation, editing,
deletion, search, filtering, pagination, category discovery, favorite and
reusable-template controls, and read-only content-version history.

## Backend configuration

Set `VITE_API_BASE_URL` to the backend origin when it differs from the local
default of `http://localhost:8000`. Do not put provider credentials or other
secrets in this repository.

The frontend uses these backend endpoints for its current workflows:

| Endpoint | Frontend use |
| --- | --- |
| `POST /chat/stream` | Default streaming chat |
| `POST /chat/formatted` | JSON, Markdown, Table, Email, or HTML chat output |
| `POST /chat/tools` | Backend-owned tool orchestration demo |
| `POST /images/generate` | Base64 image response with MIME type |
| `POST /audio/generate` | Base64 audio response with MIME type |
| `GET` / `POST /prompts` | Prompt Library list and creation |
| `PATCH` / `DELETE /prompts/{promptId}` | Prompt editing and deletion |
| `PUT` / `DELETE /prompts/{promptId}/favorite` | Current favorite metadata |
| `PUT` / `DELETE /prompts/{promptId}/template` | Current template metadata |
| `GET /prompts/{promptId}/versions` | Content-version history |
| `GET /prompts/categories` | Prompt Library category filter |

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm test
npm run lint
npm run build
```

Focused Vitest coverage verifies API payloads, rendered output formats,
Base64/MIME media rendering, error handling, and normal chat streaming.
