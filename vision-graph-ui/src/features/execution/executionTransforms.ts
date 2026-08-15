import flow from 'lodash/fp/flow'
import filter from 'lodash/fp/filter'
import map from 'lodash/fp/map'
import last from 'lodash/fp/last'
import difference from 'lodash/fp/difference'
import type { AgentEvt } from '../../shared/agent/types'
import { isRunStart, isStepStart, isStepError, isStepDone } from '../../shared/agent/types'
import { deriveBusyNodeIds } from '../../shared/agent/busySetReducer'

const isRunDone = (evt: AgentEvt): evt is Extract<AgentEvt, { kind: 'run-done' }> =>
  evt.kind === 'run-done' && evt.status === 'done'

export interface ErrorState {
  stepId: string
  msg: string
  nodeId: string
}

export const deriveBusySet = (evts: AgentEvt[]): Set<string> => {
  const busy = deriveBusyNodeIds(evts)
  const runDoneNodeIds = flow([
    filter((evt: AgentEvt) => evt.kind === 'run-done'),
    map((evt: AgentEvt) => (evt as Extract<AgentEvt, { kind: 'run-done' }>).nodeId),
  ])(evts) as string[]
  const settled = difference([...busy], runDoneNodeIds)
  return new Set(settled)
}

export const deriveStepTitle = (evts: AgentEvt[], nodeId: string): string | null => {
  const nodeRunIds = flow([
    filter(isRunStart),
    filter((evt: Extract<AgentEvt, { kind: 'run-start' }>) => evt.nodeId === nodeId),
    map((evt: Extract<AgentEvt, { kind: 'run-start' }>) => evt.runId),
  ])(evts) as string[]

  if (nodeRunIds.length === 0) return null

  const latestRunId = nodeRunIds[nodeRunIds.length - 1]
  const stepStarts = flow([
    filter(isStepStart),
    filter((evt: Extract<AgentEvt, { kind: 'step-start' }>) => evt.runId === latestRunId),
  ])(evts) as Extract<AgentEvt, { kind: 'step-start' }>[]

  if (stepStarts.length === 0) return null

  const latestStep = last(stepStarts)
  return latestStep ? latestStep.title : null
}

export const deriveStepTitleByNode = (evts: AgentEvt[]): Map<string, string> => {
  const runNodeMap = new Map<string, string>()
  evts.forEach(evt => {
    if (isRunStart(evt)) {
      runNodeMap.set(evt.runId, evt.nodeId)
    }
  })

  const stepTitleMap = new Map<string, string>()
  const stepStarts = evts.filter(isStepStart)

  stepStarts.forEach(step => {
    const nodeId = runNodeMap.get(step.runId)
    if (nodeId) {
      stepTitleMap.set(nodeId, step.title)
    }
  })

  return stepTitleMap
}

export const deriveErrorState = (evts: AgentEvt[]): ErrorState | null => {
  const runNodeMap = new Map<string, string>()
  evts.forEach(evt => {
    if (isRunStart(evt)) {
      runNodeMap.set(evt.runId, evt.nodeId)
    }
  })

  const stepErrors = evts.filter(isStepError)
  if (stepErrors.length === 0) return null

  const latestError = stepErrors[stepErrors.length - 1] as Extract<AgentEvt, { kind: 'step-error' }>
  const nodeId = runNodeMap.get(latestError.runId)

  if (!nodeId) return null

  return {
    stepId: latestError.stepId,
    msg: latestError.msg,
    nodeId,
  }
}

export const deriveStatus = (evts: AgentEvt[]): 'idle' | 'running' | 'done' | 'error' => {
  const hasEvents = evts.length > 0
  if (!hasEvents) return 'idle'

  const errorState = deriveErrorState(evts)
  if (errorState) return 'error'

  const runDones = evts.filter(isRunDone)
  if (runDones.length > 0) {
    const lastRunDone = runDones[runDones.length - 1] as Extract<AgentEvt, { kind: 'run-done' }>
    if (lastRunDone.status === 'done') return 'done'
  }

  const runStarts = evts.filter(isRunStart)
  const stepDones = evts.filter(isStepDone)
  if (runStarts.length > stepDones.length) return 'running'

  return 'idle'
}

export const deriveCanRetry = (evts: AgentEvt[]): boolean => {
  return deriveErrorState(evts) !== null
}
