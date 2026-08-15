import { log } from '../../../shared/logger'
import type { SttCapabilities, SttEngine, SttEvent, SttState } from '../../../shared/stt/types'

const logger = log('FakeSttEngine')

const INTERIM_MS = 10
const FINAL_MARGIN_MS = 30

const fakeCapabilities: SttCapabilities = {
  webgpu: false,
  fallback: 'wasm',
  mic: true,
  secureContext: true,
  opfsCache: false,
}

const createFakeSttEngine = (scriptedText: string[]): SttEngine => {
  let state: SttState = 'idle'
  let eventCallback: ((evt: SttEvent) => void) | null = null
  let timeoutIds: ReturnType<typeof setTimeout>[] = []

  const emit = (evt: SttEvent) => {
    if (eventCallback) {
      eventCallback(evt)
    }
  }

  const scheduleEmissions = () => {
    let currentText = ''

    for (let wordIdx = 0; wordIdx < scriptedText.length; wordIdx += 1) {
      const word = scriptedText[wordIdx]
      currentText = currentText ? `${currentText} ${word}` : word
      const interimTxt = currentText

      const interimId = setTimeout(() => {
        emit({ type: 'interim', text: interimTxt })
      }, INTERIM_MS * (wordIdx + 1))
      timeoutIds.push(interimId)
    }

    if (!currentText) {
      return
    }

    const finalId = setTimeout(() => {
      emit({ type: 'final', text: currentText })
      state = 'idle'
    }, INTERIM_MS * scriptedText.length + FINAL_MARGIN_MS)
    timeoutIds.push(finalId)
  }

  const start = async (): Promise<void> => {
    state = 'listening'
    logger.debug('FakeSttEngine started')
    scheduleEmissions()
  }

  const stop = async (): Promise<void> => {
    state = 'stopped'
    for (const id of timeoutIds) {
      clearTimeout(id)
    }
    timeoutIds = []
    logger.debug('FakeSttEngine stopped')
  }

  const on = (callback: (event: SttEvent) => void): void => {
    eventCallback = callback
  }

  const getState = (): SttState => state

  const getCapabilities = (): SttCapabilities => fakeCapabilities

  return { start, stop, on, getState, getCapabilities }
}

export { createFakeSttEngine }
