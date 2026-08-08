import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NodeStatus from './NodeStatus'

describe('NodeStatus', () => {
  it('renders idle status', () => {
    render(<NodeStatus status="idle" />)
    expect(screen.getByText('Idle')).toBeInTheDocument()
  })

  it('renders recording status', () => {
    render(<NodeStatus status="recording" />)
    expect(screen.getByText('Recording')).toBeInTheDocument()
  })

  it('renders running status', () => {
    render(<NodeStatus status="running" />)
    expect(screen.getByText('Running')).toBeInTheDocument()
  })

  it('renders done status', () => {
    render(<NodeStatus status="done" />)
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('shows labels with uppercase transform', () => {
    const { rerender } = render(<NodeStatus status="idle" />)
    expect(screen.getByText('Idle')).toBeInTheDocument()

    rerender(<NodeStatus status="recording" />)
    expect(screen.getByText('Recording')).toBeInTheDocument()

    rerender(<NodeStatus status="running" />)
    expect(screen.getByText('Running')).toBeInTheDocument()

    rerender(<NodeStatus status="done" />)
    expect(screen.getByText('Done')).toBeInTheDocument()
  })
})
