import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { ReactNode } from 'react'
import NodePromptArea from './NodePromptArea'
import { ThemeProvider } from '../../shared/ThemeProvider'

const renderWithTheme = (ui: ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('NodePromptArea', () => {
  it('renders textarea placeholder', () => {
    const onChange = vi.fn()
    renderWithTheme(<NodePromptArea value="" onChange={onChange} isStream={false} />)
    const textarea = screen.getByPlaceholderText('Enter prompt...')
    expect(textarea).toBeInTheDocument()
  })

  it('calls onChange when txt changes', () => {
    const onChange = vi.fn()
    renderWithTheme(<NodePromptArea value="" onChange={onChange} isStream={false} />)
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'hello' } })
    expect(onChange).toHaveBeenCalledWith('hello')
  })

  it('shows streamed txt when streaming', () => {
    const onChange = vi.fn()
    renderWithTheme(
      <NodePromptArea value="original" onChange={onChange} streamedTxt="streamed" isStream={true} />
    )
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('streamed')
  })

  it('disables textarea when streaming', () => {
    const onChange = vi.fn()
    renderWithTheme(
      <NodePromptArea value="original" onChange={onChange} isStream={true} />
    )
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeDisabled()
  })

  it('enables textarea when not streaming', () => {
    const onChange = vi.fn()
    renderWithTheme(
      <NodePromptArea value="original" onChange={onChange} isStream={false} />
    )
    const textarea = screen.getByRole('textbox')
    expect(textarea).not.toBeDisabled()
  })

  it('has placeholder text', () => {
    const onChange = vi.fn()
    renderWithTheme(<NodePromptArea value="" onChange={onChange} isStream={false} />)
    const textarea = screen.getByPlaceholderText('Enter prompt...')
    expect(textarea).toBeInTheDocument()
  })
})