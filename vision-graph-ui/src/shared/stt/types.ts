export type SttEvent =
  | { type: 'interim'; text: string }
  | { type: 'final'; text: string }
  | { type: 'error'; error: string }
  | { type: 'progress'; stage: 'loading' | 'decoding' | 'transcribing' | 'done'; progress: number }

export type SttState = 'idle' | 'listening' | 'processing' | 'stopped' | 'error'

export interface SttCapabilities {
  webgpu: boolean
  fallback: 'webgpu' | 'wasm' | 'none'
  mic: boolean
  secureContext: boolean
  opfsCache: boolean
}

export interface SttEngine {
  start: () => Promise<void>
  stop: () => Promise<void>
  on: (callback: (event: SttEvent) => void) => void
  getState: () => SttState
  getCapabilities: () => SttCapabilities
}
