import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useState } from 'react'
import styled from 'styled-components'
import type { DagDirection } from './dagFormat'
import type { Theme } from '../../shared/theme'

type DagFormatControlProps = {
  readonly selectedNodeIds: readonly string[]
  readonly onFormat: (direction: DagDirection) => void | boolean
  readonly initialDirection?: DagDirection
  readonly initialCurrentDirection?: DagDirection | null
}

const directions: readonly DagDirection[] = ['RIGHT', 'DOWN', 'LEFT']

const getDirectionLabel = (direction: DagDirection): string => {
  switch (direction) {
    case 'RIGHT':
      return 'Right'
    case 'DOWN':
      return 'Down'
    case 'LEFT':
      return 'Left'
    default:
      return direction
  }
}

const getDirectionIcon = (direction: DagDirection) => {
  switch (direction) {
    case 'RIGHT':
      return ArrowRight
    case 'DOWN':
      return ArrowDown
    case 'LEFT':
      return ArrowLeft
    default:
      return ArrowRight
  }
}

const getDirectionColor = (direction: DagDirection, theme: Theme): string => {
  switch (direction) {
    case 'RIGHT':
      return theme.colors.gorse
    case 'DOWN':
      return theme.colors.success
    case 'LEFT':
      return theme.colors.warning
    default:
      return theme.colors.textMuted
  }
}

const Shell = styled.div`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgElevated};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  z-index: ${({ theme }) => theme.zIndex.overlay};
`

const Command = styled.button<{ $isEnabled: boolean; $direction: DagDirection }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  border: 0;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ theme, $direction }) => getDirectionColor($direction, theme)};
  background: ${({ theme }) => theme.colors.bgElevated};
  font: inherit;
  cursor: ${({ $isEnabled }) => ($isEnabled ? 'pointer' : 'not-allowed')};
  opacity: ${({ $isEnabled }) => ($isEnabled ? 1 : 0.55)};

  &:hover:not(:disabled), &:focus-visible {
    background: ${({ theme }) => theme.colors.bgHover};
    outline: 2px solid ${({ theme, $direction }) => getDirectionColor($direction, theme)};
    outline-offset: -2px;
  }
`

const Readout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 88px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.sizeXs};
`

const ReadoutValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizeSm};
`

export function DagFormatControl({ selectedNodeIds, onFormat, initialDirection = 'RIGHT', initialCurrentDirection = null }: DagFormatControlProps) {
  const [nextDirection, setNextDirection] = useState<DagDirection>(initialDirection)
  const [currentDirection, setCurrentDirection] = useState<DagDirection | null>(initialCurrentDirection)
  const hasSelection = selectedNodeIds.length > 0
  const Icon = getDirectionIcon(nextDirection)
  const directionLabel = getDirectionLabel(nextDirection)
  const currentLabel = currentDirection ? getDirectionLabel(currentDirection) : 'None'

  const handleFormat = useCallback(() => {
    if (!hasSelection) return
    const wasApplied = onFormat(nextDirection)
    if (wasApplied === false) return
    setCurrentDirection(nextDirection)
    const directionIndex = directions.indexOf(nextDirection)
    setNextDirection(directions[(directionIndex + 1) % directions.length] ?? 'RIGHT')
  }, [hasSelection, nextDirection, onFormat])

  return (
    <Shell aria-label="DAG format control">
      <Command
        type="button"
        aria-label={`Format selected nodes ${directionLabel.toLowerCase()}`}
        disabled={!hasSelection}
        $isEnabled={hasSelection}
        $direction={nextDirection}
        onClick={handleFormat}
      >
        <Icon aria-hidden="true" size={16} />
        <span>{hasSelection ? directionLabel : 'No selection'}</span>
      </Command>
      <Readout aria-label="Current DAG layout">
        <span>Layout</span>
        <ReadoutValue>{currentLabel}</ReadoutValue>
      </Readout>
    </Shell>
  )
}
