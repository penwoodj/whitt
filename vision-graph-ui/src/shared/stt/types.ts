export type SttEvent =
  | { type: 'interim'; text: string }
  | { type: 'final'; text: string }
  | { type: 'error'; error: string }

export type SttState = 'idle' | 'listening' | 'processing' | 'stopped' | 'error'

export interface SttEngine {
  start: () => Promise<void>
  stop: () => Promise<void>
  on: (callback: (event: SttEvent) => void) => void
  getState: () => SttState
}
