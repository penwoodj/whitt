import type { Meta, StoryObj } from '@storybook/react'
import NodeTooltip from './NodeTooltip'
import { emptyNode, busyNode } from './nodeData'

const meta = {
  title: 'Features/Node/NodeTooltip',
  component: NodeTooltip,
  tags: ['autodocs'],
} satisfies Meta<typeof NodeTooltip>

export default meta
type Story = StoryObj<typeof NodeTooltip>

export const Default: Story = {
  args: {
    node: emptyNode('1'),
    children: <div style={{ padding: '16px', border: '1px solid #ccc' }}>Hover me</div>,
  },
}

export const WithLastUpdate: Story = {
  args: {
    node: busyNode('1'),
    children: <div style={{ padding: '16px', border: '1px solid #ccc' }}>Hover me</div>,
  },
}

export const WithStatus: Story = {
  args: {
    node: {
      ...emptyNode('1'),
      status: 'running',
      lastUpdate: new Date(),
    },
    children: <div style={{ padding: '16px', border: '1px solid #ccc' }}>Hover me</div>,
  },
}
