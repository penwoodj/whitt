import { useEffect, useRef, useState } from 'react'
import type { EvtBus } from './eventBus'
import type { AgentEvt, GraphMutation } from './types'
import { deriveBusyNodeIds } from './busySetReducer'
import { isRunStart, isStepStart, isGraphMutation } from './types'

export interface AgentStreamState {
  busyNodeIds: Set<string>
  stepTitleByNode: Map<string, string>
  lastMutation: GraphMutation | null
}

export function useAgentEvtStream(bus: EvtBus<AgentEvt>): AgentStreamState {
  const [state, setState] = useState<AgentStreamState>({
    busyNodeIds: new Set(),
    stepTitleByNode: new Map(),
    lastMutation: null,
  })

  const eventsRef = useRef<AgentEvt[]>([])

  useEffect(() => {
    const unsubscribe = bus.subscribe((evt) => {
      eventsRef.current.push(evt)

      setState(prevState => {
        const newBusyNodeIds = deriveBusyNodeIds(eventsRef.current)

        const newStepTitleByNode = new Map(prevState.stepTitleByNode)
        eventsRef.current.forEach(e => {
          if (isStepStart(e)) {
            const runNode = eventsRef.current
              .filter(ev => isRunStart(ev) && ev.runId === e.runId)
              .pop()
            if (runNode && isRunStart(runNode)) {
              newStepTitleByNode.set(runNode.nodeId, e.title)
            }
          }
        })

        const graphMutations = eventsRef.current
          .filter(isGraphMutation)
          .map(e => e.mutation)
        const newLastMutation = graphMutations.length > 0
          ? graphMutations[graphMutations.length - 1]
          : null

        return {
          busyNodeIds: newBusyNodeIds,
          stepTitleByNode: newStepTitleByNode,
          lastMutation: newLastMutation,
        }
      })
    })

    return unsubscribe
  }, [bus])

  return state
}
