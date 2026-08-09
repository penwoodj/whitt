import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { ReactNode } from 'react'
import Node from './Node'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { emptyNode, busyNode } from './nodeData'

const renderWithTheme = (ui: ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('Node', () => {
  it('renders node with title', () => {
    const node = emptyNode('1')
    renderWithTheme(<Node data={node} />)
    expect(screen.getAllByText('New Node')[0]).toBeInTheDocument()
  })

  it('renders node with status', () => {
    const node = busyNode('1')
    renderWithTheme(<Node data={node} />)
    expect(screen.getByText('Running')).toBeInTheDocument()
  })

  it('renders node with todos', () => {
    const node = busyNode('1')
    renderWithTheme(<Node data={node} />)
    expect(screen.getByText('Agentic Tasks (2)')).toBeInTheDocument()
  })

  it('calls onSend when prompt sent', () => {
    const onSend = vi.fn()
    const node = emptyNode('1')
    renderWithTheme(<Node data={node} onSend={onSend} />)

    const textarea = screen.getByPlaceholderText('Enter prompt...')
    fireEvent.change(textarea, { target: { value: 'test prompt' } })
    fireEvent.keyDown(textarea, { key: 'Enter' })

    expect(onSend).toHaveBeenCalledWith('test prompt')
  })

  it('calls onTitleChange when title edited', () => {
    const onTitleChange = vi.fn()
    const node = emptyNode('1')
    renderWithTheme(<Node data={node} onTitleChange={onTitleChange} />)

    const title = screen.getAllByText('New Node')[0]
    fireEvent.doubleClick(title)

    const input = screen.getAllByRole('textbox')[0]
    fireEvent.change(input, { target: { value: 'New Title' } })
    fireEvent.blur(input)

    expect(onTitleChange).toHaveBeenCalledWith('New Title')
  })

  it('toggles todos on click', () => {
    const node = busyNode('1')
    renderWithTheme(<Node data={node} />)

    const todosBtn = screen.getByText('Agentic Tasks (2)')
    expect(screen.queryByText('research')).not.toBeInTheDocument()

    fireEvent.click(todosBtn)
    expect(screen.getByText('research')).toBeInTheDocument()
  })

  it('toggles detail panel on click', () => {
    const node = emptyNode('1')
    renderWithTheme(<Node data={node} />)

    const detailsBtn = screen.getByText('Details')
    expect(screen.queryByText('Node Details')).not.toBeInTheDocument()

    fireEvent.click(detailsBtn)
    expect(screen.getByText('Node Details')).toBeInTheDocument()
  })

  it('renders tooltip on hover', () => {
    const node = emptyNode('1')
    node.title = 'Test Node'
    renderWithTheme(<Node data={node} />)

    const tooltip = document.querySelector('.node-tooltip')
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveTextContent('Test Node')
  })
})
