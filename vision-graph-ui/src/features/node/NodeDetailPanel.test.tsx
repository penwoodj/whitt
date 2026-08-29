import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import NodeDetailPanel from './NodeDetailPanel'
import { ThemeProvider } from '../../shared/ThemeProvider'

const renderWithTheme = (ui: ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('NodeDetailPanel', () => {
  it('renders FilePreview with markdown content', () => {
    renderWithTheme(<NodeDetailPanel />)
    const filePreviewArea = screen.getByTestId('file-preview-area')
    expect(filePreviewArea).toBeInTheDocument()
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

  it('shows edit button in FilePreview', () => {
    renderWithTheme(<NodeDetailPanel />)
    const editButton = screen.getByRole('button', { name: 'Edit' })
    expect(editButton).toBeInTheDocument()
  })
})
