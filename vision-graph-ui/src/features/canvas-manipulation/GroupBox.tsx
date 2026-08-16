import styled from 'styled-components'
import type { Group } from './useGrouping'
import type { Node as FlowNode } from '@xyflow/react'

type GroupBoxProps = {
  group: Group
  memberNodes: FlowNode[]
  isSelected: boolean
  isHovered: boolean
  onClick: () => void
  onRightClick: () => void
  onDoubleClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  onPromoteToHard: () => void
}

const GroupBoxContainer = styled.div<{
  $groupType: string
  $isSelected: boolean
}>`
  position: absolute;
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 200ms ease, background-color 200ms ease;
  ${props => props.$groupType === 'hard'
    ? `
      border: 3px solid #00008b;
      background-color: rgba(0, 123, 255, 0.8);
    `
    : `
      border: 2px dashed #007bff;
      background-color: transparent;
    `}
  ${props => props.$isSelected && 'box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);'}
`

const GroupTooltip = styled.div`
  position: absolute;
  top: -28px;
  left: 0;
  background: rgba(30, 30, 30, 0.9);
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
`

const MakeFolderBtn = styled.button<{ $isHovered: boolean }>`
  position: absolute;
  top: -12px;
  right: -12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #007bff;
  background: #fff;
  color: #007bff;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  opacity: ${props => (props.$isHovered ? 1 : 0)};
  transition: opacity 120ms ease;
`

const ExpansionSurface = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(30, 30, 30, 0.95);
  border-radius: 12px;
  padding: 12px;
  color: #fff;
  overflow: hidden;
`

export function GroupBox({
  group,
  memberNodes,
  isSelected,
  isHovered,
  onClick,
  onRightClick,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave,
  onPromoteToHard,
}: GroupBoxProps) {
  const memberTitles = memberNodes.map(n => n.data.title as string)

  return (
    <GroupBoxContainer
      data-testid="group-box"
      data-group-type={group.groupType}
      style={{
        left: group.bounds.left,
        top: group.bounds.top,
        width: group.bounds.width,
        height: group.bounds.height,
      }}
      $groupType={group.groupType}
      $isSelected={isSelected}
      onClick={onClick}
      onContextMenu={e => {
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
      {group.isExpanded ? (
        <ExpansionSurface data-testid="group-expansion-surface">
          {memberTitles.map(title => (
            <div key={title}>{title}</div>
          ))}
        </ExpansionSurface>
      ) : (
        <>
          {isHovered && (
            <GroupTooltip data-testid="group-tooltip">
              <div>{memberNodes.length} nodes</div>
              <div>
                {memberTitles.slice(0, 3).join(', ')}
                {memberTitles.length > 3 && '...'}
              </div>
            </GroupTooltip>
          )}
          {group.groupType === 'soft' && (
            <MakeFolderBtn
              data-testid="make-folder-action"
              type="button"
              $isHovered={isHovered}
              aria-label="Make Folder"
              onClick={e => {
                e.stopPropagation()
                onPromoteToHard()
              }}
            >
              +
            </MakeFolderBtn>
          )}
        </>
      )}
    </GroupBoxContainer>
  )
}
