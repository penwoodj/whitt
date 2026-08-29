import { useCallback, useMemo } from 'react'
import type { PromptPayload } from './agentSemanticsTypes'

export interface UseAgentContextProps {
  focusedNodeId: string | null
  linkedNodeIds?: string[]
}

export function useAgentContext({
  focusedNodeId,
  linkedNodeIds = [],
}: UseAgentContextProps) {
  const buildPayloadMemo = useCallback(
    (promptTxt: string): PromptPayload => {
      if (!focusedNodeId) {
        throw new Error('No focused node for prompt context')
      }

      return {
        contextNodeId: focusedNodeId,
        linkedNodeIds,
        promptTxt,
      }
    },
    [focusedNodeId, linkedNodeIds]
  )

  const canWriteToMemo = useCallback(
    (nodeId: string): boolean => {
      if (!focusedNodeId) return false
      if (nodeId === focusedNodeId) return true
      return linkedNodeIds.includes(nodeId)
    },
    [focusedNodeId, linkedNodeIds]
  )

  return useMemo(
    () => ({
      buildPayload: buildPayloadMemo,
      canWriteTo: canWriteToMemo,
    }),
    [buildPayloadMemo, canWriteToMemo]
  )
}