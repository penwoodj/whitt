import type { Meta, StoryObj } from '@storybook/react'
import { AutoAcceptToggle } from './AutoAcceptToggle'

const meta = {
  title: 'Settings/AutoAcceptToggle',
  component: AutoAcceptToggle,
  tags: ['autodocs'],
} satisfies Meta<typeof AutoAcceptToggle>

export default meta
type Story = StoryObj<typeof AutoAcceptToggle>

export const Default: Story = {
  args: {
    isAuto: true,
    onChange: () => {},
  },
}

export const Off: Story = {
  args: {
    isAuto: false,
    onChange: () => {},
  },
}
