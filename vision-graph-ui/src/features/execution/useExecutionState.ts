import { useEffect, useRef, useState } from 'react'
import type { EvtBus } from '../../shared/agent/eventBus'
import type { AgentEvt } from '../../shared/agent/types'
import {
  deriveBusySet,
  deriveStepTitleByNode,
  deriveErrorState,
  deriveStatus,
  deriveCanRetry,
  type ErrorState,
} from './executionTransforms'

export interface ExecutionState {
  busyNodeIds: Set<string>
  stepTitleByNode: Map<string, string>
  errorState: ErrorState | null
  status: 'idle' | 'running' | 'done' | 'error'
  canRetry: boolean
}

export function useExecutionState(bus: EvtBus<AgentEvt>): ExecutionState {
  const [state, setState] = useState<ExecutionState>({
    busyNodeIds: new Set(),
    stepTitleByNode: new Map(),
    errorState: null,
    status: 'idle',
    canRetry: false,
  })

  const eventsRef = useRef<AgentEvt[]>([])

  useEffect(() => {
    const unsubscribe = bus.subscribe((evt) => {
      eventsRef.current.push(evt)

      const newBusyNodeIds = deriveBusySet(eventsRef.current)
      const newStepTitleByNode = deriveStepTitleByNode(eventsRef.current)
      const newErrorState = deriveErrorState(eventsRef.current)
      const newStatus = deriveStatus(eventsRef.current)
      const newCanRetry = deriveCanRetry(eventsRef.current)

      setState({
        busyNodeIds: newBusyNodeIds,
        stepTitleByNode: newStepTitleByNode,
        errorState: newErrorState,
        status: newStatus,
        canRetry: newCanRetry,
      })
    })

    return unsubscribe
  }, [bus])

  return state
}
