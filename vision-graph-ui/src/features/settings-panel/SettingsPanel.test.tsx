import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import SettingsPanel from './SettingsPanel'

const mockOnClose = vi.fn()

const renderWithTheme = (ui: React.JSX.Element) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('SettingsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders hidden when isOpen=false', () => {
    renderWithTheme(<SettingsPanel isOpen={false} onClose={mockOnClose} />)

    const backdrop = screen.queryByTestId('settings-backdrop')
    expect(backdrop).not.toBeInTheDocument()
  })

  it('renders visible when isOpen=true', () => {
    renderWithTheme(<SettingsPanel isOpen={true} onClose={mockOnClose} />)

    const backdrop = screen.getByTestId('settings-backdrop')
    expect(backdrop).toBeInTheDocument()

    const panel = screen.getByTestId('settings-panel')
    expect(panel).toBeInTheDocument()
  })

  it('calls onClose when X btn clicked', () => {
    renderWithTheme(<SettingsPanel isOpen={true} onClose={mockOnClose} />)

    const closeBtn = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeBtn)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when ESC pressed', () => {
    renderWithTheme(<SettingsPanel isOpen={true} onClose={mockOnClose} />)

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' })

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('renders Settings form when open', () => {
    renderWithTheme(<SettingsPanel isOpen={true} onClose={mockOnClose} />)

    expect(screen.getAllByText(/auto-accept/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/voice shortcut/i).length).toBeGreaterThan(0)
  })
})
