import type { Meta, StoryObj } from '@storybook/react'
import { useMemo } from 'react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { initialSpeechState, reduceSpeech, type SpeechStatus } from './speechTypes'

type StateProps = { state: SpeechStatus }

function LocalSttStateStory({ state }: StateProps) {
  const speech = useMemo(() => ({ ...initialSpeechState, state }), [state])
  return (
    <div style={{ padding: 20 }}>
      <strong>Local STT adapter state</strong>
      <div role="status">{speech.state}</div>
      <div>Amplitude: {speech.amplitude}</div>
      <div>Transcript: {speech.text || 'empty'}</div>
      <button type="button" onClick={() => reduceSpeech(speech, { type: 'stop-requested' })}>Stop</button>
    </div>
  )
}

const meta: Meta<typeof LocalSttStateStory> = {
  title: 'Features/VoiceCapture/Local STT states',
  component: LocalSttStateStory,
  decorators: [(Story) => <ThemeProvider><Story /></ThemeProvider>],
}

export default meta
type Story = StoryObj<typeof LocalSttStateStory>

export const Default: Story = { args: { state: 'idle' } }
export const PermissionPending: Story = { args: { state: 'permission-pending' } }
export const Listening: Story = { args: { state: 'listening' } }
export const Processing: Story = { args: { state: 'processing' } }
export const Denied: Story = { args: { state: 'denied' } }
export const AdapterError: Story = { args: { state: 'error' } }
export const Stopped: Story = { args: { state: 'stopped' } }
