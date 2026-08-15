import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import ErrorState from './ErrorState'
import type { ErrorStateProps } from './ErrorState'

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('ErrorState', () => {
  it('APPC-03 load failure', () => {
    const onRetry = vi.fn()
    const props: ErrorStateProps = {
      message: 'Failed to load project: File not found',
      onRetry,
    }

    renderWithTheme(<ErrorState {...props} />)

    expect(screen.getByText('Failed to Load Project')).toBeInTheDocument()
    expect(screen.getByText('Failed to load project: File not found')).toBeInTheDocument()
    
    const retryButton = screen.getByRole('button', { name: 'Retry' })
    expect(retryButton).toBeInTheDocument()
    
    fireEvent.click(retryButton)
    expect(onRetry).toHaveBeenCalled()
  })
})