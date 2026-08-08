import type { Meta, StoryObj } from '@storybook/react'
import NodeAgenticTodos from './NodeAgenticTodos'
import type { Todo } from './nodeTypes'

const meta = {
  title: 'Features/Node/NodeAgenticTodos',
  component: NodeAgenticTodos,
  tags: ['autodocs'],
} satisfies Meta<typeof NodeAgenticTodos>

export default meta
type Story = StoryObj<typeof NodeAgenticTodos>

const todos: Todo[] = [
  { label: 'research', status: 'queued' },
  { label: 'draft', status: 'queued' },
]

export const Default: Story = {
  args: {
    todos,
    expanded: false,
    onToggle: () => console.log('Toggle clicked'),
  },
}

export const Expanded: Story = {
  args: {
    todos,
    expanded: true,
    onToggle: () => console.log('Toggle clicked'),
  },
}

export const WithRunning: Story = {
  args: {
    todos: [
      { label: 'research', status: 'running' },
      { label: 'draft', status: 'queued' },
    ],
    expanded: true,
    onToggle: () => console.log('Toggle clicked'),
  },
}

export const Empty: Story = {
  args: {
    todos: [],
    expanded: true,
    onToggle: () => console.log('Toggle clicked'),
  },
}
