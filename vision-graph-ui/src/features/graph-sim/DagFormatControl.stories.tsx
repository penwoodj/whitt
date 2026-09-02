import type { Meta, StoryObj } from '@storybook/react'
import { DagFormatControl } from './DagFormatControl'

const meta = {
  title: 'Graph/DagFormatControl',
  component: DagFormatControl,
  tags: ['autodocs'],
  args: {
    onFormat: () => undefined,
  },
} satisfies Meta<typeof DagFormatControl>

export default meta
type Story = StoryObj<typeof meta>

export const Right: Story = {
  args: {
    selectedNodeIds: ['A', 'B'],
    initialDirection: 'RIGHT',
    initialCurrentDirection: null,
  },
}

export const Down: Story = {
  args: {
    selectedNodeIds: ['A', 'B'],
    initialDirection: 'DOWN',
    initialCurrentDirection: 'RIGHT',
  },
}

export const Left: Story = {
  args: {
    selectedNodeIds: ['A', 'B'],
    initialDirection: 'LEFT',
    initialCurrentDirection: 'DOWN',
  },
}

export const NoSelection: Story = {
  args: {
    selectedNodeIds: [],
    initialDirection: 'RIGHT',
    initialCurrentDirection: null,
  },
}
