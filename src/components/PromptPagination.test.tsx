import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { PromptPagination } from './PromptPagination'

describe('PromptPagination', () => {
  it('renders the visible range and enables both page controls when applicable', () => {
    const output = renderToStaticMarkup(
      <PromptPagination
        onPageChange={vi.fn()}
        promptPage={{ items: [], page: 2, page_size: 20, total: 45, total_pages: 3 }}
      />,
    )

    expect(output).toContain('Showing 21–40 of 45 prompts')
    expect(output).toContain('Page 2 of 3')
    expect(output).toContain('Previous')
    expect(output).toContain('Next')
    expect(output).not.toContain('disabled=""')
  })

  it('hides pagination for an empty result set', () => {
    const output = renderToStaticMarkup(
      <PromptPagination
        onPageChange={vi.fn()}
        promptPage={{ items: [], page: 1, page_size: 20, total: 0, total_pages: 0 }}
      />,
    )

    expect(output).toBe('')
  })
})
