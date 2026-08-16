import { useState, useCallback, useMemo } from 'react'
import type { Node as FlowNode, Edge } from '@xyflow/react'

type ConnectionState = {
  isDrawing: boolean
  sourceNodeId: string | null
  targetNodeId: string | null
  currentPosition: { x: number; y: number } | null
  isValid: boolean
}

export function useLinkDrawing(nodes: FlowNode[], edges: Edge[]) {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isDrawing: false,
    sourceNodeId: null,
    targetNodeId: null,
    currentPosition: null,
    isValid: false,
  })

  const hasCycle = useCallback((sourceId: string, targetId: string, currentEdges: Edge[]): boolean => {
    if (sourceId === targetId) return true

    const buildAdjacencyList = (edgesList: Edge[]) => {
      const adj: Record<string, string[]> = {}
      edgesList.forEach(edge => {
        if (!adj[edge.source]) adj[edge.source] = []
        adj[edge.source].push(edge.target)
      })
      return adj
    }

    const adj = buildAdjacencyList(currentEdges)

    const visited = new Set<string>()
    const stack = [targetId]

    while (stack.length > 0) {
      const current = stack.pop()!
      if (current === sourceId) return true
      if (visited.has(current)) continue
      visited.add(current)

      if (adj[current]) {
        for (const neighbor of adj[current]) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor)
          }
        }
      }
    }

    return false
  }, [])

  const startConnection = useCallback((nodeId: string) => {
    setConnectionState({
      isDrawing: true,
      sourceNodeId: nodeId,
      targetNodeId: null,
      currentPosition: null,
      isValid: false,
    })
  }, [])

  const updateConnection = useCallback((position: { x: number; y: number }, targetNodeId: string | null) => {
    setConnectionState(prev => {
      const isValid = targetNodeId !== null && targetNodeId !== prev.sourceNodeId && !hasCycle(prev.sourceNodeId!, targetNodeId, edges)

      return {
        ...prev,
        currentPosition: position,
        targetNodeId,
        isValid,
      }
    })
  }, [edges, hasCycle])

  const completeConnection = useCallback((): Edge | null => {
    if (!connectionState.sourceNodeId || !connectionState.targetNodeId || !connectionState.isValid) {
      setConnectionState({
        isDrawing: false,
        sourceNodeId: null,
        targetNodeId: null,
        currentPosition: null,
        isValid: false,
      })
      return null
    }

    const newEdge: Edge = {
      id: `edge-${connectionState.sourceNodeId}-${connectionState.targetNodeId}`,
      source: connectionState.sourceNodeId,
      target: connectionState.targetNodeId,
      type: 'default',
    }

    setConnectionState({
      isDrawing: false,
      sourceNodeId: null,
      targetNodeId: null,
      currentPosition: null,
      isValid: false,
    })

    return newEdge
  }, [connectionState.sourceNodeId, connectionState.targetNodeId, connectionState.isValid])

  const cancelConnection = useCallback(() => {
    setConnectionState({
      isDrawing: false,
      sourceNodeId: null,
      targetNodeId: null,
      currentPosition: null,
      isValid: false,
    })
  }, [])

  const linkDrawingData = useMemo(() => ({
    connectionState,
    startConnection,
    updateConnection,
    completeConnection,
    cancelConnection,
    hasCycle,
  }), [
    connectionState,
    startConnection,
    updateConnection,
    completeConnection,
    cancelConnection,
    hasCycle,
  ])

  return linkDrawingData
}
