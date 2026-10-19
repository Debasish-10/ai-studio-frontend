import { useMutation, useQueryClient } from '@tanstack/react-query'
import { promptLibraryQueryKeys } from '../queries/promptLibrary/queryKeys'
import { updatePrompt } from '../services/promptLibrary'
import type { PromptUpdate } from '../types/promptLibrary'

interface UpdatePromptVariables {
  promptId: string
  payload: PromptUpdate
}

export function useUpdatePrompt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ promptId, payload }: UpdatePromptVariables) => updatePrompt(promptId, payload),
    onSuccess: (_, { promptId }) => Promise.all([
      queryClient.invalidateQueries({ queryKey: promptLibraryQueryKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: promptLibraryQueryKeys.detail(promptId), exact: true }),
      queryClient.invalidateQueries({ queryKey: promptLibraryQueryKeys.versions(promptId) }),
    ]),
  })
}
