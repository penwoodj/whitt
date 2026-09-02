import { useCallback } from 'react'

export interface NodePosition {
  x: number
  y: number
}

export interface Node {
  id: string
  position: NodePosition
}

const MIN_DISTANCE = 150
const MAX_DISTANCE = 250

export function useSpawnPlacement() {
  const calculatePosition = useCallback((
    parentPosition: NodePosition,
    existingSiblings: Node[]
  ): NodePosition => {
    const siblingCount = existingSiblings.length
    const angle = (siblingCount * 2 * Math.PI) / 8
    
    const baseDistance = MIN_DISTANCE + (siblingCount * 10)
    const distance = Math.min(baseDistance, MAX_DISTANCE)
    
    return {
      x: parentPosition.x + Math.cos(angle) * distance,
      y: parentPosition.y + Math.sin(angle) * distance,
    }
  }, [])

  const getAnimationClass = useCallback((): string => {
    return 'fade-in-settle'
  }, [])

  const getAnimationDuration = useCallback((): string => {
    return '400ms'
  }, [])

  const createLink = useCallback((source: string, target: string) => {
    return {
      id: `${source}-${target}`,
      source,
      target,
      type: 'default' as const,
      animated: true,
    }
  }, [])

  return {
    calculatePosition,
    getAnimationClass,
    getAnimationDuration,
    createLink,
  }
}
