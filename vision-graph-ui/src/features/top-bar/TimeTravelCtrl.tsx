import styled from 'styled-components'
import type { TimeTravelCtrlProps } from './topBarTypes'

const TravelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const TravelButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizeSm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.bgHover};
    border-color: ${({ theme }) => theme.colors.borderActive};
    box-shadow: ${({ theme }) => theme.glow.primary};
  }

  &:focus-visible:not(:disabled) {
    outline: none;
    border-color: ${({ theme }) => theme.colors.borderActive};
    box-shadow: ${({ theme }) => theme.glow.primary};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

const CommitLabel = styled.span`
  font-size: ${({ theme }) => theme.font.sizeSm};
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.font.mono};
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export default function TimeTravelCtrl({
  canTravelBack,
  canTravelForward,
  commitLabel,
  onTravelBack,
  onTravelForward,
}: TimeTravelCtrlProps) {
  return (
    <TravelContainer>
      <TravelButton onClick={onTravelBack} disabled={!canTravelBack} aria-label="Travel back">
        ◀
      </TravelButton>
      <CommitLabel title={commitLabel}>{commitLabel}</CommitLabel>
      <TravelButton onClick={onTravelForward} disabled={!canTravelForward} aria-label="Travel forward">
        ▶
      </TravelButton>
    </TravelContainer>
  )
}
