export type Coord = { x: number; y: number }

export type LineKind = 'ENQUEUED_BY' | 'DEPENDS_ON' | 'PRODUCED' | 'ROUTED_TO' | 'RUNNING_ON'

export type LineStatus = 'idle' | 'loading' | 'done' | 'error'

export type LineData = {
  id: string
  srcCoord: Coord
  dstCoord: Coord
  lineKind?: LineKind
  status?: LineStatus
  isActive?: boolean
}

export type LineProps = LineData & {
  onLabelClick?: (kind: LineKind) => void
}

export type LineSvgProps = {
  srcCoord: Coord
  dstCoord: Coord
  isActive?: boolean
  isHovered?: boolean
  statusColor?: string
}

export type LineLabelProps = {
  srcCoord: Coord
  dstCoord: Coord
  lineKind: LineKind
  onLabelClick?: (kind: LineKind) => void
}

export type LineAnimProps = {
  srcCoord: Coord
  dstCoord: Coord
  status?: LineStatus
  statusColor?: string
}
