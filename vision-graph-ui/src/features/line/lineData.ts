import type { LineData, LineKind, LineStatus } from './lineTypes'
import type { Coord } from './lineTypes'

export const mkLineData = (
  id: string,
  srcCoord: Coord,
  dstCoord: Coord,
  overrides?: Partial<LineData>
): LineData => ({
  id,
  srcCoord,
  dstCoord,
  lineKind: undefined,
  status: 'idle',
  isActive: false,
  ...overrides,
})

export const mkCoord = (x: number, y: number): Coord => ({ x, y })

export const allLineKinds: LineKind[] = ['ENQUEUED_BY', 'DEPENDS_ON', 'PRODUCED', 'ROUTED_TO', 'RUNNING_ON']

export const allStatuses: LineStatus[] = ['idle', 'loading', 'done', 'error']
