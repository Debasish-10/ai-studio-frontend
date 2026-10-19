# AI Studio — Architecture

## Repository Structure

AI Studio uses two separate repositories:

- ai-studio-frontend
- ai-studio-backend

---

# Frontend — Sprint 6

Technology:

- React
- Vite
- TypeScript
- React Router

Current structure:

src/
├── components/
│   ├── AppLayout.tsx
│   ├── AudioGenerationPanel.tsx
│   ├── BackendStatus.tsx
│   ├── ChatConversationPanel.tsx
│   ├── DeletePromptModal.tsx
│   ├── EvaluationCaseEditor.tsx
│   ├── EvaluationResults.tsx
│   ├── FormattedChatOutput.tsx
│   ├── GeneratedAudio.tsx
│   ├── GeneratedImage.tsx
│   ├── ImageGenerationPanel.tsx
│   ├── PromptComparisonResults.tsx
│   ├── PromptConfigurationForm.tsx
│   ├── PromptEditorModal.tsx
│   ├── PromptLibraryFilters.tsx
│   ├── PromptList.tsx
│   ├── PromptPagination.tsx
│   ├── PromptVersionHistoryModal.tsx
│   └── ToolCallingPanel.tsx
├── hooks/
│   ├── useCreatePrompt.ts
│   ├── useDeletePrompt.ts
│   ├── usePromptCategories.ts
│   ├── usePromptList.ts
│   ├── usePromptVersions.ts
│   ├── useSetPromptFavorite.ts
│   ├── useSetPromptTemplate.ts
│   └── useUpdatePrompt.ts
├── pages/
│   ├── ChatPage.tsx
│   ├── EvaluationPage.tsx
│   ├── PromptBuilderPage.tsx
│   └── PromptLibraryPage.tsx
├── queries/
│   └── promptLibrary/queryKeys.ts
├── services/
│   ├── api.ts
│   ├── evaluation.ts
│   ├── prompt.ts
│   └── promptLibrary.ts
├── types/
│   ├── api.ts
│   ├── evaluation.ts
│   ├── prompt.ts
│   └── promptLibrary.ts
├── App.tsx
├── queryClient.ts
└── main.tsx

Responsibilities:

- Application shell, navigation, and routes
- Chat UI with in-memory multi-turn conversation state
- Streaming assistant responses
- Formatted chat responses for JSON, Markdown, Table, Email, and HTML
- Safe Markdown rendering for assistant messages
- Backend-controlled tool calling, image generation, and audio/TTS UI
- Prompt experiments and two-variant prompt/output comparison
- Evaluation dataset creation and evaluation result display
- Prompt library management, including version-history viewing
- Backend connection status
- Backend API communication through the service layer

## Application Shell and Routes

`App.tsx` configures the shared `AppLayout` and these routes:

- `/chat` — Chat page
- `/prompt-builder` — Prompt Builder page
- `/prompt-library` — Prompt Library page
- `/evaluations` — Evaluation dataset and results page

The layout provides the sidebar navigation and compact backend status header.
The Chat page groups Chat, Tool Calling, Image Generation, and Audio
Generation in local tabs. Each feature panel owns its request state and remains
mounted while hidden, so switching tabs retains its current result.

## Chat Flow

Normal chat remains the default:

ChatPage
↓
`streamChatMessage()` service
↓
`POST /chat/stream`
↓
ReadableStream response chunks
↓
In-memory conversation state
↓
Assistant Markdown UI

The Chat page sends the new user message separately and sends completed prior
messages as `history`. User and assistant messages use the shared
`ConversationMessage` contract (`role`, `content`). Failed or partial assistant
responses remain out of future history.

Assistant content is rendered with `react-markdown`, `remark-gfm`, and
`remark-breaks`. Raw HTML is not enabled.

When a user selects an output format, the page uses the formatted-output flow:

ChatPage
↓
`sendFormattedChatMessage()` service
↓
`POST /chat/formatted`
↓
Formatted response content
↓
Format-aware assistant output

The selected format is sent as `output_format`. JSON is pretty-printed;
Markdown and Table use the existing safe Markdown renderer; Email preserves
its text layout; and HTML is displayed as escaped source rather than injected
into the page.
The service layer also retains non-streaming `POST /chat` support.

## Formatted Output Rendering

`FormattedChatOutput` renders the response using the format selected for that
assistant turn:

| Output format | Frontend treatment |
| --- | --- |
| JSON | Pretty-printed in a code-style block |
| Markdown | Safe `react-markdown` rendering with GFM and line breaks |
| Table | GFM table rendering through the same Markdown renderer |
| Email | Preserved text layout in an email-style block |
| HTML | Escaped source text; raw model HTML is never injected |

`POST /chat/formatted` receives the standard chat request plus
`output_format`. Its `content` is either text or a structured `{ answer }`
object, which the frontend serializes for display when required. The backend
owns output validation; the frontend only renders the returned contract.

## Tool Calling Demo Flow

ChatPage Tool Calling section
↓
`sendToolChatMessage()` service
↓
`POST /chat/tools`
↓
Backend-selected tool execution and final response
↓
Assistant result UI

