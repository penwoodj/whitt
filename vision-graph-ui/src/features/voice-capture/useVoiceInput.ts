import { useState, useCallback, useRef } from 'react'
import { log } from '../../shared/logger'
import type { SttEngine, SttEvent } from '../../shared/stt/types'

const logger = log('useVoiceInput')

type PromptFileWriter = (path: string, content: string) => void

const useVoiceInput = (engine: SttEngine, promptFileWriter?: PromptFileWriter) => {
  const [isRec, setIsRec] = useState<boolean>(false)
  const [interimTxt, setInterimTxt] = useState<string>('')
  const [finalTxt, setFinalTxt] = useState<string>('')
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false)
  const [tooltipPinned, setTooltipPinned] = useState<boolean>(false)
  const isListeningRef = useRef<boolean>(false)
  const cursorPosRef = useRef<number>(0)
  const sendCallbackRef = useRef<((text: string) => void) | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scheduleDebouncedWrite = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      if (promptFileWriter && finalTxt) {
        const ts = Date.now()
        const coordsHash = Math.abs(finalTxt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0))
        const path = `.whitt/prompts/${ts}-${coordsHash}.md`
        promptFileWriter(path, finalTxt)
      }
    }, 2000)
  }, [finalTxt, promptFileWriter])

  const handleSttEvent = useCallback((evt: SttEvent) => {
    if (evt.type === 'interim') {
      setInterimTxt(evt.text)
    } else if (evt.type === 'final') {
      setFinalTxt((prev) => (prev ? `${prev} ${evt.text}` : evt.text))
      setInterimTxt('')
      scheduleDebouncedWrite()
    } else if (evt.type === 'error') {
      setErrorMsg(evt.error)
      if (evt.error.includes('Permission denied')) {
        setPermissionDenied(true)
      }
    }
  }, [scheduleDebouncedWrite])

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

  const send = useCallback(() => {
    if (!finalTxt.trim()) {
      return
    }

    if (sendCallbackRef.current) {
      sendCallbackRef.current(finalTxt)
    }
  }, [finalTxt])

  const setSendCallback = useCallback((callback: (text: string) => void) => {
    sendCallbackRef.current = callback
  }, [])

  const insertAtCursor = useCallback((text: string, position?: number) => {
    const insertPos = position ?? cursorPosRef.current
    setFinalTxt((prev) => {
      const before = prev.slice(0, insertPos)
      const after = prev.slice(insertPos)
      return `${before}${text}${after}`
    })
  }, [])

  const setCursorPos = useCallback((pos: number) => {
    cursorPosRef.current = pos
  }, [])

  const toggleTooltipPin = useCallback(() => {
    setTooltipPinned((prev) => !prev)
  }, [])

  const handleKeyDown = useCallback((evt: React.KeyboardEvent) => {
    if (evt.key === 'Enter' && !evt.shiftKey) {
      evt.preventDefault()
      send()
    }
  }, [send])

  return {
    isRec,
    interimTxt,
    finalTxt,
    permissionDenied,
    errorMsg,
    tooltipVisible,
    tooltipPinned,
    setTooltipVisible,
    toggleTooltipPin,
    startRec,
    stopRec,
    send,
    setSendCallback,
    insertAtCursor,
    setCursorPos,
    handleKeyDown,
  }
}

export { useVoiceInput }
