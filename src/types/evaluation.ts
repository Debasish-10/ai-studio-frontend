export interface EvaluationCase {
  input: string
  expected_output: string
  criteria: string[]
}

export interface EvaluationDataset {
  name: string
  cases: EvaluationCase[]
}

export interface EvaluationRunRequest {
  dataset: EvaluationDataset
  temperature?: number
}

export interface EvaluationCaseResult extends EvaluationCase {
  actual_output: string
  passed: boolean
}

export interface EvaluationRunResponse {
  dataset_name: string
  results: EvaluationCaseResult[]
}
