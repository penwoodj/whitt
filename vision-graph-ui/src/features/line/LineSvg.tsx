import styled from 'styled-components'
import type { LineSvgProps } from './lineTypes'
import { statusColor } from './lineTransforms'
import { isAct } from './linePredicates'

type LineSvgPropsInternal = LineSvgProps & {
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

type EdgeSvgProps = {
  $viewBox: string
}

const EdgeSvg = styled.svg<EdgeSvgProps>`
  width: 100%;
  height: 100%;
  viewBox: ${({ $viewBox }) => $viewBox};
  overflow: visible;
`

const renderPath = (srcX: number, srcY: number, dstX: number, dstY: number): string => {
  const midX = (srcX + dstX) / 2
  const ctrlX1 = midX
  const ctrlY1 = srcY
  const ctrlX2 = midX
  const ctrlY2 = dstY
  return `M ${srcX} ${srcY} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${dstX} ${dstY}`
}

export default function LineSvg({ srcCoord, dstCoord, isActive, isHovered, statusColor: customColor, onMouseEnter, onMouseLeave }: LineSvgPropsInternal) {
  const strokeWidth = isAct(isActive) ? 4 : 2
  const stroke = customColor || statusColor('idle')
  const darkerStroke = isHovered ? '#444444' : stroke

  const pathD = renderPath(srcCoord.x, srcCoord.y, dstCoord.x, dstCoord.y)
  const viewBox = `0 0 ${Math.max(srcCoord.x, dstCoord.x) + 10} ${Math.max(srcCoord.y, dstCoord.y) + 10}`

  return (
    <EdgeSvg $viewBox={viewBox}>
      <path
        d={pathD}
        stroke={darkerStroke}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </EdgeSvg>
  )
}
