import { useState, useCallback } from 'react'

export function usePillHoverPreview() {
  const [hoveredPillId, setHoveredPillId] = useState<string | null>(null)

  const handlePillHover = useCallback((pillId: string) => {
    setHoveredPillId(pillId)
  }, [])

  const handlePillLeave = useCallback(() => {
    setHoveredPillId(null)
  }, [])

  return {
    hoveredPillId,
    handlePillHover,
    handlePillLeave,
  }
}