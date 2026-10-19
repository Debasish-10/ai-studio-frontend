import { useQuery } from '@tanstack/react-query'
import { promptLibraryQueryKeys } from '../queries/promptLibrary/queryKeys'
import { getPrompts } from '../services/promptLibrary'
import type { PromptListParameters } from '../types/promptLibrary'

export function usePromptList(parameters: PromptListParameters) {
  return useQuery({
    queryKey: promptLibraryQueryKeys.list(parameters),
    queryFn: () => getPrompts(parameters),
  })
}
