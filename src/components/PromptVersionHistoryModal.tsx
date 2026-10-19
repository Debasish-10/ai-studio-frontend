import { usePromptVersions } from '../hooks/usePromptVersions'
import type { Prompt, PromptVersion } from '../types/promptLibrary'

interface PromptVersionHistoryModalProps {
  onClose: () => void
  prompt?: Prompt
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)

  return Number.isNaN(date.getTime()) ? timestamp : date.toLocaleString()
}

function VersionSnapshot({ isLatest, version }: { isLatest: boolean; version: PromptVersion }) {
  return (
    <article className="prompt-version-card">
      <div className="prompt-version-heading">
        <h3>Version {version.version}</h3>
        {isLatest && <span className="prompt-library-status latest">Latest</span>}
      </div>
      <p className="preview-note">Created {formatTimestamp(version.created_at)}</p>
      <pre>{version.content}</pre>
    </article>
  )
}

export function PromptVersionHistoryModal({ onClose, prompt }: PromptVersionHistoryModalProps) {
  const { data: versions, isError, isPending } = usePromptVersions(prompt?.id)

  if (!prompt) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal version-history-modal" role="dialog" aria-modal="true" aria-labelledby="version-history-heading">
        <div className="modal-heading">
          <div>
            <h2 id="version-history-heading">Version History — {prompt.title}</h2>
            <p className="preview-note">Read-only snapshots, newest first.</p>
          </div>
          <button type="button" className="secondary-button" onClick={onClose}>Close</button>
        </div>

        <div className="version-history-content" aria-live="polite" aria-busy={isPending}>
          {isPending && <p>Loading version history…</p>}
          {isError && <p className="error">We could not load version history. Please try again.</p>}
          {versions?.length === 0 && <p>No version history is available for this prompt.</p>}
          {versions?.map((version, index) => <VersionSnapshot isLatest={index === 0} key={version.id} version={version} />)}
        </div>
      </section>
    </div>
  )
}
