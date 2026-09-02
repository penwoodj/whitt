import type { LocalSttEngine, LocalSttCapabilities } from './LocalSttEngine'
import type { LocalSttSegment } from './speechTypes'

export type LocalWhisperEndpointConfig = {
  url: string
}

const capabilities: LocalSttCapabilities = {
  supported: true,
  webgpu: false,
  fallback: 'none',
  mic: true,
  secureContext: true,
  opfsCache: false,
}

const isSegment = (value: unknown): value is LocalSttSegment => {
  if (typeof value !== 'object' || value === null) return false
  if (!('text' in value) || !('start' in value) || !('end' in value)) return false
  return typeof value.text === 'string' && typeof value.start === 'number' && typeof value.end === 'number'
}

export const createLocalWhisperEndpointAdapter = (config: LocalWhisperEndpointConfig): LocalSttEngine => {
  let state: LocalSttEngine['getState'] extends () => infer State ? State : never = 'idle'
  let abortController: AbortController | null = null

  const start = async (previous?: LocalSttEngine, _stream?: MediaStream): Promise<void> => {
    previous?.cancel()
    state = 'listening'
  }

  const preloadModel = async (): Promise<void> => undefined

  const transcribePCM = async function* (samples: Float32Array): AsyncIterable<LocalSttSegment> {
    state = 'processing'
    abortController = new AbortController()
    const response = await fetch(config.url, {
      method: 'POST',
      body: JSON.stringify(Array.from(samples)),
      signal: abortController.signal,
      headers: { 'Content-Type': 'application/octet-stream' },
    })
    if (!response.ok) {
      state = 'error'
      throw new Error(`Local STT endpoint failed: ${response.status}`)
    }
    const payload: unknown = await response.json()
    if (!Array.isArray(payload) || !payload.every(isSegment)) {
      state = 'error'
      throw new Error('Local STT endpoint returned invalid segments')
    }
    const segments = payload
    yield* segments
    state = 'stopped'
  }

  const cancel = (): void => {
    abortController?.abort()
    abortController = null
    state = 'stopped'
  }

  const dispose = (): void => {
    cancel()
  }

  return { start, preloadModel, transcribePCM, cancel, dispose, getState: () => state, getCapabilities: () => capabilities }
}
