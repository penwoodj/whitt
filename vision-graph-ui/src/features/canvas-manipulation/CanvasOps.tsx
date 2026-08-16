import { useState, useCallback, useEffect } from 'react'
import type { Node as FlowNode, Edge } from '@xyflow/react'
import styled from 'styled-components'
import { useGrouping } from './useGrouping'
import { useLinkDrawing } from './useLinkDrawing'
import { GroupBox } from './GroupBox'
import { ConnectionLineComponent } from './ConnectionLine'
import { EdgeWithDelete } from './EdgeWithDelete'

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: ${({ theme }) => theme.colors.bg};
`

const NodeWrapper = styled.div<{ $isSelected: boolean; $isConnectionTarget: boolean }>`
  position: absolute;
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: ${({ $isSelected }) => ($isSelected ? '#e0f0ff' : 'white')};
  cursor: pointer;
  user-select: none;
  z-index: 1;
  box-shadow: ${({ $isConnectionTarget }) => $isConnectionTarget ? '0 0 8px rgba(0, 123, 255, 0.5)' : 'none'};

  &::after {
    content: '';
    position: absolute;
    right: -12px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 100%;
    background: transparent;
    cursor: crosshair;
  }
`

const SelectionHalo = styled.div`
  position: absolute;
  border: 2px dashed #007bff;
  pointer-events: none;
`

const CanvasClickArea = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
`

type CanvasOpsProps = {
  initialNodes: FlowNode[]
  initialEdges?: Edge[]
}

