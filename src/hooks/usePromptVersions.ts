import { useQuery } from '@tanstack/react-query'
import { promptLibraryQueryKeys } from '../queries/promptLibrary/queryKeys'
import { getPromptVersions } from '../services/promptLibrary'

export function usePromptVersions(promptId: string | undefined) {
  return useQuery({
    queryKey: promptLibraryQueryKeys.versions(promptId ?? ''),
    queryFn: () => {
      if (!promptId) {
        throw new Error('A prompt must be selected before loading version history.')
      }

      return getPromptVersions(promptId)
    },
    enabled: Boolean(promptId),
  })
}
