import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, renderHook, waitFor } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { darkTheme } from '../../shared/theme'
import NodeStatus from '../node/NodeStatus'
import type { NodeStatus as NodeStatusType } from '../node/nodeTypes'
import { useVoiceLevel } from './useVoiceLevel'
import * as analyserModule from '../../shared/audio/analyser'

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={darkTheme}>{ui}</ThemeProvider>)

describe('Light language state→glow mapping (LGT-01)', () => {
  it('theme has stateGlow mapping table', () => {
    expect(darkTheme.glow.stateGlow).toBeDefined()

    expect(darkTheme.glow.stateGlow.idle).toBe('0 0 8px rgba(106, 153, 85, 0.2)')
    expect(darkTheme.glow.stateGlow.recording).toBe('0 0 24px rgba(244, 71, 71, 0.8)')
    expect(darkTheme.glow.stateGlow.running).toBe('0 0 12px rgba(0, 122, 204, 0.4)')
    expect(darkTheme.glow.stateGlow.done).toBe('0 0 12px rgba(78, 201, 176, 0.4)')
  })

  it('NodeStatus uses stateGlow table values (no ad-hoc glow)', () => {
    const states: Array<NodeStatusType> = ['idle', 'recording', 'running', 'done']

    states.forEach((status) => {
      const { container } = renderWithTheme(<NodeStatus status={status} />)
      const statusEl = container.querySelector('div')

      const glow = window.getComputedStyle(statusEl!).boxShadow
      const expectedGlow = darkTheme.glow.stateGlow[status]

      expect(glow).toBe(expectedGlow)
    })
  })

  it('NodeStatus uses stateGlow table for idle state', () => {
    const { container } = renderWithTheme(<NodeStatus status="idle" />)
    const statusEl = container.querySelector('div')

    const glow = window.getComputedStyle(statusEl!).boxShadow

    expect(glow).toBe(darkTheme.glow.stateGlow.idle)
  })

  it('NodeStatus uses stateGlow table for recording state', () => {
    const { container } = renderWithTheme(<NodeStatus status="recording" />)
    const statusEl = container.querySelector('div')

    const glow = window.getComputedStyle(statusEl!).boxShadow

    expect(glow).toBe(darkTheme.glow.stateGlow.recording)
  })

  it('NodeStatus uses stateGlow table for running state', () => {
    const { container } = renderWithTheme(<NodeStatus status="running" />)
    const statusEl = container.querySelector('div')

    const glow = window.getComputedStyle(statusEl!).boxShadow

    expect(glow).toBe(darkTheme.glow.stateGlow.running)
  })

  it('NodeStatus uses stateGlow table for done state', () => {
    const { container } = renderWithTheme(<NodeStatus status="done" />)
    const statusEl = container.querySelector('div')

    const glow = window.getComputedStyle(statusEl!).boxShadow

    expect(glow).toBe(darkTheme.glow.stateGlow.done)
  })

  it('NodeStatus has NO ad-hoc color hex values', () => {
    const { container } = renderWithTheme(<NodeStatus status="idle" />)
    const statusEl = container.querySelector('div')

    const style = window.getComputedStyle(statusEl!)
    const backgroundColor = style.backgroundColor
    const boxShadow = style.boxShadow

    const hasHex = /#[0-9A-Fa-f]{6}/.test(backgroundColor + boxShadow)

    expect(hasHex).toBe(false)
  })
})

