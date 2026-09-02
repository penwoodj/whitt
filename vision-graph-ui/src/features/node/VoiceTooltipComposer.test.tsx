import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { LocalSttEngine } from '../voice-capture/LocalSttEngine'
import type { CaptureHandle } from '../voice-capture/localCapture'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { darkTheme } from '../../shared/theme'
import VoiceTooltipComposer, { chooseDialogPlacement } from './VoiceTooltipComposer'

const makeEngine = (): LocalSttEngine => ({
  start: vi.fn(async () => undefined),
  preloadModel: vi.fn(async () => undefined),
  transcribePCM: vi.fn(async function* () { yield { text: 'final words', start: 0, end: 1 } }),
  cancel: vi.fn(),
  dispose: vi.fn(),
  getState: () => 'idle',
  getCapabilities: () => ({ supported: true, webgpu: false, fallback: 'wasm', mic: true, secureContext: true, opfsCache: false }),
})

const makeCapture = (amplitude = 0): CaptureHandle => ({
  stop: async function* () { yield { text: 'captured words', start: 0, end: 1 } },
  cancel: vi.fn(),
  readAmplitude: () => amplitude,
})

const renderComposer = (overrides: Partial<React.ComponentProps<typeof VoiceTooltipComposer>> = {}) => render(
  <ThemeProvider theme={darkTheme}>
    <VoiceTooltipComposer
      nodeId="node-a"
      title="Research"
      status="idle"
      value=""
      onChange={vi.fn()}
      onSend={vi.fn()}
      engine={makeEngine()}
      anchorRect={{ left: 100, right: 260, top: 100, bottom: 180, width: 160, height: 80 }}
      viewport={{ width: 1200, height: 800 }}
      {...overrides}
    />
  </ThemeProvider>,
)

describe('VoiceTooltipComposer', () => {
  it('opens focused editor from preview', () => {
    renderComposer()
    fireEvent.click(screen.getByRole('button', { name: /open prompt/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /prompt/i })).toHaveFocus()
  })

  it('falls left when right collides', () => {
    const placement = chooseDialogPlacement({ left: 900, right: 1100, top: 100, bottom: 180, width: 200, height: 80 }, { width: 1200, height: 800 }, 280)
    expect(placement.side).toBe('left')
    expect(placement.arrow).toBe('right')
  })

  it('keeps right placement when space exists', () => {
    const placement = chooseDialogPlacement({ left: 100, right: 260, top: 100, bottom: 180, width: 160, height: 80 }, { width: 1200, height: 800 }, 280)
    expect(placement).toEqual({ side: 'right', arrow: 'left' })
  })

  it('shows listening status and final transcript', async () => {
    const engine = makeEngine()
    const capture = makeCapture()
    const createCapture = vi.fn(async () => capture)
    renderComposer({ engine, createCapture })
    fireEvent.click(screen.getByRole('button', { name: /microphone/i }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/listening/i))
    fireEvent.click(screen.getByRole('button', { name: /microphone/i }))
    await waitFor(() => expect(screen.getByText('captured words')).toBeInTheDocument())
    expect(engine.transcribePCM).not.toHaveBeenCalled()
    expect(createCapture).toHaveBeenCalledWith(engine, undefined)
  })

  it('maps capture amplitude to distinct visual states', async () => {
    const amplitude = { value: 0 }
    const capture: CaptureHandle = { ...makeCapture(), readAmplitude: () => amplitude.value }
    const createCapture = vi.fn(async () => capture)
    renderComposer({ engine: makeEngine(), createCapture })
    fireEvent.click(screen.getByRole('button', { name: /microphone/i }))
    await waitFor(() => expect(screen.getByTestId('voice-composer-surface')).toHaveAttribute('data-amplitude-state', 'quiet'))
    amplitude.value = 0.8
    await waitFor(() => expect(screen.getByTestId('voice-composer-surface')).toHaveAttribute('data-amplitude-state', 'active'))
  })

  it('keeps recording indicator static with reduced motion', async () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
    renderComposer({ createCapture: vi.fn(async () => makeCapture()) })
    fireEvent.click(screen.getByRole('button', { name: /microphone/i }))
    await waitFor(() => expect(screen.getByTestId('recording-indicator')).toHaveAttribute('data-motion', 'static'))
    vi.unstubAllGlobals()
  })

  it('sends on Enter but keeps newline on Shift Enter', () => {
    const onSend = vi.fn()
    const onChange = vi.fn()
    renderComposer({ value: 'hello', onSend, onChange })
    fireEvent.click(screen.getByRole('button', { name: /open prompt/i }))
    const textbox = screen.getByRole('textbox', { name: /prompt/i })
    fireEvent.keyDown(textbox, { key: 'Enter', shiftKey: true })
    expect(onSend).not.toHaveBeenCalled()
    fireEvent.keyDown(textbox, { key: 'Enter' })
    expect(onSend).toHaveBeenCalledWith('hello')
  })

  it('preserves prompt and shows adapter error', async () => {
    const engine = makeEngine()
    const capture: CaptureHandle = { ...makeCapture(), stop: async function* () { yield* []; throw new Error('adapter failed') } }
    renderComposer({ engine, value: 'keep this', createCapture: vi.fn(async () => capture) })
    fireEvent.click(screen.getByRole('button', { name: /microphone/i }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/listening/i))
    fireEvent.click(screen.getByRole('button', { name: /microphone/i }))
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('adapter failed'))
    fireEvent.click(screen.getByRole('button', { name: /open prompt/i }))
    expect(screen.getByRole('textbox', { name: /prompt/i })).toHaveValue('keep this')
  })

  it('hides after outside dismiss without cancelling recording', async () => {
    const engine = makeEngine()
    const capture = makeCapture()
    renderComposer({ engine, createCapture: vi.fn(async () => capture) })
    fireEvent.click(screen.getByRole('button', { name: /microphone/i }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/listening/i))
    fireEvent.mouseDown(document.body)
    expect(screen.getByRole('dialog', { hidden: true })).not.toBeVisible()
    expect(engine.cancel).not.toHaveBeenCalled()
    expect(capture.cancel).not.toHaveBeenCalled()
  })
})
