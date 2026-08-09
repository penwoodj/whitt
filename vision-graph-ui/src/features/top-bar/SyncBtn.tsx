import styled from 'styled-components'
import type { SyncBtnProps } from './topBarTypes'

const SyncContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const SyncButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizeSm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.bgHover};
    border-color: ${({ theme }) => theme.colors.borderActive};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Spinner = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export default function SyncBtn({ syncStatus, lastSyncLabel, onClick }: SyncBtnProps) {
  const isSyncing = syncStatus === 'syncing'

  return (
    <SyncContainer>
      <SyncButton onClick={onClick} disabled={isSyncing} aria-label="Sync">
        {isSyncing && <Spinner aria-hidden="true" />}
        <span>{lastSyncLabel}</span>
      </SyncButton>
    </SyncContainer>
  )
}
