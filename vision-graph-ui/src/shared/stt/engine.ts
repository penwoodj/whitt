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
    state = 'listening'
    logger.debug('SttEngine started', capabilities)

    eventCallback?.({ type: 'progress', stage: 'loading', progress: 0 })
    await new Promise(resolve => setTimeout(resolve, 100))
    eventCallback?.({ type: 'progress', stage: 'decoding', progress: 0.5 })
    await new Promise(resolve => setTimeout(resolve, 100))
    eventCallback?.({ type: 'progress', stage: 'transcribing', progress: 1 })

    state = 'idle'
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
