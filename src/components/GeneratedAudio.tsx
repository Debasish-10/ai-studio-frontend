import type { AudioGenerationResponse } from '../types/api'

interface GeneratedAudioProps {
  audio: AudioGenerationResponse
}

export function GeneratedAudio({ audio }: GeneratedAudioProps) {
  return (
    <audio className="generated-audio" controls aria-label="Generated audio">
      <source src={`data:${audio.mime_type};base64,${audio.audio_base64}`} type={audio.mime_type} />
      Your browser does not support audio playback.
    </audio>
  )
}
