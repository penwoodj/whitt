import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { ExecutionArea } from './ExecutionArea'

describe('ExecutionArea', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>)
  }

  const mockWorkflow = `name: test-workflow
steps:
  - name: step1
    action: test`

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('EXE-01 area present', () => {
    it('area displayed below bar of light', () => {
      renderWithTheme(<ExecutionArea workflow={mockWorkflow} onExecute={vi.fn()} />)
      
      const area = screen.getByTestId('execution-area')
      expect(area).toBeInTheDocument()
      expect(area).toHaveStyle({ marginTop: expect.any(String) })
    })

    it('workflow summary visible', () => {
      renderWithTheme(<ExecutionArea workflow={mockWorkflow} onExecute={vi.fn()} />)
      
      expect(screen.getByText('test-workflow')).toBeInTheDocument()
      expect(screen.getByText((content) => content.includes('steps'))).toBeInTheDocument()
    })
  })

  describe('EXE-02 dbl-left executes', () => {
    it('execution starts immediately on double-left-click', async () => {
      const user = userEvent.setup()
      const executeSpy = vi.fn()
      
      renderWithTheme(<ExecutionArea workflow={mockWorkflow} onExecute={executeSpy} />)
      
      const area = screen.getByTestId('execution-area')
      
      await user.pointer([
        { keys: '[MouseLeft][MouseLeft]', target: area },
      ])
      
      expect(executeSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('EXE-03 dbl-right confirms', () => {
    it('confirm dialog opens with YAML on right-click', async () => {
      const user = userEvent.setup()
      const executeSpy = vi.fn()
      
      renderWithTheme(<ExecutionArea workflow={mockWorkflow} onExecute={executeSpy} />)
      
      const area = screen.getByTestId('execution-area')
      await user.pointer([
        { keys: '[MouseRight]', target: area },
      ])
      
      expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()
      expect(screen.getByTestId('yaml-visualizer')).toBeInTheDocument()
    })

    it('execution not started until confirm', async () => {
      const user = userEvent.setup()
      const executeSpy = vi.fn()
      
      renderWithTheme(<ExecutionArea workflow={mockWorkflow} onExecute={executeSpy} />)
      
      const area = screen.getByTestId('execution-area')
      await user.pointer([
        { keys: '[MouseRight]', target: area },
      ])
      
      expect(executeSpy).not.toHaveBeenCalled()
      
      const confirmButton = screen.getByRole('button', { name: /execute/i })
      await user.click(confirmButton)
      
      expect(executeSpy).toHaveBeenCalledTimes(1)
    })
  })
})