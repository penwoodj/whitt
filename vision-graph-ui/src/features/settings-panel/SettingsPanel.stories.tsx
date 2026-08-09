import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import SettingsPanel from './SettingsPanel'

const meta = {
  title: 'Features/SettingsPanel',
  component: SettingsPanel,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0a0a0a' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof SettingsPanel>

export default meta
type Story = StoryObj<typeof SettingsPanel>

export const Default: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
  },
}

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
}
