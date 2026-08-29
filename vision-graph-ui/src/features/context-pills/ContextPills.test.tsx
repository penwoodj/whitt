import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ThemeProvider } from '../../shared/ThemeProvider'
import NodePromptArea from '../node/NodePromptArea'
import type { ContextPill } from './contextPillTypes'

describe('ContextPills - PIL-01 pills on highlight', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  function renderWithTheme(component: React.ReactElement) {
    return render(<ThemeProvider>{component}</ThemeProvider>)
  }

  it('highlights passed to NodePromptArea and rendered as pills', async () => {
    const mockHighlightSelections: ContextPill[] = [
      {
        id: 'pill-1',
        lineRange: 'L12-18',
        startLine: 12,
        endLine: 18,
        textSnippet: 'function processData(input) {\n  // logic here\n}',
        filePath: '/test/file.md'
      },
      {
        id: 'pill-2',
        lineRange: 'L24-30',
        startLine: 24,
        endLine: 30,
        textSnippet: 'const result = output.map(x => x * 2)',
        filePath: '/test/file.md'
      }
    ]

    const mockOnRemove = vi.fn()

    renderWithTheme(
      <NodePromptArea
        value="test prompt"
        onChange={vi.fn()}
        isStream={false}
        isRec={false}
        isCycleRun={false}
        onToggleRec={vi.fn()}
        onSend={vi.fn()}
        contextPills={mockHighlightSelections}
        onRemovePill={mockOnRemove}
      />
    )

    const pill1 = screen.getByTestId('context-pill-pill-1')
    const pill2 = screen.getByTestId('context-pill-pill-2')

    expect(pill1).toBeInTheDocument()
    expect(pill2).toBeInTheDocument()
    expect(pill1).toHaveAttribute('data-line-range', 'L12-18')
    expect(pill2).toHaveAttribute('data-line-range', 'L24-30')
  })
})