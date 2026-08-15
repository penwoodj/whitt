import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createFakeAnalyser } from '../fake/FakeAnalyser'
import { useVoiceLevel } from './useVoiceLevel'

describe('useVoiceLevel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('useVoiceLevel streams audio level 0-1', () => {
    const analyser = createFakeAnalyser([0.2, 0.6, 0.9, 0.4, 0.1])
    const { result } = renderHook(() => useVoiceLevel(analyser))

    expect(result.current).toBe(0.2)

    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(result.current).toBe(0.6)

    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(result.current).toBe(0.9)

    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(result.current).toBe(0.4)
  })

  it('useVoiceLevel cleans up on unmount', () => {
    const analyser = createFakeAnalyser([0.5])
    const { unmount } = renderHook(() => useVoiceLevel(analyser))

    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
  })
})
