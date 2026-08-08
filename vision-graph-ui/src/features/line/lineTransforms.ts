import type { Coord } from './lineTypes'

export const calcMid = (srcCoord: Coord, dstCoord: Coord): Coord => ({
  x: (srcCoord.x + dstCoord.x) / 2,
  y: (srcCoord.y + dstCoord.y) / 2,
})

export const statusColor = (status?: string): string => {
  if (status === 'error') return '#ff0000'
  if (status === 'loading') return '#0066ff'
  if (status === 'done') return '#00cc00'
  return '#666666'
}
