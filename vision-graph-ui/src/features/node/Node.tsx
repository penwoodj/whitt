import { useCallback, useMemo, useEffect, useRef } from 'react'
import styled from 'styled-components'
import NodeTitle from './NodeTitle'
import NodeStatus from './NodeStatus'
import NodePromptArea from './NodePromptArea'
import NodeAgenticTodos from './NodeAgenticTodos'
import NodeTooltip from './NodeTooltip'
import NodeDetailPanel from './NodeDetailPanel'
import type { NodeProps, NodeViewState } from './nodeTypes'
import { useNodeState } from './useNodeState'
import { useNodeLogging } from './useNodeLogging'

const NodeWrap = styled.div<{ $isActive?: boolean; $viewState: NodeViewState }>`
  display: flex;
  flex-direction: column;
  padding: ${({ $viewState }) => ($viewState === 'expanded' ? '16px' : $viewState === 'hovered' ? '8px' : '0')};
  border-radius: ${({ $viewState }) => ($viewState === 'expanded' ? '12px' : '50%')};
  background-color: ${({ $viewState, theme }) => ($viewState === 'expanded' ? theme.colors.bgElevated : 'transparent')};
  border: ${({ $viewState, theme }) => ($viewState === 'hovered' ? `1px dashed ${theme.colors.primary}` : 'none')};
  box-shadow: ${({ $isActive, $viewState, theme }) => {
    if ($viewState !== 'expanded') return 'none'
    return $isActive ? theme.glow.primary : theme.shadow.sm
  }};
  min-width: ${({ $viewState }) => ($viewState === 'expanded' ? '200px' : 'auto')};
  max-width: ${({ $viewState }) => ($viewState === 'expanded' ? '300px' : 'auto')};
  transition: border-radius 240ms ease, padding 240ms ease, background-color 240ms ease, box-shadow 240ms ease, min-width 240ms ease, max-width 240ms ease, border 240ms ease;

  &:hover {
    transform: none;
  }
`

const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const CollapsedTitle = styled.div`
  padding: 4px 8px;
  color: ${({ theme }) => theme.colors.text};
  font: ${({ theme }) => theme.font.sans};
  font-size: ${({ theme }) => theme.font.sizeMd};
  cursor: pointer;
  user-select: none;
  pointer-events: auto;
`

export default function Node({ data, isActive, onSend, onTitleChange }: NodeProps) {
  const nodeLog = useNodeLogging()
  const nodeRef = useRef<HTMLDivElement>(null)
  const {
    isRec,
    isStream,
    promptTxt,
    setPromptTxt,
    todosExpanded,
    detailExpanded,
    streamedTxt,
    nodeViewState,
    setHovered,
    setExpanded,
    setCollapsed,
    toggleRec,
    sendPrompt,
    toggleTodos,
    toggleDetail,
  } = useNodeState()

  const handleSend = useCallback(() => {
    sendPrompt()
    if (onSend) {
      onSend(promptTxt)
      nodeLog.info('Prompt sent', { promptTxt })
    }
  }, [sendPrompt, onSend, promptTxt, nodeLog])

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      if (onTitleChange) {
        onTitleChange(newTitle)
        nodeLog.info('Title changed', { newTitle })
      }
    },
    [onTitleChange, nodeLog]
  )

  const handleMouseEnter = useCallback(() => {
    if (nodeViewState === 'collapsed') {
      setHovered()
    }
  }, [nodeViewState, setHovered])

  const handleMouseLeave = useCallback(() => {
    if (nodeViewState === 'hovered') {
      setCollapsed()
    }
  }, [nodeViewState, setCollapsed])

  const handleClick = useCallback(() => {
    if (nodeViewState === 'hovered') {
      setExpanded()
    }
  }, [nodeViewState, setExpanded])

  const handleKeyDown = useCallback(
    (evt: React.KeyboardEvent) => {
      if (evt.key === 'Escape' && nodeViewState === 'expanded') {
        setCollapsed()
      }
    },
    [nodeViewState, setCollapsed]
  )

  useEffect(() => {
    const handleClickOutside = (evt: MouseEvent) => {
      if (nodeViewState === 'expanded' && nodeRef.current && !nodeRef.current.contains(evt.target as Node)) {
        setCollapsed()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [nodeViewState, setCollapsed])

  const showAgentic = data.lifecycle === 'agentic-running' || data.lifecycle === 'done'

  const nodeContent = useMemo(
    () => (
      <NodeWrap
        ref={nodeRef}
        $isActive={isActive}
        $viewState={nodeViewState}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-expanded={nodeViewState === 'expanded'}
      >
        {nodeViewState === 'collapsed' ? (
          <CollapsedTitle>{data.title}</CollapsedTitle>
        ) : (
          <>
            <NodeHeader>
              <NodeTitle title={data.title} onTitleChange={handleTitleChange} />
              {nodeViewState === 'expanded' && <NodeStatus status={data.status} />}
            </NodeHeader>

            {nodeViewState === 'expanded' && (
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

                {data.lifecycle === 'done' && (
                  <NodeDetailPanel expanded={detailExpanded} onToggle={toggleDetail} />
                )}
              </>
            )}
          </>
        )}
      </NodeWrap>
    ),
    [
      data,
      isActive,
      nodeViewState,
      isRec,
      isStream,
      promptTxt,
      streamedTxt,
      todosExpanded,
      detailExpanded,
      showAgentic,
      handleMouseEnter,
      handleMouseLeave,
      handleClick,
      handleKeyDown,
      toggleRec,
      toggleTodos,
      toggleDetail,
      setPromptTxt,
      handleSend,
      handleTitleChange,
    ]
  )

  return <NodeTooltip node={data}>{nodeContent}</NodeTooltip>
}