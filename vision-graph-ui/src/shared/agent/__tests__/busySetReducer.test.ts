import { describe, it, expect } from 'vitest'
import { deriveBusyNodeIds } from '../busySetReducer'
import type { AgentEvt } from '../types'

describe('Busy-set reducer (startButNotFinished derivation)', () => {
  describe('empty events → empty busy set', () => {
    it('result is empty set', () => {
      const evts: AgentEvt[] = []
      const busy = deriveBusyNodeIds(evts)
      expect(busy.size).toBe(0)
    })
  })

  describe('run-start adds node to busy set', () => {
    it('n1 is in busy set after run-start', () => {
      const evts: AgentEvt[] = [
        { kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: 'draft' },
      ]
      const busy = deriveBusyNodeIds(evts)
      expect(busy.has('n1')).toBe(true)
      expect(busy.size).toBe(1)
    })
  })

  describe('step-done removes node from busy set', () => {
    it('n1 is NOT in busy set after step-done', () => {
      const evts: AgentEvt[] = [
        { kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: 'draft' },
        { kind: 'step-start', runId: 'r1', stepId: 's1', title: 'Step 1' },
        { kind: 'step-done', runId: 'r1', stepId: 's1' },
      ]
      const busy = deriveBusyNodeIds(evts)
      expect(busy.has('n1')).toBe(false)
      expect(busy.size).toBe(0)
    })
  })

  describe('step-error removes node from busy set', () => {
    it('n1 is NOT in busy set after step-error', () => {
      const evts: AgentEvt[] = [
        { kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: 'draft' },
        { kind: 'step-start', runId: 'r1', stepId: 's1', title: 'Step 1' },
        { kind: 'step-error', runId: 'r1', stepId: 's1', msg: 'Error' },
      ]
      const busy = deriveBusyNodeIds(evts)
      expect(busy.has('n1')).toBe(false)
      expect(busy.size).toBe(0)
    })
  })

  describe('multiple runs tracked independently', () => {
    it('n1 finished, n2 still running', () => {
      const evts: AgentEvt[] = [
        { kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: 'draft' },
        { kind: 'run-start', runId: 'r2', nodeId: 'n2', workflow: 'draft' },
        { kind: 'step-start', runId: 'r1', stepId: 's1', title: 'Step 1' },
        { kind: 'step-done', runId: 'r1', stepId: 's1' },
      ]
      const busy = deriveBusyNodeIds(evts)
      expect(busy.has('n1')).toBe(false)
      expect(busy.has('n2')).toBe(true)
      expect(busy.size).toBe(1)
    })
  })
})
