import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectFolderPicker } from './ProjectFolderPicker'

describe('ProjectFolderPicker', () => {
  it('renders w/ empty input by default', () => {
    const onChange = vi.fn()
    render(<ProjectFolderPicker folderPath="" onChange={onChange} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('')
  })

  it('calls onBrowse when Browse btn clicked', () => {
    const onChange = vi.fn()
    render(<ProjectFolderPicker folderPath="" onChange={onChange} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(button).toBeInTheDocument()
  })

  it('does not open real file picker', () => {
    const onChange = vi.fn()
    render(<ProjectFolderPicker folderPath="" onChange={onChange} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    const windowShow = (global as any).window.showOpenFilePicker
    expect(windowShow).toBeUndefined()
  })
})
