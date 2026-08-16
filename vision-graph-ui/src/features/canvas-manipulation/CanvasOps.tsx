import { useState, useCallback } from 'react'
import type { Node as FlowNode, Edge } from '@xyflow/react'
import styled from 'styled-components'

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: ${({ theme }) => theme.colors.bg};
`

const NodeWrapper = styled.div<{ $isSelected: boolean }>`
  position: absolute;
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: ${({ $isSelected }) => ($isSelected ? '#e0f0ff' : 'white')};
  cursor: pointer;
  user-select: none;
  z-index: 1;
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
  const [nodes] = useState<FlowNode[]>(initialNodes)
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set())
  const [lassoStart, setLassoStart] = useState<{ x: number; y: number } | null>(null)
  const [lassoEnd, setLassoEnd] = useState<{ x: number; y: number } | null>(null)

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
  }, [])

  const handleCanvasClick = useCallback(() => {
    setSelectedNodeIds(new Set())
    setLassoStart(null)
    setLassoEnd(null)
  }, [])

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 2) {
      setLassoStart({ x: e.clientX, y: e.clientY })
      setLassoEnd({ x: e.clientX, y: e.clientY })
    }
  }, [])

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (lassoStart) {
      setLassoEnd({ x: e.clientX, y: e.clientY })
    }
  }, [lassoStart])

  const handleCanvasMouseUp = useCallback(() => {
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
    }

    setLassoStart(null)
    setLassoEnd(null)
  }, [lassoStart, lassoEnd, nodes])

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
          style={{
            left: node.position.x,
            top: node.position.y
          }}
          onClick={(e) => {
            e.stopPropagation()
            handleNodeClick(node.id, e.ctrlKey || e.metaKey)
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

      <CanvasClickArea
        onClick={handleCanvasClick}
        role="button"
        tabIndex={0}
        aria-label="Clear selection"
      />
    </CanvasContainer>
  )
}
