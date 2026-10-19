import type { PromptPage } from '../types/promptLibrary'

interface PromptPaginationProps {
  onPageChange: (page: number) => void
  promptPage: PromptPage
}

export function PromptPagination({ onPageChange, promptPage }: PromptPaginationProps) {
  if (promptPage.total === 0) {
    return null
  }

  const firstPrompt = (promptPage.page - 1) * promptPage.page_size + 1
  const lastPrompt = Math.min(promptPage.page * promptPage.page_size, promptPage.total)
  const isFirstPage = promptPage.page === 1
  const isLastPage = promptPage.page >= promptPage.total_pages

  return (
    <nav className="prompt-pagination" aria-label="Prompt list pagination">
      <p className="preview-note">Showing {firstPrompt}–{lastPrompt} of {promptPage.total} prompts</p>
      <div className="prompt-pagination-controls">
        <button type="button" className="secondary-button" onClick={() => onPageChange(promptPage.page - 1)} disabled={isFirstPage}>
          Previous
        </button>
        <span>Page {promptPage.page} of {promptPage.total_pages}</span>
        <button type="button" className="secondary-button" onClick={() => onPageChange(promptPage.page + 1)} disabled={isLastPage}>
          Next
        </button>
      </div>
    </nav>
  )
}
