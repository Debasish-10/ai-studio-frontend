import { useDeletePrompt } from '../hooks/useDeletePrompt'
import type { Prompt } from '../types/promptLibrary'

interface DeletePromptModalProps {
  isOpen: boolean
  onClose: () => void
  promptToDelete?: Prompt
}

export function DeletePromptModal({ isOpen, onClose, promptToDelete }: DeletePromptModalProps) {
  const deletePrompt = useDeletePrompt()

  function resetAndClose() {
    deletePrompt.reset()
    onClose()
  }

  function closeModal() {
    if (!deletePrompt.isPending) {
      resetAndClose()
    }
  }

  if (!isOpen || !promptToDelete) {
    return null
  }

  const apiError = deletePrompt.error instanceof Error
    ? deletePrompt.error.message
    : 'We could not delete the prompt. Please try again.'

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="delete-prompt-heading">
        <div className="modal-heading">
          <div>
            <h2 id="delete-prompt-heading">Delete Prompt?</h2>
            <p className="preview-note"><strong>{promptToDelete.title}</strong> will be permanently deleted along with its version history.</p>
          </div>
          <button type="button" className="secondary-button" onClick={closeModal} disabled={deletePrompt.isPending}>Close</button>
        </div>

        <div className="modal-actions confirmation-modal-actions" aria-live="polite">
          {deletePrompt.isError && <p className="error">{apiError}</p>}
          <button type="button" className="secondary-button" onClick={closeModal} disabled={deletePrompt.isPending}>Cancel</button>
          <button type="button" className="remove-button" onClick={() => deletePrompt.mutate(promptToDelete.id, { onSuccess: resetAndClose })} disabled={deletePrompt.isPending}>
            {deletePrompt.isPending ? 'Deleting Prompt…' : 'Delete Prompt'}
          </button>
        </div>
      </section>
    </div>
  )
}
