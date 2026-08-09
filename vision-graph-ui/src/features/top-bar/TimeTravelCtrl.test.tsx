import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import TimeTravelCtrl from './TimeTravelCtrl'
import type { TimeTravelCtrlProps } from './topBarTypes'

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('TimeTravelCtrl', () => {
  it('renders commit label', () => {
    const props: TimeTravelCtrlProps = {
      canTravelBack: false,
      canTravelForward: false,
      commitLabel: 'abc1234 • Add Node B',
      onTravelBack: vi.fn(),
      onTravelForward: vi.fn(),
    }

    renderWithTheme(<TimeTravelCtrl {...props} />)

    expect(screen.getByText('abc1234 • Add Node B')).toBeInTheDocument()
  })

  it('back btn disabled when cannot travel', () => {
    const props: TimeTravelCtrlProps = {
      canTravelBack: false,
      canTravelForward: true,
      commitLabel: 'abc1234 • Add Node B',
      onTravelBack: vi.fn(),
      onTravelForward: vi.fn(),
    }

    renderWithTheme(<TimeTravelCtrl {...props} />)

    const backBtn = screen.getByRole('button', { name: /travel back/i })
    expect(backBtn).toBeDisabled()
  })

  it('forward btn disabled when cannot travel', () => {
    const props: TimeTravelCtrlProps = {
      canTravelBack: true,
      canTravelForward: false,
      commitLabel: 'abc1234 • Add Node B',
      onTravelBack: vi.fn(),
      onTravelForward: vi.fn(),
    }

    renderWithTheme(<TimeTravelCtrl {...props} />)

    const fwdBtn = screen.getByRole('button', { name: /travel forward/i })
    expect(fwdBtn).toBeDisabled()
  })

  it('calls onTravelBack on click', () => {
    const onTravelBack = vi.fn()
    const props: TimeTravelCtrlProps = {
      canTravelBack: true,
      canTravelForward: false,
      commitLabel: 'abc1234 • Add Node B',
      onTravelBack,
      onTravelForward: vi.fn(),
    }

    renderWithTheme(<TimeTravelCtrl {...props} />)

    fireEvent.click(screen.getByRole('button', { name: /travel back/i }))
    expect(onTravelBack).toHaveBeenCalled()
  })

  it('calls onTravelForward on click', () => {
    const onTravelForward = vi.fn()
    const props: TimeTravelCtrlProps = {
      canTravelBack: false,
      canTravelForward: true,
      commitLabel: 'abc1234 • Add Node B',
      onTravelBack: vi.fn(),
      onTravelForward,
    }

    renderWithTheme(<TimeTravelCtrl {...props} />)

    fireEvent.click(screen.getByRole('button', { name: /travel forward/i }))
    expect(onTravelForward).toHaveBeenCalled()
  })
})
