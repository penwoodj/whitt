import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { ReactNode } from 'react'
import NodeMicBtn from './NodeMicBtn'
import { ThemeProvider } from '../../shared/ThemeProvider'

const renderWithTheme = (ui: ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('NodeMicBtn', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders mic icon when not rec', () => {
    renderWithTheme(<NodeMicBtn isRec={false} onToggleRec={vi.fn()} />)
    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('title', 'Start recording')
  })

  it('renders stop icon when rec', () => {
    renderWithTheme(<NodeMicBtn isRec={true} onToggleRec={vi.fn()} />)
    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('title', 'Stop recording')
  })

  it('calls onToggleRec on click', () => {
    const onToggleRec = vi.fn()
    renderWithTheme(<NodeMicBtn isRec={false} onToggleRec={onToggleRec} />)
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    expect(onToggleRec).toHaveBeenCalled()
  })

  it('streams txt when stopping rec', () => {
    const onToggleRec = vi.fn()
    const onStreamTxt = vi.fn()
    renderWithTheme(
      <NodeMicBtn isRec={true} onToggleRec={onToggleRec} onStreamTxt={onStreamTxt} />
    )
    const btn = screen.getByRole('button')
    fireEvent.click(btn)

    vi.advanceTimersByTime(500)

    expect(onStreamTxt).toHaveBeenCalled()
    expect(onToggleRec).toHaveBeenCalled()
  })
})
