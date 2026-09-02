import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { cleanup, render, screen, fireEvent, act, within, waitFor } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import GraphSim from './GraphSim'

const renderWithTheme = (ui: React.ReactElement) => render(<ThemeProvider>{ui}</ThemeProvider>)

const emptyClientRects = (): DOMRectList => ({
  length: 0,
  item: () => null,
  [Symbol.iterator]: () => [][Symbol.iterator]()
})
Range.prototype.getClientRects = emptyClientRects
Element.prototype.getClientRects = emptyClientRects

describe('GraphSim', () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  afterEach(() => {
    cleanup()
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('shows project picker initially w/ placeholder', () => {
    renderWithTheme(<GraphSim />)
    expect(screen.getByText(/select or create project/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /new project/i })).toBeInTheDocument()
  })

  it('click project reveals graph page w/ top bar + node', async () => {
    vi.useRealTimers()
    renderWithTheme(<GraphSim />)
    fireEvent.click(screen.getByRole('button', { name: 'AI Frameworks Research' }))
    await waitFor(() => expect(screen.getAllByText('AI Frameworks Research').length).toBeGreaterThan(0))
    expect(screen.getByRole('button', { name: /sync/i })).toBeInTheDocument()
  })

  it('sync btn present in graph state', () => {
    renderWithTheme(<GraphSim />)
    fireEvent.click(screen.getByRole('button', { name: 'AI Frameworks Research' }))
    const syncBtn = screen.getByRole('button', { name: /sync/i })
    expect(syncBtn).toBeInTheDocument()
    expect(syncBtn).not.toBeDisabled()
  })

  it('settings gear btn present', () => {
    renderWithTheme(<GraphSim />)
    fireEvent.click(screen.getByRole('button', { name: 'AI Frameworks Research' }))
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument()
  })

  it('time travel disabled initially', () => {
    renderWithTheme(<GraphSim />)
    fireEvent.click(screen.getByRole('button', { name: 'AI Frameworks Research' }))
    expect(screen.getByRole('button', { name: /travel back/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /travel forward/i })).toBeDisabled()
  })

  it('each project click loads different graph', async () => {
    vi.useRealTimers()
    renderWithTheme(<GraphSim />)
    fireEvent.click(screen.getByRole('button', { name: 'AI Frameworks Research' }))
    await waitFor(() => expect(screen.getByRole('heading', { name: 'AI Frameworks Research' })).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: 'Local-First Essay' }))
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Local-First Essay' })).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: 'Whitt Architecture' }))
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Whitt Architecture' })).toBeInTheDocument())
  })

  it('send flow triggers cycle then details', async () => {
    vi.useRealTimers()
    renderWithTheme(<GraphSim />)
    fireEvent.click(screen.getByRole('button', { name: 'AI Frameworks Research' }))
    
    await waitFor(() => expect(screen.getAllByText('AI Frameworks Research')[0]).toBeInTheDocument())
    fireEvent.click(screen.getAllByTestId('node-gorse-light').at(-1)!)
    fireEvent.change(screen.getByPlaceholderText('Ask anything...'), { target: { value: 'Explain graph' } })
    const activeDialog = screen.getAllByRole('dialog', { hidden: true }).find(dialog => dialog.getAttribute('aria-expanded') === 'true')
    expect(activeDialog).toBeDefined()
    const sendButton = activeDialog?.querySelector('button[aria-label="Send prompt"]')
    expect(sendButton).toBeTruthy()
    vi.useFakeTimers()
    fireEvent.click(sendButton!)

    await act(async () => vi.advanceTimersByTimeAsync(1500))

    const todos = screen.queryAllByText(/research web|draft outline|verify/i)
    expect(todos.length).toBeGreaterThan(0)

    await act(async () => vi.advanceTimersByTimeAsync(3000))

    expect(screen.getAllByText('Response').length).toBeGreaterThan(0)
  })

  it('expanded node shows execution state and agent step', async () => {
    vi.useRealTimers()
    renderWithTheme(<GraphSim />)
    fireEvent.click(screen.getByRole('button', { name: 'AI Frameworks Research' }))
    await waitFor(() => expect(screen.getAllByText('AI Frameworks Research')[0]).toBeInTheDocument())

    fireEvent.click(screen.getAllByTestId('node-gorse-light').at(-1)!)
    const prompt = screen.getByPlaceholderText('Ask anything...')
    fireEvent.change(prompt, { target: { value: 'Explain graph' } })
    const activeDialog = screen.getAllByRole('dialog', { hidden: true }).find(dialog => dialog.getAttribute('aria-expanded') === 'true')
    expect(activeDialog).toBeDefined()
    const sendButton = activeDialog?.querySelector('button[aria-label="Send prompt"]')
    expect(sendButton).toBeTruthy()
    fireEvent.click(sendButton!)

    expect(screen.getAllByTestId('execution-panel').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/research web/i).length).toBeGreaterThan(0)
  })

  it('clicked node opens prompt dialog in app path', async () => {
    vi.useRealTimers()
    renderWithTheme(<GraphSim />)
    fireEvent.click(screen.getByRole('button', { name: 'AI Frameworks Research' }))
    await waitFor(() => expect(screen.getAllByText('AI Frameworks Research')[0]).toBeInTheDocument())

    const nodes = screen.getAllByTestId('node-gorse-light')
    fireEvent.click(nodes.at(-1)!)

    expect(screen.getAllByTestId('voice-composer-surface').at(-1)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ask anything...')).toBeInTheDocument()
  })

  it('completed node shows generated file preview and edit control', async () => {
    vi.useRealTimers()
    renderWithTheme(<GraphSim />)
    fireEvent.click(screen.getByRole('button', { name: 'AI Frameworks Research' }))
    await waitFor(() => expect(screen.getAllByText('AI Frameworks Research')[0]).toBeInTheDocument())

    await waitFor(() => expect(screen.getAllByTestId('node-gorse-light').length).toBeGreaterThan(0))
    const nodes = screen.getAllByTestId('node-gorse-light')
    fireEvent.click(nodes.at(-1)!)
    fireEvent.change(screen.getByPlaceholderText('Ask anything...'), { target: { value: 'Generate file' } })
    const activeDialog = screen.getAllByRole('dialog', { hidden: true }).find(dialog => dialog.getAttribute('aria-expanded') === 'true')
    expect(activeDialog).toBeDefined()
    const sendButton = activeDialog?.querySelector('button[aria-label="Send prompt"]')
    expect(sendButton).toBeTruthy()
    fireEvent.click(sendButton!)
    await waitFor(() => expect(screen.getAllByTestId('file-preview-area').some(area => area.textContent?.includes('Generate file'))).toBe(true), { timeout: 6000 })

    const preview = screen.getAllByTestId('file-preview-area').find(area => area.textContent?.includes('Based on your prompt: "Generate file"'))
    expect(preview).toBeInTheDocument()
    expect(preview).toHaveTextContent('Based on your prompt: "Generate file"')
    const editButton = preview?.querySelector('button[aria-label="Edit"]')
    expect(editButton).toBeTruthy()
  }, 10000)

  it('expanded node wires context pill remove and jump', async () => {
    vi.useRealTimers()
    renderWithTheme(<GraphSim />)
    const projectIcons = screen.getAllByRole('button').filter(button => button.textContent && button.textContent.length === 1)
    fireEvent.click(projectIcons[0])
    await waitFor(() => expect(screen.getAllByText('AI Frameworks Research')[0]).toBeInTheDocument())
    fireEvent.click(screen.getAllByTestId('node-gorse-light').at(-1)!)

    const composer = screen.getAllByTestId('voice-composer-surface').at(-1)!
    const pill = within(composer).getByTestId('context-pill-pill-1')
    fireEvent.click(pill)
    fireEvent.click(within(composer).getByTestId('remove-pill-pill-1'))

    expect(within(composer).queryByTestId('context-pill-pill-1')).not.toBeInTheDocument()
  })

  it('real app sends, completes, previews, edits, saves', async () => {
    vi.useRealTimers()
    renderWithTheme(<GraphSim />)
    fireEvent.click(screen.getByRole('button', { name: 'AI Frameworks Research' }))
    await waitFor(() => expect(screen.getAllByText('AI Frameworks Research').length).toBeGreaterThan(0))

    fireEvent.click(screen.getAllByTestId('node-gorse-light').at(-1)!)
    fireEvent.change(screen.getByPlaceholderText('Ask anything...'), { target: { value: 'T7a prompt' } })
    const activeDialog = screen.getAllByRole('dialog', { hidden: true }).find(dialog => dialog.getAttribute('aria-expanded') === 'true')
    expect(activeDialog).toBeDefined()
    const sendButton = activeDialog?.querySelector('button[aria-label="Send prompt"]')
    if (!(sendButton instanceof HTMLButtonElement)) throw new Error('Send prompt button missing')
    fireEvent.click(sendButton)

    expect(screen.getByTestId('execution-panel')).toBeInTheDocument()
    expect(screen.getByTestId('step-title')).toHaveTextContent('research web')

    await waitFor(() => expect(screen.getByTestId('execution-panel')).toHaveTextContent('Completed'), { timeout: 6000 })
    const preview = screen.getAllByTestId('file-preview-area').find(area => area.textContent?.includes('T7a prompt'))
    expect(preview).toBeDefined()

    const editButton = preview?.querySelector('button[aria-label="Edit"]')
    if (!(editButton instanceof HTMLButtonElement)) throw new Error('Edit button missing')
    fireEvent.click(editButton)
    const editingPreview = screen.getAllByTestId('file-preview-area').find(area => area.textContent?.includes('T7a prompt'))
    const saveButton = editingPreview?.querySelector('button[aria-label="Save"]')
    if (!(saveButton instanceof HTMLButtonElement)) throw new Error('Save button missing')
    fireEvent.click(saveButton)

    expect(screen.getAllByTestId('file-preview-area').some(area => area.querySelector('button[aria-label="Edit"]'))).toBe(true)
  }, 10000)
})
