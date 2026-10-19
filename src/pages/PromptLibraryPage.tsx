import { useEffect, useMemo, useState } from 'react'
import { DeletePromptModal } from '../components/DeletePromptModal'
import { PromptEditorModal } from '../components/PromptEditorModal'
import { PromptLibraryFilters } from '../components/PromptLibraryFilters'
import { PromptList } from '../components/PromptList'
import { PromptPagination } from '../components/PromptPagination'
import { PromptVersionHistoryModal } from '../components/PromptVersionHistoryModal'
import { usePromptCategories } from '../hooks/usePromptCategories'
import { useSetPromptFavorite } from '../hooks/useSetPromptFavorite'
import { useSetPromptTemplate } from '../hooks/useSetPromptTemplate'
import { usePromptList } from '../hooks/usePromptList'
import type { Prompt, PromptListParameters } from '../types/promptLibrary'

const promptPageSize = 20

export function PromptLibraryPage() {
  const [isCreatePromptOpen, setIsCreatePromptOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [category, setCategory] = useState('')
  const [isFavorite, setIsFavorite] = useState<boolean | undefined>()
  const [isTemplate, setIsTemplate] = useState<boolean | undefined>()
  const [page, setPage] = useState(1)
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null)
  const [promptToEdit, setPromptToEdit] = useState<Prompt | null>(null)
  const [promptToViewHistory, setPromptToViewHistory] = useState<Prompt | null>(null)
  const setPromptFavorite = useSetPromptFavorite()
  const setPromptTemplate = useSetPromptTemplate()
  const { data: categories = [], isError: isCategoriesError, isPending: isCategoriesPending } = usePromptCategories()

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(search.trim()), 300)

    return () => window.clearTimeout(timeoutId)
  }, [search])

  const promptListParameters = useMemo<PromptListParameters>(() => ({
    search: debouncedSearch || undefined,
    category: category || undefined,
    is_favorite: isFavorite,
    is_template: isTemplate,
    page,
    page_size: promptPageSize,
  }), [category, debouncedSearch, isFavorite, isTemplate, page])
  const { data, isError, isPending } = usePromptList(promptListParameters)

  function closePromptEditor() {
    setIsCreatePromptOpen(false)
    setPromptToEdit(null)
  }

  function closeDeletePrompt() {
    setPromptToDelete(null)
  }

  function resetPageAndSetSearch(value: string) {
    setPage(1)
    setSearch(value)
  }

  function resetPageAndSetCategory(value: string) {
    setPage(1)
    setCategory(value)
  }

  function resetPageAndSetFavorite(value: boolean | undefined) {
    setPage(1)
    setIsFavorite(value)
  }

  function resetPageAndSetTemplate(value: boolean | undefined) {
    setPage(1)
    setIsTemplate(value)
  }

  return (
    <section className="prompt-library" aria-labelledby="prompt-library-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Sprint 6</p>
          <h2 id="prompt-library-heading">Prompt Library</h2>
          <p className="preview-note">Save, organize, and reuse prompts.</p>
        </div>
        <button type="button" onClick={() => { setPromptToEdit(null); setIsCreatePromptOpen(true) }}>Create Prompt</button>
      </div>

      <section className="prompt-library-section" aria-labelledby="prompt-library-filters-heading">
        <h3 id="prompt-library-filters-heading">Search and Filters</h3>
        <PromptLibraryFilters
          categories={categories}
          category={category}
          isCategoriesError={isCategoriesError}
          isCategoriesPending={isCategoriesPending}
          isFavorite={isFavorite}
          isTemplate={isTemplate}
          search={search}
          onCategoryChange={resetPageAndSetCategory}
          onFavoriteChange={resetPageAndSetFavorite}
          onSearchChange={resetPageAndSetSearch}
          onTemplateChange={resetPageAndSetTemplate}
        />
      </section>

      <section className="prompt-library-section" aria-labelledby="prompt-library-content-heading">
        <h3 id="prompt-library-content-heading">Prompts</h3>
        <div aria-live="polite" aria-busy={isPending}>
          {isPending && <p>Loading prompts…</p>}
          {isError && <p className="error">We could not load prompts. Please try again.</p>}
          {data && <>
            <PromptList
              favoritePendingPromptId={setPromptFavorite.isPending ? setPromptFavorite.variables?.promptId : undefined}
              prompts={data.items}
              templatePendingPromptId={setPromptTemplate.isPending ? setPromptTemplate.variables?.promptId : undefined}
              onDelete={setPromptToDelete}
            onEdit={setPromptToEdit}
              onSetFavorite={(prompt) => setPromptFavorite.mutate({
                promptId: prompt.id,
                isFavorite: !prompt.is_favorite,
              })}
            onSetTemplate={(prompt) => setPromptTemplate.mutate({
              promptId: prompt.id,
              isTemplate: !prompt.is_template,
            })}
            onViewHistory={setPromptToViewHistory}
            />
            <PromptPagination promptPage={data} onPageChange={setPage} />
          </>}
        </div>
      </section>

      <PromptEditorModal
        isOpen={isCreatePromptOpen || promptToEdit !== null}
        onClose={closePromptEditor}
        promptToEdit={promptToEdit ?? undefined}
      />
      <DeletePromptModal
        isOpen={promptToDelete !== null}
        onClose={closeDeletePrompt}
        promptToDelete={promptToDelete ?? undefined}
      />
      <PromptVersionHistoryModal prompt={promptToViewHistory ?? undefined} onClose={() => setPromptToViewHistory(null)} />
    </section>
  )
}
