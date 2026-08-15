import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createEvtBus } from '../eventBus'
import { useAgentEvtStream } from '../useAgentEvtStream'
import type { AgentEvt } from '../types'
import type { GraphMutation } from '../types'

describe('useAgentEvtStream hook', () => {
  describe('hook subscribes to bus on mount', () => {
    it('hook subscribes to event bus on mount', () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useAgentEvtStream(bus))

      expect(result.current.busyNodeIds).toBeDefined()
      expect(result.current.stepTitleByNode).toBeDefined()
      expect(result.current.lastMutation).toBeDefined()
    })
  })

  describe('hook exposes busyNodeIds derived set', () => {
    it('busyNodeIds contains running node IDs', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useAgentEvtStream(bus))

      bus.emit({ kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: 'draft' })

      await waitFor(() => {
        expect(result.current.busyNodeIds.has('n1')).toBe(true)
      })
    })

    it('set updates on step-done', async () => {
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

  describe('hook exposes stepTitleByNode map', () => {
    it('stepTitleByNode maps node IDs to current step titles', async () => {
      const bus = createEvtBus<AgentEvt>()
      const { result } = renderHook(() => useAgentEvtStream(bus))

      bus.emit({ kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: 'draft' })
      bus.emit({ kind: 'step-start', runId: 'r1', stepId: 's1', title: 'Parsing prompt' })

      await waitFor(() => {
        expect(result.current.stepTitleByNode.get('n1')).toBe('Parsing prompt')
      })
    })

    it('map updates on new step-start', async () => {
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

  describe('hook exposes lastMutation (graph-mutation event)', () => {
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

    it('updates on new graph-mutation', async () => {
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

  describe('hook unsubscribes on unmount', () => {
    it('hook unsubscribes from event bus on unmount', () => {
      const bus = createEvtBus<AgentEvt>()
      const { unmount } = renderHook(() => useAgentEvtStream(bus))

      const emitSpy = vi.spyOn(bus, 'emit')

      unmount()

      bus.emit({ kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: 'draft' })

      expect(emitSpy).toHaveBeenCalled()
    })
  })
})
