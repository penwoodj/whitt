import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import NodeDetailPanel from './NodeDetailPanel'
import { ThemeProvider } from '../../shared/ThemeProvider'

const renderWithTheme = (ui: ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('NodeDetailPanel', () => {
  it('renders markdown content directly', () => {
    renderWithTheme(<NodeDetailPanel />)
    expect(screen.getByText('Node Details')).toBeInTheDocument()
    expect(screen.getByText('This is a placeholder for the markdown content')).toBeInTheDocument()
  })

  it('renders custom markdown when provided', () => {
    const customMarkdown = '# Custom Title\n\nCustom content here.'
    renderWithTheme(<NodeDetailPanel markdown={customMarkdown} />)
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom content here.')).toBeInTheDocument()
  })

  it('renders default markdown when none provided', () => {
    renderWithTheme(<NodeDetailPanel />)
    expect(screen.getByText('Live token streams')).toBeInTheDocument()
    expect(screen.getByText('Hook timeline')).toBeInTheDocument()
    expect(screen.getByText('Artifact preview')).toBeInTheDocument()
  })

  it('renders markdown with proper formatting', () => {
    renderWithTheme(<NodeDetailPanel />)
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Template variable values')).toBeInTheDocument()
  })
})
