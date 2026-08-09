import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import SettingsGear from './SettingsGear'
import type { SettingsGearProps } from './topBarTypes'

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('SettingsGear', () => {
  it('renders gear icon', () => {
    const props: SettingsGearProps = {
      onClick: vi.fn(),
    }

    renderWithTheme(<SettingsGear {...props} />)

    expect(screen.getByText('⚙')).toBeInTheDocument()
  })

  it('calls onClick on click', () => {
    const onClick = vi.fn()
    const props: SettingsGearProps = {
      onClick,
    }

    renderWithTheme(<SettingsGear {...props} />)

    fireEvent.click(screen.getByRole('button', { name: 'Settings' }))
    expect(onClick).toHaveBeenCalled()
  })

  it('has correct aria-label', () => {
    const props: SettingsGearProps = {
      onClick: vi.fn(),
    }

    renderWithTheme(<SettingsGear {...props} />)

    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
  })
})
