import type { Meta, StoryObj } from '@storybook/react'
import { vi } from 'vitest'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { darkTheme } from '../../shared/theme'
import NodeStatus from '../node/NodeStatus'
import { useVoiceLevel } from './useVoiceLevel'
import { GlowBall } from './GlowBall'
import { BarOfLight } from './BarOfLight'
import { HaloRing } from './HaloRing'
import { MorphLoader } from './MorphLoader'
import { BreathingEdge } from './BreathingEdge'

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

export const EXE11EdgesBreatheExecuting: Story = {
  name: 'EXE-11 edges breathe executing',
  render: () => (
    <div style={{ padding: '16px' }}>
      <div>Edge Animation States</div>
      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
        <div>
          <div>Idle Edge</div>
          <div style={{ width: '150px', height: '100px', border: '1px solid #333' }}>
            <BreathingEdge state="idle" />
          </div>
        </div>
        <div>
          <div>Executing Edge</div>
          <div style={{ width: '150px', height: '100px', border: '1px solid #333' }}>
            <BreathingEdge state="executing" />
          </div>
        </div>
      </div>
    </div>
  ),
}

export const EXE12BorderAnimationEventual: Story = {
  name: 'EXE-12 border animation eventual',
  render: () => (
    <div style={{ padding: '16px' }}>
      <div>Border-Beam Effect (Polish Tier)</div>
      <div style={{ marginTop: '8px', position: 'relative', width: '200px', height: '120px', border: '2px solid #007ACC' }}>
        <div style={{ position: 'absolute', inset: '4px', border: '1px dashed rgba(0, 122, 204, 0.5)' }} />
        <BreathingEdge state="executing" />
      </div>
      <div style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>
        Border-beam class present while executing
      </div>
    </div>
  ),
}

export const EXE14MorphLoader: Story = {
  name: 'EXE-14 morph loader',
  render: () => (
    <div style={{ padding: '16px' }}>
      <div>Morphing Loader</div>
      <div style={{ marginTop: '8px' }}>
        <MorphLoader isActive={true} />
      </div>
      <div style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>
        Icon cycles ~1.2s, transform/opacity crossfade only
      </div>
    </div>
  ),
}

export const LGT04MorphCadence: Story = {
  name: 'LGT-04 morph cadence',
  render: () => (
    <div style={{ padding: '16px' }}>
      <div>Extended Loader Run (4s)</div>
      <div style={{ marginTop: '8px' }}>
        <MorphLoader isActive={true} />
      </div>
      <div style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>
        ~3-4 icon steps over 4s, ~1.2s per step
      </div>
    </div>
  ),
}

export const LGT07ReducedMotion: Story = {
  name: 'LGT-07 reduced motion',
  render: () => (
    <div style={{ padding: '16px' }}>
      <div>Reduced Motion Mode</div>
      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
        <div>
          <div>Normal Animation</div>
          <GlowBall state="recording" size={48} reducedMotion={false} />
        </div>
        <div>
          <div>Reduced Motion (Static)</div>
          <GlowBall state="recording" size={48} reducedMotion={true} />
        </div>
      </div>
      <div style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>
        Reduced-motion: animations off, static glow retained
      </div>
    </div>
  ),
}
