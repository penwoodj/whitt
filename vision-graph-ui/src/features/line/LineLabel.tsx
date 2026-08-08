import type { LineLabelProps } from './lineTypes'
import { calcMid } from './lineTransforms'
import { log } from '../../shared/logger'

const lineLog = log('LineLabel')

const fireClick = (kind: string, onLabelClick?: (kind: string) => void) => {
  return () => {
    if (onLabelClick) {
      onLabelClick(kind)
      lineLog.info(`Label clicked: ${kind}`)
    }
  }
}

export default function LineLabel({ srcCoord, dstCoord, lineKind, onLabelClick }: LineLabelProps) {
  const midPt = calcMid(srcCoord, dstCoord)
  const handleClick = fireClick(lineKind, onLabelClick as (kind: string) => void)

  return (
    <text
      x={midPt.x}
      y={midPt.y - 5}
      textAnchor="middle"
      fontSize="12"
      fill="#666666"
      style={{ cursor: onLabelClick ? 'pointer' : 'default', userSelect: 'none' }}
      onClick={handleClick}
    >
      {lineKind}
    </text>
  )
}
