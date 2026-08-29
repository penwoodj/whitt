import type { Meta, StoryObj } from '@storybook/react'
import { useAgentEvtStream } from '../../../shared/agent/useAgentEvtStream'
import { createEvtBus } from '../../../shared/agent/eventBus'
import type { AgentEvt, GraphMutation } from '../../../shared/agent/types'
import { ThemeProvider } from '../../../shared/ThemeProvider'

function AgentEvtStreamStory() {
  const bus = createEvtBus<AgentEvt>()
  const { busyNodeIds, stepTitleByNode, lastMutation } = useAgentEvtStream(bus)

  const handleRunStart = () => {
    bus.emit({ kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: 'draft' })
  }

  const handleStepStart = () => {
    bus.emit({ kind: 'step-start', runId: 'r1', stepId: 's1', title: 'Parsing prompt' })
  }

  const handleStepDone = () => {
    bus.emit({ kind: 'step-done', runId: 'r1', stepId: 's1' })
  }

  const handleSpawnMutation = () => {
    const mutation: GraphMutation = {
      op: 'spawn',
      parentNodeId: 'n1',
      newNodeId: 'n2',
      title: 'Sub topic',
    }
    bus.emit({ kind: 'graph-mutation', runId: 'r1', mutation })
  }

  return (
    <div style={{ padding: '16px', color: '#fff' }}>
      <h2>Agent Event Stream State</h2>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={handleRunStart}>Run Start</button>
        <button onClick={handleStepStart} style={{ marginLeft: '8px' }}>Step Start</button>
        <button onClick={handleStepDone} style={{ marginLeft: '8px' }}>Step Done</button>
        <button onClick={handleSpawnMutation} style={{ marginLeft: '8px' }}>Spawn Mutation</button>
      </div>
      <div>
        <h3>Busy Nodes: {Array.from(busyNodeIds).join(', ') || 'none'}</h3>
        <h3>Step Titles:</h3>
        <ul>
          {Array.from(stepTitleByNode.entries()).map(([nodeId, title]) => (
            <li key={nodeId}>{nodeId}: {title}</li>
          ))}
        </ul>
        <h3>Last Mutation:</h3>
        <pre>{JSON.stringify(lastMutation, null, 2)}</pre>
      </div>
    </div>
  )
}

const meta: Meta<typeof AgentEvtStreamStory> = {
  title: 'Features/AgentSemantics/AGTC-01 AgentEvtStream basic',
  component: AgentEvtStreamStory,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AgentEvtStreamStory>

export const Default: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}