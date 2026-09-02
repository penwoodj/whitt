import dagre from '@dagrejs/dagre'
import type { Edge, Node as FlowNode, XYPosition } from '@xyflow/react'

export const DAG_DIRECTIONS = ['RIGHT', 'DOWN', 'LEFT'] as const
export type DagDirection = (typeof DAG_DIRECTIONS)[number]

type DagFormatInput = {
  readonly nodes: FlowNode[]
  readonly edges: readonly Edge[]
  readonly direction: DagDirection
  readonly selectedNodeIds: readonly string[]
}

type DagFormatResult = {
  readonly nodes: FlowNode[]
  readonly edges: readonly Edge[]
}

export class DagFormatCycleError extends Error {
  readonly nodeIds: readonly string[]

  constructor(nodeIds: readonly string[]) {
    super(`Selected graph contains directed cycle: ${nodeIds.join(', ')}`)
    this.name = 'DagFormatCycleError'
    this.nodeIds = nodeIds
  }
}

type LayoutNode = {
  readonly width: number
  readonly height: number
}

const getNodeDimension = (node: FlowNode): LayoutNode => ({
  width: node.measured?.width ?? node.width ?? 160,
  height: node.measured?.height ?? node.height ?? 80,
})

const assertNever = (value: never): never => {
  throw new Error(`Unexpected DAG direction: ${String(value)}`)
}

const getRankDirection = (direction: DagDirection): 'LR' | 'TB' | 'RL' => {
  switch (direction) {
    case 'RIGHT':
      return 'LR'
    case 'DOWN':
      return 'TB'
    case 'LEFT':
      return 'RL'
    default:
      return assertNever(direction)
  }
}

const findCycle = (nodeIds: readonly string[], edges: readonly Edge[]): readonly string[] => {
  const adjacency = new Map<string, readonly string[]>()
  const indegree = new Map(nodeIds.map((nodeId) => [nodeId, 0]))
  const neighbors = new Map<string, string[]>(nodeIds.map((nodeId) => [nodeId, []]))

  edges.forEach((edge) => {
    const sourceNeighbors = neighbors.get(edge.source)
    if (sourceNeighbors && indegree.has(edge.target)) {
      sourceNeighbors.push(edge.target)
      indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1)
    }
  })

  nodeIds.forEach((nodeId) => {
    adjacency.set(nodeId, neighbors.get(nodeId) ?? [])
  })
  const queue = nodeIds.filter((nodeId) => indegree.get(nodeId) === 0).sort()
  let visited = 0

  while (queue.length > 0) {
    const nodeId = queue.shift()
    if (!nodeId) continue
    visited += 1
    adjacency.get(nodeId)?.forEach((childId) => {
      const nextIndegree = (indegree.get(childId) ?? 0) - 1
      indegree.set(childId, nextIndegree)
      if (nextIndegree === 0) queue.push(childId)
    })
    queue.sort()
  }

  return visited === nodeIds.length ? [] : nodeIds.filter((nodeId) => (indegree.get(nodeId) ?? 0) > 0).sort()
}

const getOrigin = (nodes: readonly FlowNode[]): XYPosition => ({
  x: Math.min(...nodes.map((node) => node.position.x)),
  y: Math.min(...nodes.map((node) => node.position.y)),
})

const readLayoutPoint = (value: unknown): XYPosition => {
  if (typeof value === 'object' && value !== null && 'x' in value && 'y' in value && typeof value.x === 'number' && typeof value.y === 'number') {
    return { x: value.x, y: value.y }
  }
  throw new Error('Dagre returned invalid node position')
}

const getLayoutOrigin = (nodes: readonly FlowNode[], graph: dagre.graphlib.Graph): XYPosition => ({
  x: Math.min(...nodes.map((node) => readLayoutPoint(graph.node(node.id)).x - getNodeDimension(node).width / 2)),
  y: Math.min(...nodes.map((node) => readLayoutPoint(graph.node(node.id)).y - getNodeDimension(node).height / 2)),
})

export const formatSelectedDag = ({ nodes, edges, direction, selectedNodeIds }: DagFormatInput): DagFormatResult => {
  if (selectedNodeIds.length === 0) return { nodes, edges }

  const selectedIdSet = new Set(selectedNodeIds)
  const selectedNodes = nodes.filter((node) => selectedIdSet.has(node.id)).sort((left, right) => left.id.localeCompare(right.id))
  if (selectedNodes.length === 0) return { nodes, edges }

  const inducedEdges = edges.filter((edge) => selectedIdSet.has(edge.source) && selectedIdSet.has(edge.target))
  const cycleNodeIds = findCycle(selectedNodes.map((node) => node.id), inducedEdges)
  if (cycleNodeIds.length > 0) throw new DagFormatCycleError(cycleNodeIds)

  const graph = new dagre.graphlib.Graph().setGraph({ rankdir: getRankDirection(direction), nodesep: 48, ranksep: 96 }).setDefaultEdgeLabel(() => ({}))
  selectedNodes.forEach((node) => {
    const dimension = getNodeDimension(node)
    graph.setNode(node.id, dimension)
  })
  inducedEdges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target)
  })
  dagre.layout(graph)

  const origin = getOrigin(selectedNodes)
  const layoutOrigin = getLayoutOrigin(selectedNodes, graph)
  const positionById = new Map(selectedNodes.map((node) => {
    const point = readLayoutPoint(graph.node(node.id))
    return [node.id, { x: point.x - getNodeDimension(node).width / 2 - layoutOrigin.x + origin.x, y: point.y - getNodeDimension(node).height / 2 - layoutOrigin.y + origin.y }]
  }))

  return {
    nodes: nodes.map((node) => {
      const position = positionById.get(node.id)
      return position ? { ...node, position } : node
    }),
    edges,
  }
}
