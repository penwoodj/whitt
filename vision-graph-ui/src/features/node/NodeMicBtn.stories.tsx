import type { Meta, StoryObj } from '@storybook/react'
import NodeMicBtn from './NodeMicBtn'

const meta = {
  title: 'Features/Node/NodeMicBtn',
  component: NodeMicBtn,
  tags: ['autodocs'],
} satisfies Meta<typeof NodeMicBtn>

export default meta
type Story = StoryObj<typeof NodeMicBtn>

export const Default: Story = {
  args: {
    isRec: false,
    onToggleRec: () => console.log('Toggle clicked'),
  },
}

export const Recording: Story = {
  args: {
    isRec: true,
    onToggleRec: () => console.log('Toggle clicked'),
    onStreamTxt: (txt) => console.log('Streaming:', txt),
  },
}

export const WithStreamHandler: Story = {
  args: {
    isRec: true,
    onToggleRec: () => console.log('Toggle clicked'),
    onStreamTxt: (txt) => console.log('Streamed txt:', txt),
  },
}
