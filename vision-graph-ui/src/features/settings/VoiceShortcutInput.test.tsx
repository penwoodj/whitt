import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VoiceShortcutInput } from './VoiceShortcutInput'

describe('VoiceShortcutInput', () => {
  it('renders w/ default "Ctrl+Space"', () => {
    const onChange = vi.fn()
    render(<VoiceShortcutInput scTxt="Ctrl+Space" onChange={onChange} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('Ctrl+Space')
  })

  it('shows red border on invalid shortcut', () => {
    const onChange = vi.fn()
    render(<VoiceShortcutInput scTxt="x" onChange={onChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.blur(input)
    expect(input.style.border).toContain('red')
  })

  it('shows err msg on invalid shortcut', () => {
    const onChange = vi.fn()
    render(<VoiceShortcutInput scTxt="x" onChange={onChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.blur(input)
    const errorMsg = screen.getByText('must contain modifier key')
    expect(errorMsg).toBeInTheDocument()
  })
})
