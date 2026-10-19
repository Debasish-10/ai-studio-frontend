import { useEffect, useState } from 'react'
import { getHealth } from '../services/api'
import type { HealthResponse } from '../types/api'

export function BackendStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [healthError, setHealthError] = useState<string | null>(null)
  const [isCheckingHealth, setIsCheckingHealth] = useState(true)

  async function checkHealth(showLoadingState = true) {
    if (showLoadingState) {
      setIsCheckingHealth(true)
    }
    setHealthError(null)

    try {
      setHealth(await getHealth())
    } catch (error) {
      setHealth(null)
      setHealthError(error instanceof Error ? error.message : 'Unable to check backend status.')
    } finally {
      setIsCheckingHealth(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void checkHealth(false)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  const statusMessage = isCheckingHealth
    ? 'Checking connection…'
    : health
      ? `Connected: ${health.status}`
      : healthError ?? 'Unable to check backend status.'

  return (
    <div className="backend-status" aria-live="polite">
      <span className={health ? 'status-indicator connected' : 'status-indicator'} aria-hidden="true" />
      <span>{statusMessage}</span>
      <button type="button" className="status-button" onClick={() => void checkHealth()} disabled={isCheckingHealth}>
        {isCheckingHealth ? 'Checking…' : 'Check again'}
      </button>
    </div>
  )
}
