import { type FormEvent, useState } from 'react'
import { sendFormattedChatMessage, streamChatMessage } from '../services/api'
import type { ConversationMessage, FormattedChatResponse, OutputFormat } from '../types/api'
import { FormattedChatOutput } from './FormattedChatOutput'

type ConversationEntry = ConversationMessage & {
  status: 'pending' | 'streaming' | 'complete' | 'failed'
  outputFormat?: OutputFormat
}

interface ChatConversationPanelProps {
  hidden: boolean
  temperature: number
  onTemperatureChange: (temperature: number) => void
}

function formattedContentToDisplay(response: FormattedChatResponse): string {
  return typeof response.content === 'string' ? response.content : JSON.stringify(response.content, null, 2)
}

export function ChatConversationPanel({ hidden, temperature, onTemperatureChange }: ChatConversationPanelProps) {
  const [message, setMessage] = useState('')
  const [outputFormat, setOutputFormat] = useState<OutputFormat | ''>('')
  const [conversation, setConversation] = useState<ConversationEntry[]>([])
  const [chatError, setChatError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedMessage = message.trim()

    if (isSending || !trimmedMessage) {
      if (!isSending) setChatError('Enter a message before sending.')
      return
    }

    const history = conversation
      .filter((conversationMessage) => conversationMessage.status === 'complete')
      .map(({ role, content }) => ({ role, content }))

    setIsSending(true)
    setChatError(null)
    setConversation((currentConversation) => [
      ...currentConversation,
      { role: 'user', content: trimmedMessage, status: 'pending' },
      { role: 'assistant', content: '', status: 'streaming', outputFormat: outputFormat || undefined },
    ])

    try {
      if (outputFormat) {
        const response = await sendFormattedChatMessage({
          message: trimmedMessage,
          history,
          temperature,
          output_format: outputFormat,
        })

        setConversation((currentConversation) =>
          currentConversation.map((conversationMessage, index) =>
            index === currentConversation.length - 1 && conversationMessage.status === 'streaming'
              ? { ...conversationMessage, content: formattedContentToDisplay(response) }
              : conversationMessage,
          ),
        )
      } else {
        for await (const chunk of streamChatMessage({ message: trimmedMessage, history, temperature })) {
          setConversation((currentConversation) =>
            currentConversation.map((conversationMessage, index) =>
              index === currentConversation.length - 1 && conversationMessage.status === 'streaming'
                ? { ...conversationMessage, content: conversationMessage.content + chunk }
                : conversationMessage,
            ),
          )
        }
      }

      setConversation((currentConversation) =>
        currentConversation.map((conversationMessage, index) =>
          index >= currentConversation.length - 2 ? { ...conversationMessage, status: 'complete' } : conversationMessage,
        ),
      )
    } catch {
      setConversation((currentConversation) =>
        currentConversation.map((conversationMessage, index) =>
          index >= currentConversation.length - 2 ? { ...conversationMessage, status: 'failed' } : conversationMessage,
        ),
      )
      setChatError('We could not get a response. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="feature-tab-panel" id="chat-panel" role="tabpanel" aria-labelledby="chat-tab" hidden={hidden}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="message">Message</label>
        <textarea id="message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask AI Studio anything…" maxLength={4000} disabled={isSending} />
        <div className="temperature-control">
          <label htmlFor="temperature">Temperature <output htmlFor="temperature">{temperature.toFixed(1)}</output></label>
          <input id="temperature" type="range" min="0" max="2" step="0.1" value={temperature} onChange={(event) => onTemperatureChange(Number(event.target.value))} disabled={isSending} />
        </div>
        <label htmlFor="output-format">Output Format</label>
        <select id="output-format" value={outputFormat} onChange={(event) => setOutputFormat(event.target.value as OutputFormat | '')} disabled={isSending}>
          <option value="">Normal chat (streaming)</option>
          <option value="json">JSON</option>
          <option value="markdown">Markdown</option>
          <option value="table">Table</option>
          <option value="email">Email</option>
          <option value="html">HTML</option>
        </select>
        <button type="submit" disabled={isSending || !message.trim()}>{isSending ? 'Sending…' : 'Send message'}</button>
      </form>

      <div className="response" aria-live="polite">
        {chatError && <p className="error">{chatError}</p>}
        {conversation.map((conversationMessage, index) =>
          (conversationMessage.content || conversationMessage.status === 'streaming') && (
            conversationMessage.role === 'user' ? (
              <p className="chat-message" key={index}><strong>You:</strong> {conversationMessage.content}</p>
            ) : (
              <div className="chat-message assistant-message" key={index}>
                <strong>Assistant:</strong>
                {conversationMessage.status === 'streaming' && !conversationMessage.content
                  ? <span> Thinking…</span>
                  : <FormattedChatOutput content={conversationMessage.content} outputFormat={conversationMessage.outputFormat} />}
              </div>
            )
          ),
        )}
      </div>
    </section>
  )
}
