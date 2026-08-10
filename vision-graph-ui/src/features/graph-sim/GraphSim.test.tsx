import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import GraphSim from './GraphSim'

const renderWithTheme = (ui: React.ReactElement) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('GraphSim', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows project picker initially w/ placeholder', () => {
    renderWithTheme(<GraphSim />)
    expect(screen.getByText(/select or create project/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /new project/i })).toBeInTheDocument()
  })

  it('click project reveals graph page w/ top bar + node', () => {
    renderWithTheme(<GraphSim />)
    const projectIcons = screen.getAllByRole('button').filter(b => b.textContent && b.textContent.length === 1)
    fireEvent.click(projectIcons[0])
    expect(screen.getByText('AI Frameworks Research')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sync/i })).toBeInTheDocument()
  })

  it('sync btn present in graph state', () => {
    renderWithTheme(<GraphSim />)
    const projectIcons = screen.getAllByRole('button').filter(b => b.textContent && b.textContent.length === 1)
    fireEvent.click(projectIcons[0])
    const syncBtn = screen.getByRole('button', { name: /sync/i })
    expect(syncBtn).toBeInTheDocument()
    expect(syncBtn).not.toBeDisabled()
  })

  it('settings gear btn present', () => {
    renderWithTheme(<GraphSim />)
    const projectIcons = screen.getAllByRole('button').filter(b => b.textContent && b.textContent.length === 1)
    fireEvent.click(projectIcons[0])
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument()
  })

  it('time travel disabled initially', () => {
    renderWithTheme(<GraphSim />)
    const projectIcons = screen.getAllByRole('button').filter(b => b.textContent && b.textContent.length === 1)
    fireEvent.click(projectIcons[0])
    expect(screen.getByRole('button', { name: /travel back/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /travel forward/i })).toBeDisabled()
  })

  it('each project click loads different graph', async () => {
    renderWithTheme(<GraphSim />)
    const projectIcons = screen.getAllByRole('button').filter(b => b.textContent && b.textContent.length === 1)
    
    fireEvent.click(projectIcons[0])
    await vi.waitFor(() => expect(screen.getByText('AI Frameworks Research')).toBeInTheDocument())
    
    fireEvent.click(projectIcons[1])
    await vi.waitFor(() => expect(screen.getByText('Local-First Essay')).toBeInTheDocument())
    
    fireEvent.click(projectIcons[2])
    await vi.waitFor(() => expect(screen.getByText('Whitt Architecture')).toBeInTheDocument())
  })

  it('send flow triggers cycle then details', async () => {
    renderWithTheme(<GraphSim />)
    const projectIcons = screen.getAllByRole('button').filter(b => b.textContent && b.textContent.length === 1)
    fireEvent.click(projectIcons[0])
    
    await vi.waitFor(() => expect(screen.getByText('AI Frameworks Research')).toBeInTheDocument())
    
    const sendButtons = screen.getAllByRole('button', { name: /send/i })
    if (sendButtons.length > 0) {
      fireEvent.click(sendButtons[0])
      
      await vi.advanceTimersByTimeAsync(1500)
      
      const todos = screen.queryAllByText(/research web|draft outline|verify/i)
      expect(todos.length).toBeGreaterThan(0)
      
      await vi.advanceTimersByTimeAsync(3000)
      
      const details = screen.queryByText(/response|key findings/i)
      expect(details).toBeInTheDocument()
    }
  })
})
