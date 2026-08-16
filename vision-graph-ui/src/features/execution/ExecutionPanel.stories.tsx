import type { Meta, StoryObj } from '@storybook/react'
import { ExecutionPanel } from './ExecutionPanel'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { fn } from 'storybook/test'

const meta = {
  title: 'Features/Execution/ExecutionPanel',
  component: ExecutionPanel,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ExecutionPanel>

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

export const Exe04HoverYamlTooltip: Story = {
  name: 'slice05 -- EXE-04 hover yaml tooltip',
  args: {
    workflow: mockWorkflow,
    events: [],
  },
}

export const Exe05TooltipPins: Story = {
  name: 'slice05 -- EXE-05 tooltip pins',
  args: {
    workflow: mockWorkflow,
    events: [],
  },
}

export const Exe15StepTitleChanges: Story = {
  name: 'slice05 -- EXE-15 step title changes',
  args: {
    workflow: mockWorkflow,
    events: [
      { kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: mockWorkflow },
      { kind: 'step-start', runId: 'r1', stepId: 's1', title: 'Parsing prompt' },
      { kind: 'step-done', runId: 'r1', stepId: 's1' },
      { kind: 'step-start', runId: 'r1', stepId: 's2', title: 'Generating response' },
      { kind: 'step-done', runId: 'r1', stepId: 's2' },
      { kind: 'step-start', runId: 'r1', stepId: 's3', title: 'Finalizing output' },
      { kind: 'step-done', runId: 'r1', stepId: 's3' },
    ],
  },
}

export const Exe16PanelLive: Story = {
  name: 'slice05 -- EXE-16 panel live',
  args: {
    workflow: mockWorkflow,
    events: [
      { kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: mockWorkflow },
      { kind: 'step-start', runId: 'r1', stepId: 's1', title: 'Processing workflow' },
    ],
  },
}

export const Exe17FilePreviewOnCreate: Story = {
  name: 'slice05 -- EXE-17 file preview on create',
  args: {
    workflow: mockWorkflow,
    events: [
      { kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: mockWorkflow },
      { kind: 'step-start', runId: 'r1', stepId: 's1', title: 'Creating file' },
      { kind: 'file-write', runId: 'r1', path: 'output.md', actor: 'agent' },
      { kind: 'step-done', runId: 'r1', stepId: 's1' },
    ],
  },
}

export const Exec04StepError: Story = {
  name: 'slice05 -- EXEC-04 step error',
  args: {
    workflow: mockWorkflow,
    events: [
      { kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: mockWorkflow },
      { kind: 'step-start', runId: 'r1', stepId: 's1', title: 'Processing data' },
      { kind: 'step-error', runId: 'r1', stepId: 's1', msg: 'Failed to process data' },
    ],
    onRetry: fn(),
  },
}

export const Exec05Completion: Story = {
  name: 'slice05 -- EXEC-05 completion',
  args: {
    workflow: mockWorkflow,
    events: [
      { kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: mockWorkflow },
      { kind: 'step-start', runId: 'r1', stepId: 's1', title: 'Processing workflow' },
      { kind: 'step-done', runId: 'r1', stepId: 's1' },
      { kind: 'run-done', runId: 'r1', nodeId: 'n1', status: 'done' },
    ],
  },
}