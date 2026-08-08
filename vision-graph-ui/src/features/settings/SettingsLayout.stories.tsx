import type { Meta, StoryObj } from '@storybook/react'
import { SettingsLayout, SettingsSection } from './SettingsLayout'

const meta = {
  title: 'Settings/SettingsLayout',
  component: SettingsLayout,
  tags: ['autodocs'],
} satisfies Meta<typeof SettingsLayout>

export default meta
type Story = StoryObj<typeof SettingsLayout>

export const Default: Story = {
  args: {
    children: (
      <>
        <SettingsSection legend="Auto-Accept">
          <span>Toggle content</span>
        </SettingsSection>
        <SettingsSection legend="Voice Shortcut">
          <span>Input content</span>
        </SettingsSection>
        <SettingsSection legend="Model Endpoint">
          <span>Endpoint content</span>
        </SettingsSection>
        <SettingsSection legend="Project Folder">
          <span>Folder content</span>
        </SettingsSection>
      </>
    ),
  },
}
