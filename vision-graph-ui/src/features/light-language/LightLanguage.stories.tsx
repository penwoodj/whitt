import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { darkTheme } from '../../shared/theme'
import NodeStatus from '../node/NodeStatus'

const meta = {
  title: 'slice03 -- LGT-01 token table states',
  component: NodeStatus,
  decorators: [
    (Story) => (
      <ThemeProvider theme={darkTheme}>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof NodeStatus>

export default meta
type Story = StoryObj<typeof NodeStatus>

export const LGT01TokenTableStates: Story = {
  name: 'LGT-01 token table states',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>
      <NodeStatus status="idle" />
      <NodeStatus status="recording" />
      <NodeStatus status="running" />
      <NodeStatus status="done" />
    </div>
  ),
}
