import type { NodeData } from './nodeTypes'
import styled from 'styled-components'

type NodeTooltipProps = {
  node: NodeData
  children: React.ReactNode
}

const TooltipWrap = styled.div`
  position: relative;
  display: inline-block;
`

const TooltipBox = styled.div`
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 12px;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.bgHover};
  color: ${({ theme }) => theme.colors.textInverse};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.font.sizeXs};
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  z-index: ${({ theme }) => theme.zIndex.tooltip};
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 50%;
    width: 8px;
    height: 8px;
    background-color: ${({ theme }) => theme.colors.bgHover};
    transform: translateY(-50%) rotate(45deg);
  }

  ${TooltipWrap}:hover & {
    opacity: 1;
    visibility: visible;
  }
`

const TooltipTitle = styled.div`
  font-weight: ${({ theme }) => theme.font.weightBold};
  margin-bottom: 4px;
`

const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const Capitalize = styled.span`
  text-transform: capitalize;
`

const MutedTxt = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
`

export default function NodeTooltip({ node, children }: NodeTooltipProps) {
  const lastUpdateTxt = node.lastUpdate ? node.lastUpdate.toLocaleTimeString() : 'Never'

  return (
    <TooltipWrap>
      {children}
      <TooltipBox className="node-tooltip">
        <TooltipTitle>{node.title}</TooltipTitle>
        <TooltipRow>
          <Capitalize>{node.status}</Capitalize>
          <MutedTxt>•</MutedTxt>
          <MutedTxt>Updated: {lastUpdateTxt}</MutedTxt>
        </TooltipRow>
      </TooltipBox>
    </TooltipWrap>
  )
}
