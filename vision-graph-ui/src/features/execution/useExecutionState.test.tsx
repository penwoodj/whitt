import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createEvtBus } from '../../shared/agent/eventBus'
import { useExecutionState } from './useExecutionState'
import type { AgentEvt } from '../../shared/agent/types'

describe('useExecutionState', () => {
  describe('EXE-11 edges breathe', () => {
    it('derives busy node set from run-start + step-start events', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useExecutionState(bus))

      bus.emit({ kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' })
      bus.emit({ kind: 'step-start', runId: 'run1', stepId: 'step1', title: 'Step 1' })

      await waitFor(() => {
        expect(result.current.busyNodeIds.has('node1')).toBe(true)
        expect(result.current.stepTitleByNode.get('node1')).toBe('Step 1')
      })
    })
  })

  describe('EXE-15 step title changes', () => {
    it('updates step title to latest step-start', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useExecutionState(bus))

      bus.emit({ kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' })
      bus.emit({ kind: 'step-start', runId: 'run1', stepId: 'step1', title: 'Step 1' })

      await waitFor(() => {
        expect(result.current.stepTitleByNode.get('node1')).toBe('Step 1')
      })

      bus.emit({ kind: 'step-start', runId: 'run1', stepId: 'step2', title: 'Step 2' })

      await waitFor(() => {
        expect(result.current.stepTitleByNode.get('node1')).toBe('Step 2')
      })
    })

    it('replaces previous step titles', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useExecutionState(bus))

      bus.emit({ kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' })
      bus.emit({ kind: 'step-start', runId: 'run1', stepId: 'step1', title: 'Step 1' })
      bus.emit({ kind: 'step-start', runId: 'run1', stepId: 'step2', title: 'Step 2' })
      bus.emit({ kind: 'step-start', runId: 'run1', stepId: 'step3', title: 'Step 3' })

      await waitFor(() => {
        expect(result.current.stepTitleByNode.get('node1')).toBe('Step 3')
        expect(result.current.stepTitleByNode.size).toBe(1)
      })
    })
  })

  describe('EXE-16 panel live', () => {
    it('updates state continuously without full re-render', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useExecutionState(bus))

      bus.emit({ kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' })
      bus.emit({ kind: 'step-start', runId: 'run1', stepId: 'step1', title: 'Step 1' })
      bus.emit({ kind: 'log', runId: 'run1', level: 'info', msg: 'Processing' })

      await waitFor(() => {
        expect(result.current.busyNodeIds.has('node1')).toBe(true)
        expect(result.current.stepTitleByNode.get('node1')).toBe('Step 1')
      })

      bus.emit({ kind: 'step-start', runId: 'run1', stepId: 'step2', title: 'Step 2' })

      await waitFor(() => {
        expect(result.current.stepTitleByNode.get('node1')).toBe('Step 2')
        expect(result.current.busyNodeIds.has('node1')).toBe(true)
      })
    })

    it('recalculates busy set on new events', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useExecutionState(bus))

      bus.emit({ kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' })
      bus.emit({ kind: 'step-start', runId: 'run1', stepId: 'step1', title: 'Step 1' })

      await waitFor(() => {
        expect(result.current.busyNodeIds.has('node1')).toBe(true)
      })

      bus.emit({ kind: 'step-done', runId: 'run1', stepId: 'step1' })

      await waitFor(() => {
        expect(result.current.busyNodeIds.has('node1')).toBe(false)
      })
    })
  })

  describe('EXEC-04 step error', () => {
    it('contains failed step in error state', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useExecutionState(bus))

      bus.emit({ kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' })
      bus.emit({ kind: 'step-start', runId: 'run1', stepId: 'step1', title: 'Step 1' })
      bus.emit({ kind: 'step-error', runId: 'run1', stepId: 'step1', msg: 'Failed' })

      await waitFor(() => {
        expect(result.current.errorState).not.toBeNull()
        expect(result.current.errorState?.stepId).toBe('step1')
        expect(result.current.errorState?.msg).toBe('Failed')
      })
    })

    it('preserves error message', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useExecutionState(bus))

      const errorMsg = 'Network timeout after 30s'
      bus.emit({ kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' })
      bus.emit({ kind: 'step-start', runId: 'run1', stepId: 'step1', title: 'Step 1' })
      bus.emit({ kind: 'step-error', runId: 'run1', stepId: 'step1', msg: errorMsg })

      await waitFor(() => {
        expect(result.current.errorState?.msg).toBe(errorMsg)
      })
    })

    it('provides retry state availability', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useExecutionState(bus))

      bus.emit({ kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' })
      bus.emit({ kind: 'step-start', runId: 'run1', stepId: 'step1', title: 'Step 1' })
      bus.emit({ kind: 'step-error', runId: 'run1', stepId: 'step1', msg: 'Failed' })

      await waitFor(() => {
        expect(result.current.canRetry).toBe(true)
      })
    })
  })

  describe('EXEC-05 completion', () => {
    it('clears busy set after run-done', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useExecutionState(bus))

      bus.emit({ kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' })
      bus.emit({ kind: 'step-start', runId: 'run1', stepId: 'step1', title: 'Step 1' })

      await waitFor(() => {
        expect(result.current.busyNodeIds.has('node1')).toBe(true)
      })

      bus.emit({ kind: 'run-done', runId: 'run1', nodeId: 'node1', status: 'done' })

      await waitFor(() => {
        expect(result.current.busyNodeIds.has('node1')).toBe(false)
      })
    })

    it('marks final status as done', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useExecutionState(bus))

      bus.emit({ kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' })
      bus.emit({ kind: 'step-start', runId: 'run1', stepId: 'step1', title: 'Step 1' })
      bus.emit({ kind: 'run-done', runId: 'run1', nodeId: 'node1', status: 'done' })

      await waitFor(() => {
        expect(result.current.status).toBe('done')
      })
    })

    it('clears completion state', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useExecutionState(bus))

      bus.emit({ kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' })
      bus.emit({ kind: 'step-start', runId: 'run1', stepId: 'step1', title: 'Step 1' })
      bus.emit({ kind: 'step-done', runId: 'run1', stepId: 'step1' })
      bus.emit({ kind: 'run-done', runId: 'run1', nodeId: 'node1', status: 'done' })

      await waitFor(() => {
        expect(result.current.busyNodeIds.size).toBe(0)
        expect(result.current.errorState).toBeNull()
      })
    })
  })
})
