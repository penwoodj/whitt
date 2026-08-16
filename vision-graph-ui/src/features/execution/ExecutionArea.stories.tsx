import type { Meta, StoryObj } from '@storybook/react'
import { ExecutionArea } from './ExecutionArea'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { fn } from 'storybook/test'

const meta = {
  title: 'Features/Execution/ExecutionArea',
  component: ExecutionArea,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ExecutionArea>

export default meta
type Story = StoryObj<typeof meta>

const mockWorkflow = `name: Test Workflow
steps:
  - name: Initialize
    action: setup
  - name: Process Data
    action: analyze
  - name: Generate Report
    action: output`

export const Exe01AreaPresent: Story = {
  name: 'slice05 -- EXE-01 area present',
  args: {
    workflow: mockWorkflow,
    onExecute: fn(),
    status: 'idle',
    stepTitle: 'Ready to execute',
  },
}

export const Exe02DblLeftExecutes: Story = {
  name: 'slice05 -- EXE-02 dbl-left executes',
  args: {
    workflow: mockWorkflow,
    onExecute: fn(),
    status: 'running',
    stepTitle: 'Processing workflow',
  },
}

export const Exe03DblRightConfirms: Story = {
  name: 'slice05 -- EXE-03 dbl-right confirms',
  args: {
    workflow: mockWorkflow,
    onExecute: fn(),
    status: 'idle',
    stepTitle: 'Confirm execution',
  },
}