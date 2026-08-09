import type { Coord } from './lineTypes'

export const calcMid = (srcCoord: Coord, dstCoord: Coord): Coord => ({
  x: (srcCoord.x + dstCoord.x) / 2,
  y: (srcCoord.y + dstCoord.y) / 2,
})

export const statusColor = (status?: string): string => {
  if (status === 'error') return '#F92672'
  if (status === 'loading') return '#66D9EF'
  if (status === 'done') return '#A6E22E'
  return '#75715E'
}
