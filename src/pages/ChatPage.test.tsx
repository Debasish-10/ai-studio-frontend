import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ChatPage } from './ChatPage'

describe('ChatPage', () => {
  it('offers feature tabs and opens normal streaming chat by default', () => {
    const page = renderToStaticMarkup(<ChatPage />)

    expect(page).toContain('role="tablist"')
    expect(page).toContain('id="chat-tab"')
    expect(page).toContain('id="tools-tab"')
    expect(page).toContain('id="image-tab"')
    expect(page).toContain('id="audio-tab"')
    expect(page).toContain('aria-selected="true"')
    expect(page).toContain('Normal chat (streaming)')
    expect(page).toContain('<option value="json">JSON</option>')
    expect(page).toContain('<option value="markdown">Markdown</option>')
    expect(page).toContain('<option value="table">Table</option>')
    expect(page).toContain('<option value="email">Email</option>')
    expect(page).toContain('<option value="html">HTML</option>')
  })

  it('keeps the tool, image, and audio feature panels available through tabs', () => {
    const page = renderToStaticMarkup(<ChatPage />)

    expect(page).toContain('Tool Calling')
    expect(page).toContain('Image Generation')
    expect(page).toContain('Audio Generation')
  })
})
