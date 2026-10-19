import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import type { OutputFormat } from '../types/api'

interface FormattedChatOutputProps {
  content: string
  outputFormat?: OutputFormat
}

function prettyPrintJson(content: string): string {
  try {
    return JSON.stringify(JSON.parse(content), null, 2)
  } catch {
    return content
  }
}

export function FormattedChatOutput({ content, outputFormat }: FormattedChatOutputProps) {
  if (!outputFormat || outputFormat === 'markdown' || outputFormat === 'table') {
    return (
      <div className="assistant-markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{content}</ReactMarkdown>
      </div>
    )
  }

  if (outputFormat === 'json') {
    return (
      <pre className="formatted-chat-content json-output" aria-label="JSON output">
        <code>{prettyPrintJson(content)}</code>
      </pre>
    )
  }

  if (outputFormat === 'email') {
    return <section className="email-output" aria-label="Email output">{content}</section>
  }

  return (
    <pre className="formatted-chat-content html-output" aria-label="HTML output">
      <code>{content}</code>
    </pre>
  )
}
