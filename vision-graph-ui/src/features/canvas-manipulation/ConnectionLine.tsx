import styled from 'styled-components'

const ConnectionLine = styled.div<{ $isValid: boolean }>`
  position: absolute;
  height: 2px;
  background: ${({ $isValid }) => ($isValid ? '#007bff' : '#dc3545')};
  border-top: ${({ $isValid }) => ($isValid ? '2px solid #007bff' : '2px dashed #dc3545')};
  pointer-events: none;
  transform-origin: left center;
  z-index: 100;
`

type ConnectionLineProps = {
  sourcePosition: { x: number; y: number }
  targetPosition: { x: number; y: number }
  isValid: boolean
}

export function ConnectionLineComponent({ sourcePosition, targetPosition, isValid }: ConnectionLineProps) {
  const dx = targetPosition.x - sourcePosition.x
  const dy = targetPosition.y - sourcePosition.y
  const length = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)

  return (
    <ConnectionLine
      data-testid="connection-preview"
      $isValid={isValid}
      style={{
        left: sourcePosition.x,
        top: sourcePosition.y,
        width: length,
        transform: `rotate(${angle}deg)`,
      }}
    />
  )
}
