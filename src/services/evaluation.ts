import type { EvaluationRunRequest, EvaluationRunResponse } from '../types/evaluation'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000').replace(/\/$/, '')

export async function runEvaluation(payload: EvaluationRunRequest): Promise<EvaluationRunResponse> {
  let response: Response

  try {
    response = await fetch(`${apiBaseUrl}/evaluations/run`, {
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

  return response.json() as Promise<EvaluationRunResponse>
}
