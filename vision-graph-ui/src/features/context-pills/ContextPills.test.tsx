import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ThemeProvider } from '../../shared/ThemeProvider'
import NodePromptArea from '../node/NodePromptArea'
import type { ContextPill } from './contextPillTypes'

describe('ContextPills - PILC-01 overflow stacking', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  function renderWithTheme(component: React.ReactElement) {
    return render(<ThemeProvider>{component}</ThemeProvider>)
  }

  it('caps at 6 pills + shows +N more', async () => {
    const mockPills: ContextPill[] = Array.from({ length: 8 }, (_, i) => ({
      id: `pill-${i + 1}`,
      lineRange: `L${i * 2 + 1}-${i * 2 + 3}`,
      startLine: i * 2 + 1,
      endLine: i * 2 + 3,
      textSnippet: `snippet ${i + 1}`,
      filePath: '/test/file.md'
    }))

    const mockOnRemove = vi.fn()

    renderWithTheme(
      <NodePromptArea
        value="test"
        onChange={vi.fn()}
        isStream={false}
        isRec={false}
        isCycleRun={false}
        onToggleRec={vi.fn()}
        onSend={vi.fn()}
        contextPills={mockPills}
        onRemovePill={mockOnRemove}
      />
    )

    expect(screen.getByTestId('context-pill-pill-1')).toBeInTheDocument()
    expect(screen.getByTestId('context-pill-pill-6')).toBeInTheDocument()
    expect(screen.queryByTestId('context-pill-pill-7')).not.toBeInTheDocument()
    expect(screen.queryByTestId('context-pill-pill-8')).not.toBeInTheDocument()
    expect(screen.getByTestId('overflow-pill')).toBeInTheDocument()
    expect(screen.getByTestId('overflow-pill').textContent).toContain('+2 more')
  })

  it('expands overflow list on click', async () => {
    const mockPills: ContextPill[] = Array.from({ length: 8 }, (_, i) => ({
      id: `pill-${i + 1}`,
      lineRange: `L${i * 2 + 1}-${i * 2 + 3}`,
      startLine: i * 2 + 1,
      endLine: i * 2 + 3,
      textSnippet: `snippet ${i + 1}`,
      filePath: '/test/file.md'
    }))

    const mockOnRemove = vi.fn()

    renderWithTheme(
      <NodePromptArea
        value="test"
        onChange={vi.fn()}
        isStream={false}
        isRec={false}
        isCycleRun={false}
        onToggleRec={vi.fn()}
        onSend={vi.fn()}
        contextPills={mockPills}
        onRemovePill={mockOnRemove}
      />
    )

    const overflowBtn = screen.getByTestId('overflow-pill')
    fireEvent.click(overflowBtn)

    expect(screen.getByTestId('overflow-list')).toBeInTheDocument()
  })
})