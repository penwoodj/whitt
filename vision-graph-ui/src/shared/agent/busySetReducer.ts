import flow from 'lodash/fp/flow'
import filter from 'lodash/fp/filter'
import map from 'lodash/fp/map'
import difference from 'lodash/fp/difference'
import type { AgentEvt } from './types'
import { isRunStart, isStepDone, isStepError } from './types'

const deriveRunNodeMap = (evts: AgentEvt[]): Map<string, string> => {
  const runToNode = new Map<string, string>()
  evts.forEach(evt => {
    if (isRunStart(evt)) {
      runToNode.set(evt.runId, evt.nodeId)
    }
  })
  return runToNode
}

export const deriveBusyNodeIds = (evts: AgentEvt[]): Set<string> => {
  const runToNode = deriveRunNodeMap(evts)

  const startedNodeIds = flow([
    filter(isRunStart),
    map((evt: Extract<AgentEvt, { kind: 'run-start' }>) => evt.nodeId),
  ])(evts) as string[]

  const finishedRunIds = flow([
    filter((evt: AgentEvt) => isStepDone(evt) || isStepError(evt)),
    map((evt: AgentEvt) => evt.runId),
  ])(evts) as string[]

  const finishedNodeIds = finishedRunIds
    .map(runId => runToNode.get(runId))
    .filter((nodeId): nodeId is string => nodeId !== null)

  const busy = difference(startedNodeIds, finishedNodeIds) as unknown as string[]
  return new Set(busy)
}
