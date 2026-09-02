import { useState, useCallback, useEffect, useRef } from 'react'
import '@xyflow/react/dist/style.css'
import { ReactFlow, Background, Controls, Handle, Position, useReactFlow, useNodesInitialized } from '@xyflow/react'
import styled from 'styled-components'
import type { Node as FlowNode, Edge, NodeProps, NodeTypes, OnConnect, OnEdgesChange, OnNodesChange } from '@xyflow/react'
import { Node } from '../node'
import type { NodeData } from '../node/nodeTypes'
import { DagFormatControl } from './DagFormatControl'
import { useGrouping } from '../canvas-manipulation/useGrouping'
import { GroupBox } from '../canvas-manipulation/GroupBox'
import { darkTheme } from '../../shared/theme'
import type { DagDirection } from './dagFormat'
import type { AgentEvt } from '../../shared/agent/types'

const GraphContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.bg};
`

const FlowSurface = styled(ReactFlow)`
  & .react-flow__viewport { transform-origin: 0 0; }
  & .react-flow__node { position: absolute; width: max-content; }
  & .react-flow__node { visibility: visible; }
  & .react-flow__edge-path { stroke: ${({ theme }) => theme.colors.primary}; stroke-width: 2; }
  & .react-flow__edge.selected .react-flow__edge-path { stroke: ${({ theme }) => theme.colors.borderActive}; }
  & .react-flow__background { pointer-events: none; }
`

const GraphBackground = styled(Background)`
  pointer-events: none;
`

const GraphControls = styled(Controls)`
  position: absolute;
  bottom: 16px;
  left: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  & .react-flow__controls-button { background: ${({ theme }) => theme.colors.bgElevated}; border-bottom: 1px solid ${({ theme }) => theme.colors.border}; fill: ${({ theme }) => theme.colors.textMuted}; width: 26px; height: 26px; }
  & .react-flow__controls-button:hover { background: ${({ theme }) => theme.colors.bgHover}; fill: ${({ theme }) => theme.colors.text}; }
  & .react-flow__controls-button svg { fill: currentColor; }
`

const CanvasActions = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  z-index: ${({ theme }) => theme.zIndex.overlay};
`

const NewNodeButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.bgElevated};
  cursor: pointer;
`

const SelectionHalo = styled.div<{ $left: number; $top: number; $width: number; $height: number }>`
  position: absolute;
  left: ${({ $left }) => $left}px;
  top: ${({ $top }) => $top}px;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  border: 2px dashed ${({ theme }) => theme.colors.borderActive};
  pointer-events: none;
  z-index: ${({ theme }) => theme.zIndex.overlay};
`

const NodeHandle = styled(Handle)`
  position: absolute;
  width: 8px;
  height: 8px;
  border: 2px solid ${({ theme }) => theme.colors.bgElevated};
  background: ${({ theme }) => theme.colors.borderActive};
