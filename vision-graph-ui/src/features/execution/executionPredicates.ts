import type { AgentEvt } from '../../shared/agent/types'
import { isStepError } from '../../shared/agent/types'

export const isRunning = (evt: AgentEvt): boolean => evt.kind === 'run-start'

export const isDone = (evt: AgentEvt): evt is Extract<AgentEvt, { kind: 'run-done' }> =>
  evt.kind === 'run-done' && evt.status === 'done'

export const hasError = (evt: AgentEvt): boolean => isStepError(evt)

export const isBusy = (evts: AgentEvt[]): boolean => {
  const runStarts = evts.filter(isRunning)
  const runDones = evts.filter(isDone)
  return runStarts.length > runDones.length
}
