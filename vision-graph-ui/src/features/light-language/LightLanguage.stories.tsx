import type { Meta, StoryObj } from '@storybook/react'
import { vi } from 'vitest'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { darkTheme } from '../../shared/theme'
import NodeStatus from '../node/NodeStatus'
import { useVoiceLevel } from './useVoiceLevel'
import { GlowBall } from './GlowBall'
import { BarOfLight } from './BarOfLight'

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

export const VOX02RecordingColorShift: Story = {
  name: 'VOX-02 recording color shift',
  render: () => (
    <div style={{ display: 'flex', gap: '16px', padding: '16px' }}>
      <div>
        <div>Idle</div>
        <NodeStatus status="idle" />
      </div>
      <div>
        <div>Recording</div>
        <NodeStatus status="recording" />
      </div>
    </div>
  ),
}

export const VOX03VolumeBreathing: Story = {
  name: 'VOX-03 volume breathing',
  render: () => (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: '8px' }}>Glow Ball - Recording State</div>
      <GlowBall state="recording" size={48} />
      <div style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>
        Ball breathes with voice level
      </div>
    </div>
  ),
}

export const EXP04BarOfLight: Story = {
  name: 'EXP-04 bar of light',
  render: () => (
    <div style={{ padding: '16px' }}>
      <div>Modal Top Bar</div>
      <div style={{ marginTop: '8px' }}>
        <BarOfLight state="idle" width={300} height={4} />
      </div>
      <div style={{ marginTop: '8px' }}>
        <BarOfLight state="recording" width={300} height={4} />
      </div>
    </div>
  ),
}

export const EXP08BarBreathesTooltipClosed: Story = {
  name: 'EXP-08 bar breathes tooltip-closed',
  render: () => (
    <div style={{ padding: '16px' }}>
      <div>Bar continues breathing when tooltip closed</div>
      <div style={{ marginTop: '8px' }}>
        <BarOfLight state="recording" width={250} height={6} />
      </div>
    </div>
  ),
}

export const LGT08BarRestState: Story = {
  name: 'LGT-08 bar rest state',
  render: () => (
    <div style={{ padding: '16px' }}>
      <div>Idle bar (unanimated, hover brightens)</div>
      <div style={{ marginTop: '8px' }}>
        <BarOfLight state="idle" width={250} height={6} />
      </div>
    </div>
  ),
}
