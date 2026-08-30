import { useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import NodeTitle from './NodeTitle'
import NodeStatus from './NodeStatus'
import NodePromptArea from './NodePromptArea'
import NodeAgenticTodos from './NodeAgenticTodos'
import NodeTooltip from './NodeTooltip'
import NodeDetailPanel from './NodeDetailPanel'
import { NodeModalWrapper } from './NodeModalWrapper'
import { NodeModalBarSlot } from './NodeModalBarSlot'
import { NodeModalContent } from './NodeModalContent'
import { NodeModalHalo } from './NodeModalHalo'
import type { NodeProps } from './nodeTypes'
import { useNodeState } from './useNodeState'
import { log } from '../../shared/logger'

const NodeBox = styled.div<{ $minimized: boolean; $focused: boolean; $expanded: boolean }>`
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid
    ${({ theme, $focused, $expanded }) =>
      $focused || $expanded ? theme.colors.borderActive : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ $minimized }) => ($minimized ? '6px 10px' : '12px 14px')};
  min-width: ${({ $minimized }) => ($minimized ? '120px' : '320px')};
  transition: all 240ms ease;
  box-shadow: ${({ theme, $focused, $expanded }) =>
    $focused
      ? `${theme.shadow.md}, ${theme.glow.primaryStrong}`
      : $expanded
        ? `${theme.shadow.md}, ${theme.glow.primary}`
        : theme.shadow.sm};
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

const CloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1;
  transition: color 120ms ease, background-color 120ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.bgHover};
  }
`

const nodeLog = log('Node')

export default function Node({ data, onSend, onTitleChange }: NodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const {
    isRec,
    isStream,
    promptTxt,
    setPromptTxt,
    todosExpanded,
    streamedTxt,
    nodeViewState,
    focused,
    setHovered,
    setExpanded,
    setCollapsed,
    toggleRec,
    sendPrompt,
    toggleTodos,
    isModalOpen,
    openNodeModal,
    closeNodeModal,
  } = useNodeState()

  const handleSend = useCallback(() => {
    sendPrompt()
    if (onSend) {
      onSend(promptTxt)
      nodeLog.info('Prompt sent', { promptTxt })
    }
  }, [sendPrompt, onSend, promptTxt])

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
    if (!focused && !isStream) {
      setCollapsed()
    }
  }, [focused, isStream, setCollapsed])

  const handleClick = useCallback(() => {
    if (nodeViewState === 'hovered') {
      setExpanded()
    }
  }, [nodeViewState, setExpanded])

  const handleCloseBtn = useCallback(() => {
    setCollapsed()
  }, [setCollapsed])

  const handleKeyDown = useCallback(
    (evt: React.KeyboardEvent) => {
      if (evt.key === 'Escape') {
        // ESC precedence: tooltip → modal → node (innermost-focus-first)
        const tooltipElement = document.querySelector('[data-testid*="tooltip"][data-focused="true"]')
        if (tooltipElement && isModalOpen) {
          evt.preventDefault()
          return
        }

        if (isModalOpen) {
          closeNodeModal()
          return
        }

        if (focused) {
          setCollapsed()
        }
      }
    },
    [focused, setCollapsed, isModalOpen, closeNodeModal]
  )

  const handleRightClick = useCallback(
    (evt: React.MouseEvent) => {
      evt.preventDefault()
      evt.stopPropagation()
      const nodeBox = nodeRef.current
      if (nodeBox) {
        const rect = nodeBox.getBoundingClientRect()
        openNodeModal(data.id, data, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, false)
      }
    },
    [data, openNodeModal]
  )

  const handleDblClick = useCallback(() => {
    const nodeBox = nodeRef.current
    if (nodeBox) {
      const rect = nodeBox.getBoundingClientRect()
      sendPrompt(onSend, data, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    }
  }, [onSend, data, sendPrompt])

  useEffect(() => {
    const handleClickOutside = (evt: MouseEvent) => {
      if (focused && nodeRef.current && !nodeRef.current.contains(evt.target as Node)) {
        setCollapsed()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [focused, setCollapsed])

  const showAgentic = data.lifecycle === 'agentic-running' || data.lifecycle === 'done'

  const isMinimized = nodeViewState === 'collapsed'
  const isExpanded = nodeViewState === 'expanded' || nodeViewState === 'hovered'

  return (
    <>
      <NodeTooltip node={data}>
        <NodeBox
          ref={nodeRef}
          $minimized={isMinimized}
          $focused={focused}
          $expanded={isExpanded}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          onDoubleClick={handleDblClick}
          onContextMenu={handleRightClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-expanded={isExpanded}
        >
          <NodeHeader>
            <HeaderLeft>
              <NodeTitle title={data.title} onTitleChange={handleTitleChange} />
            </HeaderLeft>
            <HeaderRight>
              <NodeStatus status={data.status} />
              {focused && <CloseBtn onClick={handleCloseBtn}>×</CloseBtn>}
            </HeaderRight>
          </NodeHeader>

          {isExpanded && (
            <>
              <NodeAgenticTodos
                todos={data.todos}
                expanded={todosExpanded}
                onToggle={toggleTodos}
                showAgentic={showAgentic}
              />

              <NodePromptArea
                value={promptTxt}
                onChange={setPromptTxt}
                streamedTxt={streamedTxt}
                isStream={isStream}
                isRec={isRec}
                isCycleRun={data.isCycleRun || false}
                onToggleRec={toggleRec}
                onStreamTxt={setPromptTxt}
                onSend={handleSend}
              />

              {data.lifecycle === 'done' && <NodeDetailPanel markdown={(data as any).bodyMarkdown} />}
            </>
          )}
        </NodeBox>
      </NodeTooltip>

      <NodeModalWrapper
        isOpen={Boolean(isModalOpen)}
        onClose={closeNodeModal}
        origin={isModalOpen ? { x: isModalOpen.originX, y: isModalOpen.originY } : undefined}
      >
        <NodeModalHalo state={data.status} isLive={data.lifecycle === 'agentic-running' || data.lifecycle === 'done'}>
          <NodeModalBarSlot
            state={isRec ? 'recording' : data.status}
            isRec={isRec}
            onToggleRec={toggleRec}
            onSend={handleSend}
          />
          <NodeModalContent>
            <NodeAgenticTodos
              todos={data.todos}
              expanded={todosExpanded}
              onToggle={toggleTodos}
              showAgentic={showAgentic}
            />
            <NodePromptArea
              value={promptTxt}
              onChange={setPromptTxt}
              streamedTxt={streamedTxt}
              isStream={isStream}
              isRec={isRec}
              isCycleRun={data.isCycleRun || false}
              onToggleRec={toggleRec}
              onStreamTxt={setPromptTxt}
              onSend={handleSend}
            />
            {data.lifecycle === 'done' && <NodeDetailPanel markdown={(data as any).bodyMarkdown} />}
          </NodeModalContent>
        </NodeModalHalo>
      </NodeModalWrapper>
    </>
  )
}
