import { type FormEvent, useState } from 'react'
import { generateImage } from '../services/api'
import type { ImageGenerationResponse } from '../types/api'
import { GeneratedImage } from './GeneratedImage'

interface ImageGenerationPanelProps {
  hidden: boolean
}

export function ImageGenerationPanel({ hidden }: ImageGenerationPanelProps) {
  const [prompt, setPrompt] = useState('')
  const [image, setImage] = useState<ImageGenerationResponse | null>(null)
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedPrompt = prompt.trim()
    if (isGenerating || !trimmedPrompt) {
      if (!isGenerating) setError('Enter an image prompt before generating.')
      return
    }

    setIsGenerating(true)
    setError(null)
    setImage(null)
    try {
      setImage(await generateImage({ prompt: trimmedPrompt }))
      setGeneratedPrompt(trimmedPrompt)
    } catch {
      setError('We could not generate an image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section className="feature-tab-panel image-generation-demo" id="image-panel" role="tabpanel" aria-labelledby="image-tab" hidden={hidden}>
      <div className="section-heading"><div><p className="eyebrow">Demo</p><h3>Image Generation</h3></div><p>Generate one image from a prompt with the connected backend.</p></div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="image-prompt">Image Prompt</label>
        <textarea id="image-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Describe the image you want to generate." maxLength={4000} disabled={isGenerating} />
        <button type="submit" disabled={isGenerating || !prompt.trim()}>{isGenerating ? 'Generating image…' : 'Generate image'}</button>
      </form>
      <div className="image-response" aria-live="polite" aria-busy={isGenerating}>
        {isGenerating && <p>Generating your image…</p>}
        {error && <p className="error">{error}</p>}
        {image && <GeneratedImage image={image} prompt={generatedPrompt} />}
        {!isGenerating && !error && !image && <p>Your generated image will appear here.</p>}
      </div>
    </section>
  )
}
