import type { EvaluationRunResponse } from '../types/evaluation'

interface EvaluationResultsProps {
  error: string | null
  isRunning: boolean
  response: EvaluationRunResponse | null
}

export function EvaluationResults({ error, isRunning, response }: EvaluationResultsProps) {
  return (
    <section className="evaluation-results" aria-live="polite" aria-busy={isRunning}>
      <h3>Evaluation Results</h3>
      {isRunning && <p>Running evaluation cases…</p>}
      {error && <p className="error">{error}</p>}
      {response && <p className="preview-note">Dataset: {response.dataset_name}</p>}
      {response?.results.map((result, index) => (
        <article className="evaluation-result" key={index}>
          <div className="evaluation-result-heading">
            <h4>Case {index + 1}</h4>
            <span className={result.passed ? 'evaluation-status passed' : 'evaluation-status failed'}>
              {result.passed ? 'Passed' : 'Failed'}
            </span>
          </div>
          <p><strong>Input:</strong> {result.input}</p>
          <p><strong>Criteria:</strong> {result.criteria.join(', ')}</p>
          <div className="evaluation-output-grid">
            <section>
              <h5>Expected Output</h5>
              <pre>{result.expected_output}</pre>
            </section>
            <section>
              <h5>Actual Output</h5>
              <pre>{result.actual_output}</pre>
            </section>
          </div>
        </article>
      ))}
      {!isRunning && !error && !response && <p>Your expected and actual outputs will appear here.</p>}
    </section>
  )
}
