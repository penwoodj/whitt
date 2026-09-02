export type AgentEvt =
  | { kind: 'run-start'; runId: string; nodeId: string; workflow: string }
  | { kind: 'step-start'; runId: string; stepId: string; title: string }
  | { kind: 'step-done'; runId: string; stepId: string }
  | { kind: 'step-error'; runId: string; stepId: string; msg: string }
  | { kind: 'log'; runId: string; level: 'info' | 'warn' | 'error'; msg: string }
  | { kind: 'file-write'; runId: string; path: string; actor: 'agent'; content?: string }
  | { kind: 'graph-mutation'; runId: string; mutation: GraphMutation }
  | { kind: 'run-done'; runId: string; nodeId: string; status: 'done' | 'error' }

export type GraphMutation =
  | { op: 'spawn'; parentNodeId: string; newNodeId: string; title: string }
  | { op: 'edit'; nodeId: string }
  | { op: 'move'; nodeId: string; from: string; to: string }
  | { op: 'group'; nodeIds: string[]; groupId: string }
  | { op: 'detach'; nodeId: string }
  | { op: 'link'; source: string; target: string }
  | { op: 'unlink'; source: string; target: string }

export const isRunStart = (evt: AgentEvt): evt is Extract<AgentEvt, { kind: 'run-start' }> =>
  evt.kind === 'run-start'

export const isStepStart = (evt: AgentEvt): evt is Extract<AgentEvt, { kind: 'step-start' }> =>
  evt.kind === 'step-start'

export const isStepDone = (evt: AgentEvt): evt is Extract<AgentEvt, { kind: 'step-done' }> =>
  evt.kind === 'step-done'

export const isStepError = (evt: AgentEvt): evt is Extract<AgentEvt, { kind: 'step-error' }> =>
  evt.kind === 'step-error'

export const isGraphMutation = (evt: AgentEvt): evt is Extract<AgentEvt, { kind: 'graph-mutation' }> =>
  evt.kind === 'graph-mutation'

export const isRunDone = (evt: AgentEvt): evt is Extract<AgentEvt, { kind: 'run-done' }> =>
  evt.kind === 'run-done'

export const isFileWrite = (evt: AgentEvt): evt is Extract<AgentEvt, { kind: 'file-write' }> =>
  evt.kind === 'file-write'
