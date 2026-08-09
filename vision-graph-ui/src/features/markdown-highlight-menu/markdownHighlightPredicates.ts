export const hasSelection = (text: string): boolean => text.length > 0

export const hasPosition = (position: { x: number; y: number } | null): boolean => position !== null

export const isMenuVisible = (text: string, position: { x: number; y: number } | null): boolean =>
  hasSelection(text) && hasPosition(position)
