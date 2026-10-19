import { type FormEvent, useState } from 'react'
import { EvaluationCaseEditor } from '../components/EvaluationCaseEditor'
import { EvaluationResults } from '../components/EvaluationResults'
import { runEvaluation } from '../services/evaluation'
import type { EvaluationCase, EvaluationRunResponse } from '../types/evaluation'

function createEmptyCase(): EvaluationCase {
  return { input: '', expected_output: '', criteria: [''] }
}

export function EvaluationPage() {
  const [datasetName, setDatasetName] = useState('')
  const [cases, setCases] = useState<EvaluationCase[]>([createEmptyCase()])
  const [response, setResponse] = useState<EvaluationRunResponse | null>(null)
  const [evaluationError, setEvaluationError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  function updateCase(index: number, evaluationCase: EvaluationCase) {
    setCases((currentCases) =>
      currentCases.map((currentCase, caseIndex) => caseIndex === index ? evaluationCase : currentCase),
    )
  }

  function hasIncompleteCase() {
    return cases.some((evaluationCase) =>
      !evaluationCase.input.trim()
      || !evaluationCase.expected_output.trim()
      || evaluationCase.criteria.some((criterion) => !criterion.trim()),
    )
  }

  async function handleRunEvaluation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isRunning) {
      return
    }

    if (!datasetName.trim() || hasIncompleteCase()) {
      setEvaluationError('Add a dataset name, input, expected output, and at least one criterion for every case.')
      return
    }

    setIsRunning(true)
    setEvaluationError(null)
    setResponse(null)

    try {
      setResponse(await runEvaluation({
        dataset: {
          name: datasetName.trim(),
          cases: cases.map((evaluationCase) => ({
            ...evaluationCase,
            input: evaluationCase.input.trim(),
            expected_output: evaluationCase.expected_output.trim(),
            criteria: evaluationCase.criteria.map((criterion) => criterion.trim()),
          })),
        },
      }))
    } catch {
      setEvaluationError('We could not run the evaluation. Please try again.')
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <section className="evaluation-page" aria-labelledby="evaluation-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Sprint 4</p>
          <h2 id="evaluation-heading">Evaluations</h2>
        </div>
        <p>Create a dataset, run its cases, and compare expected output with actual output.</p>
      </div>

      <form onSubmit={handleRunEvaluation}>
        <label htmlFor="dataset-name">Dataset Name</label>
        <input
          id="dataset-name"
          type="text"
          value={datasetName}
          onChange={(event) => setDatasetName(event.target.value)}
          placeholder="e.g. Greeting quality"
          disabled={isRunning}
        />

        <div className="examples-section">
          <div className="examples-heading">
            <div>
              <h3>Evaluation Cases</h3>
              <p>Each case includes an input, expected output, and criteria.</p>
            </div>
            <button type="button" className="secondary-button" onClick={() => setCases((currentCases) => [...currentCases, createEmptyCase()])} disabled={isRunning}>
              Add Case
            </button>
          </div>

          {cases.map((evaluationCase, index) => (
            <EvaluationCaseEditor
              caseIndex={index}
              evaluationCase={evaluationCase}
              canRemove={cases.length > 1}
              disabled={isRunning}
              key={index}
              onChange={(nextCase) => updateCase(index, nextCase)}
              onRemove={() => setCases((currentCases) => currentCases.filter((_, caseIndex) => caseIndex !== index))}
            />
          ))}
        </div>

        <button type="submit" disabled={isRunning}>
          {isRunning ? 'Running Evaluation…' : 'Run Evaluation'}
        </button>
      </form>

      <EvaluationResults error={evaluationError} isRunning={isRunning} response={response} />
    </section>
  )
}
