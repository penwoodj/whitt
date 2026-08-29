import { useCallback } from 'react'
import type { GraphMutation } from '../../shared/agent/types'
import type { AnimationClass } from './mutationAnimations'
import { getAnimationClass } from './mutationAnimations'

export interface MutationEffect {
  animationClass: AnimationClass
  duration: string
  nodeId: string | null
  edgeId: string | null
}

export function useGraphMutationHandler() {
  const handleMutation = useCallback((mutation: GraphMutation): MutationEffect => {
    const animationClass = getAnimationClass(mutation.op)
    let nodeId: string | null = null
    let edgeId: string | null = null

    if (mutation.op === 'spawn') {
      nodeId = mutation.newNodeId
    } else if (mutation.op === 'edit' || mutation.op === 'move' || mutation.op === 'detach') {
      nodeId = mutation.nodeId
    } else if (mutation.op === 'group') {
      nodeId = mutation.nodeIds[0] ?? null
    } else if (mutation.op === 'link' || mutation.op === 'unlink') {
      edgeId = `${mutation.source}-${mutation.target}`
    }

    return {
      animationClass,
      duration: getAnimationDuration(animationClass),
      nodeId,
      edgeId,
    }
  }, [])

  const applyMutationToNodes = useCallback((
    nodes: any[],
    mutation: GraphMutation
  ): any[] => {
    const effect = handleMutation(mutation)
    
    if (mutation.op === 'spawn') {
      return [
        ...nodes,
        {
          id: mutation.newNodeId,
          type: 'custom',
          position: { x: 0, y: 0 },
          data: {
            id: mutation.newNodeId,
            title: mutation.title,
            animationClass: effect.animationClass,
          },
        },
      ]
    }

    if (mutation.op === 'detach') {
      return nodes.filter(n => n.id !== mutation.nodeId)
    }

    return nodes.map(node => {
      if (node.id === effect.nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            animationClass: effect.animationClass,
          },
        }
      }
      return node
    })
  }, [handleMutation])

  const applyMutationToEdges = useCallback((
    edges: any[],
    mutation: GraphMutation
  ): any[] => {
    if (mutation.op === 'link') {
      return [
        ...edges,
        {
          id: `${mutation.source}-${mutation.target}`,
          source: mutation.source,
          target: mutation.target,
          type: 'smoothstep',
          animated: true,
        },
      ]
    }

    if (mutation.op === 'unlink') {
      return edges.filter(e => 
        e.source === mutation.source && e.target === mutation.target
      )
    }

    return edges
  }, [])

  return {
    handleMutation,
    applyMutationToNodes,
    applyMutationToEdges,
  }
}

function getAnimationDuration(animationClass: AnimationClass): string {
  const durations = {
    'fade-in-settle': '400ms',
    'pulse': '300ms',
    'shift': '300ms',
    'halo': '350ms',
    'fade-out': '300ms',
    'edge-draw': '400ms',
    'edge-erase': '300ms',
  }
  return durations[animationClass] ?? '300ms'
}