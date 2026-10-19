import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { GeneratedImage } from './GeneratedImage'

describe('GeneratedImage', () => {
  it('renders the backend Base64 payload with its returned MIME type', () => {
    const output = renderToStaticMarkup(
      <GeneratedImage
        image={{ image_base64: 'aW1hZ2UtYnl0ZXM=', mime_type: 'image/png' }}
        prompt="A red kite"
      />,
    )

    expect(output).toContain('src="data:image/png;base64,aW1hZ2UtYnl0ZXM="')
    expect(output).toContain('alt="Generated image for: A red kite"')
  })
})
