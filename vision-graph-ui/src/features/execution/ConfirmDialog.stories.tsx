import type { Meta, StoryObj } from '@storybook/react'
import { ConfirmDialog } from './ConfirmDialog'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { fn } from 'storybook/test'

const meta = {
  title: 'Features/Execution/ConfirmDialog',
  component: ConfirmDialog,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

const mockWorkflow = `name: Test Workflow
steps:
  - name: Initialize
    action: setup
  - name: Process Data
    action: analyze
  - name: Generate Output
    action: output`

export const Exec01ConfirmShowsYaml: Story = {
  name: 'slice05 -- EXEC-01 confirm shows yaml',
  args: {
    isOpen: true,
    workflow: mockWorkflow,
    onConfirm: fn(),
    onCancel: fn(),
  },
}