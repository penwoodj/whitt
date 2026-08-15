import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProjectState } from './useProjectState'

describe('useProjectState', () => {
  it('APP-06 select loads graph', () => {
    const mockLoadGraph = vi.fn()
    const { result } = renderHook(() => useProjectState({ loadGraph: mockLoadGraph }))

    act(() => {
      result.current.selectProject('project-b')
    })

    expect(mockLoadGraph).toHaveBeenCalledWith('project-b')
    expect(result.current.activeProjectId).toBe('project-b')
  })

  it('APP-07 fresh session', () => {
    const mockLoadGraph = vi.fn()
    const { result } = renderHook(() => useProjectState({ loadGraph: mockLoadGraph }))

    act(() => {
      result.current.selectProject('project-b')
    })

    expect(result.current.activeProjectId).toBe('project-b')

    act(() => {
      result.current.resetToNew()
    })

    expect(result.current.activeProjectId).toBe(null)
    expect(mockLoadGraph).not.toHaveBeenCalled()
  })
})