import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import TopBar from './TopBar'
import { buildDefaultTopBarProps } from './topBarData'

const meta: Meta<typeof TopBar> = {
  title: 'Features/TopBar/TopBar',
  component: TopBar,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TopBar>

export const Default: Story = {
  args: buildDefaultTopBarProps(),
}

export const Syncing: Story = {
  args: {
    ...buildDefaultTopBarProps(),
    syncStatus: 'syncing',
    lastSyncLabel: 'Syncing...',
  },
}

export const CanTravel: Story = {
  args: {
    ...buildDefaultTopBarProps(),
    canTravelBack: true,
    canTravelForward: true,
  },
}
