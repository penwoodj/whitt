import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import TimeTravelCtrl from './TimeTravelCtrl'
import type { TimeTravelCtrlProps } from './topBarTypes'

const meta: Meta<typeof TimeTravelCtrl> = {
  title: 'Features/TopBar/TimeTravelCtrl',
  component: TimeTravelCtrl,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TimeTravelCtrl>

export const Disabled: Story = {
  args: {
    canTravelBack: false,
    canTravelForward: false,
    commitLabel: 'abc1234 • Add Node B',
    onTravelBack: () => {},
    onTravelForward: () => {},
  } as TimeTravelCtrlProps,
}

export const CanTravelBack: Story = {
  args: {
    canTravelBack: true,
    canTravelForward: false,
    commitLabel: 'abc1234 • Add Node B',
    onTravelBack: () => {},
    onTravelForward: () => {},
  } as TimeTravelCtrlProps,
}

export const CanTravelForward: Story = {
  args: {
    canTravelBack: false,
    canTravelForward: true,
    commitLabel: 'abc1234 • Add Node B',
    onTravelBack: () => {},
    onTravelForward: () => {},
  } as TimeTravelCtrlProps,
}

export const CanTravelBoth: Story = {
  args: {
    canTravelBack: true,
    canTravelForward: true,
    commitLabel: 'abc1234 • Add Node B',
    onTravelBack: () => {},
    onTravelForward: () => {},
  } as TimeTravelCtrlProps,
}
