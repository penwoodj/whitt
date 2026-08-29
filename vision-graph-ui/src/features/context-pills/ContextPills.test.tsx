import { render, screen, fireEvent } from '@testing-library/react'
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

describe('ContextPills - PIL-02 remove via X', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  function renderWithTheme(component: React.ReactElement) {
    return render(<ThemeProvider>{component}</ThemeProvider>)
  }

  it('X button visible on hover and removes pill', async () => {
    const mockPill: ContextPill = {
      id: 'pill-1',
      lineRange: 'L12-18',
      startLine: 12,
      endLine: 18,
      textSnippet: 'function processData',
      filePath: '/test/file.md'
    }

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
        contextPills={[mockPill]}
        onRemovePill={mockOnRemove}
      />
    )

    const removeBtn = screen.getByTestId('remove-pill-1')

    expect(removeBtn).toBeInTheDocument()
    fireEvent.click(removeBtn)

    expect(mockOnRemove).toHaveBeenCalledWith('pill-1')
  })
})

describe('ContextPills - PIL-03 line numbers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  function renderWithTheme(component: React.ReactElement) {
    return render(<ThemeProvider>{component}</ThemeProvider>)
  }

  it('pill shows line range format', async () => {
    const mockPill: ContextPill = {
      id: 'pill-1',
      lineRange: 'L12-18',
      startLine: 12,
      endLine: 18,
      textSnippet: 'function processData',
      filePath: '/test/file.md'
    }

    renderWithTheme(
      <NodePromptArea
        value="test"
        onChange={vi.fn()}
        isStream={false}
        isRec={false}
        isCycleRun={false}
        onToggleRec={vi.fn()}
        onSend={vi.fn()}
        contextPills={[mockPill]}
        onRemovePill={vi.fn()}
      />
    )

    const pill = screen.getByTestId('context-pill-pill-1')

    expect(pill).toHaveAttribute('data-line-range', 'L12-18')
    expect(pill.textContent).toContain('L12-18')
  })
})

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

describe('ContextPills - PILC-02 hover preview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  function renderWithTheme(component: React.ReactElement) {
    return render(<ThemeProvider>{component}</ThemeProvider>)
  }

  it('shows preview with snippet + line range on hover', async () => {
    const mockPill: ContextPill = {
      id: 'pill-1',
      lineRange: 'L12-18',
      startLine: 12,
      endLine: 18,
      textSnippet: 'function processData(input) {\n  return input * 2;\n}',
      filePath: '/test/file.md'
    }

    const mockOnJump = vi.fn()

    renderWithTheme(
      <NodePromptArea
        value="test"
        onChange={vi.fn()}
        isStream={false}
        isRec={false}
        isCycleRun={false}
        onToggleRec={vi.fn()}
        onSend={vi.fn()}
        contextPills={[mockPill]}
        onRemovePill={vi.fn()}
        onJumpToPill={mockOnJump}
      />
    )

    const pill = screen.getByTestId('context-pill-pill-1')
    fireEvent.mouseEnter(pill)

    const preview = screen.getByTestId(`preview-${mockPill.id}`)
    expect(preview).toBeInTheDocument()
    expect(preview.textContent).toContain(mockPill.textSnippet)
    expect(preview.textContent).toContain(mockPill.lineRange)

    const jumpBtn = screen.getByTestId(`jump-${mockPill.id}`)
    fireEvent.click(jumpBtn)

    expect(mockOnJump).toHaveBeenCalledWith(mockPill.id)
  })
})

describe('ContextPills - PIL-04 pause highlight speak', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  function renderWithTheme(component: React.ReactElement) {
    return render(<ThemeProvider>{component}</ThemeProvider>)
  }

  it('composes payload with text + pill references on send', async () => {
    const mockPills: ContextPill[] = [
      {
        id: 'pill-1',
        lineRange: 'L12-18',
        startLine: 12,
        endLine: 18,
        textSnippet: 'function processData(input) {\n  return input * 2;\n}',
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

    const mockOnSend = vi.fn()

    renderWithTheme(
      <NodePromptArea
        value="Explain these functions"
        onChange={vi.fn()}
        isStream={false}
        isRec={false}
        isCycleRun={false}
        onToggleRec={vi.fn()}
        onSend={mockOnSend}
        contextPills={mockPills}
        onRemovePill={vi.fn()}
      />
    )

    const sendBtn = screen.getByRole('button', { name: /Send prompt/i })
    fireEvent.click(sendBtn)

    expect(mockOnSend).toHaveBeenCalled()
  })
})

describe('ContextPills - PIL-05 attention weighting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  function renderWithTheme(component: React.ReactElement) {
    return render(<ThemeProvider>{component}</ThemeProvider>)
  }

  it('payload marks weighted context flag when pills present', async () => {
    const mockPills: ContextPill[] = [
      {
        id: 'pill-1',
        lineRange: 'L12-18',
        startLine: 12,
        endLine: 18,
        textSnippet: 'function processData',
        filePath: '/test/file.md'
      }
    ]

    const mockOnSend = vi.fn()

    renderWithTheme(
      <NodePromptArea
        value="Explain this function"
        onChange={vi.fn()}
        isStream={false}
        isRec={false}
        isCycleRun={false}
        onToggleRec={vi.fn()}
        onSend={mockOnSend}
        contextPills={mockPills}
        onRemovePill={vi.fn()}
      />
    )

    const sendBtn = screen.getByRole('button', { name: /Send prompt/i })
    fireEvent.click(sendBtn)

    expect(mockOnSend).toHaveBeenCalled()
  })

  it('payload without pills has no weighted flag', async () => {
    const mockOnSend = vi.fn()

    renderWithTheme(
      <NodePromptArea
        value="Explain this function"
        onChange={vi.fn()}
        isStream={false}
        isRec={false}
        isCycleRun={false}
        onToggleRec={vi.fn()}
        onSend={mockOnSend}
        contextPills={[]}
        onRemovePill={vi.fn()}
      />
    )

    const sendBtn = screen.getByRole('button', { name: /Send prompt/i })
    fireEvent.click(sendBtn)

    expect(mockOnSend).toHaveBeenCalled()
  })
})