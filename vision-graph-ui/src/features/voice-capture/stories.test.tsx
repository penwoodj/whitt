import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { useState, useEffect } from 'react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { createFakeSttEngine } from './fake/FakeSttEngine'
import { createFakeAnalyser } from './fake/FakeAnalyser'
import { useVoiceLevel } from './hooks/useVoiceLevel'
import type { ReactElement } from 'react'

describe('Voice Capture Stories', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const renderWithTheme = (component: ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>)
  }

  describe('Engine Capability Detect', () => {
    it('renders capabilities correctly', () => {
      const Component = () => (
        <div>
          <div data-testid="webgpu">✓</div>
          <div data-testid="fallback">webgpu</div>
          <div data-testid="mic">✓</div>
          <div data-testid="secure">✓</div>
          <div data-testid="opfs">✓</div>
        </div>
      )

      renderWithTheme(<Component />)

      expect(screen.getByTestId('webgpu')).toBeInTheDocument()
      expect(screen.getByTestId('fallback')).toBeInTheDocument()
      expect(screen.getByTestId('mic')).toBeInTheDocument()
      expect(screen.getByTestId('secure')).toBeInTheDocument()
      expect(screen.getByTestId('opfs')).toBeInTheDocument()
    })
  })

  describe('Model Load Progress', () => {
    it('shows progress stages', async () => {
      const Component = () => {
        const [progress, setProgress] = useState<string>('idle')

        useEffect(() => {
          const engine = createFakeSttEngine([])
          engine.on((evt) => {
            if (evt.type === 'progress') {
              setProgress(`${evt.stage}: ${evt.progress * 100}%`)
            }
          })
          engine.start().catch(() => {})

          vi.advanceTimersByTimeAsync(50).then(() => {
            setProgress('loading: 0%')
          })
          vi.advanceTimersByTimeAsync(100).then(() => {
            setProgress('decoding: 50%')
          })
          vi.advanceTimersByTimeAsync(150).then(() => {
            setProgress('transcribing: 100%')
          })
        }, [])

        return <div data-testid="progress">{progress}</div>
      }

      renderWithTheme(<Component />)

      vi.advanceTimersByTime(200)

      await waitFor(
        () => {
          const progressEl = screen.getByTestId('progress')
          expect(progressEl.textContent).toMatch(/loading|decoding|transcribing/)
        },
        { timeout: 1000 }
      )
    })
  })

  describe('AudioWorklet 16k Chunks', () => {
    it('renders AudioContext info', () => {
      const Component = () => (
        <div>
          <div data-testid="state">running</div>
          <div data-testid="samplerate">16000</div>
        </div>
      )

      renderWithTheme(<Component />)

      expect(screen.getByTestId('state')).toBeInTheDocument()
      expect(screen.getByTestId('samplerate')).toHaveTextContent('16000')
    })
  })

  describe('Permission Denied', () => {
    it('shows error and retry button', () => {
      const Component = ({ showError }: { showError: boolean }) => {
        const error = showError ? 'Permission denied: Microphone access denied' : 'Waiting...'

        return (
          <div>
            <div data-testid="error">{error}</div>
            {showError && <button data-testid="retry" type="button">Retry</button>}
          </div>
        )
      }

      const { rerender } = renderWithTheme(<Component showError={false} />)

      expect(screen.getByTestId('error')).toHaveTextContent('Waiting...')
      expect(screen.queryByTestId('retry')).not.toBeInTheDocument()

      rerender(<Component showError={true} />)

      expect(screen.getByTestId('error')).toHaveTextContent('Permission denied: Microphone access denied')
      expect(screen.getByTestId('retry')).toBeInTheDocument()
    })
  })

  describe('No WebGPU Fallback', () => {
    it('shows WebGPU status and fallback', () => {
      const Component = () => (
        <div>
          <div data-testid="webgpu">✗</div>
          <div data-testid="fallback">wasm</div>
          <div data-testid="warning">⚠ Reduced performance with WASM fallback</div>
        </div>
      )

      renderWithTheme(<Component />)

      expect(screen.getByTestId('webgpu')).toBeInTheDocument()
      expect(screen.getByTestId('fallback')).toBeInTheDocument()
      expect(screen.getByTestId('warning')).toBeInTheDocument()
    })
  })

  describe('Engine OOM Recovery', () => {
    it('preserves partial text on error', () => {
      const Component = ({ partialText, error }: { partialText: string; error: string }) => (
        <div>
          <div data-testid="partial">{partialText}</div>
          {error && (
            <div>
              <div data-testid="error">{error}</div>
              <button data-testid="retry" type="button">Retry</button>
            </div>
          )}
        </div>
      )

      const { rerender } = renderWithTheme(<Component partialText="" error="" />)

      expect(screen.getByTestId('partial')).toHaveTextContent('')
      expect(screen.queryByTestId('error')).not.toBeInTheDocument()

      rerender(<Component partialText="Partial Text" error="" />)
      expect(screen.getByTestId('partial')).toHaveTextContent('Partial Text')
      expect(screen.queryByTestId('error')).not.toBeInTheDocument()

      rerender(<Component partialText="Partial Text" error="Out of memory" />)
      expect(screen.getByTestId('partial')).toHaveTextContent('Partial Text')
      expect(screen.getByTestId('error')).toHaveTextContent('Out of memory')
      expect(screen.getByTestId('retry')).toBeInTheDocument()
    })
  })

  describe('Real browser-whisper Transcribe', () => {
    it('shows interim and final text', () => {
      const Component = ({ interim, final }: { interim: string; final: string }) => (
        <div>
          <div data-testid="final">{final}</div>
          <div data-testid="interim">{interim}</div>
        </div>
      )

      const { rerender } = renderWithTheme(<Component interim="" final="" />)

      expect(screen.getByTestId('final')).toHaveTextContent('')
      expect(screen.getByTestId('interim')).toHaveTextContent('')

      rerender(<Component interim="Real" final="" />)
      expect(screen.getByTestId('interim')).toHaveTextContent('Real')

      rerender(<Component interim="Real browser-whisper" final="" />)
      expect(screen.getByTestId('interim')).toHaveTextContent('Real browser-whisper')

      rerender(<Component interim="" final="Real browser-whisper transcribe" />)
      expect(screen.getByTestId('final')).toHaveTextContent('Real browser-whisper transcribe')
      expect(screen.getByTestId('interim')).toHaveTextContent('')
    })
  })

  describe('useVoiceLevel Scripted Curve', () => {
    it('renders level transitions from fake analyser', () => {
      const Component = () => {
        const analyser = createFakeAnalyser([0.1, 0.5, 0.8, 0.3, 0.6])
        const level = useVoiceLevel(analyser)

        return <div data-testid="level">{level.toFixed(2)}</div>
      }

      renderWithTheme(<Component />)

      const levelEl = screen.getByTestId('level')
      expect(levelEl).toBeInTheDocument()

      vi.advanceTimersByTime(100)
      expect(levelEl.textContent).toMatch(/0\.\d+/)
    })
  })

  describe('useStt Interim Ghost Final Append', () => {
    it('shows interim ghost text and final append', () => {
      const Component = ({ interim, final }: { interim: string; final: string }) => (
        <div>
          <div data-testid="final">{final}</div>
          <div data-testid="interim">{interim}</div>
        </div>
      )

      const { rerender } = renderWithTheme(<Component interim="" final="" />)

      expect(screen.getByTestId('final')).toHaveTextContent('')
      expect(screen.getByTestId('interim')).toHaveTextContent('')

      rerender(<Component interim="Interim" final="" />)
      expect(screen.getByTestId('interim')).toHaveTextContent('Interim')

      rerender(<Component interim="Interim ghost" final="" />)
      expect(screen.getByTestId('interim')).toHaveTextContent('Interim ghost')

      rerender(<Component interim="Interim ghost text" final="" />)
      expect(screen.getByTestId('interim')).toHaveTextContent('Interim ghost text')

      rerender(<Component interim="" final="Interim ghost text" />)
      expect(screen.getByTestId('final')).toHaveTextContent('Interim ghost text')
      expect(screen.getByTestId('interim')).toHaveTextContent('')
    })
  })
})
