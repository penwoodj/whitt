import { describe, expect, it } from 'vitest'
import { getBezierPath, Position } from '@xyflow/react'
import { renderHook } from '@testing-library/react'
import { darkTheme } from '../../shared/theme'
import { loadProjectGraph } from '../../shared/fsGraphLoader'
import { useGraphMutationHandler } from '../agent-semantics/useGraphMutationHandler'
import { useSpawnPlacement } from '../agent-semantics/useSpawnPlacement'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { render, screen } from '@testing-library/react'
import Node from '../node/Node'
import type { NodeData } from '../node/nodeTypes'

const createNode = (): NodeData => ({
  id: 'gorse-node',
  title: 'Gorse Node',
  status: 'idle',
  type: 'task',
  lifecycle: 'initial',
  nodeViewState: 'collapsed',
  focused: false,
  promptTxt: '',
  todos: [],
  lastUpdate: null,
  detailExpanded: false,
  todosExpanded: false,
  isRec: false,
  isCycleRun: false,
  isStream: false,
  streamedTxt: '',
})

describe('Gorse graph visuals', () => {
  it('idle node uses gorse light token', () => {
    render(
      <ThemeProvider>
        <Node data={createNode()} />
      </ThemeProvider>
    )

    expect(screen.getByTestId('node-gorse-light')).toHaveAttribute('data-light', 'gorse')
  })

  it('reduced motion keeps gorse light visible', () => {
    expect(darkTheme.glow.gorse).toBeTruthy()
    expect(darkTheme.glow.gorseReducedMotion).toBe(darkTheme.glow.gorse)
  })

  it('loader emits default Bezier edges', async () => {
    const { edges } = await loadProjectGraph('ai-frameworks')

    expect(edges.length).toBeGreaterThan(0)
    expect(edges.every((edge) => edge.type === 'default')).toBe(true)
  })

  it('spawn emits default Bezier edge', () => {
    const { result } = renderHook(() => useSpawnPlacement())

    expect(result.current.createLink('source', 'target').type).toBe('default')
  })

  it('mutation link emits default Bezier edge', () => {
    const { result } = renderHook(() => useGraphMutationHandler())

    const edges = result.current.applyMutationToEdges([], {
      op: 'link',
      source: 'source',
      target: 'target',
    })

    expect(edges[0]?.type).toBe('default')
  })

  it('default edge renders cubic geometry', async () => {
    const { edges } = await loadProjectGraph('ai-frameworks')
    const edge = edges[0]
    expect(edge?.type).toBe('default')

    const [path] = getBezierPath({
      sourceX: 0,
      sourceY: 0,
      sourcePosition: Position.Right,
      targetX: 200,
      targetY: 100,
      targetPosition: Position.Left,
    })

    expect(path).toContain('C')
    expect(path).not.toContain('L')
  })
})
