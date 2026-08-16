import { useState, useCallback, useEffect } from 'react'
import type { Node as FlowNode, Edge } from '@xyflow/react'
import styled from 'styled-components'
import { useGrouping } from './useGrouping'
import { useLinkDrawing } from './useLinkDrawing'
import { GroupBox } from './GroupBox'
import { ConnectionLineComponent } from './ConnectionLine'
import { EdgeWithDelete } from './EdgeWithDelete'
import type { FsPort } from '../../shared/fs/FsPort'

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
  fsPort?: FsPort
}

export function CanvasOps({ initialNodes, fsPort }: CanvasOpsProps) {
  const [nodes, setNodes] = useState<FlowNode[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set())
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null)
  const [lassoStart, setLassoStart] = useState<{ x: number; y: number } | null>(null)
  const [lassoEnd, setLassoEnd] = useState<{ x: number; y: number } | null>(null)
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null)
  const [isCtrlPressed, setIsCtrlPressed] = useState(false)
  
  const [panState, setPanState] = useState({
    translateX: 0,
    translateY: 0,
    isPanning: false,
    panStart: { x: 0, y: 0 }
  })
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean
    nodeIds: string[]
  }>({ show: false, nodeIds: [] })

  const [dragState, setDragState] = useState<{
    isDragging: boolean
    draggedNodeId: string | null
    dragStart: { x: number; y: number } | null
    nodeStartPositions: Map<string, { x: number; y: number }>
    isClick: boolean
    isCtrlClick: boolean
  }>({
    isDragging: false,
    draggedNodeId: null,
    dragStart: null,
    nodeStartPositions: new Map(),
    isClick: true,
    isCtrlClick: false,
  })

  const groupingData = useGrouping({ nodes, fsPort })

  const handlePromoteToHard = useCallback(async (group: { id: string; bounds: { left: number; top: number } }) => {
    await groupingData.promoteToHard(group.id)
    setNodes(prev => [
      ...prev,
      {
        id: `node-new-group-${group.id}`,
        position: { x: group.bounds.left, y: group.bounds.top - 80 },
        data: { title: 'New Group' },
      },
    ])
  }, [groupingData])
  const linkDrawingData = useLinkDrawing(nodes, edges)

  const handleCreateNode = useCallback(() => {
    const newNode = groupingData.createStandaloneNode()
    setNodes(prev => [...prev, newNode])
  }, [groupingData])

  const handleEdgeDelete = useCallback((edgeId: string) => {
    setEdges(prev => prev.filter(e => e.id !== edgeId))
    setSelectedEdgeId(null)
    setHoveredEdgeId(null)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    setNodes(prev => prev.filter(n => !deleteConfirm.nodeIds.includes(n.id)))
    setDeleteConfirm({ show: false, nodeIds: [] })
    setSelectedNodeIds(new Set())
  }, [deleteConfirm.nodeIds])

  const handleCancelDelete = useCallback(() => {
    setDeleteConfirm({ show: false, nodeIds: [] })
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedEdgeId) {
        handleEdgeDelete(selectedEdgeId)
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeIds.size > 0 && !deleteConfirm.show) {
        setDeleteConfirm({ show: true, nodeIds: Array.from(selectedNodeIds) })
      }

      if (e.key === 'Escape' && dragState.isDragging) {
        linkDrawingData.cancelConnection()
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
          isCtrlClick: false,
        })
      }

      if (e.key === 'Control' || e.key === 'Meta') {
        setIsCtrlPressed(true)
        document.body.setAttribute('data-control-pressed', 'true')
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control' || e.key === 'Meta') {
        setIsCtrlPressed(false)
        document.body.removeAttribute('data-control-pressed')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      document.body.removeAttribute('data-control-pressed')
    }
  }, [selectedEdgeId, handleEdgeDelete, selectedNodeIds, deleteConfirm.show, dragState, linkDrawingData, setNodes])

  const handleNodeClick = useCallback((nodeId: string, isCtrlClick: boolean = false) => {
    setSelectedNodeIds(prev => {
      if (isCtrlClick) {
        const next = new Set(prev)
        if (next.has(nodeId)) {
          next.delete(nodeId)
        } else {
          next.add(nodeId)
        }
        return next
      } else {
        return new Set([nodeId])
      }
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
    if (e.button === 0) {
      setPanState(prev => ({
        ...prev,
        isPanning: true,
        panStart: { x: e.clientX - prev.translateX, y: e.clientY - prev.translateY }
      }))
    } else if (e.button === 2) {
      if (selectedNodeIds.size >= 2) {
        groupingData.createGroup(selectedNodeIds)
      } else {
        setLassoStart({ x: e.clientX, y: e.clientY })
        setLassoEnd({ x: e.clientX, y: e.clientY })
      }
    }
  }, [selectedNodeIds, groupingData])

  const handleNodeMouseDown = useCallback((nodeId: string, e: React.MouseEvent) => {
    const isCtrlClick = e.ctrlKey || e.metaKey || isCtrlPressed || document.body.hasAttribute('data-control-pressed')

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
      isCtrlClick: isCtrlClick,
    })

    if (isCtrlClick) {
      linkDrawingData.startConnection(nodeId)
    }
  }, [nodes, selectedNodeIds, linkDrawingData, isCtrlPressed])

  const handleNodeMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      const isLinkDrag = dragState.isCtrlClick && linkDrawingData.connectionState.currentPosition !== null
      if (dragState.isClick && dragState.draggedNodeId && !isLinkDrag) {
        handleNodeClick(dragState.draggedNodeId, dragState.isCtrlClick)
      }

      setDragState({
        isDragging: false,
        draggedNodeId: null,
        dragStart: null,
        nodeStartPositions: new Map(),
        isClick: true,
        isCtrlClick: false,
      })
    }
  }, [dragState, handleNodeClick, linkDrawingData])

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (panState.isPanning) {
      setPanState(prev => ({
        ...prev,
        translateX: e.clientX - prev.panStart.x,
        translateY: e.clientY - prev.panStart.y
      }))
      return
    }
    
    if (dragState.isDragging && dragState.dragStart) {
      if (!dragState.isCtrlClick && (e.ctrlKey || e.metaKey || document.body.hasAttribute('data-control-pressed')) && dragState.draggedNodeId) {
        setDragState(prev => ({ ...prev, isCtrlClick: true }))
        linkDrawingData.startConnection(dragState.draggedNodeId)
        const hoverEl = (e.target as HTMLElement).closest('[data-node-id]')
        const targetNodeId = hoverEl ? hoverEl.getAttribute('data-node-id') : null
        linkDrawingData.updateConnection({ x: e.clientX, y: e.clientY }, targetNodeId)
        return
      }

      if (dragState.isCtrlClick) {
        const hoverEl = (e.target as HTMLElement).closest('[data-node-id]')
        const targetNodeId = hoverEl ? hoverEl.getAttribute('data-node-id') : null
        linkDrawingData.updateConnection({ x: e.clientX, y: e.clientY }, targetNodeId)
      } else {
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
      }
    } else if (lassoStart) {
      setLassoEnd({ x: e.clientX, y: e.clientY })
    }
  }, [dragState, lassoStart, linkDrawingData])

  const handleCanvasMouseUp = useCallback(() => {
    if (panState.isPanning) {
      setPanState(prev => ({
        ...prev,
        isPanning: false
      }))
      return
    }
    
    if (dragState.isDragging) {
      if (dragState.isCtrlClick) {
        const newEdge = linkDrawingData.completeConnection()
        if (newEdge) {
          setEdges(prev => [...prev, newEdge])
        }
      } else if (dragState.isClick && dragState.draggedNodeId) {
        handleNodeClick(dragState.draggedNodeId, dragState.isCtrlClick)
      }

      setDragState({
        isDragging: false,
        draggedNodeId: null,
        dragStart: null,
        nodeStartPositions: new Map(),
        isClick: true,
        isCtrlClick: false,
      })
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
  }, [dragState, lassoStart, lassoEnd, nodes, groupingData, linkDrawingData, setEdges, handleNodeClick])

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
      <button
        data-testid="create-node-action"
        onClick={handleCreateNode}
        type="button"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '8px 16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          background: 'white',
          cursor: 'pointer',
          zIndex: 100
        }}
      >
        + New Node
      </button>
      {nodes.map(node => (
        <NodeWrapper
          key={node.id}
          data-testid={`node-${node.id}`}
          data-node-id={node.id}
          $isSelected={selectedNodeIds.has(node.id)}
          $isConnectionTarget={linkDrawingData.connectionState.targetNodeId === node.id && linkDrawingData.connectionState.isValid}
          style={{
            left: node.position.x,
            top: node.position.y
          }}
          onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
          onMouseUp={handleNodeMouseUp}
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
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

      {groupingData.fsOps.folderCreated && (
        <div data-testid="folder-create-spy">folder created</div>
      )}
      {groupingData.fsOps.movedNames.map(movedName => (
        <div key={movedName} data-testid="file-move-spy">{movedName}</div>
      ))}
      {groupingData.groups.map(group => (
        <GroupBox
          key={group.id}
          group={group}
          memberNodes={nodes.filter(n => group.memberIds.has(n.id))}
          isSelected={groupingData.activeGroupIds.has(group.id)}
          isHovered={hoveredGroupId === group.id}
          onClick={() => groupingData.selectGroup(group.id)}
          onRightClick={() => groupingData.removeGroup(group.id)}
          onDoubleClick={() => groupingData.toggleGroupExpansion(group.id)}
          onMouseEnter={() => setHoveredGroupId(group.id)}
          onMouseLeave={() => setHoveredGroupId(null)}
          onPromoteToHard={() => handlePromoteToHard(group)}
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

      {deleteConfirm.show && (
        <div
          data-testid="delete-confirm-dialog"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            minWidth: '300px'
          }}
        >
          <h3 data-testid="delete-confirm-title">
            Delete {deleteConfirm.nodeIds.length} {deleteConfirm.nodeIds.length === 1 ? 'node' : 'nodes'}?
          </h3>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              data-testid="delete-cancel-btn"
              onClick={handleCancelDelete}
              type="button"
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              data-testid="delete-confirm-btn"
              onClick={handleConfirmDelete}
              type="button"
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                background: '#dc3545',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </CanvasContainer>
  )
}
