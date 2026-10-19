import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import type { PromptComparisonResponse } from '../types/prompt'

interface PromptComparisonResultsProps {
  error: string | null
  isComparing: boolean
  response: PromptComparisonResponse | null
}

export function PromptComparisonResults({ error, isComparing, response }: PromptComparisonResultsProps) {
  return (
    <div className="comparison-results" aria-live="polite" aria-busy={isComparing}>
      {isComparing && <p>Running both prompt variants…</p>}
      {error && <p className="error">{error}</p>}
      {response?.results.map((result) => (
        <article className="comparison-result" key={result.label}>
          <h4>{result.label}</h4>
          <h5>Prompt</h5>
          <pre>{result.prompt}</pre>
          <h5>Output</h5>
          <div className="assistant-markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{result.output}</ReactMarkdown>
          </div>
        </article>
      ))}
      {!isComparing && !error && !response && <p>Both variant outputs will appear side by side here.</p>}
    </div>
  )
}
