import { type FormEvent, useState } from 'react'
import { PromptComparisonResults } from '../components/PromptComparisonResults'
import { PromptConfigurationForm } from '../components/PromptConfigurationForm'
import { buildPrompt, comparePromptOutputs, runPromptExperiment } from '../services/prompt'
import type {
  PromptComparisonConfiguration,
  PromptComparisonRequest,
  PromptComparisonResponse,
  PromptExperimentRequest,
  PromptRequest,
} from '../types/prompt'

const initialVariantA: PromptComparisonConfiguration = {
  label: 'Variant A',
  shot_type: 'zero_shot',
  system_instructions: '',
  context: '',
  examples: [],
}

const initialVariantB: PromptComparisonConfiguration = {
  label: 'Variant B',
  shot_type: 'zero_shot',
  system_instructions: '',
  context: '',
  examples: [],
}

export function PromptBuilderPage() {
  const [variantA, setVariantA] = useState(initialVariantA)
  const [variantB, setVariantB] = useState(initialVariantB)
  const [userInstructions, setUserInstructions] = useState('')
  const [constructedPrompt, setConstructedPrompt] = useState<string | null>(null)
  const [promptError, setPromptError] = useState<string | null>(null)
  const [isBuildingPrompt, setIsBuildingPrompt] = useState(false)
  const [experimentResponse, setExperimentResponse] = useState<string | null>(null)
  const [experimentError, setExperimentError] = useState<string | null>(null)
  const [isRunningExperiment, setIsRunningExperiment] = useState(false)
  const [comparisonResponse, setComparisonResponse] = useState<PromptComparisonResponse | null>(null)
  const [comparisonError, setComparisonError] = useState<string | null>(null)
  const [isComparing, setIsComparing] = useState(false)

  function createPromptRequest(): PromptRequest {
    return {
      system_instructions: variantA.system_instructions,
      user_instructions: userInstructions,
      context: variantA.context,
      examples: variantA.examples,
    }
  }

  async function handleBuildPrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isBuildingPrompt) {
      return
    }

    setIsBuildingPrompt(true)
    setPromptError(null)
    setConstructedPrompt(null)

    try {
      const response = await buildPrompt(createPromptRequest())
      setConstructedPrompt(response.prompt)
    } catch (error) {
      setPromptError(error instanceof Error ? error.message : 'Unable to build the prompt. Please try again.')
    } finally {
      setIsBuildingPrompt(false)
    }
  }

  async function handleRunExperiment() {
    if (isRunningExperiment) {
      return
    }

    const request: PromptExperimentRequest = {
      ...createPromptRequest(),
      shot_type: variantA.shot_type,
    }

    setIsRunningExperiment(true)
    setExperimentError(null)
    setExperimentResponse(null)

    try {
      const response = await runPromptExperiment(request)
      setExperimentResponse(response.message)
    } catch (error) {
      setExperimentError(error instanceof Error ? error.message : 'Unable to run the prompt experiment. Please try again.')
    } finally {
      setIsRunningExperiment(false)
    }
  }

  async function handleComparePrompts() {
    if (isComparing) {
      return
    }

    const request: PromptComparisonRequest = {
      user_instructions: userInstructions,
      configurations: [variantA, variantB],
    }

    setIsComparing(true)
    setComparisonError(null)
    setComparisonResponse(null)

    try {
      setComparisonResponse(await comparePromptOutputs(request))
    } catch (error) {
      setComparisonError(error instanceof Error ? error.message : 'Unable to compare prompt variants. Please try again.')
    } finally {
      setIsComparing(false)
    }
  }

  const isBusy = isBuildingPrompt || isRunningExperiment || isComparing

  return (
    <section className="prompt-builder" aria-labelledby="prompt-builder-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Sprint 2</p>
          <h2 id="prompt-builder-heading">Prompt Builder</h2>
        </div>
        <p>Configure two prompt variants and compare their outputs against the same input.</p>
      </div>

      <form onSubmit={handleBuildPrompt}>
        <PromptConfigurationForm
          configuration={variantA}
          disabled={isBusy}
          idPrefix="variant-a"
          onChange={setVariantA}
        />

        <label htmlFor="user-instructions">Shared User Instructions</label>
        <textarea
          id="user-instructions"
          value={userInstructions}
          onChange={(event) => setUserInstructions(event.target.value)}
          placeholder="Write the instruction or task for both variants."
          disabled={isBusy}
        />

        <button type="submit" disabled={isBusy}>
          {isBuildingPrompt ? 'Building Prompt…' : 'Build Prompt'}
        </button>
        <button type="button" onClick={() => void handleRunExperiment()} disabled={isBusy}>
          {isRunningExperiment ? 'Running Experiment…' : 'Run Experiment'}
        </button>
      </form>

      <div className="constructed-prompt" aria-live="polite" aria-busy={isBuildingPrompt}>
        <h3>Constructed Prompt</h3>
        <p className="preview-note">This prompt is constructed by the backend.</p>
        {isBuildingPrompt && <p>Building your prompt…</p>}
        {promptError && <p className="error">{promptError}</p>}
        {constructedPrompt && <pre>{constructedPrompt}</pre>}
        {!isBuildingPrompt && !promptError && !constructedPrompt && <p>Your constructed prompt will appear here.</p>}
      </div>

      <div className="constructed-prompt" aria-live="polite" aria-busy={isRunningExperiment}>
        <h3>Experiment Response</h3>
        {isRunningExperiment && <p>Running your prompt experiment…</p>}
        {experimentError && <p className="error">{experimentError}</p>}
        {experimentResponse && <p>{experimentResponse}</p>}
        {!isRunningExperiment && !experimentError && !experimentResponse && <p>Your experiment response will appear here.</p>}
      </div>

      <section className="prompt-comparison" aria-labelledby="comparison-heading">
        <div className="section-heading">
          <div>
            <h3 id="comparison-heading">Prompt/Output Comparison</h3>
          </div>
          <p>Variant A is configured above. Configure Variant B, then compare both outputs.</p>
        </div>

        <PromptConfigurationForm
          configuration={variantB}
          disabled={isBusy}
          idPrefix="variant-b"
          onChange={setVariantB}
        />

        <button type="button" onClick={() => void handleComparePrompts()} disabled={isBusy}>
          {isComparing ? 'Comparing Variants…' : 'Compare Variants'}
        </button>

        <PromptComparisonResults
          error={comparisonError}
          isComparing={isComparing}
          response={comparisonResponse}
        />
      </section>
    </section>
  )
}
