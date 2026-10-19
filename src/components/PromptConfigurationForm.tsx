import type { Example, PromptComparisonConfiguration, PromptShotType } from '../types/prompt'

interface PromptConfigurationFormProps {
  configuration: PromptComparisonConfiguration
  disabled?: boolean
  idPrefix: string
  onChange: (configuration: PromptComparisonConfiguration) => void
}

function createEmptyExample(): Example {
  return { input: '', output: '' }
}

function examplesForShotType(shotType: PromptShotType, examples: Example[]): Example[] {
  if (shotType === 'zero_shot') {
    return []
  }

  if (shotType === 'one_shot') {
    return [examples[0] ?? createEmptyExample()]
  }

  return examples.length >= 2
    ? examples
    : [...examples, ...Array.from({ length: 2 - examples.length }, createEmptyExample)]
}

export function PromptConfigurationForm({
  configuration,
  disabled = false,
  idPrefix,
  onChange,
}: PromptConfigurationFormProps) {
  const label = configuration.label

  function updateConfiguration(update: Partial<PromptComparisonConfiguration>) {
    onChange({ ...configuration, ...update })
  }

  function updateShotType(shotType: PromptShotType) {
    updateConfiguration({ shot_type: shotType, examples: examplesForShotType(shotType, configuration.examples) })
  }

  function updateExample(index: number, field: keyof Example, value: string) {
    updateConfiguration({
      examples: configuration.examples.map((example, exampleIndex) =>
        exampleIndex === index ? { ...example, [field]: value } : example,
      ),
    })
  }

  return (
    <section className="prompt-variant" aria-labelledby={`${idPrefix}-heading`}>
      <h3 id={`${idPrefix}-heading`}>{label}</h3>

      <label htmlFor={`${idPrefix}-system-instructions`}>{label} System Instructions</label>
      <textarea
        id={`${idPrefix}-system-instructions`}
        value={configuration.system_instructions}
        onChange={(event) => updateConfiguration({ system_instructions: event.target.value })}
        placeholder="Define the assistant's role and rules."
        disabled={disabled}
      />

      <label htmlFor={`${idPrefix}-context`}>{label} Context</label>
      <textarea
        id={`${idPrefix}-context`}
        value={configuration.context}
        onChange={(event) => updateConfiguration({ context: event.target.value })}
        placeholder="Add background information for this prompt."
        disabled={disabled}
      />

      <label htmlFor={`${idPrefix}-shot-type`}>{label} Shot Mode</label>
      <select
        id={`${idPrefix}-shot-type`}
        value={configuration.shot_type}
        onChange={(event) => updateShotType(event.target.value as PromptShotType)}
        disabled={disabled}
      >
        <option value="zero_shot">Zero-shot</option>
        <option value="one_shot">One-shot</option>
        <option value="few_shot">Few-shot</option>
      </select>

      {configuration.shot_type !== 'zero_shot' && <div className="examples-section">
        <div className="examples-heading">
          <div>
            <h4>{label} Examples</h4>
            <p>
              {configuration.shot_type === 'one_shot'
                ? 'Provide one input and output pair to guide the response.'
                : 'Provide at least two input and output pairs to guide the response.'}
            </p>
          </div>
          {configuration.shot_type === 'few_shot' && <button
            type="button"
            className="secondary-button"
            onClick={() => updateConfiguration({ examples: [...configuration.examples, createEmptyExample()] })}
            disabled={disabled}
          >
            Add Example
          </button>}
        </div>

        {configuration.examples.map((example, index) => (
          <fieldset className="example-card" key={index}>
            <legend>{label} Example {index + 1}</legend>
            <label htmlFor={`${idPrefix}-example-input-${index}`}>Input</label>
            <textarea
              id={`${idPrefix}-example-input-${index}`}
              value={example.input}
              onChange={(event) => updateExample(index, 'input', event.target.value)}
              disabled={disabled}
            />
            <label htmlFor={`${idPrefix}-example-output-${index}`}>Output</label>
            <textarea
              id={`${idPrefix}-example-output-${index}`}
              value={example.output}
              onChange={(event) => updateExample(index, 'output', event.target.value)}
              disabled={disabled}
            />
            {configuration.shot_type === 'few_shot' && configuration.examples.length > 2 && <button
              type="button"
              className="remove-button"
              onClick={() => updateConfiguration({ examples: configuration.examples.filter((_, exampleIndex) => exampleIndex !== index) })}
              disabled={disabled}
            >
              Remove example
            </button>}
          </fieldset>
        ))}
      </div>}
    </section>
  )
}
