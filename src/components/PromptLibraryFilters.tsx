interface PromptLibraryFiltersProps {
  categories: string[]
  category: string
  isCategoriesError: boolean
  isCategoriesPending: boolean
  isFavorite: boolean | undefined
  isTemplate: boolean | undefined
  onCategoryChange: (category: string) => void
  onFavoriteChange: (isFavorite: boolean | undefined) => void
  onSearchChange: (search: string) => void
  onTemplateChange: (isTemplate: boolean | undefined) => void
  search: string
}

function booleanFilterValue(value: string): boolean | undefined {
  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  return undefined
}

function selectValue(value: boolean | undefined): string {
  return value === undefined ? 'all' : String(value)
}

export function PromptLibraryFilters({
  categories,
  category,
  isCategoriesError,
  isCategoriesPending,
  isFavorite,
  isTemplate,
  onCategoryChange,
  onFavoriteChange,
  onSearchChange,
  onTemplateChange,
  search,
}: PromptLibraryFiltersProps) {
  return (
    <div className="prompt-library-filters" aria-label="Prompt filters">
      <div>
        <label htmlFor="prompt-search">Search</label>
        <input
          id="prompt-search"
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search prompts..."
        />
      </div>

      <div>
        <label htmlFor="prompt-category-filter">Category</label>
        <select id="prompt-category-filter" value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="">All Categories</option>
          {isCategoriesPending && <option disabled>Loading categories…</option>}
          {categories.map((item) => <option value={item} key={item}>{item}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="prompt-favorite-filter">Favorite</label>
        <select
          id="prompt-favorite-filter"
          value={selectValue(isFavorite)}
          onChange={(event) => onFavoriteChange(booleanFilterValue(event.target.value))}
        >
          <option value="all">All</option>
          <option value="true">Favorites</option>
          <option value="false">Not Favorite</option>
        </select>
      </div>

      <div>
        <label htmlFor="prompt-template-filter">Template</label>
        <select
          id="prompt-template-filter"
          value={selectValue(isTemplate)}
          onChange={(event) => onTemplateChange(booleanFilterValue(event.target.value))}
        >
          <option value="all">All</option>
          <option value="true">Templates</option>
          <option value="false">Not Templates</option>
        </select>
      </div>

      {isCategoriesError && <p className="error">We could not load categories. You can still search and filter prompts.</p>}
    </div>
  )
}
