import type { Node as FlowNode, Edge } from 'reactflow'
import type { NodeData } from '../features/node/nodeTypes'
import { log } from './logger'

type FsNodeStatus = 'leaf' | 'expanded' | 'done'

type FsNode = {
  id: string
  title: string
  parent: string | null
  children: string[]
  slug: string
  path: string
  bodyMarkdown: string
  status: FsNodeStatus
}

type GraphData = {
  nodes: FsNode[]
  edges: { source: string; target: string; kind: 'PRODUCED' }[]
}

type ProjectId = 'ai-frameworks' | 'local-first' | 'whitt-arch'

const fsLog = log('fsGraphLoader')

function parseMd(raw: string, slug: string, path: string): FsNode {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) {
    throw new Error(`Invalid md: ${path}`)
  }

  const [, yaml, body] = match
  const fields = parseYaml(yaml)

  return {
    id: fields.id || `node-${Date.now()}-${Math.random()}`,
    title: fields.title || 'Untitled',
    parent: fields.parent || null,
    children: Array.isArray(fields.children) ? fields.children : [],
    slug,
    path,
    bodyMarkdown: body.trim(),
    status: fields.status || 'leaf'
  }
}

function parseYaml(yaml: string): Record<string, any> {
  const result: Record<string, any> = {}
  const lines = yaml.split('\n')
  
  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.*)$/)
    if (match) {
      const [, key, value] = match
      if (value.startsWith('[') && value.endsWith(']')) {
        result[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, ''))
      } else if (value === 'null' || value === '') {
        result[key] = null
      } else if (value === 'true') {
        result[key] = true
      } else if (value === 'false') {
        result[key] = false
      } else if (!isNaN(Number(value))) {
        result[key] = Number(value)
      } else {
        result[key] = value.replace(/^["']|["']$/g, '')
      }
    }
  }
  
  return result
}

function buildGraphData(nodes: FsNode[]): GraphData {
  const nodeMap = new Map<string, FsNode>()
  nodes.forEach(node => {
    nodeMap.set(node.id, node)
  })

  const edges: GraphData['edges'] = []

  nodes.forEach(node => {
    node.children.forEach(childPath => {
      const childNode = nodes.find(n => n.path === childPath)
      if (childNode) {
        edges.push({
          source: node.id,
          target: childNode.id,
          kind: 'PRODUCED'
        })
      }
    })
  })

  return { nodes, edges }
}

