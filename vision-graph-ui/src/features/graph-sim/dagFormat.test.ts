import { describe, expect, it } from 'vitest'
import type { Edge, Node } from '@xyflow/react'
import { DagFormatCycleError, formatSelectedDag } from './dagFormat'

type TestNode = Node<{ label: string }>

const makeNode = (id: string, x: number, y: number, selected = false): TestNode => ({
  id,
  position: { x, y },
  data: { label: id },
  selected,
  width: 100,
  height: 50,
})

const makeEdge = (id: string, source: string, target: string): Edge => ({
  id,
  source,
  target,
})

describe('formatSelectedDag', () => {
  it('DAGX-01 formats selected nodes right only', () => {
    const nodes = [makeNode('A', 40, 80, true), makeNode('B', 180, 120, true), makeNode('C', 400, 300)]
    const edges = [makeEdge('ab', 'A', 'B'), makeEdge('bc', 'B', 'C')]

    const result = formatSelectedDag({ nodes, edges, direction: 'RIGHT', selectedNodeIds: ['A', 'B'] })

    expect(result.nodes.find((node) => node.id === 'A')?.position.x).toBe(40)
    expect(result.nodes.find((node) => node.id === 'B')?.position.x).toBeGreaterThan(40)
    expect(result.nodes.find((node) => node.id === 'C')).toBe(nodes[2])
    expect(result.edges).toBe(edges)
  })

  it('DAGX-02 formats selected nodes down', () => {
    const nodes = [makeNode('A', 40, 80, true), makeNode('B', 180, 120, true)]

    const result = formatSelectedDag({ nodes, edges: [makeEdge('ab', 'A', 'B')], direction: 'DOWN', selectedNodeIds: ['A', 'B'] })

    expect(result.nodes.find((node) => node.id === 'B')?.position.y).toBeGreaterThan(
      result.nodes.find((node) => node.id === 'A')?.position.y ?? 0,
    )
  })

  it('DAGX-03 formats left and supports wrap direction', () => {
    const nodes = [makeNode('A', 40, 80, true), makeNode('B', 180, 120, true)]
    const edges = [makeEdge('ab', 'A', 'B')]

    const result = formatSelectedDag({ nodes, edges, direction: 'LEFT', selectedNodeIds: ['A', 'B'] })

    expect(result.nodes.find((node) => node.id === 'B')?.position.x).toBeLessThan(40 + 100)
  })

  it('DAGX-04 returns exact inputs for empty selection', () => {
    const nodes = [makeNode('A', 40, 80), makeNode('B', 180, 120)]
    const edges = [makeEdge('ab', 'A', 'B')]

    const result = formatSelectedDag({ nodes, edges, direction: 'RIGHT', selectedNodeIds: [] })

    expect(result.nodes).toBe(nodes)
    expect(result.edges).toBe(edges)
  })

  it('uses induced edges, disconnected IDs, and preserves boundary graph', () => {
    const nodes = [makeNode('B', 40, 80, true), makeNode('A', 180, 120, true), makeNode('C', 400, 300)]
    const edges = [makeEdge('ac', 'A', 'C')]

    const result = formatSelectedDag({ nodes, edges, direction: 'RIGHT', selectedNodeIds: ['A', 'B'] })

    expect(result.nodes.find((node) => node.id === 'C')).toBe(nodes[2])
    expect(result.edges).toBe(edges)
    expect(result.nodes.map((node) => node.id)).toEqual(['B', 'A', 'C'])
    expect(result.nodes[0]?.selected).toBe(true)
    expect(result.nodes[1]?.selected).toBe(true)
  })

  it('throws typed cycle error without changing inputs', () => {
    const nodes = [makeNode('A', 40, 80, true), makeNode('B', 180, 120, true)]
    const edges = [makeEdge('ab', 'A', 'B'), makeEdge('ba', 'B', 'A')]

    expect(() => formatSelectedDag({ nodes, edges, direction: 'RIGHT', selectedNodeIds: ['A', 'B'] })).toThrow(DagFormatCycleError)
    expect(nodes[0]?.position).toEqual({ x: 40, y: 80 })
    expect(edges).toEqual([makeEdge('ab', 'A', 'B'), makeEdge('ba', 'B', 'A')])
  })
})
