import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { ReactNode } from 'react'
import NodeDetailPanel from './NodeDetailPanel'
import { ThemeProvider } from '../../shared/ThemeProvider'

const renderWithTheme = (ui: ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('NodeDetailPanel', () => {
  it('renders collapsed by default', () => {
    const onToggle = vi.fn()
    renderWithTheme(<NodeDetailPanel expanded={false} onToggle={onToggle} />)
    expect(screen.getByText('Details')).toBeInTheDocument()
    expect(screen.queryByText('Node Details')).not.toBeInTheDocument()
  })

  it('shows markdown when expanded', () => {
    const onToggle = vi.fn()
    renderWithTheme(<NodeDetailPanel expanded={true} onToggle={onToggle} />)
    expect(screen.getByText('Node Details')).toBeInTheDocument()
    expect(screen.getByText((content) => content.includes('This is a placeholder'))).toBeInTheDocument()
  })

  it('calls onToggle on btn click', () => {
    const onToggle = vi.fn()
    renderWithTheme(<NodeDetailPanel expanded={false} onToggle={onToggle} />)
    const btn = screen.getByText('Details')
    fireEvent.click(btn)
    expect(onToggle).toHaveBeenCalled()
  })

  it('renders custom markdown', () => {
    const onToggle = vi.fn()
    const customMarkdown = '# Custom Title\n\nCustom content here.'
    renderWithTheme(<NodeDetailPanel expanded={true} onToggle={onToggle} markdown={customMarkdown} />)
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom content here.')).toBeInTheDocument()
  })

  it('renders default markdown when none provided', () => {
    const onToggle = vi.fn()
    renderWithTheme(<NodeDetailPanel expanded={true} onToggle={onToggle} />)
    expect(screen.getByText('Live token streams')).toBeInTheDocument()
    expect(screen.getByText('Hook timeline')).toBeInTheDocument()
  })
})
