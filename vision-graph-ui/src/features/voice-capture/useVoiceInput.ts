import { useState, useCallback, useRef } from 'react'
import { log } from '../../shared/logger'
import type { SttEngine, SttEvent } from '../../shared/stt/types'

const logger = log('useVoiceInput')

const useVoiceInput = (engine: SttEngine) => {
  const [isRec, setIsRec] = useState<boolean>(false)
  const [interimTxt, setInterimTxt] = useState<string>('')
  const [finalTxt, setFinalTxt] = useState<string>('')
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false)
  const isListeningRef = useRef<boolean>(false)

  const handleSttEvent = useCallback((evt: SttEvent) => {
    if (evt.type === 'interim') {
      setInterimTxt(evt.text)
    } else if (evt.type === 'final') {
      setFinalTxt((prev) => (prev ? `${prev} ${evt.text}` : evt.text))
      setInterimTxt('')
    } else if (evt.type === 'error') {
      setErrorMsg(evt.error)
      if (evt.error.includes('Permission denied')) {
        setPermissionDenied(true)
      }
    }
  }, [])

  const startRec = useCallback(async () => {
    if (isListeningRef.current) return

    isListeningRef.current = true
    logger.debug('Starting voice input')

    try {
      engine.on(handleSttEvent)
      await engine.start()
      setIsRec(true)
      setPermissionDenied(false)
      setErrorMsg('')
    } catch (error) {
      isListeningRef.current = false
      const errMsg = error instanceof Error ? error.message : 'Unknown error'
      setErrorMsg(errMsg)
      if (errMsg.includes('Permission denied')) {
        setPermissionDenied(true)
      }
      logger.error('Voice input failed', errMsg)
      throw error
    }
  }, [engine, handleSttEvent])

  const stopRec = useCallback(async () => {
    if (!isListeningRef.current) return

    isListeningRef.current = false
    logger.debug('Stopping voice input')
    await engine.stop()
    setIsRec(false)
  }, [engine])

  return {
    isRec,
    interimTxt,
    finalTxt,
    permissionDenied,
    errorMsg,
    tooltipVisible,
    setTooltipVisible,
    startRec,
    stopRec,
  }
}

export { useVoiceInput }
