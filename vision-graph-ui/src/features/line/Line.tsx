import { useState, useCallback, useEffect } from 'react'
import type { LineProps } from './lineTypes'
import { statusColor } from './lineTransforms'
import { hasErr } from './linePredicates'
import { log } from '../../shared/logger'
import LineSvg from './LineSvg'
import LineLabel from './LineLabel'
import LineAnim from './LineAnim'

const lineLog = log('Line')

export default function Line({ srcCoord, dstCoord, lineKind, status = 'idle', isActive, onLabelClick }: LineProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    lineLog.debug('Line hovered')
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    lineLog.debug('Line unhovered')
  }, [])

  const isErrorState = hasErr(status)
  const strokeColor = statusColor(status)

  useEffect(() => {
    lineLog.debug('Line rendered')
  }, [])

  return (
    <g>
      <LineSvg
        srcCoord={srcCoord}
        dstCoord={dstCoord}
        isActive={isActive}
        isHovered={isHovered}
        statusColor={isErrorState ? '#ff0000' : strokeColor}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <LineAnim
        srcCoord={srcCoord}
        dstCoord={dstCoord}
        status={status}
        statusColor={isErrorState ? '#ff0000' : strokeColor}
      />
      {lineKind && <LineLabel srcCoord={srcCoord} dstCoord={dstCoord} lineKind={lineKind} onLabelClick={onLabelClick} />}
    </g>
  )
}
