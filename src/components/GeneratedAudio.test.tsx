import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { GeneratedAudio } from './GeneratedAudio'

describe('GeneratedAudio', () => {
  it('renders a browser-playable source using the returned Base64 payload and MIME type', () => {
    const output = renderToStaticMarkup(
      <GeneratedAudio audio={{ audio_base64: 'YXVkaW8tYnl0ZXM=', mime_type: 'audio/wav' }} />,
    )

    expect(output).toContain('<audio class="generated-audio" controls="" aria-label="Generated audio">')
    expect(output).toContain('src="data:audio/wav;base64,YXVkaW8tYnl0ZXM="')
    expect(output).toContain('type="audio/wav"')
  })
})
