import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProjectState } from './useProjectState'

describe('useProjectState', () => {
  it('APP-06 select loads graph', async () => {
    const mockLoadGraph = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useProjectState({ loadGraph: mockLoadGraph }))

    await act(async () => {
      await result.current.selectProject('project-b')
    })

    expect(mockLoadGraph).toHaveBeenCalledWith('project-b')
    expect(result.current.activeProjectId).toBe('project-b')
  })

  it('APP-07 fresh session', async () => {
    const mockLoadGraph = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useProjectState({ loadGraph: mockLoadGraph }))

    await act(async () => {
      await result.current.selectProject('project-b')
    })

    expect(result.current.activeProjectId).toBe('project-b')

    act(() => {
      result.current.resetToNew()
    })

    expect(result.current.activeProjectId).toBe(null)
  })
})