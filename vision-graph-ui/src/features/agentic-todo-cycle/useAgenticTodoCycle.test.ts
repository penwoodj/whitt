import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAgenticTodoCycle } from './useAgenticTodoCycle'

describe('useAgenticTodoCycle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial todos all queued', () => {
    const { result } = renderHook(() => useAgenticTodoCycle())

    expect(result.current.todos).toHaveLength(3)
    expect(result.current.todos[0].label).toBe('research web')
    expect(result.current.todos[0].status).toBe('queued')
    expect(result.current.todos[1].label).toBe('draft outline')
    expect(result.current.todos[1].status).toBe('queued')
    expect(result.current.todos[2].label).toBe('verify + cite')
    expect(result.current.todos[2].status).toBe('queued')
    expect(result.current.isCycleDone).toBe(false)
  })

  it('startCycle sets first todo to running synchronously', () => {
    const { result } = renderHook(() => useAgenticTodoCycle())

    act(() => {
      result.current.startCycle()
    })

    expect(result.current.todos[0].status).toBe('running')
    expect(result.current.todos[1].status).toBe('queued')
    expect(result.current.todos[2].status).toBe('queued')
    expect(result.current.isCycleDone).toBe(false)
  })

  it('completes first todo after 1500ms', async () => {
    const { result } = renderHook(() => useAgenticTodoCycle())

    act(() => {
      result.current.startCycle()
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500)
    })

    expect(result.current.todos[0].status).toBe('done')
    expect(result.current.todos[1].status).toBe('running')
    expect(result.current.todos[2].status).toBe('queued')
  })

  it('completes all todos after 4500ms total', async () => {
    const { result } = renderHook(() => useAgenticTodoCycle())

    act(() => {
      result.current.startCycle()
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(4500)
    })

    expect(result.current.todos[0].status).toBe('done')
    expect(result.current.todos[1].status).toBe('done')
    expect(result.current.todos[2].status).toBe('done')
    expect(result.current.isCycleDone).toBe(true)
  })

  it('resetCycle returns all todos to queued', () => {
    const { result } = renderHook(() => useAgenticTodoCycle())

    act(() => {
      result.current.startCycle()
    })

    act(() => {
      result.current.resetCycle()
    })

    expect(result.current.todos).toHaveLength(3)
    expect(result.current.todos.every((t: { status: string }) => t.status === 'queued')).toBe(true)
    expect(result.current.isCycleDone).toBe(false)
  })
})
