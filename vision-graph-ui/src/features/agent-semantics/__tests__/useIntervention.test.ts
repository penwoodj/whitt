import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useIntervention } from '../useIntervention'

describe('AGT-05 intervene - correction queue', () => {
  it('correction queued when user intervenes', () => {
    const { result } = renderHook(() => useIntervention())
    
    act(() => {
      result.current.queueIntervention('n1', 'clarify this point')
    })

    expect(result.current.getQueue()).toHaveLength(1)
    expect(result.current.getQueue()[0]).toEqual({
      nodeId: 'n1',
      correction: 'clarify this point',
    })
  })

  it('queue preserves order (FIFO)', () => {
    const { result } = renderHook(() => useIntervention())
    
    act(() => {
      result.current.queueIntervention('n1', 'first')
      result.current.queueIntervention('n2', 'second')
      result.current.queueIntervention('n1', 'third')
    })

    const queue = result.current.getQueue()
    expect(queue[0].correction).toBe('first')
    expect(queue[1].correction).toBe('second')
    expect(queue[2].correction).toBe('third')
  })

  it('clear queue after agent processes', () => {
    const { result } = renderHook(() => useIntervention())
    
    act(() => {
      result.current.queueIntervention('n1', 'correction')
    })
    expect(result.current.getQueue()).toHaveLength(1)

    act(() => {
      result.current.processNextIntervention()
    })
    expect(result.current.getQueue()).toHaveLength(0)
  })
})

describe('AGTC-03 intervention path - status interruption', () => {
  it('execution status reflects interruption', () => {
    const { result } = renderHook(() => useIntervention())
    
    act(() => {
      result.current.queueIntervention('n1', 'correction')
    })

    expect(result.current.executionStatus).toBe('interrupted')
  })

  it('status shows "Interrupted by user"', () => {
    const { result } = renderHook(() => useIntervention())
    
    act(() => {
      result.current.queueIntervention('n1', 'correction')
    })

    expect(result.current.getStatusMessage()).toBe('Interrupted by user')
  })
})

describe('AGTC-03 intervention path - no surface block', () => {
  it('input surface remains responsive', () => {
    const { result } = renderHook(() => useIntervention())
    
    expect(result.current.isInputBlocked()).toBe(false)
    
    act(() => {
      result.current.queueIntervention('n1', 'correction')
    })

    expect(result.current.isInputBlocked()).toBe(false)
  })

  it('user can send correction (input not blocked)', () => {
    const { result } = renderHook(() => useIntervention())
    const onSend = vi.fn()
    
    act(() => {
      result.current.sendCorrection('n1', 'new direction', onSend)
    })

    expect(onSend).toHaveBeenCalledWith('n1', 'new direction')
    expect(result.current.getQueue()).toHaveLength(1)
  })
})

describe('AGTC-03 intervention path - stop button', () => {
  it('execution halts on stop', () => {
    const { result } = renderHook(() => useIntervention())
    const onStop = vi.fn()
    
    act(() => {
      result.current.stopExecution(onStop)
    })

    expect(onStop).toHaveBeenCalled()
    expect(result.current.executionStatus).toBe('stopped')
  })

  it('status shows "Stopped by user"', () => {
    const { result } = renderHook(() => useIntervention())
    
    act(() => {
      result.current.stopExecution(() => {})
    })

    expect(result.current.getStatusMessage()).toBe('Stopped by user')
  })
})