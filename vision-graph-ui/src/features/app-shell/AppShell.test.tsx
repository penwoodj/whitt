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

  it('APP-01 opens new project', () => {
    const children = <div data-testid="canvas">Canvas</div>
    const props: AppShellProps = { children }

    renderWithTheme(<AppShell {...props} />)

    expect(screen.getByTestId('canvas')).toBeInTheDocument()
    expect(screen.queryByTestId('project-picker')).not.toBeInTheDocument()
  })

  it('APP-02 rail fixed', () => {
    const sidebar = <div data-testid="project-rail">ProjectRail</div>
    const children = <div data-testid="canvas">Canvas</div>
    const props: AppShellProps = { sidebar, children }

    const { container } = renderWithTheme(<AppShell {...props} />)

    const rail = screen.getByTestId('project-rail')
    const canvas = screen.getByTestId('canvas')

    expect(rail).toBeInTheDocument()
    expect(canvas).toBeInTheDocument()

    const sidebarArea = container.querySelector('aside')
    expect(sidebarArea).toBeInTheDocument()
    
    const sidebarStyles = window.getComputedStyle(sidebarArea as HTMLElement)
    expect(sidebarStyles.position).toBe('sticky')
    expect(sidebarStyles.top).toBe('0px')
  })
})
