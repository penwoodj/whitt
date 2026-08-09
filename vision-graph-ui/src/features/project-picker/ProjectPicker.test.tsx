import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import ProjectPicker from './ProjectPicker'
import type { ProjectPickerProps } from './projectPickerTypes'

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('ProjectPicker', () => {
  it('renders project list', () => {
    const projects = [
      { id: '1', label: 'A', iconLetter: 'A', lastOpened: new Date() },
      { id: '2', label: 'B', iconLetter: 'B', lastOpened: new Date() },
      { id: '3', label: 'C', iconLetter: 'C', lastOpened: new Date() },
    ]
    const props: ProjectPickerProps = {
      projects,
      activeProjectId: '1',
      onSelect: vi.fn(),
      onNew: vi.fn(),
    }

    renderWithTheme(<ProjectPicker {...props} />)

    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('active project marked', () => {
    const projects = [
      { id: '1', label: 'A', iconLetter: 'A', lastOpened: new Date() },
      { id: '2', label: 'B', iconLetter: 'B', lastOpened: new Date() },
    ]
    const props: ProjectPickerProps = {
      projects,
      activeProjectId: '2',
      onSelect: vi.fn(),
      onNew: vi.fn(),
    }

    renderWithTheme(<ProjectPicker {...props} />)

    const activeIcon = screen.getByText('B').closest('button')
    expect(activeIcon).toHaveAttribute('aria-current', 'true')
  })

  it('click project calls onSelect', () => {
    const onSelect = vi.fn()
    const projects = [{ id: '1', label: 'A', iconLetter: 'A', lastOpened: new Date() }]
    const props: ProjectPickerProps = {
      projects,
      activeProjectId: '',
      onSelect,
      onNew: vi.fn(),
    }

    renderWithTheme(<ProjectPicker {...props} />)

    fireEvent.click(screen.getByText('A'))
    expect(onSelect).toHaveBeenCalledWith('1')
  })

  it('click new project calls onNew', () => {
    const onNew = vi.fn()
    const props: ProjectPickerProps = {
      projects: [],
      activeProjectId: '',
      onSelect: vi.fn(),
      onNew,
    }

    renderWithTheme(<ProjectPicker {...props} />)

    const newBtn = screen.getByRole('button', { name: /new project/i })
    fireEvent.click(newBtn)
    expect(onNew).toHaveBeenCalled()
  })
})
