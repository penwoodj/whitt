import type { MenuPosition } from './markdownHighlightTypes'

export const clampPosition = (position: MenuPosition, maxX: number, maxY: number): MenuPosition => ({
  x: Math.max(0, Math.min(position.x, maxX)),
  y: Math.max(0, Math.min(position.y, maxY)),
})

export const offsetPosition = (position: MenuPosition, offsetX: number, offsetY: number): MenuPosition => ({
  x: position.x + offsetX,
  y: position.y + offsetY,
})
