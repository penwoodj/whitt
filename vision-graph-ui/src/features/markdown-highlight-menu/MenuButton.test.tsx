import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import MenuButton from './MenuButton'
import type { MenuButtonProps } from './markdownHighlightTypes'

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('MenuButton', () => {
  it('renders icon and label', () => {
    const props: MenuButtonProps = {
      icon: '+',
      label: 'Expand',
      onClick: vi.fn(),
    }

    renderWithTheme(<MenuButton {...props} />)

    expect(screen.getByText('+')).toBeInTheDocument()
    expect(screen.getByText('Expand')).toBeInTheDocument()
  })

  it('calls onClick on click', () => {
    const onClick = vi.fn()
    const props: MenuButtonProps = {
      icon: '+',
      label: 'Expand',
      onClick,
    }

    renderWithTheme(<MenuButton {...props} />)

    fireEvent.click(screen.getByRole('button', { name: 'Expand' }))
    expect(onClick).toHaveBeenCalled()
  })

  it('has correct aria-label', () => {
    const props: MenuButtonProps = {
      icon: '+',
      label: 'Expand',
      onClick: vi.fn(),
    }

    renderWithTheme(<MenuButton {...props} />)

    expect(screen.getByRole('button', { name: 'Expand' })).toBeInTheDocument()
  })
})
