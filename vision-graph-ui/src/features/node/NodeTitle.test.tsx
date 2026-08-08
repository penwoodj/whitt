import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import NodeTitle from './NodeTitle'

describe('NodeTitle', () => {
  it('renders title txt', () => {
    render(<NodeTitle title="Test Node" />)
    expect(screen.getByText('Test Node')).toBeInTheDocument()
  })

  it('shows input on dblclick', () => {
    render(<NodeTitle title="Test Node" />)
    const title = screen.getByText('Test Node')
    fireEvent.doubleClick(title)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('Test Node')
  })

  it('saves title on blur', () => {
    const onTitleChange = vi.fn()
    render(<NodeTitle title="Test Node" onTitleChange={onTitleChange} />)
    const title = screen.getByText('Test Node')
    fireEvent.doubleClick(title)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'New Title' } })
    fireEvent.blur(input)
    expect(onTitleChange).toHaveBeenCalledWith('New Title')
  })

  it('saves title on Enter key', () => {
    const onTitleChange = vi.fn()
    render(<NodeTitle title="Test Node" onTitleChange={onTitleChange} />)
    const title = screen.getByText('Test Node')
    fireEvent.doubleClick(title)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'New Title' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onTitleChange).toHaveBeenCalledWith('New Title')
  })

  it('shows default title', () => {
    render(<NodeTitle title="New Node" />)
    expect(screen.getByText('New Node')).toBeInTheDocument()
  })
})
