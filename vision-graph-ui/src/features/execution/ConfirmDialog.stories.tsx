import type { Meta, StoryObj } from '@storybook/react'
import { ConfirmDialog } from './ConfirmDialog'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { fn } from 'storybook/test'

const meta = {
  title: 'slice05 -- EXEC-01 confirm shows yaml',
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
  name: 'EXEC-01 confirm shows yaml',
  args: {
    isOpen: true,
    workflow: mockWorkflow,
    onConfirm: fn(),
    onCancel: fn(),
  },
}

export const ClosedDialog: Story = {
  name: 'Closed dialog',
  args: {
    isOpen: false,
    workflow: mockWorkflow,
    onConfirm: fn(),
    onCancel: fn(),
  },
}

export const ComplexWorkflow: Story = {
  name: 'Complex workflow',
  args: {
    isOpen: true,
    workflow: `name: Complex Multi-Step Workflow
description: This workflow demonstrates complex YAML structure with nested steps
steps:
  - name: Data Ingestion
    action: ingest
    params:
      source: database
      format: json
  - name: Data Transformation
    action: transform
    params:
      type: normalize
      validation: true
  - name: Data Analysis
    action: analyze
    params:
      method: ml
      confidence: 0.95
  - name: Report Generation
    action: generate
    params:
      format: pdf
      include_charts: true`,
    onConfirm: fn(),
    onCancel: fn(),
  },
}