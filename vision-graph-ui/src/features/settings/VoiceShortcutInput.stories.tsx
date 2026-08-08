import type { Meta, StoryObj } from '@storybook/react'
import { VoiceShortcutInput } from './VoiceShortcutInput'

const meta = {
  title: 'Settings/VoiceShortcutInput',
  component: VoiceShortcutInput,
  tags: ['autodocs'],
} satisfies Meta<typeof VoiceShortcutInput>

export default meta
type Story = StoryObj<typeof VoiceShortcutInput>

export const Default: Story = {
  args: {
    scTxt: 'Ctrl+Space',
    onChange: () => {},
  },
}

export const Invalid: Story = {
  args: {
    scTxt: 'x',
    onChange: () => {},
  },
}

export const Empty: Story = {
  args: {
    scTxt: '',
    onChange: () => {},
  },
}
