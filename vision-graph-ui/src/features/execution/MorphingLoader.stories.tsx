import type { Meta, StoryObj } from '@storybook/react'
import { MorphingLoader } from './MorphingLoader'
import { ThemeProvider } from '../../shared/ThemeProvider'

const meta = {
  title: 'slice05 -- EXE-14 morphing icon loader',
  component: MorphingLoader,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof MorphingLoader>

export default meta
type Story = StoryObj<typeof meta>

export const Exe14MorphingIconLoader: Story = {
  name: 'EXE-14 morphing icon loader',
  args: {
    status: 'running',
    stepTitle: 'Processing workflow',
  },
}

export const IdleState: Story = {
  name: 'Idle state',
  args: {
    status: 'idle',
    stepTitle: 'Ready to start',
  },
}

export const DoneState: Story = {
  name: 'Done state',
  args: {
    status: 'done',
    stepTitle: 'Workflow completed',
  },
}

export const ErrorState: Story = {
  name: 'Error state',
  args: {
    status: 'error',
    stepTitle: 'Workflow failed',
  },
}