import styled from 'styled-components'
import { AlertTriangle, Check, LoaderCircle, Upload } from 'lucide-react'

const Button = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textInverse};
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transition.base};
  z-index: ${({ theme }) => theme.zIndex.overlay};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &[data-state="syncing"] {
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 ${({ theme }) => theme.colors.primary}66; }
    50% { box-shadow: 0 0 0 8px ${({ theme }) => theme.colors.primary}00; }
  }
`

const ErrorPanel = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  max-width: 300px;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  z-index: ${({ theme }) => theme.zIndex.overlay};
`

const ErrorTitle = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-weight: ${({ theme }) => theme.font.weightBold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const ErrorHint = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizeSm};
  line-height: 1.4;
`

const ResolutionHint = styled(ErrorHint)`
  margin-top: ${({ theme }) => theme.spacing.sm};
`

export interface GitSyncProps {
  syncState: 'idle' | 'syncing' | 'error' | 'synced' | 'unavailable'
  syncError: string | null
  onSync: () => Promise<void>
}

export function GitSync({ syncState, syncError, onSync }: GitSyncProps) {
  const handleClick = async () => {
    if (syncState === 'unavailable') return
    await onSync()
  }

  const getIcon = () => {
    switch (syncState) {
      case 'syncing':
        return <LoaderCircle aria-hidden="true" size={18} />
      case 'synced':
        return <Check aria-hidden="true" size={18} />
      case 'error':
        return <AlertTriangle aria-hidden="true" size={18} />
      case 'unavailable':
        return <AlertTriangle aria-hidden="true" size={18} />
      default:
        return <Upload aria-hidden="true" size={18} />
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={handleClick}
        disabled={syncState === 'syncing'}
        data-state={syncState}
        aria-label={syncState === 'idle' ? 'Sync to remote' : `Sync ${syncState}`}
        title={syncState === 'idle' ? 'Sync to remote' : `Sync ${syncState}`}
      >
        {getIcon()}
        {syncState === 'unavailable' && <span data-testid="git-unavailable">Git unavailable</span>}
      </Button>

      {syncState === 'error' && syncError && (
        <ErrorPanel>
          <ErrorTitle>Sync Failed</ErrorTitle>
          <ErrorHint>{syncError}</ErrorHint>
          <ResolutionHint>
            Resolve in external git client
          </ResolutionHint>
        </ErrorPanel>
      )}
    </>
  )
}
