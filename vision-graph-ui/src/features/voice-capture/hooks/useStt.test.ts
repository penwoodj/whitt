import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createFakeSttEngine } from '../fake/FakeSttEngine'
import { useStt } from './useStt'

describe('useStt', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('useStt shows interim ghost text', async () => {
    const engine = createFakeSttEngine(['Hello', 'World'])
    const { result } = renderHook(() => useStt(engine))

    act(() => {
      result.current.startRec()
    })

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(result.current.finalTxt).toBe('Hello World')
    expect(result.current.interimTxt).toBe('')
  })

  it('useStt final text appends', async () => {
    const engine = createFakeSttEngine(['First', 'Second'])
    const { result } = renderHook(() => useStt(engine))

    act(() => {
      result.current.startRec()
    })

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(result.current.finalTxt).toBe('First Second')
    expect(result.current.interimTxt).toBe('')
  })

  it('useStt start/stop controls', async () => {
    const engine = createFakeSttEngine(['Test'])
    const { result } = renderHook(() => useStt(engine))

    act(() => {
      result.current.startRec()
    })

    expect(engine.getState()).toBe('listening')

    act(() => {
      result.current.stopRec()
    })

    expect(engine.getState()).toBe('stopped')
  })
})
