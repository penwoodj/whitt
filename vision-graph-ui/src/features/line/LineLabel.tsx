import styled from 'styled-components'
import type { LineLabelProps } from './lineTypes'
import { calcMid } from './lineTransforms'
import { log } from '../../shared/logger'

const lineLog = log('LineLabel')

type EdgeLabelProps = {
  $clickable: boolean
}

const EdgeLabel = styled.text<EdgeLabelProps>`
  text-anchor: middle;
  font-size: 12px;
  fill: ${({ theme }) => theme.colors.textMuted};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  user-select: none;
`

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
    <EdgeLabel
      x={midPt.x}
      y={midPt.y - 5}
      $clickable={!!onLabelClick}
      onClick={handleClick}
    >
      {lineKind}
    </EdgeLabel>
  )
}
