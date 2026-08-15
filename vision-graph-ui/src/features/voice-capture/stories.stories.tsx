import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { getAudioContext } from '../../shared/audio/context'

type AudioFeedProps = {
  showLevel: boolean
}

const AudioFeed = ({ showLevel }: AudioFeedProps) => {
  const level = showLevel ? 0.5 : 0
  const ctx = getAudioContext()

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Audio Feed Status</h2>
      <div>Sample Rate: {ctx.sampleRate} Hz</div>
      <div>State: {ctx.state}</div>
      {showLevel && <div>Level: {level.toFixed(2)}</div>}
    </div>
  )
}

const meta: Meta<AudioFeedProps> = {
  title: 'Voice Capture/Audio Feed',
  component: AudioFeed,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    showLevel: { control: 'boolean', defaultValue: false },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta

type Story = StoryObj<AudioFeedProps>

export const AudioContextSingleton: Story = {
  args: { showLevel: false },
}

export const AnalyserNodeLevel: Story = {
  args: { showLevel: true },
}
