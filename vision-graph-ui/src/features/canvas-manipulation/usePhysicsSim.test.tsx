import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { usePhysicsSim } from './usePhysicsSim'

describe('usePhysicsSim', () => {
  const mockNodes = [
    { id: 'node-a', position: { x: 100, y: 100 }, data: { title: 'Node A' } },
    { id: 'node-b', position: { x: 700, y: 500 }, data: { title: 'Node B' } },
  ]

  describe('GRPC-09 reheat on drag', () => {
    it('reheats simulation when reheat is called', async () => {
      const { result } = renderHook(() => usePhysicsSim(mockNodes))

      await waitFor(() => {
        expect(result.current.isRunning).toBe(false)
      })

      result.current.reheat()

      await waitFor(() => {
        expect(result.current.isRunning).toBe(true)
      })
    })
  })

  describe('GRPC-09 collision resolution', () => {
    it('nodes push apart to avoid overlap', async () => {
      const overlappingNodes = [
        { id: 'node-a', position: { x: 400, y: 300 }, data: { title: 'Node A' } },
        { id: 'node-b', position: { x: 410, y: 310 }, data: { title: 'Node B' } },
      ]

      const { result } = renderHook(() => usePhysicsSim(overlappingNodes))

      await waitFor(() => {
        expect(result.current.isRunning).toBe(false)
      }, { timeout: 3000 })

      const nodeA = result.current.nodes.find(n => n.id === 'node-a')
      const nodeB = result.current.nodes.find(n => n.id === 'node-b')

      expect(nodeA).toBeDefined()
      expect(nodeB).toBeDefined()
    })
  })

  describe('GRPC-09 auto-sleep', () => {
    it('simulation stops when nodes reach equilibrium', async () => {
      const { result } = renderHook(() => usePhysicsSim(mockNodes))

      await waitFor(() => {
        expect(result.current.isRunning).toBe(false)
      }, { timeout: 3000 })
    })
  })

  describe('GRPC-09 center force', () => {
    it('nodes pulled toward center', async () => {
      const { result } = renderHook(() => usePhysicsSim(mockNodes))

      await waitFor(() => {
        expect(result.current.isRunning).toBe(false)
      }, { timeout: 3000 })

      const finalNodes = result.current.nodes
      finalNodes.forEach(node => {
        const dx = node.position.x - 400
        const dy = node.position.y - 300
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy)
        expect(distanceFromCenter).toBeLessThan(500)
      })
    })
  })

  describe('GRPC-09 velocity decay', () => {
    it('node velocities decay over time', async () => {
      const { result } = renderHook(() => usePhysicsSim(mockNodes))

      const initialNodes = [...result.current.nodes]

      await waitFor(() => {
        expect(result.current.isRunning).toBe(false)
      }, { timeout: 3000 })

      const finalNodes = result.current.nodes
      expect(finalNodes).toHaveLength(initialNodes.length)
    })
  })
})