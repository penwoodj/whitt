import { useState, useCallback, useEffect } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components'
import type { LineProps } from './lineTypes'
import { statusColor } from './lineTransforms'
import { hasErr } from './linePredicates'
import { log } from '../../shared/logger'
import LineSvg from './LineSvg'
import LineLabel from './LineLabel'
import LineAnim from './LineAnim'

const lineLog = log('Line')

const EdgeWrap = styled.g``

export default function Line({ srcCoord, dstCoord, lineKind, status = 'idle', isActive, onLabelClick }: LineProps) {
  const [isHovered, setIsHovered] = useState(false)
  const theme = useTheme()

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
  const errorColor = theme.colors.error
  const finalStrokeColor = isErrorState ? errorColor : strokeColor

  useEffect(() => {
    lineLog.debug('Line rendered')
  }, [])

  return (
    <EdgeWrap>
      <LineSvg
        srcCoord={srcCoord}
        dstCoord={dstCoord}
        isActive={isActive}
        isHovered={isHovered}
        statusColor={finalStrokeColor}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <LineAnim
        srcCoord={srcCoord}
        dstCoord={dstCoord}
        status={status}
        statusColor={finalStrokeColor}
      />
      {lineKind && <LineLabel srcCoord={srcCoord} dstCoord={dstCoord} lineKind={lineKind} onLabelClick={onLabelClick} />}
    </EdgeWrap>
  )
}