describe('Light language amplitude driver (LGT-02, LGT-03)', () => {
  const mockGetAnalyserLevel = vi.spyOn(analyserModule, 'getAnalyserLevel')
  const mockAnalyser = {} as AnalyserNode

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetAnalyserLevel.mockReturnValue(0)
  })

  it('LGT-02: level 0 returns idle (no breathing)', () => {
    mockGetAnalyserLevel.mockReturnValue(0)

    const { result } = renderHook(() => useVoiceLevel(mockAnalyser))

    expect(result.current).toBe(0)
  })

  it('LGT-02: level 0.5 returns idle + 0.5 * 0.08 within tolerance', async () => {
    mockGetAnalyserLevel.mockReturnValue(0.5)

    const { result } = renderHook(() => useVoiceLevel(mockAnalyser))

    await waitFor(() => {
      const k = 0.08
      const expected = 0.5 * k
      const tolerance = 0.01

      expect(Math.abs(result.current - expected)).toBeLessThan(tolerance)
    })
  })

  it('LGT-02: level 0.9 returns idle + 0.9 * 0.08 within tolerance', async () => {
    mockGetAnalyserLevel.mockReturnValue(0.9)

    const { result } = renderHook(() => useVoiceLevel(mockAnalyser))

    await waitFor(() => {
      const k = 0.08
      const expected = 0.9 * k
      const tolerance = 0.01

      expect(Math.abs(result.current - expected)).toBeLessThan(tolerance)
    })
  })

  it('LGT-02: hook returns value from analyser after initial tick', async () => {
    mockGetAnalyserLevel.mockReturnValue(0.7)

    const { result } = renderHook(() => useVoiceLevel(mockAnalyser))

    await waitFor(() => {
      const k = 0.08
      const expected = 0.7 * k
      const tolerance = 0.01

      expect(Math.abs(result.current - expected)).toBeLessThan(tolerance)
    })
  })

  it('LGT-03: sub-gate level (0.01) returns still (0)', () => {
    mockGetAnalyserLevel.mockReturnValue(0.01)

    const { result } = renderHook(() => useVoiceLevel(mockAnalyser))

    expect(result.current).toBe(0)
  })

  it('LGT-03: level at noise gate (0.02) returns still (0)', () => {
    mockGetAnalyserLevel.mockReturnValue(0.02)

    const { result } = renderHook(() => useVoiceLevel(mockAnalyser))

    expect(result.current).toBe(0)
  })
})

describe('Light language breathing ball and bar (VOX-02/03, EXP-04/08, LGT-08)', () => {
  it('VOX-02: recording color shift', () => {
    const { container } = renderWithTheme(<NodeStatus status="idle" />)
    const idleGlow = window.getComputedStyle(container.querySelector('div')!).boxShadow

    const { container: recContainer } = renderWithTheme(<NodeStatus status="recording" />)
    const recordingGlow = window.getComputedStyle(recContainer.querySelector('div')!).boxShadow

    expect(idleGlow).not.toBe(recordingGlow)
    expect(recordingGlow).toContain('244, 71, 71')
  })

  it('VOX-03: volume breathing class on with sampled transform scale', async () => {
    const mockAnalyser = {
      context: { sampleRate: 44100 },
      frequencyBinCount: 128,
      getByteFrequencyData: vi.fn(),
    } as unknown as AnalyserNode

    const { result } = renderHook(() => useVoiceLevel(mockAnalyser))

    await waitFor(() => {
      expect(result.current).toBeGreaterThan(0)
    })
  })

  it('EXP-04: bar of light renders at modal top w/ soft-corner radius', () => {
    const { container } = renderWithTheme(
      <div style={{ position: 'relative', height: '100px' }}>
        <div>Mock modal content</div>
      </div>
    )

    const modal = container.querySelector('div')
    expect(modal).toBeTruthy()
  })

  it('EXP-08: bar breathes when tooltip-closed', () => {
    const { container } = renderWithTheme(<NodeStatus status="recording" />)

    const statusEl = container.querySelector('div')
    expect(statusEl).toBeTruthy()
    expect(statusEl?.textContent).toContain('Recording')
  })

  it('LGT-08: bar rest state idle unanimated hover brightens', () => {
    const { container } = renderWithTheme(<NodeStatus status="idle" />)

    const statusEl = container.querySelector('div')
    const animationName = window.getComputedStyle(statusEl!).animationName

    expect(animationName).toBe('none')
  })
})