The frontend sends only the user's message, an empty demo history, and the
selected temperature. The backend exclusively decides whether to use a tool,
which tool to use, and how to execute it. The frontend displays its final
message and optional returned tool name.

## Image Generation Flow

ChatPage Image Generation section
↓
`generateImage()` service
↓
`POST /images/generate`
↓
Base64 image bytes and MIME type
↓
`<img>` data URL

The frontend displays the backend's provider-neutral image payload using its
returned MIME type. Image generation configuration and provider logic remain
owned by the backend.

## Audio Generation Flow

ChatPage Audio Generation section
↓
`generateAudio()` service
↓
`POST /audio/generate`
↓
Base64 audio bytes and MIME type
↓
Native `<audio controls>` data URL

The frontend displays the backend's provider-neutral audio payload through the
browser's standard playback controls. Audio generation configuration and
provider logic remain owned by the backend.

## API Contracts and UI State

Backend calls are centralized in feature service modules and use shared
TypeScript contracts from `src/types/`. Chat and structured-AI calls are in
`src/services/api.ts`; prompt-library calls are in
`src/services/promptLibrary.ts`.

| Endpoint | Request | Response used by the frontend |
| --- | --- | --- |
| `POST /chat/stream` | message, history, temperature | Plain-text response stream |
| `POST /chat/formatted` | chat request plus `output_format` | `output_format` and text or structured content |
| `POST /chat/tools` | message, history, temperature | Final message and optional `tool_name` |
| `POST /images/generate` | prompt | `image_base64`, `mime_type` |
| `POST /audio/generate` | text | `audio_base64`, `mime_type` |

Each Sprint 5 panel owns its form, response, loading, validation, empty, and
error state. Controls are disabled while their request is active. A new request
clears its previous result and error, and switching local tabs retains panel
state because panels remain mounted while hidden.

`GeneratedImage` and `GeneratedAudio` turn provider-neutral Base64 responses
into `data:` URLs for a native `<img>` or `<audio controls>` element.

## Prompt Library Flow

PromptLibraryPage
↓
React Query hooks and stable prompt-library query keys
↓
`src/services/promptLibrary.ts`
↓
Prompt Library backend endpoints
↓
Prompt list, editor, metadata controls, and read-only version history

The Prompt Library uses React Query for server-state fetching and mutations.
The shared client is configured in `src/queryClient.ts`; prompt-library query
keys are defined in `src/queries/promptLibrary/queryKeys.ts`. Successful
mutations invalidate affected prompt lists and, where applicable, prompt detail
and version-history queries. The page owns only UI state: filter inputs,
pagination, and modal selection.

`Prompt` is the current saved record: title, content, description, category,
favorite status, template status, and timestamps. `PromptVersion` is a
read-only snapshot of historical `content` only. Creating a prompt creates
Version 1. The backend creates a later version only when `content` changes;
changes to title, description, category, favorite status, or template status
do not create a version. Favorite and template are current Prompt metadata,
not historical version state.

| Endpoint | Frontend use |
| --- | --- |
| `GET /prompts` | Paginated list with search, category, favorite, and template filters |
| `POST /prompts` | Create a prompt (and its initial content version) |
| `PATCH /prompts/{promptId}` | Update the current prompt record |
| `DELETE /prompts/{promptId}` | Delete a prompt and its version history |
| `PUT` / `DELETE /prompts/{promptId}/favorite` | Set or clear current favorite metadata |
| `PUT` / `DELETE /prompts/{promptId}/template` | Set or clear current template metadata |
| `GET /prompts/{promptId}/versions` | Read content-version history |
| `GET /prompts/categories` | Populate the category filter |

## Testing

Vitest covers formatted-output rendering for every supported format, API
payloads for formatted chat/tool/image/audio and Prompt Library flows, shared
API failure handling, native media markup, and streamed chat chunks. Production
typecheck, lint, and Vite build are run through `npm run build` and `npm run lint`.

## Prompt Experiment and Comparison Flow

PromptBuilderPage
↓
`buildPrompt()`, `runPromptExperiment()`, or `comparePromptOutputs()` service
↓
`POST /prompts/build`, `POST /prompts/experiment`, or `POST /prompts/compare`
↓
Constructed prompt, experiment response, or side-by-side comparison UI

The comparison flow uses Variant A and Variant B configurations with shared
user instructions. Prompt configuration fields are reusable components and
comparison outputs use safe Markdown rendering.

## Evaluation Flow

EvaluationPage
↓
Evaluation case editor
↓
`runEvaluation()` service
↓
`POST /evaluations/run`
↓
Expected vs actual output and backend pass/fail results

Evaluation datasets are held in page memory. Each case contains an input,
expected output, and one or more criteria. The backend evaluates cases and
returns the pass/fail value; the frontend displays the result without
reimplementing evaluation logic.

## Backend Status Flow

BackendStatus
↓
`getHealth()` service
↓
`GET /health`

---

# Backend

The backend is maintained in a separate repository.

Technology:

- Python
- FastAPI

The frontend communicates with backend HTTP endpoints only through its service
layer. Backend business logic, model integration, and data systems remain
outside this repository.
