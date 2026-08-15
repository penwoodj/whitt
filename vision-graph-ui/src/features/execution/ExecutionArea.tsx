import { useState } from 'react'
import styled from 'styled-components'
import { X } from 'lucide-react'
import { StatusBarCard } from './StatusBarCard'
import { YamlWorkflowVisualizer } from './YamlWorkflowVisualizer'
import * as yaml from 'js-yaml'

const AreaContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transition.base};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.borderActive};
  }
`

const WorkflowSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

const WorkflowInfo = styled.div`
  flex: 1;
`

const WorkflowTitle = styled.h3`
  font-size: ${({ theme }) => theme.font.sizeMd};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`

const WorkflowMeta = styled.p`
  font-size: ${({ theme }) => theme.font.sizeSm};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`

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
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  role: dialog;
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

export interface ExecutionAreaProps {
  workflow: string
  onExecute: () => void
  status?: 'idle' | 'running' | 'done' | 'error'
  stepTitle?: string
}

export function ExecutionArea({ 
  workflow, 
  onExecute, 
  status = 'idle', 
  stepTitle = 'Ready' 
}: ExecutionAreaProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  let parsedWorkflow: Record<string, unknown> | null = null
  try {
    parsedWorkflow = yaml.load(workflow) as Record<string, unknown> | null
  } catch {
    parsedWorkflow = null
  }

  const stepCount = parsedWorkflow && typeof parsedWorkflow === 'object' && 'steps' in parsedWorkflow 
    ? Array.isArray(parsedWorkflow.steps) 
      ? parsedWorkflow.steps.length 
      : 0
    : 0

  const workflowName = parsedWorkflow && typeof parsedWorkflow === 'object' && 'name' in parsedWorkflow
    ? parsedWorkflow.name as string
    : 'Workflow'

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    setShowConfirm(true)
  }

  const handleDoubleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (event.button === 0) {
      onExecute()
    }
  }

  const handleConfirm = () => {
    setShowConfirm(false)
    onExecute()
  }

  const handleCancel = () => {
    setShowConfirm(false)
  }

  return (
    <>
      <AreaContainer 
        data-testid="execution-area"
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        <WorkflowSummary>
          <WorkflowInfo>
            <WorkflowTitle>
              {workflowName}
            </WorkflowTitle>
            <WorkflowMeta>{stepCount} steps</WorkflowMeta>
          </WorkflowInfo>
          <StatusBarCard status={status} stepTitle={stepTitle} />
        </WorkflowSummary>
      </AreaContainer>
      
      {showConfirm && (
        <DialogOverlay $isOpen={showConfirm} onClick={handleCancel}>
          <Dialog onClick={(e) => e.stopPropagation()} data-testid="confirm-dialog">
            <DialogHeader>
              <DialogTitle>Confirm Execution</DialogTitle>
              <CloseButton onClick={handleCancel}>
                <X size={20} />
              </CloseButton>
            </DialogHeader>
            <DialogContent>
              <YamlWorkflowVisualizer workflow={workflow} />
            </DialogContent>
            <DialogActions>
              <Button $variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button $variant="primary" onClick={handleConfirm}>
                Execute
              </Button>
            </DialogActions>
          </Dialog>
        </DialogOverlay>
      )}
    </>
  )
}