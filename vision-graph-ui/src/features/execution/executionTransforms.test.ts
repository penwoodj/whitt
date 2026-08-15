import { describe, it, expect } from 'vitest'
import { deriveBusySet, deriveStepTitleByNode, deriveErrorState, deriveStatus, deriveCanRetry } from './executionTransforms'
import type { AgentEvt } from '../../shared/agent/types'

describe('executionTransforms', () => {
  describe('deriveBusySet', () => {
    it('returns empty set for no events', () => {
      const evts: AgentEvt[] = []
      const result = deriveBusySet(evts)
      expect(result.size).toBe(0)
    })

    it('includes node with run-start but no step-done', () => {
      const evts: AgentEvt[] = [
        { kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' },
        { kind: 'step-start', runId: 'run1', stepId: 'step1', title: 'Step 1' },
      ]
      const result = deriveBusySet(evts)
      expect(result.has('node1')).toBe(true)
    })

    it('excludes node with step-done', () => {
      const evts: AgentEvt[] = [
        { kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' },
        { kind: 'step-start', runId: 'run1', stepId: 'step1', title: 'Step 1' },
        { kind: 'step-done', runId: 'run1', stepId: 'step1' },
      ]
      const result = deriveBusySet(evts)
      expect(result.has('node1')).toBe(false)
    })
  })

  describe('deriveStepTitleByNode', () => {
    it('returns empty map for no events', () => {
      const evts: AgentEvt[] = []
      const result = deriveStepTitleByNode(evts)
      expect(result.size).toBe(0)
    })

    it('maps node to latest step title', () => {
      const evts: AgentEvt[] = [
        { kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' },
        { kind: 'step-start', runId: 'run1', stepId: 'step1', title: 'Step 1' },
        { kind: 'step-start', runId: 'run1', stepId: 'step2', title: 'Step 2' },
      ]
      const result = deriveStepTitleByNode(evts)
      expect(result.get('node1')).toBe('Step 2')
    })
  })

  describe('deriveErrorState', () => {
    it('returns null for no errors', () => {
      const evts: AgentEvt[] = [
        { kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' },
        { kind: 'step-start', runId: 'run1', stepId: 'step1', title: 'Step 1' },
      ]
      const result = deriveErrorState(evts)
      expect(result).toBeNull()
    })

    it('returns error state for step-error', () => {
      const evts: AgentEvt[] = [
        { kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' },
        { kind: 'step-start', runId: 'run1', stepId: 'step1', title: 'Step 1' },
        { kind: 'step-error', runId: 'run1', stepId: 'step1', msg: 'Failed' },
      ]
      const result = deriveErrorState(evts)
      expect(result).not.toBeNull()
      expect(result?.stepId).toBe('step1')
      expect(result?.msg).toBe('Failed')
      expect(result?.nodeId).toBe('node1')
    })
  })

  describe('deriveStatus', () => {
    it('returns idle for no events', () => {
      const evts: AgentEvt[] = []
      const result = deriveStatus(evts)
      expect(result).toBe('idle')
    })

    it('returns running for active execution', () => {
      const evts: AgentEvt[] = [
        { kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' },
        { kind: 'step-start', runId: 'run1', stepId: 'step1', title: 'Step 1' },
      ]
      const result = deriveStatus(evts)
      expect(result).toBe('running')
    })

    it('returns done for completed execution', () => {
      const evts: AgentEvt[] = [
        { kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' },
        { kind: 'step-start', runId: 'run1', stepId: 'step1', title: 'Step 1' },
        { kind: 'step-done', runId: 'run1', stepId: 'step1' },
        { kind: 'run-done', runId: 'run1', nodeId: 'node1', status: 'done' },
      ]
      const result = deriveStatus(evts)
      expect(result).toBe('done')
    })

    it('returns error for failed execution', () => {
      const evts: AgentEvt[] = [
        { kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' },
        { kind: 'step-start', runId: 'run1', stepId: 'step1', title: 'Step 1' },
        { kind: 'step-error', runId: 'run1', stepId: 'step1', msg: 'Failed' },
      ]
      const result = deriveStatus(evts)
      expect(result).toBe('error')
    })
  })

  describe('deriveCanRetry', () => {
    it('returns false for no errors', () => {
      const evts: AgentEvt[] = [
        { kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' },
      ]
      const result = deriveCanRetry(evts)
      expect(result).toBe(false)
    })

    it('returns true for error state', () => {
      const evts: AgentEvt[] = [
        { kind: 'run-start', runId: 'run1', nodeId: 'node1', workflow: 'test' },
        { kind: 'step-start', runId: 'run1', stepId: 'step1', title: 'Step 1' },
        { kind: 'step-error', runId: 'run1', stepId: 'step1', msg: 'Failed' },
      ]
      const result = deriveCanRetry(evts)
      expect(result).toBe(true)
    })
  })
})
