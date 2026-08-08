import type { Meta, StoryObj } from '@storybook/react'
import NodePromptArea from './NodePromptArea'

const meta = {
  title: 'Features/Node/NodePromptArea',
  component: NodePromptArea,
  tags: ['autodocs'],
} satisfies Meta<typeof NodePromptArea>

export default meta
type Story = StoryObj<typeof NodePromptArea>

export const Default: Story = {
  args: {
    value: '',
    onChange: (txt) => console.log('Changed:', txt),
    onSend: () => console.log('Send clicked'),
  },
}

export const WithText: Story = {
  args: {
    value: 'Hello, world!',
    onChange: (txt) => console.log('Changed:', txt),
    onSend: () => console.log('Send clicked'),
  },
}

export const WithStreamedTxt: Story = {
  args: {
    value: 'original',
    onChange: (txt) => console.log('Changed:', txt),
    onSend: () => console.log('Send clicked'),
    streamedTxt: 'streamed text from mic',
  },
}
