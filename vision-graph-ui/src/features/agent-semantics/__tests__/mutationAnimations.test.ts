import { describe, it, expect } from 'vitest'
import { getAnimationClass, mutationAnimationMap, ANIMATION_DURATIONS } from '../mutationAnimations'
import type { GraphMutation } from '../../../shared/agent/types'

describe('AGTC-01 event vocabulary - 7-op animation mapping', () => {
  it('spawn maps to fade-in-settle animation', () => {
    const animation = getAnimationClass('spawn')
    expect(animation).toBe('fade-in-settle')
    expect(ANIMATION_DURATIONS['fade-in-settle']).toBe('400ms')
  })

  it('edit maps to pulse animation', () => {
    const animation = getAnimationClass('edit')
    expect(animation).toBe('pulse')
    expect(ANIMATION_DURATIONS['pulse']).toBe('300ms')
  })

  it('move maps to shift animation', () => {
    const animation = getAnimationClass('move')
    expect(animation).toBe('shift')
    expect(ANIMATION_DURATIONS['shift']).toBe('300ms')
  })

  it('group maps to halo animation', () => {
    const animation = getAnimationClass('group')
    expect(animation).toBe('halo')
    expect(ANIMATION_DURATIONS['halo']).toBe('350ms')
  })

  it('detach maps to fade-out animation', () => {
    const animation = getAnimationClass('detach')
    expect(animation).toBe('fade-out')
    expect(ANIMATION_DURATIONS['fade-out']).toBe('300ms')
  })

  it('link maps to edge-draw animation', () => {
    const animation = getAnimationClass('link')
    expect(animation).toBe('edge-draw')
    expect(ANIMATION_DURATIONS['edge-draw']).toBe('400ms')
  })

  it('unlink maps to edge-erase animation', () => {
    const animation = getAnimationClass('unlink')
    expect(animation).toBe('edge-erase')
    expect(ANIMATION_DURATIONS['edge-erase']).toBe('300ms')
  })

  it('lookup table has all 7 ops', () => {
    expect(Object.keys(mutationAnimationMap)).toEqual([
      'spawn',
      'edit',
      'move',
      'group',
      'detach',
      'link',
      'unlink',
    ])
  })
})

describe('AGT-04 mutations as movement', () => {
  it('sequence of spawn+move emits animation classes', () => {
    const mutations: GraphMutation[] = [
      { op: 'spawn', parentNodeId: 'n1', newNodeId: 'n2', title: 'Child' },
      { op: 'move', nodeId: 'n2', from: 'pos1', to: 'pos2' },
    ]

    const animations = mutations.map(m => getAnimationClass(m.op))
    expect(animations).toEqual(['fade-in-settle', 'shift'])
  })

  it('position delta implies smooth transition (no teleport)', () => {
    const spawnMutation: GraphMutation = {
      op: 'spawn',
      parentNodeId: 'n1',
      newNodeId: 'n2',
      title: 'Child',
    }
    const moveMutation: GraphMutation = {
      op: 'move',
      nodeId: 'n2',
      from: 'pos1',
      to: 'pos2',
    }

    const spawnAnim = getAnimationClass(spawnMutation.op)
    const moveAnim = getAnimationClass(moveMutation.op)

    expect(spawnAnim).not.toBe(moveAnim)
    expect(spawnAnim).toBe('fade-in-settle')
    expect(moveAnim).toBe('shift')
  })
})