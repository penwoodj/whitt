import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSpawnPlacement } from '../useSpawnPlacement'

describe('AGTC-02 spawn placement - adjacent placement', () => {
  it('calculates adjacent position with distance window', () => {
    const parentNode = { id: 'n1', position: { x: 100, y: 100 } }
    const existingSiblings: Array<{ id: string; position: { x: number; y: number } }> = []
    
    const { result } = renderHook(() => useSpawnPlacement())
    const position = result.current.calculatePosition(parentNode.position, existingSiblings)

    const distance = Math.sqrt(
      Math.pow(position.x - parentNode.position.x, 2) +
      Math.pow(position.y - parentNode.position.y, 2)
    )

    expect(distance).toBeGreaterThanOrEqual(150)
    expect(distance).toBeLessThanOrEqual(250)
  })

  it('offsets from siblings (crowd-aware)', () => {
    const parentNode = { id: 'n1', position: { x: 100, y: 100 } }
    const existingSiblings: Array<{ id: string; position: { x: number; y: number } }> = [
      { id: 'n2', position: { x: 250, y: 100 } },
      { id: 'n3', position: { x: 175, y: 216 } },
    ]
    
    const { result } = renderHook(() => useSpawnPlacement())
    const position = result.current.calculatePosition(parentNode.position, existingSiblings)

    const isUnique = !existingSiblings.some(sibling =>
      sibling.position.x === position.x && sibling.position.y === position.y
    )

    expect(isUnique).toBe(true)
  })
})

describe('AGTC-02 spawn placement - fade-in animation', () => {
  it('node has fade-in animation class', () => {
    const { result } = renderHook(() => useSpawnPlacement())
    
    expect(result.current.getAnimationClass()).toBe('fade-in-settle')
  })

  it('animation duration 400ms (fade+settle)', () => {
    const { result } = renderHook(() => useSpawnPlacement())
    
    expect(result.current.getAnimationDuration()).toBe('400ms')
  })
})

describe('AGTC-02 spawn placement - parent link drawn', () => {
  it('creates link with draw animation class', () => {
    const parentNodeId = 'n1'
    const newChildId = 'n2'
    
    const { result } = renderHook(() => useSpawnPlacement())
    const link = result.current.createLink(parentNodeId, newChildId)

    expect(link.source).toBe('n1')
    expect(link.target).toBe('n2')
    expect(link.type).toBe('default')
    expect(link.animated).toBe(true)
  })
})
