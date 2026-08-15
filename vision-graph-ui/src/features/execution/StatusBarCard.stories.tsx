import type { Meta, StoryObj } from '@storybook/react'
import { StatusBarCard } from './StatusBarCard'
import { ThemeProvider } from '../../shared/ThemeProvider'

const meta = {
  title: 'slice05 -- EXE-09 status card minimal',
  component: StatusBarCard,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof StatusBarCard>

export default meta
type Story = StoryObj<typeof meta>

export const Exe09StatusCardMinimal: Story = {
  name: 'EXE-09 status card minimal',
  args: {
    status: 'idle',
    stepTitle: 'Ready',
  },
}

export const Exe10HoverAffordance: Story = {
  name: 'EXE-10 hover affordance',
  args: {
    status: 'running',
    stepTitle: 'Processing workflow',
    showTooltip: true,
  },
}

export const Exe13OnlyTextLoader: Story = {
  name: 'EXE-13 only text+loader',
  args: {
    status: 'done',
    stepTitle: 'Completed',
  },
}

export const Exec02TitleTruncation: Story = {
  name: 'EXEC-02 title truncation',
  args: {
    status: 'running',
    stepTitle: 'This is a very long step title that should be truncated with ellipsis at the card edge',
    showTooltip: true,
  },
}