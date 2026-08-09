import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import SyncBtn from './SyncBtn'
import type { SyncBtnProps } from './topBarTypes'

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('SyncBtn', () => {
  it('renders sync label', () => {
    const props: SyncBtnProps = {
      syncStatus: 'idle',
      lastSyncLabel: 'Synced 2s ago',
      onClick: vi.fn(),
    }

    renderWithTheme(<SyncBtn {...props} />)

    expect(screen.getByText('Synced 2s ago')).toBeInTheDocument()
  })

  it('disabled when syncing', () => {
    const props: SyncBtnProps = {
      syncStatus: 'syncing',
      lastSyncLabel: 'Syncing...',
      onClick: vi.fn(),
    }

    renderWithTheme(<SyncBtn {...props} />)

    const button = screen.getByRole('button', { name: /sync/i })
    expect(button).toBeDisabled()
  })
})
