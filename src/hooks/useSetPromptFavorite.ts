import { useMutation, useQueryClient } from '@tanstack/react-query'
import { promptLibraryQueryKeys } from '../queries/promptLibrary/queryKeys'
import { setPromptFavorite } from '../services/promptLibrary'

interface SetPromptFavoriteVariables {
  promptId: string
  isFavorite: boolean
}

export function useSetPromptFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ promptId, isFavorite }: SetPromptFavoriteVariables) => setPromptFavorite(promptId, isFavorite),
    onSuccess: (_, { promptId }) => Promise.all([
      queryClient.invalidateQueries({ queryKey: promptLibraryQueryKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: promptLibraryQueryKeys.detail(promptId), exact: true }),
    ]),
  })
}
