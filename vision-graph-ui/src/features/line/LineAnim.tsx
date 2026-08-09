import styled, { css, keyframes } from 'styled-components'
import type { LineAnimProps } from './lineTypes'
import { statusColor } from './lineTransforms'
import { isPend, hasErr } from './linePredicates'

const dashoffset = keyframes`
  to { stroke-dashoffset: -10; }
`

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`

type EdgeAnimWrapProps = {
  $isLoading: boolean
  $isError: boolean
}

const getAnimationStyle = ($isLoading: boolean, $isError: boolean) => {
  if ($isLoading) return css`animation: ${dashoffset} 1s linear infinite`
  if ($isError) return css`animation: ${pulse} 1s ease-in-out infinite`
  return css``
}

const EdgeAnimWrap = styled.g<EdgeAnimWrapProps>`
  ${({ $isLoading, $isError }) => getAnimationStyle($isLoading, $isError)}
`

const renderPath = (srcX: number, srcY: number, dstX: number, dstY: number): string => {
  const midX = (srcX + dstX) / 2
  const ctrlX1 = midX
  const ctrlY1 = srcY
  const ctrlX2 = midX
  const ctrlY2 = dstY
  return `M ${srcX} ${srcY} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${dstX} ${dstY}`
}

export default function LineAnim({ srcCoord, dstCoord, status = 'idle', statusColor: customColor }: LineAnimProps) {
  const stroke = customColor || statusColor(status)
  const isLoading = isPend(status)
  const isError = hasErr(status)

  const pathD = renderPath(srcCoord.x, srcCoord.y, dstCoord.x, dstCoord.y)
  const strokeDasharray = isLoading ? '5, 5' : 'none'

  return (
    <EdgeAnimWrap $isLoading={isLoading} $isError={isError}>
      <path
        d={pathD}
        stroke={stroke}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
      />
    </EdgeAnimWrap>
  )
}
