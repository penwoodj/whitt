import { useEffect } from 'react'
import styled from 'styled-components'

const EdgeContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const EdgeLine = styled.line`
  stroke: #999;
  stroke-width: 2;
  cursor: pointer;
  transition: stroke 0.2s ease;

  &:hover {
    stroke: #007bff;
    stroke-width: 3;
  }
`

const DeleteButton = styled.button<{ $visible: boolean }>`
  position: absolute;
  background: white;
  border: 1px solid #dc3545;
  color: #dc3545;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 100;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #dc3545;
    color: white;
  }

  &:active {
    background: #c82333;
  }
`

type EdgeWithDeleteProps = {
  edgeId: string
  sourcePosition: { x: number; y: number }
  targetPosition: { x: number; y: number }
  isHovered: boolean
  isSelected: boolean
  onDelete: () => void
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function EdgeWithDelete({
  edgeId,
  sourcePosition,
  targetPosition,
  isHovered,
  isSelected,
  onDelete,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: EdgeWithDeleteProps) {
  const midX = (sourcePosition.x + targetPosition.x) / 2
  const midY = (sourcePosition.y + targetPosition.y) / 2

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSelected && (e.key === 'Delete' || e.key === 'Backspace')) {
        onDelete()
      }
    }

    if (isSelected) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSelected, onDelete])

  return (
    <EdgeContainer data-testid={`edge-${edgeId}`}>
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <EdgeLine
          x1={sourcePosition.x + 150}
          y1={sourcePosition.y + 25}
          x2={targetPosition.x}
          y2={targetPosition.y + 25}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          role="presentation"
          style={{
            pointerEvents: 'auto',
            stroke: isSelected ? '#007bff' : '#999',
            strokeWidth: isSelected ? 3 : 2,
          }}
        />
      </svg>
      <DeleteButton
        data-testid={`delete-edge-${edgeId}`}
        $visible={isHovered || isSelected}
        style={{
          left: `${midX}px`,
          top: `${midY}px`,
        }}
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        aria-label="Delete edge"
      >
        ×
      </DeleteButton>
    </EdgeContainer>
  )
}
