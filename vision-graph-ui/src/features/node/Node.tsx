import { useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import NodeTitle from './NodeTitle'
import NodeStatus from './NodeStatus'
import NodePromptArea from './NodePromptArea'
import NodeAgenticTodos from './NodeAgenticTodos'
import NodeTooltip from './NodeTooltip'
import NodeDetailPanel from './NodeDetailPanel'
import type { NodeProps } from './nodeTypes'
import { useNodeState } from './useNodeState'
import { log } from '../../shared/logger'

const NodeBox = styled.div<{ $minimized: boolean; $focused: boolean }>`
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme, $focused }) => ($focused ? theme.colors.borderActive : theme.colors.border)};
  border-radius: 12px;
  padding: ${({ $minimized }) => ($minimized ? '6px 10px' : '12px 14px')};
  min-width: ${({ $minimized }) => ($minimized ? '120px' : '320px')};
  transition: all 240ms ease;
  box-shadow: ${({ theme, $focused }) => ($focused ? theme.shadow.md : theme.shadow.sm)};
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
      if (evt.key === 'Escape' && focused) {
        setCollapsed()
      }
    },
    [focused, setCollapsed]
  )

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
    <NodeTooltip node={data}>
      <NodeBox
        ref={nodeRef}
        $minimized={isMinimized}
        $focused={focused}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
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
  )
}
