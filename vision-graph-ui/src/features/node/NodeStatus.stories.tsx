import type { Meta, StoryObj } from '@storybook/react'
import NodeStatus from './NodeStatus'

const meta = {
  title: 'Features/Node/NodeStatus',
  component: NodeStatus,
  tags: ['autodocs'],
} satisfies Meta<typeof NodeStatus>

export default meta
type Story = StoryObj<typeof NodeStatus>

export const Idle: Story = {
  args: {
    status: 'idle',
  },
}

export const Recording: Story = {
  args: {
    status: 'recording',
  },
}

export const Running: Story = {
  args: {
    status: 'running',
  },
}

export const Done: Story = {
  args: {
    status: 'done',
  },
}
