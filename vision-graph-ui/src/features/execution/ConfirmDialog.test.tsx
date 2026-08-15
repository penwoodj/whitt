import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>)
  }

  const mockWorkflow = `name: test-workflow
steps:
  - name: step1
    action: test
  - name: step2
    action: process`

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('EXEC-01 confirm shows yaml', () => {
    it('same YAML component as EXE-06 displayed', () => {
      const onConfirm = vi.fn()
      const onCancel = vi.fn()
      
      renderWithTheme(
        <ConfirmDialog 
          isOpen={true} 
          workflow={mockWorkflow} 
          onConfirm={onConfirm} 
          onCancel={onCancel} 
        />
      )
      
      expect(screen.getByTestId('yaml-visualizer')).toBeInTheDocument()
    })

    it('testid matches visualizer', () => {
      const onConfirm = vi.fn()
      const onCancel = vi.fn()
      
      renderWithTheme(
        <ConfirmDialog 
          isOpen={true} 
          workflow={mockWorkflow} 
          onConfirm={onConfirm} 
          onCancel={onCancel} 
        />
      )
      
      const visualizer = screen.getByTestId('yaml-visualizer')
      expect(visualizer).toBeInTheDocument()
    })

    it('execute button available', () => {
      const onConfirm = vi.fn()
      const onCancel = vi.fn()
      
      renderWithTheme(
        <ConfirmDialog 
          isOpen={true} 
          workflow={mockWorkflow} 
          onConfirm={onConfirm} 
          onCancel={onCancel} 
        />
      )
      
      expect(screen.getByRole('button', { name: /execute/i })).toBeInTheDocument()
    })

    it('cancel button available', () => {
      const onConfirm = vi.fn()
      const onCancel = vi.fn()
      
      renderWithTheme(
        <ConfirmDialog 
          isOpen={true} 
          workflow={mockWorkflow} 
          onConfirm={onConfirm} 
          onCancel={onCancel} 
        />
      )
      
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })
  })
})