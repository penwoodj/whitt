import styled from 'styled-components'
import type { AgentEvt } from '../../shared/agent/types'
import type { NodeData } from './nodeTypes'

const Context = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.sizeXs};
`

type AgentContextProps = {
  data: NodeData
  executionEvents?: AgentEvt[]
}

const getAgentStatus = (data: NodeData, events: AgentEvt[]): string => {
  const latestEvent = events[events.length - 1]
  if (latestEvent?.kind === 'step-error' || latestEvent?.kind === 'run-done' && latestEvent.status === 'error') return 'Error'
  if (latestEvent?.kind === 'run-done' || data.lifecycle === 'done') return 'Done'
  if (latestEvent?.kind === 'run-start' || latestEvent?.kind === 'step-start' || data.lifecycle === 'agentic-running') return 'Running'
  return 'Ready'
}

export function AgentContext({ data, executionEvents = [] }: AgentContextProps) {
  const status = getAgentStatus(data, executionEvents)
  const mutation = executionEvents.find(event => event.kind === 'graph-mutation')
  return <Context data-testid="agent-context"><span data-testid="agent-status">{status}</span><span>Context: {data.title}</span><span>Prompt: {data.promptTxt || 'No prompt yet'}</span>{mutation?.kind === 'graph-mutation' && <span>Mutation: {mutation.mutation.op}</span>}</Context>
}
