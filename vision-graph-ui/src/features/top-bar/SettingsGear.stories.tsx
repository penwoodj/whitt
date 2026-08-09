import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import SettingsGear from './SettingsGear'
import type { SettingsGearProps } from './topBarTypes'

const meta: Meta<typeof SettingsGear> = {
  title: 'Features/TopBar/SettingsGear',
  component: SettingsGear,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SettingsGear>

export const Default: Story = {
  args: {
    onClick: () => {},
  } as SettingsGearProps,
}
