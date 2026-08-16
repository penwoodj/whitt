import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ExecutionPanel } from './ExecutionPanel'
import { ThemeProvider } from '../../shared/ThemeProvider'
import type { AgentEvt } from '../../shared/agent/types'

const mockWorkflow = `name: Test Workflow
steps:
  - name: Initialize
    action: setup
  - name: Process Data
    action: analyze`

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('ExecutionPanel', () => {
  describe('EXE-04 hover yaml tooltip', () => {
    it('shows tooltip on hover with YamlWorkflowVisualizer', async () => {
      renderWithTheme(<ExecutionPanel workflow={mockWorkflow} events={[]} />)

      const panel = screen.getByTestId('execution-panel')
      const tooltip = screen.getByTestId('yaml-tooltip')

      expect(tooltip).toHaveStyle({ opacity: '0' })

      fireEvent.mouseEnter(panel)

      await waitFor(() => {
        expect(tooltip).toHaveStyle({ opacity: '1' })
      })
    })
  })

  describe('EXE-05 tooltip pins', () => {
    it('pins tooltip on click and keeps visible after mouse leave', async () => {
      renderWithTheme(<ExecutionPanel workflow={mockWorkflow} events={[]} />)

      const panel = screen.getByTestId('execution-panel')
      const tooltip = screen.getByTestId('yaml-tooltip')
      const pinBtn = screen.getByTestId('pin-tooltip-btn')

      fireEvent.mouseEnter(panel)
      await waitFor(() => {
        expect(tooltip).toHaveStyle({ opacity: '1' })
      })

      fireEvent.click(pinBtn)
      fireEvent.mouseLeave(panel)

      await waitFor(() => {
        expect(tooltip).toHaveStyle({ opacity: '1' })
      })
    })
  })

  describe('EXE-15 step title changes', () => {
    it('updates step title when step-start events fire', async () => {
      const events: AgentEvt[] = [
        { kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: mockWorkflow },
        { kind: 'step-start', runId: 'r1', stepId: 's1', title: 'First step' },
        { kind: 'step-done', runId: 'r1', stepId: 's1' },
        { kind: 'step-start', runId: 'r1', stepId: 's2', title: 'Second step' },
        { kind: 'step-done', runId: 'r1', stepId: 's2' },
        { kind: 'step-start', runId: 'r1', stepId: 's3', title: 'Third step' },
      ]

      renderWithTheme(<ExecutionPanel workflow={mockWorkflow} events={events} />)

      await waitFor(() => {
        expect(screen.getByText('Third step')).toBeInTheDocument()
      })
    })
  })

  describe('EXE-16 panel live', () => {
    it('updates panel content live without reopen', async () => {
      const initialEvents: AgentEvt[] = [
        { kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: mockWorkflow },
        { kind: 'step-start', runId: 'r1', stepId: 's1', title: 'Initial step' },
      ]

      const { rerender } = renderWithTheme(<ExecutionPanel workflow={mockWorkflow} events={initialEvents} />)

      await waitFor(() => {
        expect(screen.getByText('Initial step')).toBeInTheDocument()
      })

      const updatedEvents: AgentEvt[] = [
        ...initialEvents,
        { kind: 'step-done', runId: 'r1', stepId: 's1' },
        { kind: 'step-start', runId: 'r1', stepId: 's2', title: 'Updated step' },
      ]

      rerender(<ThemeProvider><ExecutionPanel workflow={mockWorkflow} events={updatedEvents} /></ThemeProvider>)

      await waitFor(() => {
        expect(screen.getByText('Updated step')).toBeInTheDocument()
      })
    })
  })

  describe('EXE-17 file preview on create', () => {
    it('shows preview area when file-write event fires', async () => {
      const events: AgentEvt[] = [
        { kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: mockWorkflow },
        { kind: 'step-start', runId: 'r1', stepId: 's1', title: 'Creating file' },
        { kind: 'file-write', runId: 'r1', path: 'output.md', actor: 'agent' },
        { kind: 'step-done', runId: 'r1', stepId: 's1' },
      ]

      renderWithTheme(<ExecutionPanel workflow={mockWorkflow} events={events} />)

      await waitFor(() => {
        const previewArea = screen.getByTestId('preview-area')
        expect(previewArea).toBeVisible()
        expect(screen.getByText('File Preview: output.md')).toBeInTheDocument()
      })
    })
  })

  describe('EXEC-04 step error', () => {
    it('shows error banner with retry button on step-error', async () => {
      const onRetry = vi.fn()
      const events: AgentEvt[] = [
        { kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: mockWorkflow },
        { kind: 'step-start', runId: 'r1', stepId: 's1', title: 'Processing data' },
        { kind: 'step-error', runId: 'r1', stepId: 's1', msg: 'Failed to process' },
      ]

      renderWithTheme(<ExecutionPanel workflow={mockWorkflow} events={events} onRetry={onRetry} />)

      await waitFor(() => {
        const errorBanner = screen.getByTestId('error-banner')
        expect(errorBanner).toBeVisible()
        expect(screen.getByText(/Step failed: s1/)).toBeInTheDocument()
      })

      const retryBtn = screen.getByTestId('retry-btn')
      fireEvent.click(retryBtn)

      expect(onRetry).toHaveBeenCalledTimes(1)
    })
  })

  describe('EXEC-05 completion', () => {
    it('shows completion state when run-done fires', async () => {
      const events: AgentEvt[] = [
        { kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: mockWorkflow },
        { kind: 'step-start', runId: 'r1', stepId: 's1', title: 'Processing workflow' },
        { kind: 'step-done', runId: 'r1', stepId: 's1' },
        { kind: 'run-done', runId: 'r1', nodeId: 'n1', status: 'done' },
      ]

      renderWithTheme(<ExecutionPanel workflow={mockWorkflow} events={events} />)

      await waitFor(() => {
        expect(screen.getByText('Completed')).toBeInTheDocument()
      })
    })
  })
})