import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createEvtBus } from '../../../shared/agent/eventBus'
import { useAgentEvtStream } from '../../../shared/agent/useAgentEvtStream'
import type { AgentEvt, GraphMutation } from '../../../shared/agent/types'

describe('useAgentEvtStream hook', () => {
  describe('Hook subscribes to bus on mount', () => {
    it('state exposes busyNodeIds', () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useAgentEvtStream(bus))
      expect(result.current.busyNodeIds).toBeDefined()
    })

    it('state exposes stepTitleByNode', () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useAgentEvtStream(bus))
      expect(result.current.stepTitleByNode).toBeDefined()
    })

    it('state exposes lastMutation', () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useAgentEvtStream(bus))
      expect(result.current.lastMutation).toBeDefined()
    })
  })

  describe('Busy set tracks running nodes', () => {
    it('busyNodeIds contains node after run-start', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useAgentEvtStream(bus))

      bus.emit({ kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: 'draft' })

      await waitFor(() => {
        expect(result.current.busyNodeIds.has('n1')).toBe(true)
      })
    })

    it('other nodes not in set', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useAgentEvtStream(bus))

      bus.emit({ kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: 'draft' })

      await waitFor(() => {
        expect(result.current.busyNodeIds.has('n2')).toBe(false)
        expect(result.current.busyNodeIds.has('n3')).toBe(false)
      })
    })
  })

  describe('Busy set clears on step-done', () => {
    it('busyNodeIds cleared after step-done', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useAgentEvtStream(bus))

      bus.emit({ kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: 'draft' })
      bus.emit({ kind: 'step-start', runId: 'r1', stepId: 's1', title: 'Step 1' })

      await waitFor(() => {
        expect(result.current.busyNodeIds.has('n1')).toBe(true)
      })

      bus.emit({ kind: 'step-done', runId: 'r1', stepId: 's1' })

      await waitFor(() => {
        expect(result.current.busyNodeIds.has('n1')).toBe(false)
      })
    })
  })

  describe('Busy set clears on step-error', () => {
    it('busyNodeIds cleared after step-error', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useAgentEvtStream(bus))

      bus.emit({ kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: 'draft' })
      bus.emit({ kind: 'step-start', runId: 'r1', stepId: 's1', title: 'Step 1' })

      await waitFor(() => {
        expect(result.current.busyNodeIds.has('n1')).toBe(true)
      })

      bus.emit({ kind: 'step-error', runId: 'r1', stepId: 's1', msg: 'failed' })

      await waitFor(() => {
        expect(result.current.busyNodeIds.has('n1')).toBe(false)
      })
    })
  })

  describe('Step title maps to node', () => {
    it('stepTitleByNode has entry after step-start', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useAgentEvtStream(bus))

      bus.emit({ kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: 'draft' })
      bus.emit({ kind: 'step-start', runId: 'r1', stepId: 's1', title: 'Parsing prompt' })

      await waitFor(() => {
        expect(result.current.stepTitleByNode.get('n1')).toBe('Parsing prompt')
      })
    })
  })

  describe('Step title updates on new step', () => {
    it('stepTitleByNode updated on new step-start', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useAgentEvtStream(bus))

      bus.emit({ kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: 'draft' })
      bus.emit({ kind: 'step-start', runId: 'r1', stepId: 's1', title: 'Step 1' })

      await waitFor(() => {
        expect(result.current.stepTitleByNode.get('n1')).toBe('Step 1')
      })

      bus.emit({ kind: 'step-start', runId: 'r1', stepId: 's2', title: 'Step 2' })

      await waitFor(() => {
        expect(result.current.stepTitleByNode.get('n1')).toBe('Step 2')
      })
    })
  })

  describe('Last mutation tracks graph changes', () => {
    it('lastMutation contains most recent mutation', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useAgentEvtStream(bus))

      const mutation: GraphMutation = {
        op: 'spawn',
        parentNodeId: 'n1',
        newNodeId: 'n2',
        title: 'Sub topic',
      }

      bus.emit({ kind: 'graph-mutation', runId: 'r1', mutation })

      await waitFor(() => {
        expect(result.current.lastMutation).toEqual(mutation)
      })
    })
  })

  describe('Last mutation updates on new events', () => {
    it('lastMutation updates on new graph-mutation', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useAgentEvtStream(bus))

      const mutation1: GraphMutation = {
        op: 'spawn',
        parentNodeId: 'n1',
        newNodeId: 'n2',
        title: 'Sub topic',
      }

      const mutation2: GraphMutation = {
        op: 'edit',
        nodeId: 'n1',
      }

      bus.emit({ kind: 'graph-mutation', runId: 'r1', mutation: mutation1 })

      await waitFor(() => {
        expect(result.current.lastMutation).toEqual(mutation1)
      })

      bus.emit({ kind: 'graph-mutation', runId: 'r1', mutation: mutation2 })

      await waitFor(() => {
        expect(result.current.lastMutation).toEqual(mutation2)
      })
    })
  })

  describe('Hook unsubscribes on unmount', () => {
    it('hook unsubscribes from event bus on unmount', () => {
      const bus = createEvtBus<AgentEvt>()
      const { unmount } = renderHook(() => useAgentEvtStream(bus))

      const emitSpy = vi.fn()
      const unsubscribe = bus.subscribe(emitSpy)
      unsubscribe()

      unmount()

      bus.emit({ kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: 'draft' })

      expect(emitSpy).not.toHaveBeenCalled()
    })
  })
})