import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { createFakeLocalSttEngine } from '../voice-capture/LocalSttEngine'
import VoiceTooltipComposer from './VoiceTooltipComposer'

const engine = createFakeLocalSttEngine({ segments: [{ text: 'local words', start: 0, end: 1 }], amplitude: [0.1, 0.6, 1] })
const baseArgs = {
  nodeId: 'story-node', title: 'Research node', status: 'idle', value: '', onChange: () => undefined, onSend: () => undefined, engine,
  anchorRect: { left: 100, right: 260, top: 100, bottom: 180, width: 160, height: 80 }, viewport: { width: 1200, height: 800 },
}
const meta = { title: 'Features/Node/VoiceTooltipComposer', component: VoiceTooltipComposer, decorators: [(Story) => <ThemeProvider><Story /></ThemeProvider>], args: baseArgs, tags: ['autodocs'] } satisfies Meta<typeof VoiceTooltipComposer>
export default meta
type Story = StoryObj<typeof VoiceTooltipComposer>
export const Preview: Story = {}
export const EditingPinned: Story = { args: { value: 'Pinned prompt', manualFocus: true } }
export const Listening: Story = { args: { chatActive: true } }
export const Processing: Story = { args: { status: 'processing', value: 'Processing prompt' } }
export const Denied: Story = { args: { status: 'denied', value: 'Preserved prompt' } }
export const ErrorState: Story = { args: { status: 'error', value: 'Preserved prompt' } }
export const ReducedMotion: Story = { args: { status: 'recording' } }
export const RecorderTransfer: Story = { args: { title: 'Second recorder', chatActive: true } }
