import { type FormEvent, useState } from 'react'
import { sendToolChatMessage } from '../services/api'
import type { ToolChatResponse } from '../types/api'
import { FormattedChatOutput } from './FormattedChatOutput'

interface ToolCallingPanelProps {
  hidden: boolean
  temperature: number
}

export function ToolCallingPanel({ hidden, temperature }: ToolCallingPanelProps) {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState<ToolChatResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedMessage = message.trim()
    if (isSending || !trimmedMessage) {
      if (!isSending) setError('Enter a message before sending.')
      return
    }

    setIsSending(true)
    setError(null)
    setResponse(null)
    try {
      setResponse(await sendToolChatMessage({ message: trimmedMessage, history: [], temperature }))
    } catch {
      setError('We could not complete the tool request. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="feature-tab-panel tool-calling-demo" id="tools-panel" role="tabpanel" aria-labelledby="tools-tab" hidden={hidden}>
      <div className="section-heading"><div><p className="eyebrow">Demo</p><h3>Tool Calling</h3></div><p>The backend decides whether a tool is needed and executes it.</p></div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="tool-message">Message</label>
        <textarea id="tool-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask for something a backend tool can help with." maxLength={4000} disabled={isSending} />
        <button type="submit" disabled={isSending || !message.trim()}>{isSending ? 'Running tool request…' : 'Send tool request'}</button>
      </form>
      <div className="tool-response" aria-live="polite" aria-busy={isSending}>
        {isSending && <p>Waiting for the backend to complete the request…</p>}
        {error && <p className="error">{error}</p>}
        {response && <><FormattedChatOutput content={response.message} />{response.tool_name && <p className="tool-name">Backend tool used: {response.tool_name}</p>}</>}
        {!isSending && !error && !response && <p>Your completed tool response will appear here.</p>}
      </div>
    </section>
  )
}
