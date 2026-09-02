import type { ReactNode } from 'react'
import styled from 'styled-components'
import type { NodeData } from './nodeTypes'

type NodeTooltipProps = { readonly node: NodeData; readonly children: ReactNode }
const TooltipWrap = styled.div`position: relative; display: inline-block;`
const TooltipBox = styled.div`position: absolute; left: 100%; top: 50%; transform: translateY(-50%); margin-left: ${({ theme }) => theme.spacing.sm}; padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md}; background: ${({ theme }) => theme.colors.bgHover}; color: ${({ theme }) => theme.colors.textInverse}; border-radius: ${({ theme }) => theme.radius.sm}; font-size: ${({ theme }) => theme.font.sizeXs}; white-space: nowrap; opacity: 0; visibility: hidden; pointer-events: none; z-index: ${({ theme }) => theme.zIndex.tooltip}; ${TooltipWrap}:hover & { opacity: 1; visibility: visible; }`
const TooltipTitle = styled.div`font-weight: ${({ theme }) => theme.font.weightBold}; margin-bottom: ${({ theme }) => theme.spacing.xs};`
const TooltipRow = styled.div`display: flex; align-items: center; gap: ${({ theme }) => theme.spacing.xs};`
const MutedTxt = styled.span`color: ${({ theme }) => theme.colors.textMuted};`

export default function NodeTooltip({ node, children }: NodeTooltipProps) {
  const lastUpdateTxt = node.lastUpdate ? node.lastUpdate.toLocaleTimeString() : 'Never'
  return <TooltipWrap>{children}<TooltipBox className="node-tooltip"><TooltipTitle>{node.title}</TooltipTitle><TooltipRow><span>{node.status}</span><MutedTxt>•</MutedTxt><MutedTxt>Updated: {lastUpdateTxt}</MutedTxt></TooltipRow></TooltipBox></TooltipWrap>
}
