import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { PromptList } from './PromptList'

describe('PromptList', () => {
  it('renders prompt metadata and status indicators', () => {
    const output = renderToStaticMarkup(
      <PromptList onDelete={vi.fn()} onEdit={vi.fn()} onSetFavorite={vi.fn()} onSetTemplate={vi.fn()} onViewHistory={vi.fn()} prompts={[{
        id: 'prompt-1',
        title: 'Release notes',
        content: 'Create release notes.',
        description: 'A concise release-note prompt.',
        category: 'writing',
        is_favorite: true,
        is_template: true,
        created_at: '2026-10-08T00:00:00Z',
        updated_at: '2026-10-08T00:00:00Z',
      }]} />,
    )

    expect(output).toContain('Release notes')
    expect(output).toContain('A concise release-note prompt.')
    expect(output).toContain('Category: writing')
    expect(output).toContain('Favorite')
    expect(output).toContain('Template')
    expect(output).toContain('Edit')
    expect(output).toContain('History')
    expect(output).toContain('Delete')
    expect(output).toContain('Remove template')
    expect(output).toContain('aria-label="Remove from favorites"')
    expect(output).toContain('★')
  })

  it('renders an empty state when there are no prompts', () => {
    const output = renderToStaticMarkup(<PromptList onDelete={vi.fn()} onEdit={vi.fn()} onSetFavorite={vi.fn()} onSetTemplate={vi.fn()} onViewHistory={vi.fn()} prompts={[]} />)

    expect(output).toContain('No prompts have been saved yet.')
  })
})
