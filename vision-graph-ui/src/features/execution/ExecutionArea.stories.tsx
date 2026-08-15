import type { Meta, StoryObj } from '@storybook/react'
import { ExecutionArea } from './ExecutionArea'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { fn } from 'storybook/test'

const meta = {
  title: 'slice05 -- EXE-01 area present',
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
  name: 'EXE-01 area present',
  args: {
    workflow: mockWorkflow,
    onExecute: fn(),
    status: 'idle',
    stepTitle: 'Ready to execute',
  },
}

export const Exe02DblLeftExecutes: Story = {
  name: 'EXE-02 dbl-left executes',
  args: {
    workflow: mockWorkflow,
    onExecute: fn(),
    status: 'running',
    stepTitle: 'Processing workflow',
  },
}

export const Exe03DblRightConfirms: Story = {
  name: 'EXE-03 dbl-right confirms',
  args: {
    workflow: mockWorkflow,
    onExecute: fn(),
    status: 'idle',
    stepTitle: 'Confirm execution',
  },
}

export const RunningState: Story = {
  name: 'Running state',
  args: {
    workflow: mockWorkflow,
    onExecute: fn(),
    status: 'running',
    stepTitle: 'Processing data',
  },
}

export const DoneState: Story = {
  name: 'Done state',
  args: {
    workflow: mockWorkflow,
    onExecute: fn(),
    status: 'done',
    stepTitle: 'Workflow completed',
  },
}

export const ErrorState: Story = {
  name: 'Error state',
  args: {
    workflow: mockWorkflow,
    onExecute: fn(),
    status: 'error',
    stepTitle: 'Execution failed',
  },
}