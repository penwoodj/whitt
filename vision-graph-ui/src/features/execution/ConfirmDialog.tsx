import { useEffect } from 'react'
import styled from 'styled-components'
import { X } from 'lucide-react'
import { YamlWorkflowVisualizer } from './YamlWorkflowVisualizer'

const DialogOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${({ $isOpen }) => $isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
  padding: ${({ theme }) => theme.spacing.lg};
`

const Dialog = styled.div`
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  max-width: 700px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  role: dialog;
  aria-modal="true";
`

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const DialogTitle = styled.h2`
  font-size: ${({ theme }) => theme.font.sizeLg};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`

const DialogContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  overflow-y: auto;
  flex: 1;
`

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.font.sizeSm};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  cursor: pointer;
  border: none;
  transition: background ${({ theme }) => theme.transition.fast};
  
  ${({ $variant, theme }) => $variant === 'primary' ? `
    background: ${theme.colors.primary};
    color: ${theme.colors.textInverse};
    &:hover {
      background: ${theme.colors.primaryHover};
    }
  ` : `
    background: ${theme.colors.bgHover};
    color: ${theme.colors.text};
    &:hover {
      background: ${theme.colors.border};
    }
  `}
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.bgHover};
  }
`

export interface ConfirmDialogProps {
  isOpen: boolean
  workflow: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ isOpen, workflow, onConfirm, onCancel }: ConfirmDialogProps) {
  const handleOverlayClick = () => {
    onCancel()
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, onCancel])

  return (
    <DialogOverlay 
      $isOpen={isOpen} 
      onClick={handleOverlayClick}
    >
      <Dialog onClick={(e) => e.stopPropagation()} data-testid="confirm-dialog">
        <DialogHeader>
          <DialogTitle>Confirm Execution</DialogTitle>
          <CloseButton onClick={onCancel} aria-label="Close">
            <X size={20} />
          </CloseButton>
        </DialogHeader>
        <DialogContent>
          <YamlWorkflowVisualizer workflow={workflow} />
        </DialogContent>
        <DialogActions>
          <Button $variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button $variant="primary" onClick={onConfirm}>
            Execute
          </Button>
        </DialogActions>
      </Dialog>
    </DialogOverlay>
  )
}