import { useMutation, useQueryClient } from '@tanstack/react-query'
import { promptLibraryQueryKeys } from '../queries/promptLibrary/queryKeys'
import { setPromptTemplate } from '../services/promptLibrary'

interface SetPromptTemplateVariables {
  promptId: string
  isTemplate: boolean
}

export function useSetPromptTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ promptId, isTemplate }: SetPromptTemplateVariables) => setPromptTemplate(promptId, isTemplate),
    onSuccess: (_, { promptId }) => Promise.all([
      queryClient.invalidateQueries({ queryKey: promptLibraryQueryKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: promptLibraryQueryKeys.detail(promptId), exact: true }),
    ]),
  })
}
