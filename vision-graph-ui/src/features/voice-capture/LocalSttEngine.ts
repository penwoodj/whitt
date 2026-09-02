import type { LocalSttSegment } from './speechTypes'

export type LocalSttCapabilities = {
  supported: boolean
  webgpu: boolean
  fallback: 'webgpu' | 'wasm' | 'none'
  mic: boolean
  secureContext: boolean
  opfsCache: boolean
}

export type LocalSttEngine = {
  start: (previous?: LocalSttEngine, stream?: MediaStream) => Promise<void>
  preloadModel: () => Promise<void>
  transcribePCM: (samples: Float32Array) => AsyncIterable<LocalSttSegment>
  cancel: () => void
  dispose: () => void
  getState: () => 'idle' | 'listening' | 'processing' | 'stopped' | 'error'
  getCapabilities: () => LocalSttCapabilities
}

export type FakeLocalSttEngine = LocalSttEngine & {
  readAmplitude: () => number[]
  cleanupCount: () => number
}

export type FakeLocalSttConfig = {
  segments: LocalSttSegment[]
  amplitude?: number[]
  error?: string
}

export const createFakeLocalSttEngine = (config: FakeLocalSttConfig): FakeLocalSttEngine => {
  let state: LocalSttEngine['getState'] extends () => infer State ? State : never = 'idle'
  let cleanupTotal = 0
  const capabilities: LocalSttCapabilities = {
    supported: true,
    webgpu: false,
    fallback: 'wasm',
    mic: true,
    secureContext: true,
    opfsCache: false,
  }

  const start = async (previous?: LocalSttEngine, _stream?: MediaStream): Promise<void> => {
    if (previous) {
      previous.cancel()
    }
    state = 'listening'
  }

  const preloadModel = async (): Promise<void> => undefined

  const transcribePCM = async function* (_samples: Float32Array): AsyncIterable<LocalSttSegment> {
    state = 'processing'
    if (config.error) {
      state = 'error'
      throw new Error(config.error)
    }
    state = 'stopped'
    yield* config.segments
  }

  const cancel = (): void => {
    state = 'stopped'
    cleanupTotal += 1
  }

  const dispose = (): void => {
    state = 'stopped'
    cleanupTotal += 1
  }

  return {
    start,
    preloadModel,
    transcribePCM,
    cancel,
    dispose,
    getState: () => state,
    getCapabilities: () => capabilities,
    readAmplitude: () => [...(config.amplitude ?? [])],
    cleanupCount: () => cleanupTotal,
  }
}
