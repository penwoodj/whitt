import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import ProjectIcon from './ProjectIcon'
import type { ProjectIconProps } from './projectPickerTypes'

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('ProjectIcon', () => {
  it('renders icon letter', () => {
    const props: ProjectIconProps = {
      label: 'Test Project',
      iconLetter: 'T',
      $isActive: false,
      onClick: vi.fn(),
    }

    renderWithTheme(<ProjectIcon {...props} />)

    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('shows active border when active', () => {
    const props: ProjectIconProps = {
      label: 'Test Project',
      iconLetter: 'T',
      $isActive: true,
      onClick: vi.fn(),
    }

    const { container } = renderWithTheme(<ProjectIcon {...props} />)

    const button = container.querySelector('button')
    expect(button).toHaveStyle({ border: '2px solid #007ACC' })
  })

  it('calls onClick on click', () => {
    const onClick = vi.fn()
    const props: ProjectIconProps = {
      label: 'Test Project',
      iconLetter: 'T',
      $isActive: false,
      onClick,
    }

    renderWithTheme(<ProjectIcon {...props} />)

    fireEvent.click(screen.getByText('T'))
    expect(onClick).toHaveBeenCalled()
  })
})
