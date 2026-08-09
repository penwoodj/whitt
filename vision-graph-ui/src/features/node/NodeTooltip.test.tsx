import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import NodeTooltip from './NodeTooltip'
import { emptyNode } from './nodeData'
import { ThemeProvider } from '../../shared/ThemeProvider'

const renderWithTheme = (ui: ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('NodeTooltip', () => {
  it('renders children', () => {
    const node = emptyNode('1')
    renderWithTheme(
      <NodeTooltip node={node}>
        <div>Child content</div>
      </NodeTooltip>
    )
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('shows tooltip with title', () => {
    const node = emptyNode('1')
    node.title = 'Test Node'
    renderWithTheme(
      <NodeTooltip node={node}>
        <div>Content</div>
      </NodeTooltip>
    )
    const tooltip = document.querySelector('.node-tooltip')
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveTextContent('Test Node')
  })

  it('shows tooltip with status', () => {
    const node = emptyNode('1')
    node.status = 'running'
    renderWithTheme(
      <NodeTooltip node={node}>
        <div>Content</div>
      </NodeTooltip>
    )
    const tooltip = document.querySelector('.node-tooltip')
    expect(tooltip).toHaveTextContent('running')
  })

  it('shows last update time', () => {
    const node = emptyNode('1')
    node.lastUpdate = new Date('2024-01-01T12:00:00')
    renderWithTheme(
      <NodeTooltip node={node}>
        <div>Content</div>
      </NodeTooltip>
    )
    const tooltip = document.querySelector('.node-tooltip')
    expect(tooltip).toHaveTextContent('Updated:')
  })

  it('shows never when no last update', () => {
    const node = emptyNode('1')
    renderWithTheme(
      <NodeTooltip node={node}>
        <div>Content</div>
      </NodeTooltip>
    )
    const tooltip = document.querySelector('.node-tooltip')
    expect(tooltip).toHaveTextContent('Never')
  })
})
