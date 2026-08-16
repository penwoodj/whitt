import styled from 'styled-components'

const GroupBoxContainer = styled.div<{ $isSelected: boolean }>`
  position: absolute;
  border: 2px solid ${({ $isSelected }) => ($isSelected ? '#007bff' : '#666')};
  background: rgba(0, 123, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #007bff;
    background: rgba(0, 123, 255, 0.1);
  }
`

const GroupTooltip = styled.div`
  position: absolute;
  left: 100%;
  top: 0;
  margin-left: 8px;
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none;
`

const ExpansionSurface = styled.div`
  position: absolute;
  left: 100%;
  top: 0;
  margin-left: 16px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
`

type GroupBoxProps = {
  group: {
    id: string
    memberIds: Set<string>
    bounds: { left: number; top: number; width: number; height: number }
    isExpanded: boolean
  }
  nodes: Array<{ id: string; data: { title: string } }>
  isSelected: boolean
  isHovered: boolean
  onClick: () => void
  onRightClick: () => void
  onDoubleClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function GroupBox({
  group,
  nodes,
  isSelected,
  isHovered,
  onClick,
  onRightClick,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave,
}: GroupBoxProps) {
  const memberNodes = nodes.filter(n => group.memberIds.has(n.id))

  return (
    <GroupBoxContainer
      data-testid="group-box"
      $isSelected={isSelected}
      style={{
        left: group.bounds.left,
        top: group.bounds.top,
        width: group.bounds.width,
        height: group.bounds.height,
      }}
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault()
        onRightClick()
      }}
      onDoubleClick={onDoubleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`Group with ${memberNodes.length} nodes`}
    >
      {isHovered && !group.isExpanded && (
        <GroupTooltip data-testid="group-tooltip">
          <div>{memberNodes.length} nodes</div>
          <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '4px' }}>
            {memberNodes.slice(0, 3).map(n => n.data.title).join(', ')}
            {memberNodes.length > 3 && '...'}
          </div>
        </GroupTooltip>
      )}

      {group.isExpanded && (
        <ExpansionSurface data-testid="group-expansion-surface">
          <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>
            Group Contents
          </h3>
          {memberNodes.map(node => (
            <div key={node.id} style={{ padding: '4px 0', fontSize: '13px' }}>
              {node.data.title}
            </div>
          ))}
        </ExpansionSurface>
      )}
    </GroupBoxContainer>
  )
}
