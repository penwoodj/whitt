import { BrowserWhisper } from 'browser-whisper'
import type { ASRModel, TranscribeOptions } from 'browser-whisper'
import type { LocalSttEngine, LocalSttCapabilities } from './LocalSttEngine'
import type { LocalSttSegment } from './speechTypes'

export type BrowserWhisperConfig = {
  model?: ASRModel
  quantization?: TranscribeOptions['quantization']
  language?: string
}

const detectCapabilities = (): LocalSttCapabilities => {
  const webgpu = typeof navigator !== 'undefined' && 'gpu' in navigator
  const mic = typeof navigator !== 'undefined' && 'mediaDevices' in navigator
  const secureContext = typeof window !== 'undefined' && window.isSecureContext
  const opfsCache = typeof navigator !== 'undefined' && 'storage' in navigator && 'getDirectory' in navigator.storage
  return { supported: mic && secureContext, webgpu, fallback: webgpu ? 'webgpu' : 'wasm', mic, secureContext, opfsCache }
}

export const createLocalSttEngine = (config: BrowserWhisperConfig = {}): LocalSttEngine => {
  const whisper = new BrowserWhisper({ model: config.model ?? 'whisper-tiny', quantization: config.quantization ?? 'hybrid', language: config.language })
  const capabilities = detectCapabilities()
  let state: LocalSttEngine['getState'] extends () => infer State ? State : never = 'idle'
  let stream: ReturnType<BrowserWhisper['transcribePCM']> | null = null

  const start = async (previous?: LocalSttEngine, stream?: MediaStream): Promise<void> => {
    if (previous) previous.cancel()
    if (!capabilities.supported) {
      state = 'error'
      throw new Error(!capabilities.mic ? 'No microphone detected' : 'Insecure context: requires HTTPS or localhost')
    }
    try {
      if (!stream) await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (error) {
      state = 'error'
      const message = error instanceof Error ? error.message : 'Microphone access denied'
      throw new Error(`Permission denied: ${message}`)
    }
    state = 'listening'
  }

  const preloadModel = async (): Promise<void> => {
    await whisper.downloadModel({ model: config.model ?? 'whisper-tiny', quantization: config.quantization ?? 'hybrid' })
  }

  const transcribePCM = async function* (samples: Float32Array): AsyncIterable<LocalSttSegment> {
    state = 'processing'
    stream = whisper.transcribePCM(samples, { model: config.model ?? 'whisper-tiny', quantization: config.quantization ?? 'hybrid', language: config.language })
    for await (const segment of stream) {
      yield { text: segment.text, start: segment.start, end: segment.end }
    }
    state = 'stopped'
  }

  const cancel = (): void => {
    stream?.cancel()
    stream = null
    state = 'stopped'
  }

  const dispose = (): void => {
    cancel()
    whisper.dispose()
  }

  return {
    start,
    preloadModel,
    transcribePCM,
    cancel,
    dispose,
    getState: () => state,
    getCapabilities: () => capabilities,
  }
}
