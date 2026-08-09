import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import NewProjectBtn from './NewProjectBtn'
import type { NewProjectBtnProps } from './projectPickerTypes'

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('NewProjectBtn', () => {
  it('renders plus icon', () => {
    const props: NewProjectBtnProps = {
      onClick: vi.fn(),
    }

    renderWithTheme(<NewProjectBtn {...props} />)

    expect(screen.getByText('+')).toBeInTheDocument()
  })

  it('calls onClick on click', () => {
    const onClick = vi.fn()
    const props: NewProjectBtnProps = {
      onClick,
    }

    renderWithTheme(<NewProjectBtn {...props} />)

    fireEvent.click(screen.getByText('+'))
    expect(onClick).toHaveBeenCalled()
  })

  it('has correct aria-label', () => {
    const props: NewProjectBtnProps = {
      onClick: vi.fn(),
    }

    renderWithTheme(<NewProjectBtn {...props} />)

    expect(screen.getByRole('button', { name: 'New Project' })).toBeInTheDocument()
  })
})
