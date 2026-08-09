import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VoiceShortcutInput } from './VoiceShortcutInput'
import { ThemeProvider } from '../../shared/ThemeProvider'

const renderWithTheme = (ui: React.ReactElement) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('VoiceShortcutInput', () => {
  it('renders w/ default "Ctrl+Space"', () => {
    const onChange = vi.fn()
    renderWithTheme(<VoiceShortcutInput scTxt="Ctrl+Space" onChange={onChange} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('Ctrl+Space')
  })

  it('shows red border on invalid shortcut', () => {
    const onChange = vi.fn()
    renderWithTheme(<VoiceShortcutInput scTxt="x" onChange={onChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.blur(input)
    const styles = window.getComputedStyle(input)
    expect(styles.borderColor).toContain('239')
  })

  it('shows err msg on invalid shortcut', () => {
    const onChange = vi.fn()
    renderWithTheme(<VoiceShortcutInput scTxt="x" onChange={onChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.blur(input)
    const errorMsg = screen.getByText('must contain modifier key')
    expect(errorMsg).toBeInTheDocument()
  })
})
