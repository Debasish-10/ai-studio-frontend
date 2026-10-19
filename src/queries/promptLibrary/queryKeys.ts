import type { PromptListParameters } from '../../types/promptLibrary'

export const promptLibraryQueryKeys = {
  all: ['prompt-library'] as const,
  prompts: () => [...promptLibraryQueryKeys.all, 'prompts'] as const,
  lists: () => [...promptLibraryQueryKeys.prompts(), 'list'] as const,
  list: (parameters: PromptListParameters) => [...promptLibraryQueryKeys.lists(), parameters] as const,
  details: () => [...promptLibraryQueryKeys.prompts(), 'detail'] as const,
  detail: (promptId: string) => [...promptLibraryQueryKeys.details(), promptId] as const,
  versions: (promptId: string) => [...promptLibraryQueryKeys.detail(promptId), 'versions'] as const,
  categories: () => [...promptLibraryQueryKeys.all, 'categories'] as const,
}
