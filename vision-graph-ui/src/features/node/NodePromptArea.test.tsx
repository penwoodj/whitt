import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { ReactNode } from 'react'
import NodePromptArea from './NodePromptArea'
import { ThemeProvider } from '../../shared/ThemeProvider'

const renderWithTheme = (ui: ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('NodePromptArea', () => {
  it('renders textarea placeholder', () => {
    const onChange = vi.fn()
    renderWithTheme(
      <NodePromptArea
        value=""
        onChange={onChange}
        isStream={false}
        isRec={false}
        isCycleRun={false}
        onToggleRec={vi.fn()}
        onSend={vi.fn()}
      />
    )
    const textarea = screen.getByPlaceholderText('Ask anything...')
    expect(textarea).toBeInTheDocument()
  })

  it('calls onChange when txt changes', () => {
    const onChange = vi.fn()
    renderWithTheme(
      <NodePromptArea
        value=""
        onChange={onChange}
        isStream={false}
        isRec={false}
        isCycleRun={false}
        onToggleRec={vi.fn()}
        onSend={vi.fn()}
      />
    )
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'hello' } })
    expect(onChange).toHaveBeenCalledWith('hello')
  })

  it('shows streamed txt when streaming', () => {
    const onChange = vi.fn()
    renderWithTheme(
      <NodePromptArea
        value="original"
        onChange={onChange}
        streamedTxt="streamed"
        isStream={true}
        isRec={false}
        isCycleRun={false}
        onToggleRec={vi.fn()}
        onSend={vi.fn()}
      />
    )
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('streamed')
  })

  it('disables textarea when streaming', () => {
    const onChange = vi.fn()
    renderWithTheme(
      <NodePromptArea
        value="original"
        onChange={onChange}
        isStream={true}
        isRec={false}
        isCycleRun={false}
        onToggleRec={vi.fn()}
        onSend={vi.fn()}
      />
    )
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeDisabled()
  })

  it('enables textarea when not streaming', () => {
    const onChange = vi.fn()
    renderWithTheme(
      <NodePromptArea
        value="original"
        onChange={onChange}
        isStream={false}
        isRec={false}
        isCycleRun={false}
        onToggleRec={vi.fn()}
        onSend={vi.fn()}
      />
    )
    const textarea = screen.getByRole('textbox')
    expect(textarea).not.toBeDisabled()
  })

  it('calls onSend when send button clicked with text', () => {
    const onSend = vi.fn()
    renderWithTheme(
      <NodePromptArea
        value="test prompt"
        onChange={vi.fn()}
        isStream={false}
        isRec={false}
        isCycleRun={false}
        onToggleRec={vi.fn()}
        onSend={onSend}
      />
    )
    const sendBtn = screen.getByLabelText('Send prompt')
    fireEvent.click(sendBtn)
    expect(onSend).toHaveBeenCalled()
  })

  it('disables send button when streaming', () => {
    const onSend = vi.fn()
    renderWithTheme(
      <NodePromptArea
        value="test"
        onChange={vi.fn()}
        isStream={true}
        isRec={false}
        isCycleRun={false}
        onToggleRec={vi.fn()}
        onSend={onSend}
      />
    )
    const sendBtn = screen.getByLabelText('Send prompt')
    expect(sendBtn).toBeDisabled()
  })

  it('disables send button when cycle running', () => {
    const onSend = vi.fn()
    renderWithTheme(
      <NodePromptArea
        value="test"
        onChange={vi.fn()}
        isStream={false}
        isRec={false}
        isCycleRun={true}
        onToggleRec={vi.fn()}
        onSend={onSend}
      />
    )
    const sendBtn = screen.getByLabelText('Stop generation')
    expect(sendBtn).toBeDisabled()
  })

  it('disables send button when empty', () => {
    const onSend = vi.fn()
    renderWithTheme(
      <NodePromptArea
        value=""
        onChange={vi.fn()}
        isStream={false}
        isRec={false}
        isCycleRun={false}
        onToggleRec={vi.fn()}
        onSend={onSend}
      />
    )
    const sendBtn = screen.getByLabelText('Send prompt')
    expect(sendBtn).toBeDisabled()
  })

  it('calls onToggleRec when mic button clicked', () => {
    const onToggleRec = vi.fn()
    renderWithTheme(
      <NodePromptArea
        value=""
        onChange={vi.fn()}
        isStream={false}
        isRec={false}
        isCycleRun={false}
        onToggleRec={onToggleRec}
        onSend={vi.fn()}
      />
    )
    const micBtn = screen.getByTitle('Start recording')
    fireEvent.click(micBtn)
    expect(onToggleRec).toHaveBeenCalled()
  })

  it('shows stop icon when isRec true', () => {
    renderWithTheme(
      <NodePromptArea
        value=""
        onChange={vi.fn()}
        isStream={false}
        isRec={true}
        isCycleRun={false}
        onToggleRec={vi.fn()}
        onSend={vi.fn()}
      />
    )
    const micBtn = screen.getByTitle('Stop recording')
    expect(micBtn).toBeInTheDocument()
  })

  it('renders composer with textarea and buttons', () => {
    renderWithTheme(
      <NodePromptArea
        value=""
        onChange={vi.fn()}
        isStream={false}
        isRec={false}
        isCycleRun={false}
        onToggleRec={vi.fn()}
        onSend={vi.fn()}
      />
    )
    const textarea = screen.getByRole('textbox')
    const sendBtn = screen.getByLabelText('Send prompt')
    const micBtn = screen.getByTitle('Start recording')

    expect(textarea).toBeInTheDocument()
    expect(sendBtn).toBeInTheDocument()
    expect(micBtn).toBeInTheDocument()
  })
})
