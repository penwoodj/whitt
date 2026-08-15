import { useState, useCallback, useEffect, useRef } from 'react'
import type { NodeViewState } from './nodeTypes'
import { useModalState, type ModalState } from './useModalState'

export const useNodeState = () => {
  const [isRec, setIsRec] = useState(false)
  const [isStream, setIsStream] = useState(false)
  const [promptTxt, setPromptTxt] = useState('')
  const [todosExpanded, setTodosExpanded] = useState(false)
  const [detailExpanded, setDetailExpanded] = useState(false)
  const [streamedTxt, setStreamedTxt] = useState('')
  const [nodeViewState, setNodeViewState] = useState<NodeViewState>('collapsed')
  const [focused, setFocused] = useState(false)
  const [autoRecord, setAutoRecord] = useState(false)
  const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { isModalOpen, openModal, closeModal } = useModalState()

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
    (onSend?: (txt: string) => void, nodeData?: any, position?: { x: number; y: number }) => {
      if (promptTxt.trim() && onSend) {
        onSend(promptTxt.trim())
        setPromptTxt('')
      }

      if (nodeData && position) {
        openModal(nodeData.id, nodeData, position)
        setAutoRecord(true)
      }
    },
    [promptTxt, openModal]
  )

  const toggleTodos = useCallback(() => setTodosExpanded((prev) => !prev), [])

  const toggleDetail = useCallback(() => setDetailExpanded((prev) => !prev), [])

  const setHovered = useCallback(() => {
    if (!focused) {
      setNodeViewState('hovered')
    }
  }, [focused])

  const setExpanded = useCallback(() => {
    setNodeViewState('expanded')
    setFocused(true)
  }, [])

  const setCollapsed = useCallback(() => {
    setNodeViewState('collapsed')
    setFocused(false)
    setAutoRecord(false)
  }, [])

  const openNodeModal = useCallback(
    (nodeId: string, nodeData: any, position: { x: number; y: number }, shouldAutoRecord = false) => {
      openModal(nodeId, nodeData, position)
      setAutoRecord(shouldAutoRecord)
    },
    [openModal]
  )

  const closeNodeModal = useCallback(() => {
    closeModal()
    setAutoRecord(false)
  }, [closeModal])

  useEffect(() => {
    if (autoRecord && !isRec) {
      toggleRec()
    }
  }, [autoRecord, isRec, toggleRec])

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
    focused,
    setFocused,
    setHovered,
    setExpanded,
    setCollapsed,
    toggleRec,
    sendPrompt,
    toggleTodos,
    toggleDetail,
    isModalOpen,
    openNodeModal,
    closeNodeModal,
  }
}
