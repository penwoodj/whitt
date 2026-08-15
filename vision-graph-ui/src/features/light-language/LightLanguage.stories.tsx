import type { Meta, StoryObj } from '@storybook/react'
import { vi } from 'vitest'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { darkTheme } from '../../shared/theme'
import NodeStatus from '../node/NodeStatus'
import { useVoiceLevel } from './useVoiceLevel'

const meta = {
  title: 'slice03 -- LGT-01 token table states',
  component: NodeStatus,
  decorators: [
    (Story) => (
      <ThemeProvider theme={darkTheme}>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof NodeStatus>

export default meta
type Story = StoryObj<typeof NodeStatus>

export const LGT01TokenTableStates: Story = {
  name: 'LGT-01 token table states',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>
      <NodeStatus status="idle" />
      <NodeStatus status="recording" />
      <NodeStatus status="running" />
      <NodeStatus status="done" />
    </div>
  ),
}

export const LGT02AmplitudeCurve: Story = {
  name: 'LGT-02 amplitude curve',
  render: () => {
    const mockAnalyser = {
      context: { sampleRate: 44100 },
      frequencyBinCount: 128,
      getByteFrequencyData: vi.fn(),
    } as unknown as AnalyserNode

    const level = useVoiceLevel(mockAnalyser)

    return (
      <div style={{ padding: '16px' }}>
        <div>Voice Level: {level.toFixed(4)}</div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>
          Mock analyser returns 0 (test mode)
        </div>
      </div>
    )
  },
}

export const LGT03SilenceStillness: Story = {
  name: 'LGT-03 silence stillness',
  render: () => {
    const mockAnalyser = {
      context: { sampleRate: 44100 },
      frequencyBinCount: 128,
      getByteFrequencyData: vi.fn(),
    } as unknown as AnalyserNode

    const level = useVoiceLevel(mockAnalyser)

    return (
      <div style={{ padding: '16px' }}>
        <div>Voice Level: {level.toFixed(4)}</div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>
          Below noise gate (0.02) = still
        </div>
      </div>
    )
  },
}
