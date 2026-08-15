import styled from 'styled-components'

const Card = styled.div<{ $isHovered?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizeSm};
  transition: ${({ theme }) => theme.transition.base};
  
  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    border-color: ${({ theme }) => theme.colors.borderActive};
  }
`

const StatusText = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`

const Loader = styled.div<{ $status: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme, $status }) => {
    switch ($status) {
      case 'running':
        return theme.colors.running
      case 'done':
        return theme.colors.done
      case 'error':
        return theme.colors.error
      default:
        return theme.colors.idle
    }
  }};
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  ${({ $status }) => $status !== 'running' && 'animation: none;'}
`

const Tooltip = styled.div<{ $visible?: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  white-space: nowrap;
  z-index: ${({ theme }) => theme.zIndex.tooltip};
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  visibility: ${({ $visible }) => $visible ? 'visible' : 'hidden'};
  transition: opacity ${({ theme }) => theme.transition.fast};
  pointer-events: none;
`

const CardWrapper = styled.div`
  position: relative;
  display: inline-block;
`

export interface StatusBarCardProps {
  status: 'idle' | 'running' | 'done' | 'error'
  stepTitle: string
  showTooltip?: boolean
}

export function StatusBarCard({ status, stepTitle, showTooltip = false }: StatusBarCardProps) {
  return (
    <CardWrapper>
      <Card role="status">
        <StatusText title={stepTitle}>{stepTitle}</StatusText>
        <Loader $status={status} role="progressbar" aria-label={`Status: ${status}`} />
      </Card>
      {showTooltip && (
        <Tooltip $visible role="tooltip">{stepTitle}</Tooltip>
      )}
    </CardWrapper>
  )
}