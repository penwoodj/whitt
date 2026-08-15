import { log } from '../../../shared/logger'
import type { SttEngine, SttEvent, SttState } from '../../../shared/stt/types'

const logger = log('FakeSttEngine')

const createFakeSttEngine = (scriptedText: string[]): SttEngine => {
  let state: SttState = 'idle'
  let eventCallback: ((evt: SttEvent) => void) | null = null
  let timeoutIds: ReturnType<typeof setTimeout>[] = []

  const start = async (): Promise<void> => {
    state = 'listening'
    logger.debug('FakeSttEngine started')

    let currentText = ''
    for (const word of scriptedText) {
      currentText = currentText ? `${currentText} ${word}` : word

      if (eventCallback) {
        eventCallback({ type: 'interim', text: currentText })
      }

      await new Promise<void>((resolve) => {
        const id = setTimeout(() => resolve(), 10)
        timeoutIds.push(id)
      })
    }

    if (eventCallback && currentText) {
      eventCallback({ type: 'final', text: currentText })
    }

    state = 'idle'
  }

  const stop = async (): Promise<void> => {
    state = 'stopped'
    timeoutIds.forEach((id) => clearTimeout(id))
    timeoutIds = []
    logger.debug('FakeSttEngine stopped')
  }

  const on = (callback: (event: SttEvent) => void): void => {
    eventCallback = callback
  }

  const getState = (): SttState => state

  return { start, stop, on, getState }
}

export { createFakeSttEngine }