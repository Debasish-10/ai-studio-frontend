export interface Example {
  input: string
  output: string
}

export interface PromptRequest {
  system_instructions: string
  user_instructions: string
  context: string
  examples: Example[]
}

export interface PromptResponse {
  prompt: string
}

export type PromptShotType = 'zero_shot' | 'one_shot' | 'few_shot'

export interface PromptExperimentRequest extends PromptRequest {
  shot_type: PromptShotType
  temperature?: number
}

export interface PromptComparisonConfiguration {
  label: string
  shot_type: PromptShotType
  system_instructions: string
  context: string
  examples: Example[]
  temperature?: number
}

export interface PromptComparisonRequest {
  user_instructions: string
  configurations: PromptComparisonConfiguration[]
}

export interface PromptComparisonResult {
  label: string
  prompt: string
  output: string
}

export interface PromptComparisonResponse {
  results: PromptComparisonResult[]
}
