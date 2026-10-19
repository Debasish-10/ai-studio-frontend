export interface Prompt {
  id: string
  title: string
  content: string
  description: string | null
  category: string
  is_favorite: boolean
  is_template: boolean
  created_at: string
  updated_at: string
}

export interface PromptPage {
  items: Prompt[]
  page: number
  page_size: number
  total: number
  total_pages: number
}

export interface PromptListParameters {
  search?: string
  category?: string
  is_favorite?: boolean
  is_template?: boolean
  page?: number
  page_size?: number
}

export interface PromptCreate {
  title: string
  content: string
  description?: string | null
  category?: string
  is_favorite?: boolean
  is_template?: boolean
}

export interface PromptUpdate {
  title?: string
  content?: string
  description?: string | null
  category?: string
  is_favorite?: boolean
  is_template?: boolean
}

export interface PromptVersion {
  id: string
  prompt_id: string
  version: number
  content: string
  created_at: string
}
