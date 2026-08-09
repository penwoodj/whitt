import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import NewProjectModal from './NewProjectModal'

const meta = {
  title: 'Features/NewProjectModal',
  component: NewProjectModal,
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
} satisfies Meta<typeof NewProjectModal>

export default meta
type Story = StoryObj<typeof NewProjectModal>

export const Default: Story = {
  args: {
    isOpen: false,
    onCreate: () => {},
    onCancel: () => {},
  },
}

export const Open: Story = {
  args: {
    isOpen: true,
    onCreate: () => {},
    onCancel: () => {},
  },
}
