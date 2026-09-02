import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import NodeTitle from './NodeTitle'
import NodeStatus from './NodeStatus'
import NodeTooltip from './NodeTooltip'
import VoiceTooltipComposer from './VoiceTooltipComposer'
import NodeDetailPanel from './NodeDetailPanel'
import { ExecutionPanel } from '../execution/ExecutionPanel'
import { ConfirmDialog } from '../execution/ConfirmDialog'
import type { NodeProps } from './nodeTypes'
import { useNodeState } from './useNodeState'
import { log } from '../../shared/logger'
import type { PromptPayload } from '../context-pills/contextPillTypes'
import { AgentContext } from './AgentContext'

const NodeBox = styled.div<{ $minimized: boolean; $focused: boolean; $expanded: boolean; $gorse: boolean }>`
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid
    ${({ theme, $focused, $expanded }) =>
      $focused || $expanded ? theme.colors.borderActive : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ $minimized }) => ($minimized ? '6px 10px' : '12px 14px')};
  min-width: ${({ $minimized }) => ($minimized ? '120px' : '320px')};
  transition: all 240ms ease;
  box-shadow: ${({ theme, $focused, $expanded, $gorse }) =>
    $focused
      ? `${theme.shadow.md}, ${theme.glow.primaryStrong}`
      : $expanded
        ? `${theme.shadow.md}, ${theme.glow.primary}`
        : $gorse
          ? `${theme.shadow.sm}, ${theme.glow.gorse}`
          : theme.shadow.sm};
  @media (prefers-reduced-motion: reduce) {
    box-shadow: ${({ theme, $gorse }) => ($gorse ? `${theme.shadow.sm}, ${theme.glow.gorseReducedMotion}` : theme.shadow.sm)};
  }
`

const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const nodeLog = log('Node')

export default function Node({ data, isActive = false, onSend, onActivate, onTitleChange, onRemovePill, onJumpToPill, onSendPayload, onRetry, executionEvents, workflow, writeQueue }: NodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const {
    promptTxt,
    setPromptTxt,
    nodeViewState,
    focused,
    setHovered,
    setExpanded,
    setCollapsed,
    sendPrompt,
  } = useNodeState()

  const handleSend = useCallback(() => {
    sendPrompt()
    const payload: PromptPayload = { text: promptTxt.trim(), contextPills: data.contextPills, weightedContext: (data.contextPills?.length ?? 0) > 0 }
    if (onSendPayload) onSendPayload(payload)
    if (onSend) {
      onSend(promptTxt)
      nodeLog.info('Prompt sent', { promptTxt })
    }
  }, [data.contextPills, onSend, onSendPayload, promptTxt, sendPrompt])

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      if (onTitleChange) {
        onTitleChange(newTitle)
        nodeLog.info('Title changed', { newTitle })
      }
    },
    [onTitleChange]
  )

  const handleMouseEnter = useCallback(() => {
    setHovered()
  }, [setHovered])

  const handleMouseLeave = useCallback(() => {
    if (!focused) {
      setCollapsed()
    }
  }, [focused, setCollapsed])

  const handleClick = useCallback(() => {
    onActivate?.()
    if (nodeViewState === 'hovered' || nodeViewState === 'collapsed') {
      setExpanded()
    }
  }, [nodeViewState, onActivate, setExpanded])

  const handleKeyDown = useCallback(
    (evt: React.KeyboardEvent) => {
      if (evt.key === 'Escape') {
        if (focused) {
          setCollapsed()
        }
      }
    },
    [focused, setCollapsed]
  )

  const handleRightClick = useCallback((evt: React.MouseEvent) => { evt.preventDefault(); evt.stopPropagation(); setIsConfirmOpen(true) }, [])

  const handleDblClick = useCallback(() => {
    const nodeBox = nodeRef.current
    if (nodeBox) {
      const rect = nodeBox.getBoundingClientRect()
      sendPrompt(onSend, data, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    }
  }, [onSend, data, sendPrompt])

  useEffect(() => {
    const handleClickOutside = (evt: MouseEvent) => {
      const target = evt.target
      const isNodeSurface = target instanceof HTMLElement && target.closest('[data-testid="voice-composer-surface"], [data-testid="file-preview-area"]')
      const isInsideNode = target instanceof globalThis.Node && nodeRef.current?.contains(target)
      if (focused && nodeRef.current && !isInsideNode && !isNodeSurface) {
        setCollapsed()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [focused, setCollapsed])

  useEffect(() => {
    if (isActive) setExpanded()
  }, [isActive, setExpanded])

  const isMinimized = nodeViewState === 'collapsed'
  const isExpanded = isActive || nodeViewState === 'expanded' || nodeViewState === 'hovered'
  const isGorse = data.status === 'idle'

  return (
    <>
      <NodeTooltip node={data}>
        <NodeBox
          ref={nodeRef}
          $minimized={isMinimized}
          $focused={focused}
          $expanded={isExpanded}
          $gorse={isGorse}
          data-testid="node-gorse-light"
          data-light={isGorse ? 'gorse' : 'state'}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          onDoubleClick={handleDblClick}
          onContextMenu={handleRightClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-expanded={isExpanded}
          aria-controls={`voice-composer-${data.id}`}
        >
          <NodeHeader>
            <HeaderLeft>
              <NodeTitle title={data.title} onTitleChange={handleTitleChange} />
            </HeaderLeft>
            <HeaderRight>
              <NodeStatus status={data.status} />
            </HeaderRight>
          </NodeHeader>

        </NodeBox>
      </NodeTooltip>
       <VoiceTooltipComposer
        nodeId={data.id}
        title={data.title}
        status={data.status}
        value={promptTxt}
        onChange={setPromptTxt}
        onSend={handleSend}
        anchorRect={nodeRef.current?.getBoundingClientRect() ?? { left: 0, right: 160, top: 0, bottom: 60, width: 160, height: 60 }}
        viewport={{ width: window.innerWidth, height: window.innerHeight }}
        chatActive={isExpanded}
       manualFocus={focused}
        contextPills={data.contextPills}
        onRemovePill={onRemovePill}
         onJumpToPill={onJumpToPill}
         contextPayload={{ text: promptTxt, contextPills: data.contextPills, weightedContext: (data.contextPills?.length ?? 0) > 0 }}
       />
       {isExpanded && executionEvents && <ExecutionPanel workflow={workflow ?? ''} events={executionEvents} onRetry={() => onRetry?.(executionEvents.find(event => event.kind === 'step-error')?.stepId ?? '')} writeQueue={writeQueue} />}
       {isExpanded && <AgentContext data={data} executionEvents={executionEvents} />}
      {data.lifecycle === 'done' && isExpanded && <NodeDetailPanel markdown={data.bodyMarkdown} writeQueue={writeQueue} filePath={`${data.id}.md`} />}
      <ConfirmDialog isOpen={isConfirmOpen} workflow={workflow ?? ''} onConfirm={() => { setIsConfirmOpen(false); handleSend() }} onCancel={() => setIsConfirmOpen(false)} />
    </>
  )
}
