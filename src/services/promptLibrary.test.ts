import { afterEach, describe, expect, it, vi } from 'vitest'
import { createPrompt, deletePrompt, getPromptCategories, getPromptVersions, getPrompts, setPromptFavorite, setPromptTemplate, updatePrompt } from './promptLibrary'
import type { PromptVersion } from '../types/promptLibrary'

describe('createPrompt', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('posts a new prompt and returns the created prompt', async () => {
    const prompt = {
      id: 'prompt-1',
      title: 'Release notes',
      content: 'Create release notes.',
      description: null,
      category: 'general',
      is_favorite: false,
      is_template: false,
      created_at: '2026-10-08T00:00:00Z',
      updated_at: '2026-10-08T00:00:00Z',
    }
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(prompt), { status: 201 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(createPrompt({
      title: 'Release notes',
      content: 'Create release notes.',
      description: null,
      category: 'general',
      is_favorite: false,
      is_template: false,
    })).resolves.toEqual(prompt)

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Release notes',
        content: 'Create release notes.',
        description: null,
        category: 'general',
        is_favorite: false,
        is_template: false,
      }),
    })
  })
})

describe('getPrompts', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests a filtered prompt page with the supported query parameters', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      items: [],
      page: 2,
      page_size: 10,
      total: 0,
      total_pages: 0,
    }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(getPrompts({
      search: 'react',
      category: 'coding',
      is_favorite: false,
      is_template: true,
      page: 2,
      page_size: 10,
    })).resolves.toMatchObject({ page: 2, page_size: 10 })

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/prompts?search=react&category=coding&is_favorite=false&is_template=true&page=2&page_size=10',
    )
  })
})

describe('updatePrompt', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('patches a prompt and returns the updated prompt', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 'prompt-1', title: 'Welcome' }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(updatePrompt('prompt-1', { title: 'Welcome' })).resolves.toEqual({ id: 'prompt-1', title: 'Welcome' })

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/prompts/prompt-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Welcome' }),
    })
  })
})

describe('getPromptCategories', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('gets the distinct prompt categories', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(['coding', 'general']), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(getPromptCategories()).resolves.toEqual(['coding', 'general'])

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/prompts/categories')
  })
})

describe('deletePrompt', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('deletes the selected prompt', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(deletePrompt('prompt-1')).resolves.toBeUndefined()

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/prompts/prompt-1', { method: 'DELETE' })
  })
})

describe('setPromptFavorite', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('uses the favorite endpoint to add a prompt to favorites', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 'prompt-1', is_favorite: true }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(setPromptFavorite('prompt-1', true)).resolves.toEqual({ id: 'prompt-1', is_favorite: true })

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/prompts/prompt-1/favorite', { method: 'PUT' })
  })

  it('uses the favorite endpoint to remove a prompt from favorites', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 'prompt-1', is_favorite: false }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(setPromptFavorite('prompt-1', false)).resolves.toEqual({ id: 'prompt-1', is_favorite: false })

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/prompts/prompt-1/favorite', { method: 'DELETE' })
  })
})

describe('setPromptTemplate', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('uses the template endpoint to mark a prompt as a template', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 'prompt-1', is_template: true }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(setPromptTemplate('prompt-1', true)).resolves.toEqual({ id: 'prompt-1', is_template: true })

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/prompts/prompt-1/template', { method: 'PUT' })
  })

  it('uses the template endpoint to remove template status', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 'prompt-1', is_template: false }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(setPromptTemplate('prompt-1', false)).resolves.toEqual({ id: 'prompt-1', is_template: false })

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/prompts/prompt-1/template', { method: 'DELETE' })
  })
})

describe('getPromptVersions', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('gets version history for the selected prompt', async () => {
    const versions: PromptVersion[] = [{
      id: 'version-2',
      prompt_id: 'prompt-1',
      version: 2,
      content: 'Updated content',
      created_at: '2026-10-08T00:00:00Z',
    }]
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(versions), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(getPromptVersions('prompt-1')).resolves.toEqual(versions)

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/prompts/prompt-1/versions')
  })
})
