import type { Meta, StoryObj } from '@storybook/react'
import NodeDetailPanel from './NodeDetailPanel'

const meta = {
  title: 'Features/Node/NodeDetailPanel',
  component: NodeDetailPanel,
  tags: ['autodocs'],
} satisfies Meta<typeof NodeDetailPanel>

export default meta
type Story = StoryObj<typeof NodeDetailPanel>

export const Default: Story = {
  args: {
    expanded: false,
    onToggle: () => console.log('Toggle clicked'),
  },
}

export const Expanded: Story = {
  args: {
    expanded: true,
    onToggle: () => console.log('Toggle clicked'),
  },
}

export const CustomMarkdown: Story = {
  args: {
    expanded: true,
    onToggle: () => console.log('Toggle clicked'),
    markdown: '# Custom Report\n\n## Analysis\n\nDetailed analysis content here.\n\n- Point 1\n- Point 2\n- Point 3',
  },
}
