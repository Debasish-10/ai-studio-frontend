import { useMutation, useQueryClient } from '@tanstack/react-query'
import { promptLibraryQueryKeys } from '../queries/promptLibrary/queryKeys'
import { deletePrompt } from '../services/promptLibrary'

export function useDeletePrompt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePrompt,
    onSuccess: async (_, promptId) => {
      await queryClient.invalidateQueries({ queryKey: promptLibraryQueryKeys.lists() })
      queryClient.removeQueries({ queryKey: promptLibraryQueryKeys.detail(promptId) })
    },
  })
}
