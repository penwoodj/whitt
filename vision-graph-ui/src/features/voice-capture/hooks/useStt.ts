import { useState, useEffect, useCallback, useRef } from 'react'
import { log } from '../../../shared/logger'
import type { SttEngine, SttEvent } from '../../../shared/stt/types'

const logger = log('useStt')

const useStt = (engine: SttEngine) => {
  const [interimTxt, setInterimTxt] = useState<string>('')
  const [finalTxt, setFinalTxt] = useState<string>('')
  const isListeningRef = useRef<boolean>(false)
  const eventCallbackRef = useRef<((evt: SttEvent) => void) | null>(null)

  useEffect(() => {
    eventCallbackRef.current = (evt: SttEvent) => {
      if (evt.type === 'interim') {
        setInterimTxt(evt.text)
      } else if (evt.type === 'final') {
        setFinalTxt((prev) => (prev ? `${prev} ${evt.text}` : evt.text))
        setInterimTxt('')
      }
    }

    engine.on(eventCallbackRef.current)
  }, [engine])

  const startRec = useCallback(async () => {
    if (isListeningRef.current) return

    isListeningRef.current = true
    logger.debug('Starting STT recording')

    await engine.start()
  }, [engine])

  const stopRec = useCallback(async () => {
    if (!isListeningRef.current) return

    isListeningRef.current = false
    logger.debug('Stopping STT recording')
    await engine.stop()
  }, [engine])

  return { interimTxt, finalTxt, startRec, stopRec }
}

export { useStt }
