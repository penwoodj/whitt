import { useState } from 'react'
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

const TooltipMenu = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 20px;
  right: -12px;
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 0;
  min-width: 180px;
  z-index: 1000;
  opacity: ${props => (props.$visible ? 1 : 0)};
  visibility: ${props => (props.$visible ? 'visible' : 'hidden')};
  transition: opacity 150ms ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`

const MenuItem = styled.button`
  display: block;
  width: 100%;
  padding: 8px 16px;
  background: transparent;
  border: none;
  color: #fff;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  transition: background 150ms ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
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
  const [showMenu, setShowMenu] = useState(false)
  const [menuHovered, setMenuHovered] = useState(false)

  const handleMakeFolderClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onPromoteToHard()
    setShowMenu(false)
  }

  const handleSpeakToSelected = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('Speak to selected:', memberTitles)
    setShowMenu(false)
  }

  const handleOtherAction = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('Other action')
    setShowMenu(false)
  }

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
          {isHovered && !showMenu && (
            <GroupTooltip data-testid="group-tooltip">
              <div>{memberNodes.length} nodes</div>
              <div>
                {memberTitles.slice(0, 3).join(', ')}
                {memberTitles.length > 3 && '...'}
              </div>
            </GroupTooltip>
          )}
          {group.groupType === 'soft' && (
            <>
              <MakeFolderBtn
                data-testid="make-folder-action"
                type="button"
                $isHovered={isHovered || showMenu || menuHovered}
                aria-label="Make Folder"
                onClick={e => {
                  e.stopPropagation()
                  setShowMenu(!showMenu)
                }}
                onMouseEnter={() => setMenuHovered(true)}
                onMouseLeave={() => setMenuHovered(false)}
              >
                +
              </MakeFolderBtn>
              <TooltipMenu
                data-testid="group-action-menu"
                $visible={showMenu || menuHovered}
                onMouseEnter={() => setMenuHovered(true)}
                onMouseLeave={() => {
                  setMenuHovered(false)
                  setShowMenu(false)
                }}
              >
                <MenuItem
                  data-testid="menu-make-folder"
                  onClick={handleMakeFolderClick}
                >
                  Make Folder
                </MenuItem>
                <MenuItem
                  data-testid="menu-speak-to-selected"
                  onClick={handleSpeakToSelected}
                >
                  Speak to Selected
                </MenuItem>
                <MenuItem
                  data-testid="menu-other-action"
                  onClick={handleOtherAction}
                >
                  Other Action
                </MenuItem>
              </TooltipMenu>
            </>
          )}
        </>
      )}
    </GroupBoxContainer>
  )
}
