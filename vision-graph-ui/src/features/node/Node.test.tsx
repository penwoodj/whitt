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
  focused: false,
  promptTxt: '',
  todos: [],
  lastUpdate: null,
  detailExpanded: false,
  todosExpanded: false,
  isRec: false,
  isCycleRun: false,
  isStream: false,
  streamedTxt: '',
  ...overrides,
})

describe('Node', () => {
  it('renders minimized box with title + state by default', () => {
    const node = createNode()
    renderWithTheme(<Node data={node} />)

    expect(screen.getAllByText('New Node')[0]).toBeInTheDocument()
    expect(screen.getByText('Idle')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Ask anything...')).not.toBeInTheDocument()
  })

  it('expands box on hover (composer visible)', () => {
    const node = createNode()
    renderWithTheme(<Node data={node} />)

    const nodeBox = screen.getByRole('button')
    fireEvent.mouseEnter(nodeBox)

    fireEvent.click(screen.getByRole('button', { name: /open prompt/i }))
    expect(screen.getByPlaceholderText('Ask anything...')).toBeInTheDocument()
    expect(screen.getByLabelText('Send prompt')).toBeInTheDocument()
  })

  it('click pins box open (focused state, border primary)', () => {
    const node = createNode()
    renderWithTheme(<Node data={node} />)

    const nodeBox = screen.getByRole('button')
    fireEvent.mouseEnter(nodeBox)
    fireEvent.click(nodeBox)

    expect(screen.getByPlaceholderText('Ask anything...')).toBeInTheDocument()
    expect(nodeBox).toHaveStyle({ borderColor: '#007ACC' })
  })

  it('mouse leave on hovered (not focused) collapses', () => {
    const node = createNode()
    renderWithTheme(<Node data={node} />)

    const nodeBox = screen.getByRole('button')
    fireEvent.mouseEnter(nodeBox)
    fireEvent.mouseLeave(nodeBox)

    expect(screen.queryByPlaceholderText('Ask anything...')).not.toBeInTheDocument()
  })

  it('mouse leave on focused stays open', () => {
    const node = createNode()
    renderWithTheme(<Node data={node} />)

    const nodeBox = screen.getByRole('button')
    fireEvent.mouseEnter(nodeBox)
    fireEvent.click(nodeBox)
    fireEvent.mouseLeave(nodeBox)

    expect(screen.getByPlaceholderText('Ask anything...')).toBeInTheDocument()
  })

  it('close btn collapses', () => {
    const node = createNode()
    renderWithTheme(<Node data={node} />)

    const nodeBox = screen.getByRole('button')
    fireEvent.mouseEnter(nodeBox)
    fireEvent.click(nodeBox)

    const closeBtn = screen.getByRole('button', { name: 'Close composer' })
    fireEvent.click(closeBtn)

    expect(screen.queryByPlaceholderText('Ask anything...')).not.toBeInTheDocument()
  })

  it('escape collapses', () => {
    const node = createNode()
    renderWithTheme(<Node data={node} />)

    const nodeBox = screen.getByRole('button')
    fireEvent.mouseEnter(nodeBox)
    fireEvent.click(nodeBox)

    expect(screen.getByPlaceholderText('Ask anything...')).toBeInTheDocument()

    fireEvent.keyDown(nodeBox, { key: 'Escape' })
    expect(screen.queryByPlaceholderText('Ask anything...')).not.toBeInTheDocument()
  })

  it('click outside collapses', () => {
    const node = createNode()
    const { container } = renderWithTheme(<Node data={node} />)

    const nodeBox = screen.getByRole('button')
    fireEvent.mouseEnter(nodeBox)
    fireEvent.click(nodeBox)

    expect(screen.getByPlaceholderText('Ask anything...')).toBeInTheDocument()

    fireEvent.mouseDown(container)
    expect(screen.queryByPlaceholderText('Ask anything...')).not.toBeInTheDocument()
  })

  it('calls onSend when send button clicked with text', () => {
    const onSend = vi.fn()
    const node = createNode()
    renderWithTheme(<Node data={node} onSend={onSend} />)

    const nodeBox = screen.getByRole('button')
    fireEvent.mouseEnter(nodeBox)
    fireEvent.click(nodeBox)

    const textarea = screen.getByPlaceholderText('Ask anything...')
    fireEvent.change(textarea, { target: { value: 'test prompt' } })

    const sendBtn = screen.getByLabelText('Send prompt')
    fireEvent.click(sendBtn)

    expect(onSend).toHaveBeenCalledWith('test prompt')
  })

  it('does not render details panel when lifecycle is not done', () => {
    const node = createNode({ lifecycle: 'initial' })
    renderWithTheme(<Node data={node} />)

    const nodeBox = screen.getByRole('button')
    fireEvent.mouseEnter(nodeBox)
    fireEvent.click(nodeBox)

    expect(screen.queryByText('Details')).not.toBeInTheDocument()
  })

  it('renders details panel when lifecycle is done and expanded', () => {
    const node = createNode({ lifecycle: 'done' })
    renderWithTheme(<Node data={node} />)

    const nodeBox = screen.getByRole('button')
    fireEvent.mouseEnter(nodeBox)
    fireEvent.click(nodeBox)

    expect(screen.getByText('Details')).toBeInTheDocument()
  })
})
