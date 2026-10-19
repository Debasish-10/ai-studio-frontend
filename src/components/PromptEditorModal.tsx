import { type FormEvent, useEffect, useState } from 'react'
import { useCreatePrompt } from '../hooks/useCreatePrompt'
import { useUpdatePrompt } from '../hooks/useUpdatePrompt'
import type { Prompt, PromptCreate } from '../types/promptLibrary'

interface PromptEditorModalProps {
  isOpen: boolean
  onClose: () => void
  promptToEdit?: Prompt
}

type PromptFormValues = Required<Omit<PromptCreate, 'description'>> & { description: string }

const initialPrompt: PromptFormValues = {
  title: '',
  content: '',
  description: '',
  category: 'general',
  is_favorite: false,
  is_template: false,
}

function formValuesFor(prompt: Prompt | undefined): PromptFormValues {
  if (!prompt) {
    return initialPrompt
  }

  return {
    title: prompt.title,
    content: prompt.content,
    description: prompt.description ?? '',
    category: prompt.category,
    is_favorite: prompt.is_favorite,
    is_template: prompt.is_template,
  }
}

export function PromptEditorModal({ isOpen, onClose, promptToEdit }: PromptEditorModalProps) {
  const [prompt, setPrompt] = useState<PromptFormValues>(initialPrompt)
  const [validationError, setValidationError] = useState<string | null>(null)
  const createPrompt = useCreatePrompt()
  const updatePrompt = useUpdatePrompt()
  const isEditing = Boolean(promptToEdit)
  const isSaving = createPrompt.isPending || updatePrompt.isPending

  useEffect(() => {
    if (isOpen) {
      setPrompt(formValuesFor(promptToEdit))
      setValidationError(null)
    }
  }, [isOpen, promptToEdit])

  function resetFormAndClose() {
    setPrompt(initialPrompt)
    setValidationError(null)
    createPrompt.reset()
    updatePrompt.reset()
    onClose()
  }

  function closeModal() {
    if (!isSaving) {
      resetFormAndClose()
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!prompt.title.trim() || !prompt.content.trim() || !prompt.category.trim()) {
      setValidationError('Add a title, content, and category before saving the prompt.')
      return
    }

    const payload: Required<PromptCreate> = {
      title: prompt.title.trim(),
      content: prompt.content,
      description: prompt.description.trim() || null,
      category: prompt.category.trim(),
      is_favorite: prompt.is_favorite,
      is_template: prompt.is_template,
    }

    setValidationError(null)

    if (promptToEdit) {
      updatePrompt.mutate({ promptId: promptToEdit.id, payload }, { onSuccess: resetFormAndClose })
      return
    }

    createPrompt.mutate(payload, { onSuccess: resetFormAndClose })
  }

  if (!isOpen) {
    return null
  }

  const activeError = isEditing ? updatePrompt.error : createPrompt.error
  const apiError = activeError instanceof Error
    ? activeError.message
    : `We could not ${isEditing ? 'save changes to' : 'create'} the prompt. Please try again.`
  const actionLabel = isEditing ? 'Save Changes' : 'Create Prompt'

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="prompt-editor-heading">
        <div className="modal-heading">
          <div>
            <h2 id="prompt-editor-heading">{isEditing ? 'Edit Prompt' : 'Create Prompt'}</h2>
            <p className="preview-note">{isEditing ? 'Update this saved prompt.' : 'Save a prompt to reuse later.'}</p>
          </div>
          <button type="button" className="secondary-button" onClick={closeModal} disabled={isSaving}>Close</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="prompt-title">Title</label>
          <input id="prompt-title" type="text" value={prompt.title} onChange={(event) => setPrompt({ ...prompt, title: event.target.value })} disabled={isSaving} />

          <label htmlFor="prompt-content">Content</label>
          <textarea id="prompt-content" value={prompt.content} onChange={(event) => setPrompt({ ...prompt, content: event.target.value })} disabled={isSaving} />

          <label htmlFor="prompt-description">Description</label>
          <textarea id="prompt-description" value={prompt.description} onChange={(event) => setPrompt({ ...prompt, description: event.target.value })} disabled={isSaving} />

          <label htmlFor="prompt-category">Category</label>
          <input id="prompt-category" type="text" value={prompt.category} onChange={(event) => setPrompt({ ...prompt, category: event.target.value })} disabled={isSaving} />

          <div className="prompt-form-options">
            <label><input type="checkbox" checked={prompt.is_favorite} onChange={(event) => setPrompt({ ...prompt, is_favorite: event.target.checked })} disabled={isSaving} /> Favorite</label>
            <label><input type="checkbox" checked={prompt.is_template} onChange={(event) => setPrompt({ ...prompt, is_template: event.target.checked })} disabled={isSaving} /> Reusable template</label>
          </div>

          <div aria-live="polite">
            {validationError && <p className="error">{validationError}</p>}
            {(createPrompt.isError || updatePrompt.isError) && <p className="error">{apiError}</p>}
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={closeModal} disabled={isSaving}>Cancel</button>
            <button type="submit" disabled={isSaving}>{isSaving ? `${isEditing ? 'Saving Changes' : 'Creating Prompt'}…` : actionLabel}</button>
          </div>
        </form>
      </section>
    </div>
  )
}
