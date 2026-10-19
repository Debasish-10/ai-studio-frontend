import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { PromptLibraryFilters } from './PromptLibraryFilters'

describe('PromptLibraryFilters', () => {
  it('renders search and composable filter controls', () => {
    const output = renderToStaticMarkup(
      <PromptLibraryFilters
        categories={['coding', 'writing']}
        category="coding"
        isCategoriesError={false}
        isCategoriesPending={false}
        isFavorite={true}
        isTemplate={false}
        search="react"
        onCategoryChange={vi.fn()}
        onFavoriteChange={vi.fn()}
        onSearchChange={vi.fn()}
        onTemplateChange={vi.fn()}
      />,
    )

    expect(output).toContain('placeholder="Search prompts..."')
    expect(output).toContain('All Categories')
    expect(output).toContain('value="coding" selected=""')
    expect(output).toContain('Favorites')
    expect(output).toContain('Not Favorite')
    expect(output).toContain('Templates')
    expect(output).toContain('Not Templates')
  })
})
