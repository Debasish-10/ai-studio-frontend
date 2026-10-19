import type { EvaluationCase } from '../types/evaluation'

interface EvaluationCaseEditorProps {
  caseIndex: number
  evaluationCase: EvaluationCase
  canRemove: boolean
  disabled: boolean
  onChange: (evaluationCase: EvaluationCase) => void
  onRemove: () => void
}

export function EvaluationCaseEditor({
  caseIndex,
  evaluationCase,
  canRemove,
  disabled,
  onChange,
  onRemove,
}: EvaluationCaseEditorProps) {
  function updateCriteria(index: number, value: string) {
    onChange({
      ...evaluationCase,
      criteria: evaluationCase.criteria.map((criterion, criterionIndex) =>
        criterionIndex === index ? value : criterion,
      ),
    })
  }

  return (
    <fieldset className="example-card">
      <legend>Case {caseIndex + 1}</legend>

      <label htmlFor={`evaluation-input-${caseIndex}`}>Input</label>
      <textarea
        id={`evaluation-input-${caseIndex}`}
        value={evaluationCase.input}
        onChange={(event) => onChange({ ...evaluationCase, input: event.target.value })}
        disabled={disabled}
      />

      <label htmlFor={`evaluation-expected-output-${caseIndex}`}>Expected Output</label>
      <textarea
        id={`evaluation-expected-output-${caseIndex}`}
        value={evaluationCase.expected_output}
        onChange={(event) => onChange({ ...evaluationCase, expected_output: event.target.value })}
        disabled={disabled}
      />

      <div className="criteria-section">
        <div className="examples-heading">
          <div>
            <h3>Criteria</h3>
            <p>Define the conditions this case should satisfy.</p>
          </div>
          <button
            type="button"
            className="secondary-button"
            onClick={() => onChange({ ...evaluationCase, criteria: [...evaluationCase.criteria, ''] })}
            disabled={disabled}
          >
            Add Criterion
          </button>
        </div>

        {evaluationCase.criteria.map((criterion, criterionIndex) => (
          <div className="criterion-input" key={criterionIndex}>
            <label htmlFor={`evaluation-criterion-${caseIndex}-${criterionIndex}`}>
              Criterion {criterionIndex + 1}
            </label>
            <input
              id={`evaluation-criterion-${caseIndex}-${criterionIndex}`}
              type="text"
              value={criterion}
              onChange={(event) => updateCriteria(criterionIndex, event.target.value)}
              disabled={disabled}
            />
            {evaluationCase.criteria.length > 1 && <button
              type="button"
              className="remove-button"
              onClick={() => onChange({
                ...evaluationCase,
                criteria: evaluationCase.criteria.filter((_, index) => index !== criterionIndex),
              })}
              disabled={disabled}
            >
              Remove criterion
            </button>}
          </div>
        ))}
      </div>

      {canRemove && <button type="button" className="remove-button" onClick={onRemove} disabled={disabled}>
        Remove case
      </button>}
    </fieldset>
  )
}