`

const FlowNodeShell = styled.div` position: relative; `
const NodeHandleLeft = styled(NodeHandle)` left: -4px; top: 50%; transform: translateY(-50%); `
const NodeHandleRight = styled(NodeHandle)` right: -4px; top: 50%; transform: translateY(-50%); `

export type GraphWorkspaceProps = {
  nodes: FlowNode[]
  edges: Edge[]
  onNodeSend: (text: string) => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onSelectionChange: (change: { nodes: FlowNode[]; edges: Edge[] }) => void
  setNodes: React.Dispatch<React.SetStateAction<FlowNode[]>>
  selectedNodeIds: readonly string[]
  onFormat: (direction: DagDirection) => boolean
  activeNodeId: string | null
  onNodeMouseEnter: () => void
  onNodeMouseLeave: () => void
  onNodeDragStart: () => void
  onNodeDragStop: () => void
  onConnect: OnConnect
  onCreateNode: () => void
  onNodeClick: (nodeId: string, additive: boolean) => void
  onActiveNodeChange?: (nodeId: string) => void
  onRemovePill?: (pillId: string) => void
  onJumpToPill?: (pillId: string) => void
  onSendPayload?: (payload: import('../context-pills/contextPillTypes').PromptPayload) => void
  onRetry?: (stepId: string) => void
  executionEvents?: AgentEvt[]
  workflow?: string
  writeQueue?: import('../../shared/fs/WriteQueue').WriteQueue
}

const isNodeData = (value: unknown): value is NodeData => typeof value === 'object' && value !== null && 'id' in value && 'title' in value && 'status' in value

export function GraphWorkspace({ nodes, edges, onNodeSend, onNodesChange, onEdgesChange, onSelectionChange, setNodes, selectedNodeIds, onFormat, activeNodeId, onNodeMouseEnter, onNodeMouseLeave, onNodeDragStart, onNodeDragStop, onConnect, onCreateNode, onNodeClick, onActiveNodeChange, onRemovePill, onJumpToPill, onSendPayload, onRetry, executionEvents, workflow, writeQueue }: GraphWorkspaceProps) {
  const { getViewport, setViewport, fitView } = useReactFlow()
  const groupingData = useGrouping({ nodes })
  const dragStartRef = useRef<Map<string, { x: number; y: number }>>(new Map())
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null)
  const isNodesInitialized = useNodesInitialized()

  useEffect(() => {
    if (isNodesInitialized && nodes.length > 0) fitView({ padding: 0.15, maxZoom: 1 })
  }, [isNodesInitialized, nodes.length, fitView])

  const handleKeyDown = useCallback((evt: React.KeyboardEvent) => {
    const activeElement = document.activeElement
    const isInputFocused = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA' || activeElement?.getAttribute('contenteditable') === 'true'
    if (isInputFocused) return
    const viewport = getViewport()
    const panDelta = 50
    if (activeNodeId) {
      const delta = evt.shiftKey ? 10 : 1
      const axis = evt.key === 'ArrowRight' ? 'x' : evt.key === 'ArrowLeft' ? 'x' : 'y'
      const amount = evt.key === 'ArrowRight' || evt.key === 'ArrowDown' ? delta : -delta
      if (evt.key.startsWith('Arrow')) {
        setNodes(prev => prev.map(node => node.id === activeNodeId ? { ...node, position: { ...node.position, [axis]: node.position[axis] + amount } } : node))
        evt.preventDefault()
      }
      return
    }
    const pan = evt.key === 'ArrowRight' || evt.key === 'd' || evt.key === 'D' ? { x: -panDelta, y: 0 } : evt.key === 'ArrowLeft' || evt.key === 'a' || evt.key === 'A' ? { x: panDelta, y: 0 } : evt.key === 'ArrowUp' || evt.key === 'w' || evt.key === 'W' ? { x: 0, y: panDelta } : evt.key === 'ArrowDown' || evt.key === 's' || evt.key === 'S' ? { x: 0, y: -panDelta } : null
    if (pan) { setViewport({ x: viewport.x + pan.x, y: viewport.y + pan.y, zoom: viewport.zoom }); evt.preventDefault() }
  }, [activeNodeId, getViewport, setNodes, setViewport])

  const handleNodeDragStartWithSnapshot = useCallback((_: globalThis.MouseEvent | React.MouseEvent | TouchEvent, node: FlowNode) => {
    const selectedIds = new Set(nodes.filter(item => item.selected).map(item => item.id))
    const dragIds = selectedIds.has(node.id) ? selectedIds : new Set([node.id])
    const connectedIds = new Set(edges.flatMap(edge => edge.source === node.id ? [edge.target] : edge.target === node.id ? [edge.source] : []))
    dragStartRef.current = new Map(nodes.filter(item => dragIds.has(item.id) || connectedIds.has(item.id)).map(item => [item.id, item.position]))
    onNodeDragStart()
  }, [edges, nodes, onNodeDragStart])

  const handleNodeDrag = useCallback((_: globalThis.MouseEvent | React.MouseEvent | TouchEvent, node: FlowNode) => {
    const startPosition = dragStartRef.current.get(node.id)
    if (!startPosition) return
    const delta = { x: node.position.x - startPosition.x, y: node.position.y - startPosition.y }
    const connectedIds = new Set(edges.flatMap(edge => edge.source === node.id ? [edge.target] : edge.target === node.id ? [edge.source] : []))
    setNodes(currentNodes => currentNodes.map(currentNode => {
      const currentStart = dragStartRef.current.get(currentNode.id)
      if ((!currentStart && !connectedIds.has(currentNode.id)) || currentNode.id === node.id || !currentStart) return currentNode
      return { ...currentNode, position: { x: currentStart.x + delta.x, y: currentStart.y + delta.y } }
    }))
  }, [edges, setNodes])

  const handleNodeDragStopWithSnapshot = useCallback(() => { dragStartRef.current = new Map(); onNodeDragStop() }, [onNodeDragStop])

  useEffect(() => {
    const handleEscape = (evt: KeyboardEvent) => {
      if (evt.key !== 'Escape' || dragStartRef.current.size === 0) return
      const positions = dragStartRef.current
      setNodes(currentNodes => currentNodes.map(node => { const position = positions.get(node.id); return position ? { ...node, position } : node }))
      dragStartRef.current = new Map()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [setNodes])

  const handlePaneContextMenu = useCallback((evt: globalThis.MouseEvent | React.MouseEvent) => { evt.preventDefault(); if (selectedNodeIds.length > 1) groupingData.createGroup(new Set(selectedNodeIds)) }, [groupingData, selectedNodeIds])
  const handleNodeContextMenu = useCallback((evt: globalThis.MouseEvent | React.MouseEvent, node: FlowNode) => { evt.preventDefault(); const flowSelectedIds = nodes.filter(item => item.selected).map(item => item.id); const currentIds = flowSelectedIds.length > 1 ? flowSelectedIds : selectedNodeIds; const groupIds = currentIds.includes(node.id) ? currentIds : [...currentIds, node.id]; if (groupIds.length > 1) groupingData.createGroup(new Set(groupIds)) }, [groupingData, nodes, selectedNodeIds])
  const selectedNodes = nodes.filter(node => selectedNodeIds.includes(node.id))
  const selectedBounds = selectedNodes.length === 0 ? null : { left: Math.min(...selectedNodes.map(node => node.position.x)) - 8, top: Math.min(...selectedNodes.map(node => node.position.y)) - 8, width: Math.max(...selectedNodes.map(node => node.position.x + 160)) - Math.min(...selectedNodes.map(node => node.position.x)) + 16, height: Math.max(...selectedNodes.map(node => node.position.y + 50)) - Math.min(...selectedNodes.map(node => node.position.y)) + 16 }

  const renderNodeType = useCallback((props: NodeProps) => {
    if (!isNodeData(props.data)) return null
     return <FlowNodeShell><NodeHandleLeft type="target" position={Position.Left} /><Node data={props.data} isActive={props.id === activeNodeId} onActivate={() => onActiveNodeChange?.(props.id)} onSend={onNodeSend} onSendPayload={onSendPayload} onRetry={onRetry} onRemovePill={onRemovePill} onJumpToPill={onJumpToPill} executionEvents={executionEvents} workflow={workflow} writeQueue={writeQueue} /><NodeHandleRight type="source" position={Position.Right} /></FlowNodeShell>
  }, [activeNodeId, executionEvents, onActiveNodeChange, onJumpToPill, onNodeSend, onRemovePill, onRetry, onSendPayload, workflow, writeQueue])
  const workspaceNodeTypes: NodeTypes = { custom: renderNodeType }

  return (
    <GraphContainer data-testid="react-flow__canvas" data-selected-node-ids={selectedNodeIds.join(',')} data-selection-key="Shift" data-multi-selection-key="ControlOrMeta">
      <FlowSurface nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onSelectionChange={onSelectionChange} nodeTypes={workspaceNodeTypes} defaultViewport={{ x: 0, y: 0, zoom: 0.4 }} minZoom={0.1} maxZoom={2.5} zoomOnScroll zoomOnPinch panOnScroll={false} panOnDrag panActivationKeyCode={null} selectionOnDrag selectionKeyCode="Shift" multiSelectionKeyCode="ControlOrMeta" onPaneContextMenu={handlePaneContextMenu} onNodeContextMenu={handleNodeContextMenu} onNodeClick={(evt, node) => { onNodeClick(node.id, evt.ctrlKey || evt.metaKey); onActiveNodeChange?.(node.id) }} onConnect={onConnect} onNodeDragStart={handleNodeDragStartWithSnapshot} onNodeDrag={handleNodeDrag} onNodeDragStop={handleNodeDragStopWithSnapshot} proOptions={{ hideAttribution: true }} defaultEdgeOptions={{ type: 'default', style: { stroke: darkTheme.colors.primary, strokeWidth: 2 } }} onNodeMouseEnter={onNodeMouseEnter} onNodeMouseLeave={onNodeMouseLeave} onKeyDown={handleKeyDown}>
        <GraphBackground color={darkTheme.colors.border} gap={20} />
        <GraphControls showInteractive={false} showFitView />
        {selectedBounds && <SelectionHalo data-testid="selection-halo" $left={selectedBounds.left} $top={selectedBounds.top} $width={selectedBounds.width} $height={selectedBounds.height} />}
        {groupingData.groups.map(group => <GroupBox key={group.id} group={group} memberNodes={nodes.filter(node => group.memberIds.has(node.id))} isSelected={groupingData.activeGroupIds.has(group.id)} isHovered={hoveredGroupId === group.id} isRecording={false} onClick={() => groupingData.selectGroup(group.id)} onRightClick={() => groupingData.removeGroup(group.id)} onDoubleClick={() => groupingData.toggleGroupExpansion(group.id)} onMouseEnter={() => setHoveredGroupId(group.id)} onMouseLeave={() => setHoveredGroupId(null)} onPromoteToHard={() => {}} onFocus={() => groupingData.focusGroup(group.id)} />)}
      </FlowSurface>
      <CanvasActions><NewNodeButton type="button" onClick={onCreateNode}>+ New Node</NewNodeButton></CanvasActions>
      <DagFormatControl selectedNodeIds={selectedNodeIds} onFormat={onFormat} />
    </GraphContainer>
  )
}
