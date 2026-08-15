// Adapted from: browser-whisper src/browser-whisper.ts
// Source: https://github.com/tanpreetjolly/browser-whisper/blob/main/src/browser-whisper.ts
// License: MIT — Copyright (c) 2024 Tanpreet Singh Jolly
// Changes: Wrapped in adapter interface, removed file transcribe (we use PCM only), added progress callback mapping

import { log } from '../logger'

const logger = log('BrowserWhisperAdapter')

export type WhisperModel = 'whisper-tiny' | 'whisper-base'

export interface WhisperOptions {
  model?: WhisperModel
  language?: string
  onProgress?: (stage: string, progress: number) => void
  onSegment?: (text: string, start: number, end: number) => void
}

export interface WhisperEngine {
  transcribePCM(samples: Float32Array, options: WhisperOptions): Promise<void>
  stop(): Promise<void>
}

export const createWhisperEngine = (): WhisperEngine => {
  logger.debug('BrowserWhisper adapter created (STUB - no real browser-whisper integration yet)')

  return {
    transcribePCM: async (samples: Float32Array, options: WhisperOptions = {}) => {
      logger.debug(`Transcribe PCM called with ${samples.length} samples`)
      options.onProgress?.('loading', 0)
      options.onProgress?.('decoding', 0.5)
      options.onProgress?.('transcribing', 1)
    },
    stop: async () => {
      logger.debug('Whisper engine stopped')
    },
  }
}
