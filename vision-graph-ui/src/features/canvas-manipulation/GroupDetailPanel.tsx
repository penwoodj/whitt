import styled from 'styled-components'
import type { Group } from './useGrouping'
import type { Node as FlowNode } from '@xyflow/react'

type GroupDetailPanelProps = {
  group: Group
  memberNodes: FlowNode[]
  onClose: () => void
}

const PanelContainer = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  width: 400px;
  max-height: 600px;
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  color: #fff;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`

const GraphViewSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  min-height: 200px;
`

const SectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const MiniGraphContainer = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
`

const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const MemberItem = styled.div`
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  font-size: 14px;
`

export function GroupDetailPanel({ group, memberNodes, onClose }: GroupDetailPanelProps) {
  const memberTitles = memberNodes.map(n => n.data.title as string)

  return (
    <PanelContainer data-testid="group-detail-panel">
      <PanelHeader>
        <PanelTitle>Group Details</PanelTitle>
        <CloseButton onClick={onClose} data-testid="close-panel">×</CloseButton>
      </PanelHeader>
      
      <SectionTitle>Full Graph View</SectionTitle>
      <GraphViewSection data-testid="graph-view-section">
        <MiniGraphContainer data-testid="mini-graph">
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '12px'
          }}>
            {memberTitles.length} nodes
          </div>
        </MiniGraphContainer>
      </GraphViewSection>
      
      <SectionTitle>Members</SectionTitle>
      <MemberList>
        {memberTitles.map(title => (
          <MemberItem key={title}>{title}</MemberItem>
        ))}
      </MemberList>
    </PanelContainer>
  )
}