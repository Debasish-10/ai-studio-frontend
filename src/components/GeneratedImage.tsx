import type { ImageGenerationResponse } from '../types/api'

interface GeneratedImageProps {
  image: ImageGenerationResponse
  prompt: string
}

export function GeneratedImage({ image, prompt }: GeneratedImageProps) {
  return (
    <img
      className="generated-image"
      src={`data:${image.mime_type};base64,${image.image_base64}`}
      alt={`Generated image for: ${prompt}`}
    />
  )
}
