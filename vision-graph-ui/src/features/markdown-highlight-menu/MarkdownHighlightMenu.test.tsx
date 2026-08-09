import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import MarkdownHighlightMenu from './MarkdownHighlightMenu'
import type { MarkdownHighlightMenuProps } from './markdownHighlightTypes'
import { buildDefaultProps, buildEmptySelectionProps, buildNullPositionProps } from './markdownHighlightData'

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('MarkdownHighlightMenu', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('menu shows on text select', () => {
    const props: MarkdownHighlightMenuProps = buildDefaultProps()

    const { container } = renderWithTheme(<MarkdownHighlightMenu {...props} />)

    const menu = container.querySelector('[data-testid="highlight-menu"]')
    expect(menu).toBeInTheDocument()
    expect(menu).toHaveStyle({ left: '100px', top: '200px' })
  })

  it('menu hidden when no selection', () => {
    const props: MarkdownHighlightMenuProps = buildEmptySelectionProps()

    const { container } = renderWithTheme(<MarkdownHighlightMenu {...props} />)

    const menu = container.querySelector('[data-testid="highlight-menu"]')
    expect(menu).not.toBeInTheDocument()
  })

  it('menu hidden when position null', () => {
    const props: MarkdownHighlightMenuProps = buildNullPositionProps()

    const { container } = renderWithTheme(<MarkdownHighlightMenu {...props} />)

    const menu = container.querySelector('[data-testid="highlight-menu"]')
    expect(menu).not.toBeInTheDocument()
  })

  it('click Expand calls onExpand', () => {
    const onExpand = vi.fn()
    const onClose = vi.fn()
    const props: MarkdownHighlightMenuProps = {
      ...buildDefaultProps(),
      onExpand,
      onRefine: () => {},
      onClose,
    }

    renderWithTheme(<MarkdownHighlightMenu {...props} />)

    fireEvent.click(screen.getByRole('button', { name: /expand/i }))
    expect(onExpand).toHaveBeenCalledWith('React Flow')
    expect(onClose).toHaveBeenCalled()
  })

  it('click Refine calls onRefine', () => {
    const onRefine = vi.fn()
    const onClose = vi.fn()
    const props: MarkdownHighlightMenuProps = {
      ...buildDefaultProps(),
      onExpand: () => {},
      onRefine,
      onClose,
    }

    renderWithTheme(<MarkdownHighlightMenu {...props} />)

    fireEvent.click(screen.getByRole('button', { name: /refine/i }))
    expect(onRefine).toHaveBeenCalledWith('React Flow')
    expect(onClose).toHaveBeenCalled()
  })

  it('click outside calls onClose', () => {
    const onClose = vi.fn()
    const props: MarkdownHighlightMenuProps = {
      ...buildDefaultProps(),
      onExpand: () => {},
      onRefine: () => {},
      onClose,
    }

    renderWithTheme(<MarkdownHighlightMenu {...props} />)

    fireEvent.mouseDown(document.body)
    expect(onClose).toHaveBeenCalled()
  })
})
