import styled from 'styled-components'

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
    0%, 100% { box-shadow: 0 0 0 0 rgba(0, 122, 204, 0.4); }
    50% { box-shadow: 0 0 0 8px rgba(0, 122, 204, 0); }
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

export interface GitSyncProps {
  syncState: 'idle' | 'syncing' | 'error' | 'synced'
  syncError: string | null
  onSync: () => Promise<void>
}

export function GitSync({ syncState, syncError, onSync }: GitSyncProps) {
  const handleClick = async () => {
    await onSync()
  }

  const getIcon = () => {
    switch (syncState) {
      case 'syncing':
        return '⟳'
      case 'synced':
        return '✓'
      case 'error':
        return '⚠'
      default:
        return '↑'
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={handleClick}
        disabled={syncState === 'syncing'}
        data-state={syncState}
        title={syncState === 'idle' ? 'Sync to remote' : `Sync ${syncState}`}
      >
        {getIcon()}
      </Button>

      {syncState === 'error' && syncError && (
        <ErrorPanel>
          <ErrorTitle>Sync Failed</ErrorTitle>
          <ErrorHint>{syncError}</ErrorHint>
          <ErrorHint style={{ marginTop: '8px' }}>
            Resolve in external git client
          </ErrorHint>
        </ErrorPanel>
      )}
    </>
  )
}