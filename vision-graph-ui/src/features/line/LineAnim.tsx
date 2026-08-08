import type { LineAnimProps } from './lineTypes'
import { statusColor } from './lineTransforms'
import { isPend, hasErr } from './linePredicates'

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
  const animationStyle = isLoading
    ? { animation: 'dashoffset 1s linear infinite' }
    : isError
    ? { animation: 'pulse 1s ease-in-out infinite' }
    : {}

  return (
    <g>
      <style>
        {`
          @keyframes dashoffset {
            to { stroke-dashoffset: -10; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
      <path
        d={pathD}
        stroke={stroke}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
        style={animationStyle}
      />
    </g>
  )
}
