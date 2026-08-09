import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { ReactNode } from 'react'
import NodePromptArea from './NodePromptArea'
import { ThemeProvider } from '../../shared/ThemeProvider'

const renderWithTheme = (ui: ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('NodePromptArea', () => {
  it('renders textarea placeholder', () => {
    const onChange = vi.fn()
    const onSend = vi.fn()
    renderWithTheme(<NodePromptArea value="" onChange={onChange} onSend={onSend} isStream={false} isCycleRun={false} />)
    const textarea = screen.getByPlaceholderText('Enter prompt...')
    expect(textarea).toBeInTheDocument()
  })

  it('calls onSend on Enter key', () => {
    const onChange = vi.fn()
    const onSend = vi.fn()
    renderWithTheme(<NodePromptArea value="hello" onChange={onChange} onSend={onSend} isStream={false} isCycleRun={false} />)
    const textarea = screen.getByRole('textbox')
    fireEvent.keyDown(textarea, { key: 'Enter' })
    expect(onSend).toHaveBeenCalled()
  })

  it('does not send on Shift+Enter', () => {
    const onChange = vi.fn()
    const onSend = vi.fn()
    renderWithTheme(<NodePromptArea value="hello" onChange={onChange} onSend={onSend} isStream={false} isCycleRun={false} />)
    const textarea = screen.getByRole('textbox')
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true })
    expect(onSend).not.toHaveBeenCalled()
  })

  it('calls onSend on btn click', () => {
    const onChange = vi.fn()
    const onSend = vi.fn()
    renderWithTheme(<NodePromptArea value="hello" onChange={onChange} onSend={onSend} isStream={false} isCycleRun={false} />)
    const btn = screen.getByText('Send')
    fireEvent.click(btn)
    expect(onSend).toHaveBeenCalled()
  })

  it('disables send btn when empty', () => {
    const onChange = vi.fn()
    const onSend = vi.fn()
    renderWithTheme(<NodePromptArea value="" onChange={onChange} onSend={onSend} isStream={false} isCycleRun={false} />)
    const btn = screen.getByText('Send')
    expect(btn).toBeDisabled()
  })

  it('shows streamed txt when streaming', () => {
    const onChange = vi.fn()
    const onSend = vi.fn()
    renderWithTheme(
      <NodePromptArea value="original" onChange={onChange} onSend={onSend} streamedTxt="streamed" isStream={true} isCycleRun={false} />
    )
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('streamed')
  })

  it('disables textarea when streaming', () => {
    const onChange = vi.fn()
    const onSend = vi.fn()
    renderWithTheme(
      <NodePromptArea value="original" onChange={onChange} onSend={onSend} isStream={true} isCycleRun={false} />
    )
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeDisabled()
  })

  it('enables textarea when not streaming', () => {
    const onChange = vi.fn()
    const onSend = vi.fn()
    renderWithTheme(
      <NodePromptArea value="original" onChange={onChange} onSend={onSend} isStream={false} isCycleRun={false} />
    )
    const textarea = screen.getByRole('textbox')
    expect(textarea).not.toBeDisabled()
  })

  it('disables send btn when cycle running', () => {
    const onChange = vi.fn()
    const onSend = vi.fn()
    renderWithTheme(
      <NodePromptArea value="hello" onChange={onChange} onSend={onSend} isStream={false} isCycleRun={true} />
    )
    const btn = screen.getByText('Send')
    expect(btn).toBeDisabled()
  })

  it('disables send btn when streaming', () => {
    const onChange = vi.fn()
    const onSend = vi.fn()
    renderWithTheme(
      <NodePromptArea value="hello" onChange={onChange} onSend={onSend} isStream={true} isCycleRun={false} />
    )
    const btn = screen.getByText('Streaming...')
    expect(btn).toBeDisabled()
  })
})
