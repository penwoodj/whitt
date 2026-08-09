import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import AppShell from './AppShell'
import type { AppShellProps } from './appShellTypes'

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('AppShell', () => {
  it('renders full layout', () => {
    const sidebar = <div data-testid="sidebar">Sidebar</div>
    const topbar = <div data-testid="topbar">TopBar</div>
    const children = <div data-testid="children">Content</div>
    const props: AppShellProps = { sidebar, topbar, children }

    renderWithTheme(<AppShell {...props} />)

    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('topbar')).toBeInTheDocument()
    expect(screen.getByTestId('children')).toBeInTheDocument()
  })

  it('renders without sidebar', () => {
    const topbar = <div data-testid="topbar">TopBar</div>
    const children = <div data-testid="children">Content</div>
    const props: AppShellProps = { topbar, children }

    renderWithTheme(<AppShell {...props} />)

    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument()
    expect(screen.getByTestId('topbar')).toBeInTheDocument()
    expect(screen.getByTestId('children')).toBeInTheDocument()
  })

  it('renders without topbar', () => {
    const sidebar = <div data-testid="sidebar">Sidebar</div>
    const children = <div data-testid="children">Content</div>
    const props: AppShellProps = { sidebar, children }

    renderWithTheme(<AppShell {...props} />)

    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.queryByTestId('topbar')).not.toBeInTheDocument()
    expect(screen.getByTestId('children')).toBeInTheDocument()
  })

  it('renders with children only', () => {
    const children = <div data-testid="children">Content</div>
    const props: AppShellProps = { children }

    renderWithTheme(<AppShell {...props} />)

    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument()
    expect(screen.queryByTestId('topbar')).not.toBeInTheDocument()
    expect(screen.getByTestId('children')).toBeInTheDocument()
  })
})
