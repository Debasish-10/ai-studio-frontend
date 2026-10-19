export interface HealthResponse {
  status: string
}

export interface ChatRequest {
  message: string
  history: ConversationMessage[]
  temperature: number
}

export type OutputFormat = 'json' | 'markdown' | 'table' | 'email' | 'html'

export interface FormattedChatRequest extends ChatRequest {
  output_format: OutputFormat
}

export interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  message: string
}

export type ToolChatRequest = ChatRequest

export interface ToolChatResponse {
  message: string
  tool_name: string | null
}

export interface ImageGenerationRequest {
  prompt: string
}

export interface ImageGenerationResponse {
  image_base64: string
  mime_type: string
}

export interface AudioGenerationRequest {
  text: string
}

export interface AudioGenerationResponse {
  audio_base64: string
  mime_type: string
}

export interface StructuredChatContent {
  answer: string
}

export interface FormattedChatResponse {
  output_format: OutputFormat
  content: StructuredChatContent | string
}
