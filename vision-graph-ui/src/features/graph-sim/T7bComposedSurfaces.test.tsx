import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '../../shared/ThemeProvider'
import GraphSim from './GraphSim'

vi.mock('../../shared/fsGraphLoader', () => ({
  loadProjectGraph: async () => ({
    nodes: [{ id: 'test-node', type: 'custom', position: { x: 0, y: 0 }, data: { id: 'test-node', title: 'Test Node', status: 'idle', type: 'task', lifecycle: 'initial', nodeViewState: 'collapsed', focused: false, promptTxt: '', todos: [], lastUpdate: null, detailExpanded: false, todosExpanded: false, isRec: false, isCycleRun: false, isStream: false, streamedTxt: '' } }],
    edges: [],
  }),
}))

const renderApp = () => render(<ThemeProvider><GraphSim /></ThemeProvider>)

const openProject = async () => {
  fireEvent.click(screen.getByRole('button', { name: 'AI Frameworks Research' }))
  await waitFor(() => expect(screen.getAllByTestId('node-gorse-light').length).toBeGreaterThan(0))
  const nodes = screen.getAllByTestId('node-gorse-light')
  fireEvent.click(nodes[nodes.length - 1])
}

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('T7b composed surfaces', () => {
  it('removes and jumps context pill before sending payload', async () => {
    renderApp()
    await openProject()

    const dialog = screen.getAllByTestId('voice-composer-surface').find(surface => surface.getAttribute('aria-expanded') === 'true') as HTMLElement
    const pill = within(dialog).getByTestId('context-pill-pill-1')
    expect(pill).toHaveAttribute('data-line-range', 'L12-18')
    expect(pill).toHaveAttribute('data-file-path', 'index.md')
    expect(pill).toHaveTextContent('graph node context')

    fireEvent.click(pill)
    expect(screen.getByTestId('graph-sim-canvas')).toHaveAttribute('data-last-context-jump', 'pill-1')

    fireEvent.click(within(pill).getByTestId('remove-pill-pill-1'))
    expect(within(dialog).queryByTestId('context-pill-pill-1')).not.toBeInTheDocument()
  })

  it('retries failed step with running state', async () => {
    renderApp()
    await openProject()

    const prompt = screen.getByPlaceholderText('Ask anything...')
    fireEvent.change(prompt, { target: { value: 'fail this run' } })
    const composer = screen.getAllByTestId('voice-composer-surface').find(surface => surface.getAttribute('aria-expanded') === 'true') as HTMLElement
    fireEvent.click(composer.querySelector('button[aria-label="Send prompt"]') as HTMLElement)
    expect(await screen.findByTestId('retry-btn')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('retry-btn'))
    expect(screen.getByTestId('execution-loading')).toHaveAttribute('data-status', 'running')
  })

  it('keeps graph interactive when GitSync unavailable', async () => {
    renderApp()
    await openProject()

    fireEvent.click(screen.getByRole('button', { name: 'Sync' }))
    expect(screen.getByTestId('git-unavailable')).toHaveTextContent('Git unavailable')
    expect(screen.getAllByTestId('node-gorse-light').at(-1)).toHaveAttribute('aria-expanded', 'true')
  })

  it('composes context, execution, agent, and git surfaces in app path', async () => {
    cleanup()
    renderApp()
    await openProject()

    const dialog = screen.getAllByTestId('voice-composer-surface').find(surface => surface.getAttribute('aria-expanded') === 'true')
    expect(dialog).toBeDefined()
    const contextPrompt = within(dialog as HTMLElement).getByPlaceholderText('Ask anything...')
    fireEvent.change(contextPrompt, { target: { value: 'Explain this source' } })

    expect(dialog).toHaveAttribute('data-context-payload', expect.stringContaining('pill-1'))
    expect(dialog).toHaveAttribute('data-context-payload', expect.stringContaining('index.md'))
    expect(dialog).toHaveAttribute('data-context-payload', expect.stringContaining('L12-18'))
    const currentDialog = screen.getAllByTestId('voice-composer-surface').find(surface => surface.getAttribute('aria-expanded') === 'true') as HTMLElement
    fireEvent.click(currentDialog.querySelector('button[aria-label="Send prompt"]') as HTMLElement)
    expect(screen.getByTestId('graph-sim-canvas')).toHaveAttribute('data-last-context-payload', expect.stringContaining('pill-1'))

    cleanup()
    renderApp()
    await openProject()
    const errorPrompt = screen.getByPlaceholderText('Ask anything...')
    fireEvent.change(errorPrompt, { target: { value: 'fail this run' } })
    const errorComposer = screen.getAllByTestId('voice-composer-surface').find(surface => surface.getAttribute('aria-expanded') === 'true')
    fireEvent.click((errorComposer as HTMLElement).querySelector('button[aria-label="Send prompt"]') as HTMLElement)
    expect(await screen.findByTestId('error-banner')).toHaveTextContent('Failed to process')
    expect(screen.getByTestId('retry-btn')).toBeInTheDocument()

    cleanup()
    renderApp()
    await openProject()
    const confirmPrompt = screen.getByPlaceholderText('Ask anything...')
    fireEvent.change(confirmPrompt, { target: { value: 'Confirm this run' } })
    fireEvent.contextMenu(screen.getAllByTestId('node-gorse-light').at(-1)!)

    expect(screen.getAllByTestId('confirm-dialog').at(-1)).toBeInTheDocument()
    expect(within(screen.getAllByTestId('confirm-dialog').at(-1) as HTMLElement).getByText('Confirm Execution')).toBeInTheDocument()
    const confirmDialog = screen.getAllByTestId('confirm-dialog').at(-1) as HTMLElement
    const executeButton = within(confirmDialog).getAllByRole('button', { hidden: true }).find(button => button.textContent === 'Execute')
    fireEvent.click(executeButton as HTMLElement)

    expect(screen.getByTestId('execution-loading')).toHaveAttribute('data-status', 'running')

    expect(screen.getByTestId('agent-status')).toHaveTextContent('Running')
    expect(screen.getByTestId('agent-context')).toHaveTextContent('Test Node')

    expect(screen.getByTestId('git-unavailable')).toHaveTextContent('Git unavailable')
    expect(screen.getAllByTestId('node-gorse-light').at(-1)).toHaveAttribute('aria-expanded', 'true')
  })
})
