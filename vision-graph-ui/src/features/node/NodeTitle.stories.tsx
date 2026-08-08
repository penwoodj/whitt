import type { Meta, StoryObj } from '@storybook/react'
import NodeTitle from './NodeTitle'

const meta = {
  title: 'Features/Node/NodeTitle',
  component: NodeTitle,
  tags: ['autodocs'],
} satisfies Meta<typeof NodeTitle>

export default meta
type Story = StoryObj<typeof NodeTitle>

export const Default: Story = {
  args: {
    title: 'Test Node',
  },
}

export const WithChangeHandler: Story = {
  args: {
    title: 'Editable Node',
    onTitleChange: (title) => console.log('Title changed:', title),
  },
}

export const LongTitle: Story = {
  args: {
    title: 'This is a very long node title that might need truncation',
  },
}
