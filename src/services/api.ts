import type {
  AudioGenerationRequest,
  AudioGenerationResponse,
  ChatRequest,
  ChatResponse,
  FormattedChatRequest,
  FormattedChatResponse,
  HealthResponse,
  ImageGenerationRequest,
  ImageGenerationResponse,
  ToolChatRequest,
  ToolChatResponse,
} from '../types/api'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000').replace(/\/$/, '')

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${apiBaseUrl}${path}`, options)
  } catch {
    throw new Error('Unable to reach the backend. Check that it is running and the API URL is correct.')
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`)
  }

  return response.json() as Promise<T>
}

export function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>('/health')
}

export function sendChatMessage(payload: ChatRequest): Promise<ChatResponse> {
  return request<ChatResponse>('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function sendFormattedChatMessage(payload: FormattedChatRequest): Promise<FormattedChatResponse> {
  return request<FormattedChatResponse>('/chat/formatted', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function sendToolChatMessage(payload: ToolChatRequest): Promise<ToolChatResponse> {
  return request<ToolChatResponse>('/chat/tools', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function generateImage(payload: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  return request<ImageGenerationResponse>('/images/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function generateAudio(payload: AudioGenerationRequest): Promise<AudioGenerationResponse> {
  return request<AudioGenerationResponse>('/audio/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function* streamChatMessage(payload: ChatRequest): AsyncGenerator<string> {
  let response: Response

  try {
    response = await fetch(`${apiBaseUrl}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('Unable to reach the backend. Check that it is running and the API URL is correct.')
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`)
  }

  if (!response.body) {
    throw new Error('The backend did not return a response stream.')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      const text = decoder.decode(value, { stream: true })

      if (text) {
        yield text
      }
    }

    const remainingText = decoder.decode()

    if (remainingText) {
      yield remainingText
    }
  } finally {
    reader.releaseLock()
  }
}
