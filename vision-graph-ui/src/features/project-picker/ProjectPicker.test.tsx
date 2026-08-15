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

  it('APP-03 project letter bubbles', () => {
    const projects = [
      { id: '1', label: 'Alpha', iconLetter: 'A', lastOpened: new Date() },
      { id: '2', label: 'Beta', iconLetter: 'B', lastOpened: new Date() },
      { id: '3', label: 'Gamma', iconLetter: 'G', lastOpened: new Date() },
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
    expect(screen.getByText('G')).toBeInTheDocument()
  })

  it('APP-04 new project blank', () => {
    const onNew = vi.fn()
    const props: ProjectPickerProps = {
      projects: [{ id: '1', label: 'Existing', iconLetter: 'E', lastOpened: new Date() }],
      activeProjectId: '',
      onSelect: vi.fn(),
      onNew,
    }

    renderWithTheme(<ProjectPicker {...props} />)

    const newBtn = screen.getByRole('button', { name: /new project/i })
    expect(newBtn).toBeInTheDocument()
    fireEvent.click(newBtn)
    expect(onNew).toHaveBeenCalled()
  })

  it('APPC-02 empty rail', () => {
    const props: ProjectPickerProps = {
      projects: [],
      activeProjectId: '',
      onSelect: vi.fn(),
      onNew: vi.fn(),
    }

    renderWithTheme(<ProjectPicker {...props} />)

    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /new project/i })).toBeInTheDocument()
  })

  it('APPC-01 rail scrolls', () => {
    const projects = Array.from({ length: 30 }, (_, i) => ({
      id: `project-${i}`,
      label: `Project ${i}`,
      iconLetter: String.fromCharCode(65 + (i % 26)),
      lastOpened: new Date(),
    }))
    
    const props: ProjectPickerProps = {
      projects,
      activeProjectId: 'project-25',
      onSelect: vi.fn(),
      onNew: vi.fn(),
    }

    const { container } = renderWithTheme(<ProjectPicker {...props} />)

    const projectList = container.querySelector('[role="list"]')
    expect(projectList).toBeInTheDocument()
    
    const listElement = projectList as HTMLElement
    expect(listElement.style.overflowY).toBe('auto')
    
    const activeProject = screen.getByText('Z')
    expect(activeProject).toBeInTheDocument()
  })
})