export function CanvasOps({ initialNodes }: CanvasOpsProps) {
  const [nodes, setNodes] = useState<FlowNode[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set())
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null)
  const [lassoStart, setLassoStart] = useState<{ x: number; y: number } | null>(null)
  const [lassoEnd, setLassoEnd] = useState<{ x: number; y: number } | null>(null)
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null)

  const [dragState, setDragState] = useState<{
    isDragging: boolean
    draggedNodeId: string | null
    dragStart: { x: number; y: number } | null
    nodeStartPositions: Map<string, { x: number; y: number }>
    isClick: boolean
  }>({
    isDragging: false,
    draggedNodeId: null,
    dragStart: null,
    nodeStartPositions: new Map(),
    isClick: true,
  })

  const groupingData = useGrouping(nodes)
  const linkDrawingData = useLinkDrawing(nodes, edges)

  const handleEdgeDelete = useCallback((edgeId: string) => {
    setEdges(prev => prev.filter(e => e.id !== edgeId))
    setSelectedEdgeId(null)
    setHoveredEdgeId(null)
  }, [])

  const isValidConnection = useCallback((connection: { source: string; target: string }) => {
    if (connection.source === connection.target) return false
    const existingEdge = edges.find(e => e.source === connection.source && e.target === connection.target)
    return !existingEdge
  }, [edges])

  const onBeforeDelete = useCallback((edge: Edge) => {
    return true
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedEdgeId) {
        handleEdgeDelete(selectedEdgeId)
      }

      if (e.key === 'Escape' && dragState.isDragging) {
        setNodes(prevNodes =>
          prevNodes.map(node => {
            if (dragState.nodeStartPositions.has(node.id)) {
              const startPos = dragState.nodeStartPositions.get(node.id)!
              return {
                ...node,
                position: { ...startPos },
              }
            }
            return node
          })
        )

        setDragState({
          isDragging: false,
          draggedNodeId: null,
          dragStart: null,
          nodeStartPositions: new Map(),
          isClick: true,
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedEdgeId, handleEdgeDelete, dragState])

  const handleNodeClick = useCallback((nodeId: string, isCtrlClick: boolean = false) => {
    setSelectedNodeIds(prev => {
      const next = new Set(prev)
      if (isCtrlClick) {
        if (next.has(nodeId)) {
          next.delete(nodeId)
        } else {
          next.add(nodeId)
        }
      } else {
        next.clear()
        next.add(nodeId)
      }
      return next
    })
    groupingData.clearGroupSelection()
  }, [groupingData])

  const handleCanvasClick = useCallback(() => {
    setSelectedNodeIds(new Set())
    setLassoStart(null)
    setLassoEnd(null)
    groupingData.clearGroupSelection()
    linkDrawingData.cancelConnection()
  }, [groupingData, linkDrawingData])

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 2) {
      if (selectedNodeIds.size >= 2) {
        groupingData.createGroup(selectedNodeIds)
      } else {
        setLassoStart({ x: e.clientX, y: e.clientY })
        setLassoEnd({ x: e.clientX, y: e.clientY })
      }
    }
  }, [selectedNodeIds, groupingData])

  const handleNodeMouseDown = useCallback((nodeId: string, e: React.MouseEvent) => {
    if (e.button === 0) {
      if (e.ctrlKey) {
        const node = nodes.find(n => n.id === nodeId)
        if (node) {
          const rightEdge = { x: node.position.x + 150, y: node.position.y + 25 }
          const dx = Math.abs(e.clientX - rightEdge.x)
          const dy = Math.abs(e.clientY - rightEdge.y)

          if (dx < 15 && dy < 25) {
            e.stopPropagation()
            linkDrawingData.startConnection(nodeId)
            return
          }
        }
      }

      const nodePositions = new Map<string, { x: number; y: number }>()
      if (selectedNodeIds.has(nodeId)) {
        selectedNodeIds.forEach(id => {
          const node = nodes.find(n => n.id === id)
          if (node) {
            nodePositions.set(id, { ...node.position })
          }
        })
      } else {
        const node = nodes.find(n => n.id === nodeId)
        if (node) {
          nodePositions.set(nodeId, { ...node.position })
        }
      }

      setDragState({
        isDragging: true,
        draggedNodeId: nodeId,
        dragStart: { x: e.clientX, y: e.clientY },
        nodeStartPositions: nodePositions,
        isClick: true,
      })
    }
  }, [nodes, selectedNodeIds, linkDrawingData])

  const handleNodeMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      if (dragState.isClick && dragState.draggedNodeId) {
        handleNodeClick(dragState.draggedNodeId, false)
      }

      setDragState({
        isDragging: false,
        draggedNodeId: null,
        dragStart: null,
        nodeStartPositions: new Map(),
        isClick: true,
      })
    } else if (linkDrawingData.connectionState.isDrawing) {
      const newEdge = linkDrawingData.completeConnection()
      if (newEdge) {
        setEdges(prev => [...prev, newEdge])
      }
    }
  }, [dragState, linkDrawingData, setEdges, handleNodeClick])

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragState.isDragging && dragState.dragStart) {
      const dx = e.clientX - dragState.dragStart.x
      const dy = e.clientY - dragState.dragStart.y
      const dragDistance = Math.sqrt(dx * dx + dy * dy)

      if (dragDistance > 4) {
        setDragState(prev => ({ ...prev, isClick: false }))
      }

      if (!dragState.isClick) {
        setNodes(prevNodes =>
          prevNodes.map(node => {
            if (dragState.nodeStartPositions.has(node.id)) {
              const startPos = dragState.nodeStartPositions.get(node.id)!
              return {
                ...node,
                position: {
                  x: startPos.x + dx,
                  y: startPos.y + dy,
                },
              }
            }
            return node
          })
        )
      }
    } else if (linkDrawingData.connectionState.isDrawing && linkDrawingData.connectionState.sourceNodeId) {
      const sourceNode = nodes.find(n => n.id === linkDrawingData.connectionState.sourceNodeId)
      if (sourceNode) {
        const targetNodeId = nodes.find(n => {
          const nodeRect = {
            left: n.position.x,
            top: n.position.y,
            right: n.position.x + 150,
            bottom: n.position.y + 50,
          }
          return e.clientX >= nodeRect.left && e.clientX <= nodeRect.right &&
                 e.clientY >= nodeRect.top && e.clientY <= nodeRect.bottom
        })?.id || null

        linkDrawingData.updateConnection({ x: e.clientX, y: e.clientY }, targetNodeId)
      }
    } else if (lassoStart) {
      setLassoEnd({ x: e.clientX, y: e.clientY })
    }
  }, [dragState, lassoStart, nodes, linkDrawingData])

  const handleCanvasMouseUp = useCallback(() => {
    if (linkDrawingData.connectionState.isDrawing) {
      const newEdge = linkDrawingData.completeConnection()
      if (newEdge) {
        setEdges(prev => [...prev, newEdge])
      }
      return
    }

    if (lassoStart && lassoEnd) {
      const minX = Math.min(lassoStart.x, lassoEnd.x)
      const maxX = Math.max(lassoStart.x, lassoEnd.x)
      const minY = Math.min(lassoStart.y, lassoEnd.y)
      const maxY = Math.max(lassoStart.y, lassoEnd.y)

      const enclosedNodes = nodes.filter(node => {
        const nodeX = node.position.x
        const nodeY = node.position.y
        return nodeX >= minX && nodeX <= maxX && nodeY >= minY && nodeY <= maxY
      })

      setSelectedNodeIds(new Set(enclosedNodes.map(n => n.id)))
      groupingData.clearGroupSelection()
    }

    setLassoStart(null)
    setLassoEnd(null)
  }, [lassoStart, lassoEnd, nodes, groupingData, linkDrawingData, setEdges])

  const selectionBounds = selectedNodeIds.size > 0 ? (() => {
    const selectedNodes = nodes.filter(n => selectedNodeIds.has(n.id))
    if (selectedNodes.length === 0) return null

    const minX = Math.min(...selectedNodes.map(n => n.position.x))
    const maxX = Math.max(...selectedNodes.map(n => n.position.x + 100))
    const minY = Math.min(...selectedNodes.map(n => n.position.y))
    const maxY = Math.max(...selectedNodes.map(n => n.position.y + 40))

    return { left: minX, top: minY, width: maxX - minX, height: maxY - minY }
  })() : null

  const lassoBounds = lassoStart && lassoEnd ? (() => {
    const minX = Math.min(lassoStart.x, lassoEnd.x)
    const maxX = Math.max(lassoStart.x, lassoEnd.x)
    const minY = Math.min(lassoStart.y, lassoEnd.y)
    const maxY = Math.max(lassoStart.y, lassoEnd.y)

    return { left: minX, top: minY, width: maxX - minX, height: maxY - minY }
  })() : null

  return (
    <CanvasContainer
      data-testid="react-flow-canvas"
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      {nodes.map(node => (
        <NodeWrapper
          key={node.id}
          data-testid={`node-${node.id}`}
          $isSelected={selectedNodeIds.has(node.id)}
          $isConnectionTarget={linkDrawingData.connectionState.targetNodeId === node.id}
          style={{
            left: node.position.x,
            top: node.position.y
          }}
          onClick={(e) => {
            e.stopPropagation()
            handleNodeClick(node.id, e.ctrlKey || e.metaKey)
          }}
          onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
          onMouseUp={handleNodeMouseUp}
          role="button"
          tabIndex={0}
          aria-label={`Select ${node.data.title as string}`}
        >
          {node.data.title as string}
        </NodeWrapper>
      ))}

      {selectionBounds && (
        <SelectionHalo
          data-testid="selection-halo"
          className="visible"
          style={{
            left: selectionBounds.left,
            top: selectionBounds.top,
            width: selectionBounds.width,
            height: selectionBounds.height
          }}
        />
      )}

      {lassoBounds && (
        <SelectionHalo
          data-testid="lasso-box"
          style={{
            left: lassoBounds.left,
            top: lassoBounds.top,
            width: lassoBounds.width,
            height: lassoBounds.height,
            border: '2px solid #007bff',
            background: 'rgba(0, 123, 255, 0.1)'
          }}
        />
      )}

      {groupingData.groups.map(group => (
        <GroupBox
          key={group.id}
          group={group}
          nodes={nodes.map(n => ({ id: n.id, data: { title: n.data.title as string } }))}
          isSelected={groupingData.activeGroupIds.has(group.id)}
          isHovered={hoveredGroupId === group.id}
          onClick={() => groupingData.selectGroup(group.id)}
          onRightClick={() => groupingData.removeGroup(group.id)}
          onDoubleClick={() => groupingData.toggleGroupExpansion(group.id)}
          onMouseEnter={() => setHoveredGroupId(group.id)}
          onMouseLeave={() => setHoveredGroupId(null)}
        />
      ))}

      {linkDrawingData.connectionState.isDrawing && linkDrawingData.connectionState.sourceNodeId && linkDrawingData.connectionState.currentPosition && (() => {
        const sourceNode = nodes.find(n => n.id === linkDrawingData.connectionState.sourceNodeId)
        if (!sourceNode) return null
        return (
          <ConnectionLineComponent
            sourcePosition={{ x: sourceNode.position.x + 150, y: sourceNode.position.y + 25 }}
            targetPosition={linkDrawingData.connectionState.currentPosition}
            isValid={linkDrawingData.connectionState.isValid}
          />
        )
      })()}

      {edges.map(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source)
        const targetNode = nodes.find(n => n.id === edge.target)
        if (!sourceNode || !targetNode) return null

        return (
          <EdgeWithDelete
            key={edge.id}
            edgeId={edge.id}
            sourcePosition={{ x: sourceNode.position.x + 150, y: sourceNode.position.y + 25 }}
            targetPosition={{ x: targetNode.position.x, y: targetNode.position.y + 25 }}
            isHovered={hoveredEdgeId === edge.id}
            isSelected={selectedEdgeId === edge.id}
            onDelete={() => handleEdgeDelete(edge.id)}
            onClick={() => setSelectedEdgeId(edge.id)}
            onMouseEnter={() => setHoveredEdgeId(edge.id)}
            onMouseLeave={() => setHoveredEdgeId(null)}
          />
        )
      })}

      <CanvasClickArea
        onClick={handleCanvasClick}
        role="button"
        tabIndex={0}
        aria-label="Clear selection"
      />
    </CanvasContainer>
  )
}
