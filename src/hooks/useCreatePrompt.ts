import { useMutation, useQueryClient } from '@tanstack/react-query'
import { promptLibraryQueryKeys } from '../queries/promptLibrary/queryKeys'
import { createPrompt } from '../services/promptLibrary'

export function useCreatePrompt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPrompt,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: promptLibraryQueryKeys.lists() }),
  })
}
