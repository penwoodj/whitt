import type { Meta, StoryObj } from '@storybook/react'
import { vi } from 'vitest'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { darkTheme } from '../../shared/theme'
import NodeStatus from '../node/NodeStatus'
import { useVoiceLevel } from './useVoiceLevel'
import { GlowBall } from './GlowBall'
import { BarOfLight } from './BarOfLight'
import { HaloRing } from './HaloRing'

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

export const EXP02BallBecomesHalo: Story = {
  name: 'EXP-02 ball becomes halo',
  render: () => (
    <div style={{ padding: '16px' }}>
      <div>Modal with Halo Ring</div>
      <div style={{ marginTop: '16px', position: 'relative', width: '200px', height: '150px', border: '1px solid #333' }}>
        <HaloRing state="recording" isLive={true}>
          <div>Modal Content</div>
        </HaloRing>
      </div>
    </div>
  ),
}

export const GRP08GroupingHalo: Story = {
  name: 'GRP-08 grouping halo',
  render: () => (
    <div style={{ padding: '16px' }}>
      <div>Group Selection with Halo</div>
      <div style={{ marginTop: '16px', position: 'relative', width: '300px', height: '200px', border: '1px dashed #444' }}>
        <HaloRing state="running" isLive={true}>
          <div style={{ position: 'absolute', top: '10px', left: '10px' }}>Node 1</div>
          <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>Node 2</div>
        </HaloRing>
      </div>
    </div>
  ),
}

export const LGT05HaloGeometry: Story = {
  name: 'LGT-05 halo geometry',
  render: () => (
    <div style={{ display: 'flex', gap: '16px', padding: '16px' }}>
      <div>
        <div>Modal Halo</div>
        <div style={{ marginTop: '8px', position: 'relative', width: '120px', height: '80px', border: '1px solid #333' }}>
          <HaloRing state="recording" isLive={true} />
        </div>
      </div>
      <div>
        <div>Group Halo</div>
        <div style={{ marginTop: '8px', position: 'relative', width: '120px', height: '80px', border: '1px dashed #444' }}>
          <HaloRing state="running" isLive={true} />
        </div>
      </div>
    </div>
  ),
}
