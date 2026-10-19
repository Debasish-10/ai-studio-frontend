import { useQuery } from '@tanstack/react-query'
import { promptLibraryQueryKeys } from '../queries/promptLibrary/queryKeys'
import { getPromptCategories } from '../services/promptLibrary'

export function usePromptCategories() {
  return useQuery({
    queryKey: promptLibraryQueryKeys.categories(),
    queryFn: getPromptCategories,
  })
}
