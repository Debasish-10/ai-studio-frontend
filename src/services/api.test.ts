import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  generateAudio,
  generateImage,
  sendFormattedChatMessage,
  sendToolChatMessage,
  streamChatMessage,
} from './api'

describe('sendFormattedChatMessage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('posts the selected output format to the formatted chat endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      output_format: 'json',
      content: { answer: 'Structured response' },
    }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(sendFormattedChatMessage({
      message: 'Summarize this',
      history: [],
      temperature: 0.5,
      output_format: 'json',
    })).resolves.toEqual({
      output_format: 'json',
      content: { answer: 'Structured response' },
    })

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/chat/formatted', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Summarize this',
        history: [],
        temperature: 0.5,
        output_format: 'json',
      }),
    })
  })
})

describe('sendToolChatMessage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('posts a tool request and returns the backend-controlled final response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      message: 'The sum is 5.',
      tool_name: 'add_numbers',
    }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(sendToolChatMessage({
      message: 'What is 2 plus 3?',
      history: [],
      temperature: 1,
    })).resolves.toEqual({
      message: 'The sum is 5.',
      tool_name: 'add_numbers',
    })

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/chat/tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What is 2 plus 3?',
        history: [],
        temperature: 1,
      }),
    })
  })
})

describe('generateImage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('posts an image prompt and returns the backend image payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      image_base64: 'aW1hZ2UtYnl0ZXM=',
      mime_type: 'image/png',
    }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(generateImage({ prompt: 'A red kite' })).resolves.toEqual({
      image_base64: 'aW1hZ2UtYnl0ZXM=',
      mime_type: 'image/png',
    })

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/images/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'A red kite' }),
    })
  })
})

describe('generateAudio', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('posts text and returns the backend audio payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      audio_base64: 'YXVkaW8tYnl0ZXM=',
      mime_type: 'audio/wav',
    }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(generateAudio({ text: 'Hello, world.' })).resolves.toEqual({
      audio_base64: 'YXVkaW8tYnl0ZXM=',
      mime_type: 'audio/wav',
    })

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/audio/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Hello, world.' }),
    })
  })

  it('returns a clear retryable error for an unsuccessful backend response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })))

    await expect(generateAudio({ text: 'Hello, world.' })).rejects.toThrow(
      'Request failed (503). Please try again.',
    )
  })
})

describe('streamChatMessage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('keeps the normal chat stream endpoint and yields every response chunk', async () => {
    const encoder = new TextEncoder()
    const fetchMock = vi.fn().mockResolvedValue(new Response(new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('Hello '))
        controller.enqueue(encoder.encode('there'))
        controller.close()
      },
    }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const chunks: string[] = []

    for await (const chunk of streamChatMessage({
      message: 'Hi',
      history: [],
      temperature: 1,
    })) {
      chunks.push(chunk)
    }

    expect(chunks).toEqual(['Hello ', 'there'])
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hi', history: [], temperature: 1 }),
    })
  })
})
