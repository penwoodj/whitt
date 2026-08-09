import { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import NodeTitle from './NodeTitle'
import NodeStatus from './NodeStatus'
import NodePromptArea from './NodePromptArea'
import NodeAgenticTodos from './NodeAgenticTodos'
import NodeTooltip from './NodeTooltip'
import NodeDetailPanel from './NodeDetailPanel'
import type { NodeProps } from './nodeTypes'
import { useNodeState } from './useNodeState'
import { useNodeLogging } from './useNodeLogging'

const NodeWrap = styled.div<{ $isActive?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ $isActive, theme }) => ($isActive ? theme.glow.primary : theme.shadow.sm)};
  min-width: 200px;
  max-width: 300px;
  transition: transform ${({ theme }) => theme.transition.base}, box-shadow ${({ theme }) => theme.transition.base};

  &:hover {
    transform: scale(${({ theme }) => theme.fishEye.scaleHover});
  }
`

const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

export default function Node({ data, isActive, onSend, onTitleChange }: NodeProps) {
  const nodeLog = useNodeLogging()
  const {
    isRec,
    isStream,
    promptTxt,
    setPromptTxt,
    todosExpanded,
    detailExpanded,
    streamedTxt,
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

  const showAgentic = data.lifecycle === 'agentic-running' || data.lifecycle === 'done'

  const nodeContent = useMemo(
    () => (
      <NodeWrap $isActive={isActive}>
        <NodeHeader>
          <NodeTitle title={data.title} onTitleChange={handleTitleChange} />
          <NodeStatus status={data.status} />
        </NodeHeader>

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

        <NodeDetailPanel
          expanded={detailExpanded}
          onToggle={toggleDetail}
        />
      </NodeWrap>
    ),
    [
      data,
      isActive,
      isRec,
      isStream,
      promptTxt,
      streamedTxt,
      todosExpanded,
      detailExpanded,
      showAgentic,
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