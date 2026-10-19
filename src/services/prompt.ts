import type { ChatResponse } from '../types/api'
import type {
  PromptComparisonRequest,
  PromptComparisonResponse,
  PromptExperimentRequest,
  PromptRequest,
  PromptResponse,
} from '../types/prompt'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000').replace(/\/$/, '')

export async function buildPrompt(payload: PromptRequest): Promise<PromptResponse> {
  let response: Response

  try {
    response = await fetch(`${apiBaseUrl}/prompts/build`, {
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

  return response.json() as Promise<PromptResponse>
}

export async function runPromptExperiment(payload: PromptExperimentRequest): Promise<ChatResponse> {
  let response: Response

  try {
    response = await fetch(`${apiBaseUrl}/prompts/experiment`, {
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

  return response.json() as Promise<ChatResponse>
}

export async function comparePromptOutputs(payload: PromptComparisonRequest): Promise<PromptComparisonResponse> {
  let response: Response

  try {
    response = await fetch(`${apiBaseUrl}/prompts/compare`, {
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

  return response.json() as Promise<PromptComparisonResponse>
}
