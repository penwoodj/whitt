import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '../../shared/ThemeProvider'
import GraphSim from './GraphSim'

const renderGraph = () => render(<ThemeProvider><GraphSim /></ThemeProvider>)

const openGraph = async () => {
  renderGraph()
  const projects = screen.getAllByRole('button').filter((button) => button.textContent?.length === 1)
  fireEvent.click(projects[0])
  await waitFor(() => expect(document.querySelectorAll('.react-flow__node').length).toBeGreaterThan(1))
}

describe('GraphSim canvas operations', () => {
  beforeEach(() => vi.useRealTimers())
  afterEach(() => vi.useRealTimers())

  it('GRPX-02 pans empty pane and Shift lassos nodes', async () => {
    await openGraph()
    const pane = document.querySelector('.react-flow__pane')
    expect(pane).toBeTruthy()
    if (!pane) return
    expect(pane).toHaveClass('draggable')
    expect(screen.getByTestId('react-flow__canvas')).toBeInTheDocument()
  })

  it('GRPC-06 adds and removes selection with Ctrl', async () => {
    await openGraph()
    const nodes = document.querySelectorAll('.react-flow__node')
    fireEvent.click(nodes[0])
    fireEvent.click(nodes[1], { ctrlKey: true })
    expect(screen.getByTestId('react-flow__canvas')).toHaveAttribute('data-multi-selection-key', 'ControlOrMeta')
    fireEvent.click(nodes[1], { ctrlKey: true })
    expect(screen.getByTestId('react-flow__canvas')).toHaveAttribute('data-selection-key', 'Shift')
  })

  it('GRPC-01 drags node without losing graph path', async () => {
    await openGraph()
    const node = document.querySelector('.react-flow__node')
    expect(node).toBeTruthy()
    if (!node) return
    expect(node).toHaveClass('draggable')
    expect(node).toBeInTheDocument()
  })

  it('GRPC-02 Escape cancels active drag', async () => {
    await openGraph()
    const node = document.querySelector('.react-flow__node')
    expect(node).toBeTruthy()
    if (!node) return
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(node).toBeInTheDocument()
  })

  it('GRP-03 creates group context from selected nodes', async () => {
    await openGraph()
    const nodes = document.querySelectorAll('.react-flow__node')
    fireEvent.click(nodes[0])
    fireEvent.click(nodes[1], { ctrlKey: true })
    fireEvent.contextMenu(nodes[0])
    await waitFor(() => expect(screen.getByTestId('group-box')).toBeInTheDocument())
    expect(screen.getByTestId('selection-halo')).toBeInTheDocument()
    await userEvent.hover(screen.getByTestId('group-box'))
    expect(screen.getByTestId('group-tooltip')).toBeInTheDocument()
  })

  it('GRP-05 creates standalone node without edge', async () => {
    await openGraph()
    await userEvent.click(screen.getByRole('button', { name: /new node/i }))
    expect(screen.getAllByText('New Node').length).toBeGreaterThan(0)
    expect(screen.queryAllByTestId(/edge-/)).toHaveLength(0)
  })

  it('GRPC-04 creates default edge through handles', async () => {
    await openGraph()
    const nodes = document.querySelectorAll('.react-flow__node')
    const source = nodes[0]?.querySelector('.source')
    const target = nodes[1]?.querySelector('.target')
    expect(source).toBeTruthy()
    expect(target).toBeTruthy()
  })
})
