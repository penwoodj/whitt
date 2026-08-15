import { log } from '../logger'
import type { SttEngine, SttEvent, SttState, SttCapabilities } from './types'

const logger = log('SttEngine')

const detectCapabilities = (): SttCapabilities => {
  const webgpu = typeof navigator !== 'undefined' && 'gpu' in navigator
  const fallback: 'webgpu' | 'wasm' | 'none' = webgpu ? 'webgpu' : 'wasm'
  const mic = typeof navigator !== 'undefined' && 'mediaDevices' in navigator
  const secureContext = typeof window !== 'undefined' && window.isSecureContext
  const opfsCache = typeof window !== 'undefined' && 'storage' in navigator && 'getDirectory' in navigator.storage

  return {
    webgpu,
    fallback,
    mic,
    secureContext,
    opfsCache,
  }
}

export const createEngine = (): SttEngine => {
  let state: SttState = 'idle'
  let eventCallback: ((evt: SttEvent) => void) | null = null
  const capabilities = detectCapabilities()

  const start = async (): Promise<void> => {
    try {
      state = 'listening'
      logger.debug('SttEngine started', capabilities)

      if (!capabilities.secureContext) {
        throw new Error('Insecure context: requires HTTPS or localhost')
      }

      eventCallback?.({ type: 'progress', stage: 'loading', progress: 0 })

      if (capabilities.mic) {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true })
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Microphone access denied'
          throw new Error(`Permission denied: ${errorMsg}`)
        }
      } else {
        throw new Error('No microphone detected')
      }

      eventCallback?.({ type: 'progress', stage: 'decoding', progress: 0.5 })
      await new Promise(resolve => setTimeout(resolve, 100))
      eventCallback?.({ type: 'progress', stage: 'transcribing', progress: 1 })

      state = 'idle'
    } catch (error) {
      state = 'error'
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      eventCallback?.({ type: 'error', error: errorMsg })
      logger.error('SttEngine failed', errorMsg)
      throw error
    }
  }

  const stop = async (): Promise<void> => {
    state = 'stopped'
    logger.debug('SttEngine stopped')
  }

  const on = (callback: (event: SttEvent) => void): void => {
    eventCallback = callback
  }

  const getState = (): SttState => state

  const getCapabilities = (): SttCapabilities => capabilities

  return { start, stop, on, getState, getCapabilities }
}
