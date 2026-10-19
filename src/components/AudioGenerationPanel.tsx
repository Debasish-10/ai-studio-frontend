import { type FormEvent, useState } from 'react'
import { generateAudio } from '../services/api'
import type { AudioGenerationResponse } from '../types/api'
import { GeneratedAudio } from './GeneratedAudio'

interface AudioGenerationPanelProps {
  hidden: boolean
}

export function AudioGenerationPanel({ hidden }: AudioGenerationPanelProps) {
  const [text, setText] = useState('')
  const [audio, setAudio] = useState<AudioGenerationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedText = text.trim()
    if (isGenerating || !trimmedText) {
      if (!isGenerating) setError('Enter text before generating audio.')
      return
    }

    setIsGenerating(true)
    setError(null)
    setAudio(null)
    try {
      setAudio(await generateAudio({ text: trimmedText }))
    } catch {
      setError('We could not generate audio. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section className="feature-tab-panel audio-generation-demo" id="audio-panel" role="tabpanel" aria-labelledby="audio-tab" hidden={hidden}>
      <div className="section-heading"><div><p className="eyebrow">Demo</p><h3>Audio Generation</h3></div><p>Convert text to speech with the connected backend.</p></div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="audio-text">Text to Speech</label>
        <textarea id="audio-text" value={text} onChange={(event) => setText(event.target.value)} placeholder="Enter the text you want to hear." maxLength={4000} disabled={isGenerating} />
        <button type="submit" disabled={isGenerating || !text.trim()}>{isGenerating ? 'Generating audio…' : 'Generate audio'}</button>
      </form>
      <div className="audio-response" aria-live="polite" aria-busy={isGenerating}>
        {isGenerating && <p>Generating your audio…</p>}
        {error && <p className="error">{error}</p>}
        {audio && <GeneratedAudio audio={audio} />}
        {!isGenerating && !error && !audio && <p>Your generated audio will appear here.</p>}
      </div>
    </section>
  )
}
