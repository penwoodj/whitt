import { useState, useCallback } from 'react'
import type { NodeData } from './nodeTypes'

export type ModalState = {
  nodeId: string
  node: NodeData
  originX: number
  originY: number
} | null

export const useModalState = () => {
  const [isModalOpen, setIsModalOpen] = useState<ModalState>(null)

  const openModal = useCallback(
    (nodeId: string, node: NodeData, origin: { x: number; y: number }) => {
      setIsModalOpen({
        nodeId,
        node,
        originX: origin.x,
        originY: origin.y,
      })
    },
    []
  )

  const closeModal = useCallback(() => {
    setIsModalOpen(null)
  }, [])

  return {
    isModalOpen,
    openModal,
    closeModal,
  }
}
