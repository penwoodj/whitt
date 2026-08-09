import { useMemo } from 'react'
import styled from 'styled-components'
import NodeMicBtn from '../node/NodeMicBtn'
import NodeStatus from '../node/NodeStatus'
import NodePromptArea from '../node/NodePromptArea'
import NodeDetailPanel from '../node/NodeDetailPanel'
import NodeTitle from '../node/NodeTitle'
import type { NodeData } from '../node/nodeTypes'
import { log } from '../../shared/logger'

type SimNodeData = NodeData & {
  markdown?: string
  onMicClick?: () => void
}

type SimNodeProps = {
  data: SimNodeData
}

const NodeWrap = styled.div`
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  min-width: 200px;
  max-width: 300px;
`

const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`

const NodeBody = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
`

const PromptWrap = styled.div`
  flex: 1;
`

export default function SimNode({ data }: SimNodeProps) {
  const simNodeLog = log('SimNode')

  const { markdown, onMicClick, ...nodeData } = data

  const handleTitleChange = useMemo(() => (newTitle: string) => {
    simNodeLog.info('Title changed', { newTitle })
  }, [simNodeLog])

  const handlePromptChange = useMemo(() => (newTxt: string) => {
    simNodeLog.debug('Prompt changed', { txt: newTxt })
  }, [simNodeLog])

  const handleDetailToggle = useMemo(() => () => {
    simNodeLog.info('Detail panel toggled')
  }, [simNodeLog])

  return (
    <NodeWrap>
      <NodeHeader>
        <NodeTitle title={nodeData.title} onTitleChange={handleTitleChange} />
        <NodeStatus status={nodeData.status} />
      </NodeHeader>

      <NodeBody>
        <NodeMicBtn
          isRec={nodeData.isRec}
          onToggleRec={onMicClick || (() => {})}
          onStreamTxt={() => {}}
        />
        <PromptWrap>
          <NodePromptArea
            value={nodeData.promptTxt}
            onChange={handlePromptChange}
            streamedTxt={nodeData.promptTxt}
            isStream={false}
          />
        </PromptWrap>
      </NodeBody>

      <NodeDetailPanel
        expanded={nodeData.detailExpanded}
        onToggle={handleDetailToggle}
        markdown={markdown}
      />
    </NodeWrap>
  )
}
