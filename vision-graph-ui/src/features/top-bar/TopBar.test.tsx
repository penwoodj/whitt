import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import TopBar from './TopBar'
import type { TopBarProps } from './topBarTypes'

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('TopBar', () => {
  it('renders top bar elements', () => {
    const props: TopBarProps = {
      graphTitle: 'My Graph',
      syncStatus: 'idle',
      lastSyncLabel: 'Synced 2s ago',
      canTravelBack: false,
      canTravelForward: false,
      commitLabel: 'abc1234 • Add Node B',
      onSync: vi.fn(),
      onTravelBack: vi.fn(),
      onTravelForward: vi.fn(),
      onOpenSettings: vi.fn(),
    }

    renderWithTheme(<TopBar {...props} />)

    expect(screen.getByText('My Graph')).toBeInTheDocument()
    expect(screen.getByText('Synced 2s ago')).toBeInTheDocument()
    expect(screen.getByText('abc1234 • Add Node B')).toBeInTheDocument()
  })

  it('sync btn shows status', () => {
    const props: TopBarProps = {
      graphTitle: 'My Graph',
      syncStatus: 'synced',
      lastSyncLabel: 'Synced just now',
      canTravelBack: false,
      canTravelForward: false,
      commitLabel: '',
      onSync: vi.fn(),
      onTravelBack: vi.fn(),
      onTravelForward: vi.fn(),
      onOpenSettings: vi.fn(),
    }

    renderWithTheme(<TopBar {...props} />)

    expect(screen.getByText('Synced just now')).toBeInTheDocument()
  })

  it('time travel ctrl disabled when cannot travel', () => {
    const props: TopBarProps = {
      graphTitle: 'My Graph',
      syncStatus: 'idle',
      lastSyncLabel: '',
      canTravelBack: false,
      canTravelForward: false,
      commitLabel: '',
      onSync: vi.fn(),
      onTravelBack: vi.fn(),
      onTravelForward: vi.fn(),
      onOpenSettings: vi.fn(),
    }

    renderWithTheme(<TopBar {...props} />)

    const backBtn = screen.getByRole('button', { name: /travel back/i })
    const fwdBtn = screen.getByRole('button', { name: /travel forward/i })
    expect(backBtn).toBeDisabled()
    expect(fwdBtn).toBeDisabled()
  })

  it('time travel ctrl enabled when can travel', () => {
    const props: TopBarProps = {
      graphTitle: 'My Graph',
      syncStatus: 'idle',
      lastSyncLabel: '',
      canTravelBack: true,
      canTravelForward: true,
      commitLabel: 'abc1234 • Add Node B',
      onSync: vi.fn(),
      onTravelBack: vi.fn(),
      onTravelForward: vi.fn(),
      onOpenSettings: vi.fn(),
    }

    renderWithTheme(<TopBar {...props} />)

    const backBtn = screen.getByRole('button', { name: /travel back/i })
    const fwdBtn = screen.getByRole('button', { name: /travel forward/i })
    expect(backBtn).not.toBeDisabled()
    expect(fwdBtn).not.toBeDisabled()
  })

  it('click sync calls onSync', () => {
    const onSync = vi.fn()
    const props: TopBarProps = {
      graphTitle: 'My Graph',
      syncStatus: 'idle',
      lastSyncLabel: '',
      canTravelBack: false,
      canTravelForward: false,
      commitLabel: '',
      onSync,
      onTravelBack: vi.fn(),
      onTravelForward: vi.fn(),
      onOpenSettings: vi.fn(),
    }

    renderWithTheme(<TopBar {...props} />)

    fireEvent.click(screen.getByRole('button', { name: /sync/i }))
    expect(onSync).toHaveBeenCalled()
  })

  it('click travel back calls onTravelBack', () => {
    const onTravelBack = vi.fn()
    const props: TopBarProps = {
      graphTitle: 'My Graph',
      syncStatus: 'idle',
      lastSyncLabel: '',
      canTravelBack: true,
      canTravelForward: false,
      commitLabel: 'abc1234 • Add Node B',
      onSync: vi.fn(),
      onTravelBack,
      onTravelForward: vi.fn(),
      onOpenSettings: vi.fn(),
    }

    renderWithTheme(<TopBar {...props} />)

    fireEvent.click(screen.getByRole('button', { name: /travel back/i }))
    expect(onTravelBack).toHaveBeenCalled()
  })

  it('click travel forward calls onTravelForward', () => {
    const onTravelForward = vi.fn()
    const props: TopBarProps = {
      graphTitle: 'My Graph',
      syncStatus: 'idle',
      lastSyncLabel: '',
      canTravelBack: false,
      canTravelForward: true,
      commitLabel: 'abc1234 • Add Node B',
      onSync: vi.fn(),
      onTravelBack: vi.fn(),
      onTravelForward,
      onOpenSettings: vi.fn(),
    }

    renderWithTheme(<TopBar {...props} />)

    fireEvent.click(screen.getByRole('button', { name: /travel forward/i }))
    expect(onTravelForward).toHaveBeenCalled()
  })

  it('click settings gear calls onOpenSettings', () => {
    const onOpenSettings = vi.fn()
    const props: TopBarProps = {
      graphTitle: 'My Graph',
      syncStatus: 'idle',
      lastSyncLabel: '',
      canTravelBack: false,
      canTravelForward: false,
      commitLabel: '',
      onSync: vi.fn(),
      onTravelBack: vi.fn(),
      onTravelForward: vi.fn(),
      onOpenSettings,
    }

    renderWithTheme(<TopBar {...props} />)

    fireEvent.click(screen.getByRole('button', { name: /settings/i }))
    expect(onOpenSettings).toHaveBeenCalled()
  })
})
