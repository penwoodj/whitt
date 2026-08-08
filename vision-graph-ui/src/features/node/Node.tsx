import { useCallback, useMemo } from 'react'
import NodeTitle from './NodeTitle'
import NodeMicBtn from './NodeMicBtn'
import NodeStatus from './NodeStatus'
import NodePromptArea from './NodePromptArea'
import NodeAgenticTodos from './NodeAgenticTodos'
import NodeTooltip from './NodeTooltip'
import NodeDetailPanel from './NodeDetailPanel'
import type { NodeProps } from './nodeTypes'
import { useNodeState } from './useNodeState'
import { useNodeLogging } from './useNodeLogging'

export default function Node({ data, onSend, onTitleChange }: NodeProps) {
  const nodeLog = useNodeLogging()
  const {
    isRec,
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

  const nodeContent = useMemo(
    () => (
      <div
        style={{
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          minWidth: '200px',
          maxWidth: '300px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          <NodeTitle title={data.title} onTitleChange={handleTitleChange} />
          <NodeStatus status={data.status} />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            marginBottom: '8px',
          }}
        >
          <NodeMicBtn
            isRec={isRec}
            onToggleRec={toggleRec}
            onStreamTxt={(txt) => setPromptTxt(txt)}
          />
          <div style={{ flex: 1 }}>
            <NodePromptArea
              value={promptTxt}
              onChange={setPromptTxt}
              onSend={handleSend}
              streamedTxt={streamedTxt}
            />
          </div>
        </div>

        <NodeAgenticTodos
          todos={data.todos}
          expanded={todosExpanded}
          onToggle={toggleTodos}
        />

        <NodeDetailPanel
          expanded={detailExpanded}
          onToggle={toggleDetail}
        />
      </div>
    ),
    [
      data,
      isRec,
      promptTxt,
      streamedTxt,
      todosExpanded,
      detailExpanded,
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
