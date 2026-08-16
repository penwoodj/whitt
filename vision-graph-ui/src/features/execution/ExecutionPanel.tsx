import { useState } from 'react'
import styled from 'styled-components'
import { X, RotateCcw } from 'lucide-react'
import { StatusBarCard } from './StatusBarCard'
import { MorphingLoader } from './MorphingLoader'
import { YamlWorkflowVisualizer } from './YamlWorkflowVisualizer'
import type { AgentEvt } from '../../shared/agent/types'
import { isStepStart, isStepError, isRunDone, isFileWrite } from '../../shared/agent/types'

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  position: relative;
`

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

const StepTitle = styled.div`
  font-size: ${({ theme }) => theme.font.sizeSm};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  color: ${({ theme }) => theme.colors.text};
`

const StatusSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const TooltipContainer = styled.div<{ $visible: boolean; $pinned: boolean }>`
  position: absolute;
  right: 100%;
  top: 0;
  margin-right: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.sm};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  z-index: ${({ theme }) => theme.zIndex.tooltip};
  min-width: 300px;
  max-width: 500px;
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  visibility: ${({ $visible }) => $visible ? 'visible' : 'hidden'};
  pointer-events: ${({ $pinned }) => $pinned ? 'auto' : 'none'};
  transition: opacity ${({ theme }) => theme.transition.fast};
`

const PinButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.xs};
  right: ${({ theme }) => theme.spacing.xs};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.sm};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.bgHover};
  }
`

const PreviewArea = styled.div<{ $visible: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  display: ${({ $visible }) => $visible ? 'block' : 'none'};
`

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const PreviewTitle = styled.h4`
  font-size: ${({ theme }) => theme.font.sizeSm};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`

const PreviewContent = styled.pre`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.font.sizeXs};
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
`

const ErrorBanner = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.error}15;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.radius.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.error};
`

const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.textInverse};
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.font.sizeXs};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transition.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.error}dd;
  }
`

const ClosePreviewButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.sm};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.bgHover};
  }
`

export interface ExecutionPanelProps {
  workflow: string
  events?: AgentEvt[]
  onRetry?: () => void
}

export function ExecutionPanel({ workflow, events = [], onRetry }: ExecutionPanelProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [previewContent, setPreviewContent] = useState<{ path: string; content: string } | null>(null)

  const latestStatus = events.length > 0 ? events[events.length - 1] : null
  const stepStartEvent = events.filter(isStepStart).pop()
  const stepErrorEvent = events.filter(isStepError).pop()
  const runDoneEvent = events.filter(isRunDone).pop()
  const fileWriteEvent = events.filter(isFileWrite).pop()

  const status = stepErrorEvent ? 'error' : runDoneEvent?.status === 'done' ? 'done' : (latestStatus?.kind === 'run-start' || stepStartEvent) ? 'running' : 'idle'
  const stepTitle = stepErrorEvent
    ? `Error: ${stepErrorEvent?.stepId}`
    : stepStartEvent?.title
    ? stepStartEvent.title
    : runDoneEvent?.status === 'done'
    ? 'Completed'
    : 'Ready'

  const handleMouseEnter = () => {
    if (!pinned) {
      setShowTooltip(true)
    }
  }

  const handleMouseLeave = () => {
    if (!pinned) {
      setShowTooltip(false)
    }
  }

  const handleTooltipClick = () => {
    setPinned(!pinned)
  }

  const handleClosePreview = () => {
    setPreviewContent(null)
  }

  if (fileWriteEvent && !previewContent) {
    setPreviewContent({
      path: fileWriteEvent.path,
      content: `Content written to ${fileWriteEvent.path}`
    })
  }

  const failedStepName = stepErrorEvent?.stepId ?? 'Unknown step'

  return (
    <PanelContainer 
      data-testid="execution-panel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <PanelHeader>
        <StatusSection>
          <MorphingLoader status={status} stepTitle={stepTitle} />
          <StatusBarCard status={status} stepTitle={stepTitle} />
        </StatusSection>
        <StepTitle data-testid="step-title">{stepTitle}</StepTitle>
      </PanelHeader>

      <TooltipContainer 
        $visible={showTooltip || pinned} 
        $pinned={pinned}
        data-testid="yaml-tooltip"
      >
        <PinButton 
          onClick={handleTooltipClick}
          data-testid="pin-tooltip-btn"
          type="button"
        >
          {pinned ? <X size={14} /> : '📌'}
        </PinButton>
        <YamlWorkflowVisualizer workflow={workflow} />
      </TooltipContainer>

      {stepErrorEvent && (
        <ErrorBanner data-testid="error-banner">
          <span>Step failed: {failedStepName}</span>
          {onRetry && (
            <RetryButton onClick={onRetry} data-testid="retry-btn" type="button">
              <RotateCcw size={12} />
              Retry
            </RetryButton>
          )}
        </ErrorBanner>
      )}

      {previewContent && (
        <PreviewArea $visible data-testid="preview-area">
          <PreviewHeader>
            <PreviewTitle>File Preview: {previewContent.path}</PreviewTitle>
            <ClosePreviewButton onClick={handleClosePreview} type="button">
              <X size={14} />
            </ClosePreviewButton>
          </PreviewHeader>
          <PreviewContent>{previewContent.content}</PreviewContent>
        </PreviewArea>
      )}
    </PanelContainer>
  )
}