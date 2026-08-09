import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { ReactNode } from 'react'
import NodeAgenticTodos from './NodeAgenticTodos'
import type { Todo } from './nodeTypes'
import { ThemeProvider } from '../../shared/ThemeProvider'

const renderWithTheme = (ui: ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('NodeAgenticTodos', () => {
  const todos: Todo[] = [
    { label: 'research', status: 'queued' },
    { label: 'draft', status: 'queued' },
  ]

  it('hidden when showAgentic is false', () => {
    const onToggle = vi.fn()
    renderWithTheme(<NodeAgenticTodos todos={todos} expanded={false} onToggle={onToggle} showAgentic={false} />)
    expect(screen.queryByText('Agentic Tasks (2)')).not.toBeInTheDocument()
  })

  it('renders collapsed by default when showAgentic is true', () => {
    const onToggle = vi.fn()
    renderWithTheme(<NodeAgenticTodos todos={todos} expanded={false} onToggle={onToggle} showAgentic={true} />)
    expect(screen.getByText('Agentic Tasks (2)')).toBeInTheDocument()
    expect(screen.queryByText('research')).not.toBeInTheDocument()
  })

  it('shows todos when expanded', () => {
    const onToggle = vi.fn()
    renderWithTheme(<NodeAgenticTodos todos={todos} expanded={true} onToggle={onToggle} showAgentic={true} />)
    expect(screen.getByText('research')).toBeInTheDocument()
    expect(screen.getByText('draft')).toBeInTheDocument()
  })

  it('calls onToggle on btn click', () => {
    const onToggle = vi.fn()
    renderWithTheme(<NodeAgenticTodos todos={todos} expanded={false} onToggle={onToggle} showAgentic={true} />)
    const btn = screen.getByText('Agentic Tasks (2)')
    fireEvent.click(btn)
    expect(onToggle).toHaveBeenCalled()
  })

  it('shows compact strip with running todo when collapsed and has running todo', () => {
    const runningTodos: Todo[] = [
      { label: 'research', status: 'running' },
      { label: 'draft', status: 'queued' },
    ]
    renderWithTheme(<NodeAgenticTodos todos={runningTodos} expanded={false} onToggle={vi.fn()} showAgentic={true} />)
    expect(screen.getByText('research')).toBeInTheDocument()
    expect(screen.queryByText('Agentic Tasks (2)')).not.toBeInTheDocument()
  })

  it('shows spinner when running todo present', () => {
    const runningTodos: Todo[] = [
      { label: 'research', status: 'running' },
      { label: 'draft', status: 'queued' },
    ]
    renderWithTheme(<NodeAgenticTodos todos={runningTodos} expanded={true} onToggle={vi.fn()} showAgentic={true} />)
    expect(screen.getByText('research')).toBeInTheDocument()
    expect(screen.getByText('draft')).toBeInTheDocument()
  })

  it('shows todo status colors', () => {
    renderWithTheme(<NodeAgenticTodos todos={todos} expanded={true} onToggle={vi.fn()} showAgentic={true} />)
    const todoItems = document.querySelectorAll('li')
    expect(todoItems).toHaveLength(2)
  })

  it('shows empty state when no todos', () => {
    renderWithTheme(<NodeAgenticTodos todos={[]} expanded={true} onToggle={vi.fn()} showAgentic={true} />)
    expect(screen.getByText('Agentic Tasks (0)')).toBeInTheDocument()
  })
})