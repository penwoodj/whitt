import type { Meta, StoryObj } from '@storybook/react'
import { useIntervention } from './useIntervention'
import { ThemeProvider } from '../../shared/ThemeProvider'

function AGT05InterveneStory() {
  const {
    queueIntervention,
    getQueue,
    processNextIntervention,
    executionStatus,
    getStatusMessage,
    isInputBlocked,
    sendCorrection,
    stopExecution,
  } = useIntervention()

  const handleSend = () => {
    sendCorrection('n1', 'clarify this point', () => {})
  }

  const handleStop = () => {
    stopExecution(() => {})
  }

  return (
    <div style={{ padding: '16px', color: '#fff' }}>
      <h2>AGT-05: Intervene</h2>
      <div>
        <h3>Execution Status: {getStatusMessage()}</h3>
        <h3>Input Blocked: {isInputBlocked().toString()}</h3>
        <h3>Intervention Queue ({getQueue().length})</h3>
        <ul>
          {getQueue().map((item, i) => (
            <li key={`${item.nodeId}-${i}`}>
              {item.nodeId}: {item.correction}
            </li>
          ))}
        </ul>
        <div style={{ marginTop: '16px' }}>
          <button type="button" onClick={handleSend}>Send Correction</button>
          <button type="button" onClick={() => processNextIntervention()} style={{ marginLeft: '8px' }}>
            Process Next
          </button>
          <button type="button" onClick={handleStop} style={{ marginLeft: '8px' }}>
            Stop
          </button>
        </div>
      </div>
    </div>
  )
}

function AGTC03InterventionPathStory() {
  const {
    queueIntervention,
    executionStatus,
    getStatusMessage,
    isInputBlocked,
  } = useIntervention()

  return (
    <div style={{ padding: '16px', color: '#fff' }}>
      <h2>AGTC-03: Intervention Path</h2>
      <div>
        <h3>Status: {getStatusMessage()}</h3>
        <h3>Input Surface: {isInputBlocked() ? 'BLOCKED' : 'RESPONSIVE'}</h3>
        <button type="button" onClick={() => queueIntervention('n1', 'correction')}>
          Trigger Interruption
        </button>
      </div>
    </div>
  )
}

const meta: Meta<typeof AGT05InterveneStory> = {
  title: 'Features/AgentSemantics/AGT-05 intervene',
  component: AGT05InterveneStory,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AGT05InterveneStory>

export const Default: Story = {
  name: 'slice06 -- AGT-05 intervene',
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export const AGTC03InterventionPath: Story = {
  name: 'slice06 -- AGTC-03 intervention path',
  render: () => (
    <ThemeProvider>
      <AGTC03InterventionPathStory />
    </ThemeProvider>
  ),
}