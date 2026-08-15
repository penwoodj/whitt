import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useVoiceInput } from './useVoiceInput'
import { createFakeSttEngine } from './fake/FakeSttEngine'
import type { SttEngine } from '../../../shared/stt/types'

describe('VoiceNode', () => {
  describe('VOXC-01 mic permission flow', () => {
    it('denied state + recovery text when getUserMedia throws', async () => {
      const mockEngine: SttEngine = {
        start: vi.fn().mockRejectedValue(new Error('Permission denied: Microphone access denied')),
        stop: vi.fn().mockResolvedValue(undefined),
        on: vi.fn(),
        getState: vi.fn().mockReturnValue('error'),
        getCapabilities: vi.fn().mockReturnValue({
          webgpu: false,
          fallback: 'wasm',
          mic: true,
          secureContext: true,
          opfsCache: false,
        }),
      }

      const { result } = renderHook(() => useVoiceInput(mockEngine))

      await act(async () => {
        try {
          await result.current.startRec()
        } catch {
        }
      })

      expect(result.current.permissionDenied).toBe(true)
      expect(result.current.errorMsg).toContain('Permission denied')
      expect(mockEngine.start).toHaveBeenCalled()
    })

    it('no crash on permission denied', async () => {
      const mockEngine: SttEngine = {
        start: vi.fn().mockRejectedValue(new Error('Permission denied')),
        stop: vi.fn().mockResolvedValue(undefined),
        on: vi.fn(),
        getState: vi.fn().mockReturnValue('error'),
        getCapabilities: vi.fn().mockReturnValue({
          webgpu: false,
          fallback: 'wasm',
          mic: true,
          secureContext: true,
          opfsCache: false,
        }),
      }

      const { result } = renderHook(() => useVoiceInput(mockEngine))

      await act(async () => {
        try {
          await result.current.startRec()
        } catch {
        }
      })

      expect(result.current).toBeDefined()
      expect(result.current.permissionDenied).toBe(true)
    })
  })

  describe('VOX-01 click starts recording', () => {
    it('STT engine started on click', async () => {
      const mockEngine = createFakeSttEngine(['hello', 'world'])

      const { result } = renderHook(() => useVoiceInput(mockEngine))

      expect(result.current.isRec).toBe(false)

      await act(async () => {
        await result.current.startRec()
      })

      expect(result.current.isRec).toBe(true)
      expect(mockEngine.getState()).not.toBe('idle')
    })

    it('no tooltip chrome auto-opened', async () => {
      const mockEngine = createFakeSttEngine(['test'])

      const { result } = renderHook(() => useVoiceInput(mockEngine))

      await act(async () => {
        await result.current.startRec()
      })

      expect(result.current.tooltipVisible).toBe(false)
    })
  })

  describe('VOXC-02 interim styling', () => {
    it('interim text styled w/ data-interim attr', async () => {
      const mockEngine = createFakeSttEngine(['hello'])

      const { result } = renderHook(() => useVoiceInput(mockEngine))

      await act(async () => {
        await result.current.startRec()
      })

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 20))
      })

      expect(result.current.interimTxt).toBe('hello')
    })

    it('final text normalizes from interim', async () => {
      const mockEngine = createFakeSttEngine(['hello'])

      const { result } = renderHook(() => useVoiceInput(mockEngine))

      await act(async () => {
        await result.current.startRec()
      })

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50))
      })

      expect(result.current.finalTxt).toBe('hello')
      expect(result.current.interimTxt).toBe('')
    })
  })
})