function convertToFlowNodes(graphData: GraphData): {
  nodes: FlowNode[]
  edges: Edge[]
} {
  const nodePositions = calculateRadialLayout(graphData.nodes)

  const flowNodes: FlowNode[] = graphData.nodes.map(fsNode => {
    const position = nodePositions.get(fsNode.id) || { x: 0, y: 0 }
    
    return {
      id: fsNode.id,
      type: 'custom',
      position,
      data: {
        id: fsNode.id,
        title: fsNode.title,
        status: fsNode.status === 'done' ? 'done' : 'idle',
        type: 'task',
        lifecycle: fsNode.status === 'done' ? 'done' : 'initial',
        nodeViewState: 'collapsed',
        focused: false,
        promptTxt: '',
        todos: [],
        lastUpdate: null,
        detailExpanded: false,
        todosExpanded: false,
        isRec: false,
        isCycleRun: false,
        bodyMarkdown: fsNode.bodyMarkdown
      } as NodeData
    }
  })

  const flowEdges: Edge[] = graphData.edges.map(edge => ({
    id: `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    type: 'smoothstep',
    data: { kind: edge.kind }
  }))

  return { nodes: flowNodes, edges: flowEdges }
}

function calculateRadialLayout(nodes: FsNode[]): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>()
  const rootNodes = nodes.filter(n => !n.parent)
  
  if (rootNodes.length === 0) {
    nodes.forEach(node => {
      positions.set(node.id, { x: Math.random() * 800 - 400, y: Math.random() * 600 - 300 })
    })
    return positions
  }

  rootNodes.forEach((root, rootIndex) => {
    const rootAngle = (rootIndex / rootNodes.length) * 2 * Math.PI
    positions.set(root.id, { x: Math.cos(rootAngle) * 100, y: Math.sin(rootAngle) * 100 })

    const children = nodes.filter(n => n.parent === root.path)
    children.forEach((child, childIndex) => {
      const childAngle = (childIndex / children.length) * 2 * Math.PI
      const childRadius = 250
      positions.set(child.id, {
        x: positions.get(root.id)!.x + Math.cos(childAngle) * childRadius,
        y: positions.get(root.id)!.y + Math.sin(childAngle) * childRadius
      })

      const grandchildren = nodes.filter(n => n.parent === child.path)
      grandchildren.forEach((grandchild, gcIndex) => {
        const gcAngle = (gcIndex / grandchildren.length) * 2 * Math.PI
        const gcRadius = 200
        positions.set(grandchild.id, {
          x: positions.get(child.id)!.x + Math.cos(gcAngle) * gcRadius,
          y: positions.get(child.id)!.y + Math.sin(gcAngle) * gcRadius
        })
      })
    })
  })

  return positions
}

export async function loadProjectGraph(projectId: ProjectId): Promise<{
  nodes: FlowNode[]
  edges: Edge[]
}> {
  fsLog.info('Loading project graph', { projectId })

  let rawData: { [key: string]: string } = {}

  try {
    switch (projectId) {
      case 'ai-frameworks':
        rawData = await importAiFrameworksData()
        break
      case 'local-first':
        rawData = await importLocalFirstData()
        break
      case 'whitt-arch':
        rawData = await importWhittArchData()
        break
      default:
        throw new Error(`Unknown project ID: ${projectId}`)
    }

    const fsNodes: FsNode[] = []
    
    for (const [path, content] of Object.entries(rawData)) {
      const slug = path.replace(/\.md$/, '').split('/').pop() || 'unknown'
      try {
        const fsNode = parseMd(content, slug, path)
        fsNodes.push(fsNode)
      } catch (error) {
        fsLog.warn('Failed to parse markdown', { path, error })
      }
    }

    const graphData = buildGraphData(fsNodes)
    const flowData = convertToFlowNodes(graphData)

    fsLog.info('Project graph loaded successfully', {
      projectId,
      nodeCount: flowData.nodes.length,
      edgeCount: flowData.edges.length
    })

    return flowData
  } catch (error) {
    fsLog.error('Failed to load project graph', { projectId, error })
    throw error
  }
}

async function importAiFrameworksData(): Promise<{ [key: string]: string }> {
  const modules = await Promise.all([
    import('../data/sample-projects/ai-frameworks-research/index.md?raw'),
    import('../data/sample-projects/ai-frameworks-research/langchain-deep-dive/index.md?raw'),
    import('../data/sample-projects/ai-frameworks-research/langchain-deep-dive/langgraph.md?raw'),
    import('../data/sample-projects/ai-frameworks-research/langchain-deep-dive/langsmith.md?raw'),
    import('../data/sample-projects/ai-frameworks-research/llama-index-deep-dive/index.md?raw'),
    import('../data/sample-projects/ai-frameworks-research/llama-index-deep-dive/data-connectors.md?raw'),
    import('../data/sample-projects/ai-frameworks-research/llama-index-deep-dive/retrieval-patterns.md?raw'),
    import('../data/sample-projects/ai-frameworks-research/autogpt-exploration/index.md?raw'),
    import('../data/sample-projects/ai-frameworks-research/autogpt-exploration/plugin-ecosystem.md?raw'),
    import('../data/sample-projects/ai-frameworks-research/autogpt-exploration/limitations.md?raw')
  ])

  return {
    'ai-frameworks-research/index.md': modules[0].default,
    'ai-frameworks-research/langchain-deep-dive/index.md': modules[1].default,
    'ai-frameworks-research/langchain-deep-dive/langgraph.md': modules[2].default,
    'ai-frameworks-research/langchain-deep-dive/langsmith.md': modules[3].default,
    'ai-frameworks-research/llama-index-deep-dive/index.md': modules[4].default,
    'ai-frameworks-research/llama-index-deep-dive/data-connectors.md': modules[5].default,
    'ai-frameworks-research/llama-index-deep-dive/retrieval-patterns.md': modules[6].default,
    'ai-frameworks-research/autogpt-exploration/index.md': modules[7].default,
    'ai-frameworks-research/autogpt-exploration/plugin-ecosystem.md': modules[8].default,
    'ai-frameworks-research/autogpt-exploration/limitations.md': modules[9].default
  }
}

async function importLocalFirstData(): Promise<{ [key: string]: string }> {
  const modules = await Promise.all([
    import('../data/sample-projects/local-first-essay/index.md?raw'),
    import('../data/sample-projects/local-first-essay/crdt-foundations/index.md?raw'),
    import('../data/sample-projects/local-first-essay/crdt-foundations/yjs.md?raw'),
    import('../data/sample-projects/local-first-essay/crdt-foundations/automerge.md?raw'),
    import('../data/sample-projects/local-first-essay/sync-strategies/index.md?raw'),
    import('../data/sample-projects/local-first-essay/sync-strategies/peer-to-peer.md?raw'),
    import('../data/sample-projects/local-first-essay/sync-strategies/server-relay.md?raw'),
    import('../data/sample-projects/local-first-essay/ownership-and-portability/index.md?raw'),
    import('../data/sample-projects/local-first-essay/ownership-and-portability/data-export.md?raw')
  ])

  return {
    'local-first-essay/index.md': modules[0].default,
    'local-first-essay/crdt-foundations/index.md': modules[1].default,
    'local-first-essay/crdt-foundations/yjs.md': modules[2].default,
    'local-first-essay/crdt-foundations/automerge.md': modules[3].default,
    'local-first-essay/sync-strategies/index.md': modules[4].default,
    'local-first-essay/sync-strategies/peer-to-peer.md': modules[5].default,
    'local-first-essay/sync-strategies/server-relay.md': modules[6].default,
    'local-first-essay/ownership-and-portability/index.md': modules[7].default,
    'local-first-essay/ownership-and-portability/data-export.md': modules[8].default
  }
}

async function importWhittArchData(): Promise<{ [key: string]: string }> {
  const modules = await Promise.all([
    import('../data/sample-projects/whitt-architecture/index.md?raw'),
    import('../data/sample-projects/whitt-architecture/graph-ui-slice/index.md?raw'),
    import('../data/sample-projects/whitt-architecture/graph-ui-slice/voice-composer.md?raw'),
    import('../data/sample-projects/whitt-architecture/graph-ui-slice/reactflow-canvas.md?raw'),
    import('../data/sample-projects/whitt-architecture/execution-engine-slice/index.md?raw'),
    import('../data/sample-projects/whitt-architecture/execution-engine-slice/yaml-workflows.md?raw'),
    import('../data/sample-projects/whitt-architecture/execution-engine-slice/hooks-system.md?raw'),
    import('../data/sample-projects/whitt-architecture/queue-orchestration-slice/index.md?raw'),
    import('../data/sample-projects/whitt-architecture/queue-orchestration-slice/10-state-lifecycle.md?raw'),
    import('../data/sample-projects/whitt-architecture/queue-orchestration-slice/priority-algorithms.md?raw')
  ])

  return {
    'whitt-architecture/index.md': modules[0].default,
    'whitt-architecture/graph-ui-slice/index.md': modules[1].default,
    'whitt-architecture/graph-ui-slice/voice-composer.md': modules[2].default,
    'whitt-architecture/graph-ui-slice/reactflow-canvas.md': modules[3].default,
    'whitt-architecture/execution-engine-slice/index.md': modules[4].default,
    'whitt-architecture/execution-engine-slice/yaml-workflows.md': modules[5].default,
    'whitt-architecture/execution-engine-slice/hooks-system.md': modules[6].default,
    'whitt-architecture/queue-orchestration-slice/index.md': modules[7].default,
    'whitt-architecture/queue-orchestration-slice/10-state-lifecycle.md': modules[8].default,
    'whitt-architecture/queue-orchestration-slice/priority-algorithms.md': modules[9].default
  }
}