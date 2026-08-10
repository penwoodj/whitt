import { useState, useCallback, useEffect, useRef } from 'react'
import type { NodeViewState } from './nodeTypes'

export const useNodeState = () => {
  const [isRec, setIsRec] = useState(false)
  const [isStream, setIsStream] = useState(false)
  const [promptTxt, setPromptTxt] = useState('')
  const [todosExpanded, setTodosExpanded] = useState(false)
  const [detailExpanded, setDetailExpanded] = useState(false)
  const [streamedTxt, setStreamedTxt] = useState('')
  const [nodeViewState, setNodeViewState] = useState<NodeViewState>('collapsed')
  const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const toggleRec = useCallback(() => {
    setIsRec((prev) => {
      const next = !prev
      if (next) {
        setIsStream(true)
        setStreamedTxt('')
        streamIntervalRef.current = setInterval(() => {
          const chars = 'abcdefghijklmnopqrstuvwxyz '
          const randomChar = chars[Math.floor(Math.random() * chars.length)]
          setStreamedTxt((prev) => prev + randomChar)
        }, 100)
      } else {
        setIsStream(false)
        if (streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current)
          streamIntervalRef.current = null
        }
        setPromptTxt((prev) => prev + streamedTxt)
        setStreamedTxt('')
      }
      return next
    })
  }, [streamedTxt])

  const sendPrompt = useCallback(
    (onSend?: (txt: string) => void) => {
      if (promptTxt.trim() && onSend) {
        onSend(promptTxt.trim())
        setPromptTxt('')
      }
    },
    [promptTxt]
  )

  const toggleTodos = useCallback(() => setTodosExpanded((prev) => !prev), [])

  const toggleDetail = useCallback(() => setDetailExpanded((prev) => !prev), [])

  const setHovered = useCallback(() => setNodeViewState('hovered'), [])

  const setExpanded = useCallback(() => setNodeViewState('expanded'), [])

  const setCollapsed = useCallback(() => setNodeViewState('collapsed'), [])

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current)
      }
    }
  }, [])

  return {
    isRec,
    isStream,
    promptTxt,
    setPromptTxt,
    todosExpanded,
    detailExpanded,
    streamedTxt,
    nodeViewState,
    setHovered,
    setExpanded,
    setCollapsed,
    toggleRec,
    sendPrompt,
    toggleTodos,
    toggleDetail,
  }
}
