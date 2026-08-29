import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAgentContext } from '../useAgentContext'
import type { PromptPayload } from '../agentSemanticsTypes'

describe('useAgentContext hook', () => {
  describe('AGT-01 default context - spoken-to node', () => {
    it('prompt payload includes contextNodeId for focused node', () => {
      const focusedNodeId = 'n1'
      const promptTxt = 'make this clearer'
      
      const { result } = renderHook(() => useAgentContext({ focusedNodeId }))
      const payload = result.current.buildPayload(promptTxt)

      expect(payload.contextNodeId).toBe('n1')
      expect(payload.linkedNodeIds).toEqual([])
      expect(payload.promptTxt).toBe('make this clearer')
    })

    it('linkedNodeIds empty when no linked refs', () => {
      const focusedNodeId = 'n1'
      const promptTxt = 'update content'

      const { result } = renderHook(() => useAgentContext({ focusedNodeId }))
      const payload = result.current.buildPayload(promptTxt)

      expect(payload.linkedNodeIds).toEqual([])
    })
  })

  describe('AGT-02 linked edit allowed', () => {
    it('linkedNodeIds includes n2 when child link exists', () => {
      const focusedNodeId = 'n1'
      const linkedNodeIds = ['n2']
      const promptTxt = 'update the child node'

      const { result } = renderHook(() => useAgentContext({ focusedNodeId, linkedNodeIds }))
      const payload = result.current.buildPayload(promptTxt)

      expect(payload.contextNodeId).toBe('n1')
      expect(payload.linkedNodeIds).toEqual(['n2'])
      expect(payload.promptTxt).toBe('update the child node')
    })

    it('write allowed on both nodes (context + linked)', () => {
      const focusedNodeId = 'n1'
      const linkedNodeIds = ['n2']

      const { result } = renderHook(() => useAgentContext({ focusedNodeId, linkedNodeIds }))
      
      expect(result.current.canWriteTo('n1')).toBe(true)
      expect(result.current.canWriteTo('n2')).toBe(true)
      expect(result.current.canWriteTo('n3')).toBe(false)
    })
  })

  describe('AGT-03 initial one file - single node init', () => {
    it('prompt payload has exactly 1 contextNodeId', () => {
      const focusedNodeId = 'root'
      const promptTxt = 'start project'

      const { result } = renderHook(() => useAgentContext({ focusedNodeId }))
      const payload = result.current.buildPayload(promptTxt)

      expect(payload.contextNodeId).toBe('root')
      expect(payload.linkedNodeIds).toEqual([])
    })

    it('agent creates exactly 1 file on first prompt', () => {
      const focusedNodeId = 'root'
      const promptTxt = 'first prompt'

      const { result } = renderHook(() => useAgentContext({ focusedNodeId }))
      const payload = result.current.buildPayload(promptTxt)

      expect(payload.contextNodeId).toBe('root')
      expect(Object.keys(payload).length).toBe(3)
    })
  })
})