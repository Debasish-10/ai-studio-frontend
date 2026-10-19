import type { Prompt } from '../types/promptLibrary'

interface PromptListProps {
  favoritePendingPromptId?: string
  onDelete: (prompt: Prompt) => void
  onEdit: (prompt: Prompt) => void
  onSetFavorite: (prompt: Prompt) => void
  onSetTemplate: (prompt: Prompt) => void
  onViewHistory: (prompt: Prompt) => void
  prompts: Prompt[]
  templatePendingPromptId?: string
}

export function PromptList({
  favoritePendingPromptId,
  onDelete,
  onEdit,
  onSetFavorite,
  onSetTemplate,
  onViewHistory,
  prompts,
  templatePendingPromptId,
}: PromptListProps) {
  if (prompts.length === 0) {
    return <p>No prompts have been saved yet.</p>
  }

  return (
    <div className="prompt-list">
      {prompts.map((prompt) => (
        <article className="prompt-list-item" key={prompt.id}>
          <div className="prompt-list-item-heading">
            <h4>{prompt.title}</h4>
            <div className="prompt-list-item-controls">
              {(prompt.is_favorite || prompt.is_template) && <div className="prompt-library-statuses">
                {prompt.is_favorite && <span className="prompt-library-status favorite">Favorite</span>}
                {prompt.is_template && <span className="prompt-library-status template">Template</span>}
              </div>}
              <button
                type="button"
                className={prompt.is_favorite ? 'favorite-button is-favorite' : 'favorite-button'}
                aria-label={prompt.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                aria-pressed={prompt.is_favorite}
                disabled={favoritePendingPromptId === prompt.id}
                onClick={() => onSetFavorite(prompt)}
              >
                {prompt.is_favorite ? '★' : '☆'}
              </button>
            </div>
          </div>
          {prompt.description && <p>{prompt.description}</p>}
          <div className="prompt-list-item-metadata">
            <span className="prompt-category-badge">Category: {prompt.category}</span>
          </div>
          <div className="prompt-list-item-actions">
            <button type="button" className="secondary-button" onClick={() => onEdit(prompt)}>Edit</button>
            <button type="button" className="secondary-button" onClick={() => onViewHistory(prompt)}>History</button>
            <button type="button" className="secondary-button" onClick={() => onSetTemplate(prompt)} disabled={templatePendingPromptId === prompt.id}>
              {prompt.is_template ? 'Remove template' : 'Mark as template'}
            </button>
            <button type="button" className="remove-button" onClick={() => onDelete(prompt)}>Delete</button>
          </div>
        </article>
      ))}
    </div>
  )
}
