import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { ReactNode } from 'react'
import Node from './Node'
import { ThemeProvider } from '../../shared/ThemeProvider'
import type { NodeData } from './nodeTypes'

const renderWithTheme = (ui: ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>)

const createNode = (overrides: Partial<NodeData> = {}): NodeData => ({
  id: '1',
  title: 'New Node',
  status: 'idle',
  type: 'task',
  lifecycle: 'initial',
  nodeViewState: 'collapsed',
  promptTxt: '',
  todos: [],
  lastUpdate: null,
  detailExpanded: false,
  todosExpanded: false,
  isRec: false,
  isCycleRun: false,
  ...overrides,
})

describe('Node', () => {
  it('renders collapsed node with title only', () => {
    const node = createNode()
    renderWithTheme(<Node data={node} />)
    expect(screen.getAllByText('New Node')[0]).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Ask anything...')).not.toBeInTheDocument()
  })

  it('shows sphere outline on hover', () => {
    const node = createNode()
    renderWithTheme(<Node data={node} />)

    const nodeWrap = screen.getByRole('button')
    fireEvent.mouseEnter(nodeWrap)

    expect(nodeWrap).toHaveStyle({ border: '1px dashed #007ACC' })
  })

  it('expands to square composer on click', () => {
    const node = createNode()
    renderWithTheme(<Node data={node} />)

    const nodeWrap = screen.getByRole('button')
    fireEvent.mouseEnter(nodeWrap)
    fireEvent.click(nodeWrap)

    expect(screen.getByPlaceholderText('Ask anything...')).toBeInTheDocument()
    expect(screen.getByLabelText('Send prompt')).toBeInTheDocument()
  })

  it('collapses on Escape key', () => {
    const node = createNode()
    renderWithTheme(<Node data={node} />)

    const nodeWrap = screen.getByRole('button')
    fireEvent.mouseEnter(nodeWrap)
    fireEvent.click(nodeWrap)

    expect(screen.getByPlaceholderText('Ask anything...')).toBeInTheDocument()

    fireEvent.keyDown(nodeWrap, { key: 'Escape' })
    expect(screen.queryByPlaceholderText('Ask anything...')).not.toBeInTheDocument()
  })

  it('collapses on click outside', () => {
    const node = createNode()
    const { container } = renderWithTheme(<Node data={node} />)

    const nodeWrap = screen.getByRole('button')
    fireEvent.mouseEnter(nodeWrap)
    fireEvent.click(nodeWrap)

    expect(screen.getByPlaceholderText('Ask anything...')).toBeInTheDocument()

    fireEvent.mouseDown(container)
    expect(screen.queryByPlaceholderText('Ask anything...')).not.toBeInTheDocument()
  })

  it('does not render details panel when lifecycle is not done', () => {
    const node = createNode({ lifecycle: 'initial' })
    renderWithTheme(<Node data={node} />)

    const nodeWrap = screen.getByRole('button')
    fireEvent.mouseEnter(nodeWrap)
    fireEvent.click(nodeWrap)

    expect(screen.queryByText('Details')).not.toBeInTheDocument()
  })

  it('renders details panel when lifecycle is done and expanded', () => {
    const node = createNode({ lifecycle: 'done' })
    renderWithTheme(<Node data={node} />)

    const nodeWrap = screen.getByRole('button')
    fireEvent.mouseEnter(nodeWrap)
    fireEvent.click(nodeWrap)

    expect(screen.getByText('Details')).toBeInTheDocument()
  })

  it('calls onSend when send button clicked with text', () => {
    const onSend = vi.fn()
    const node = createNode()
    renderWithTheme(<Node data={node} onSend={onSend} />)

    const nodeWrap = screen.getByRole('button')
    fireEvent.mouseEnter(nodeWrap)
    fireEvent.click(nodeWrap)

    const textarea = screen.getByPlaceholderText('Ask anything...')
    fireEvent.change(textarea, { target: { value: 'test prompt' } })

    const sendBtn = screen.getByLabelText('Send prompt')
    fireEvent.click(sendBtn)

    expect(onSend).toHaveBeenCalledWith('test prompt')
  })
})