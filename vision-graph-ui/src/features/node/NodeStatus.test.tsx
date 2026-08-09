import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import NodeStatus from './NodeStatus'
import { ThemeProvider } from '../../shared/ThemeProvider'

const renderWithTheme = (ui: ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('NodeStatus', () => {
  it('renders idle status', () => {
    renderWithTheme(<NodeStatus status="idle" />)
    expect(screen.getByText('Idle')).toBeInTheDocument()
  })

  it('renders recording status', () => {
    renderWithTheme(<NodeStatus status="recording" />)
    expect(screen.getByText('Recording')).toBeInTheDocument()
  })

  it('renders running status', () => {
    renderWithTheme(<NodeStatus status="running" />)
    expect(screen.getByText('Running')).toBeInTheDocument()
  })

  it('renders done status', () => {
    renderWithTheme(<NodeStatus status="done" />)
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('shows labels with uppercase transform', () => {
    const { rerender } = renderWithTheme(<NodeStatus status="idle" />)
    expect(screen.getByText('Idle')).toBeInTheDocument()

    rerender(<ThemeProvider><NodeStatus status="recording" /></ThemeProvider>)
    expect(screen.getByText('Recording')).toBeInTheDocument()

    rerender(<ThemeProvider><NodeStatus status="running" /></ThemeProvider>)
    expect(screen.getByText('Running')).toBeInTheDocument()

    rerender(<ThemeProvider><NodeStatus status="done" /></ThemeProvider>)
    expect(screen.getByText('Done')).toBeInTheDocument()
  })
})
