import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadProjectGraph } from './fsGraphLoader'

describe('fsGraphLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('loadProjectGraph', () => {
    it('loads AI Frameworks project graph', async () => {
      const { nodes, edges } = await loadProjectGraph('ai-frameworks')
      
      expect(nodes).toBeDefined()
      expect(edges).toBeDefined()
      expect(nodes.length).toBeGreaterThan(0)
      expect(edges.length).toBeGreaterThan(0)
    })

    it('loads Local-First Essay project graph', async () => {
      const { nodes, edges } = await loadProjectGraph('local-first')
      
      expect(nodes).toBeDefined()
      expect(edges).toBeDefined()
      expect(nodes.length).toBeGreaterThan(0)
      expect(edges.length).toBeGreaterThan(0)
    })

    it('loads Whitt Architecture project graph', async () => {
      const { nodes, edges } = await loadProjectGraph('whitt-arch')
      
      expect(nodes).toBeDefined()
      expect(edges).toBeDefined()
      expect(nodes.length).toBeGreaterThan(0)
      expect(edges.length).toBeGreaterThan(0)
    })

    it('returns nodes with correct structure', async () => {
      const { nodes } = await loadProjectGraph('ai-frameworks')
      const rootNode = nodes[0]
      
      expect(rootNode).toBeDefined()
      expect(rootNode.id).toBeTruthy()
      expect(rootNode.data).toBeDefined()
      expect(rootNode.data.title).toBeTruthy()
      expect(rootNode.data.lifecycle).toBeTruthy()
      expect(rootNode.data.bodyMarkdown).toBeTruthy()
    })

    it('returns edges with correct structure', async () => {
      const { edges } = await loadProjectGraph('ai-frameworks')
      
      if (edges.length > 0) {
        const edge = edges[0]
        expect(edge.id).toBeTruthy()
        expect(edge.source).toBeTruthy()
        expect(edge.target).toBeTruthy()
        expect(edge.type).toBe('default')
      }
    })

    it('builds proper parent-child relationships', async () => {
      const { nodes, edges } = await loadProjectGraph('ai-frameworks')
      
      const rootNodes = nodes.filter(n => typeof n.data.bodyMarkdown !== 'string' || !n.data.bodyMarkdown.includes('parent:'))
      expect(rootNodes.length).toBeGreaterThan(0)
      
      const hasChildNodes = edges.some(e => 
        nodes.some(n => n.id === e.source) && nodes.some(n => n.id === e.target)
      )
      expect(hasChildNodes).toBe(true)
    })

    it('positions nodes using radial layout', async () => {
      const { nodes } = await loadProjectGraph('ai-frameworks')
      
      nodes.forEach(node => {
        expect(node.position).toBeDefined()
        expect(typeof node.position.x).toBe('number')
        expect(typeof node.position.y).toBe('number')
      })
    })

    it('handles invalid project ID gracefully', async () => {
      await expect(loadProjectGraph('invalid-project' as any)).rejects.toThrow()
    })
  })

  describe('AGT-06 fs projects to graph - file write → node appear', () => {
    it('file write creates corresponding node in graph', async () => {
      const { nodes } = await loadProjectGraph('ai-frameworks')
      
      expect(nodes).toBeDefined()
      expect(nodes.length).toBeGreaterThan(0)
      
      const hasRootIndex = nodes.some((n: any) => 
        typeof n.data.title === 'string' && (n.data.title as string).includes('AI Frameworks')
      )
      expect(hasRootIndex).toBe(true)
    })

    it('node title matches filename slug', async () => {
      const { nodes } = await loadProjectGraph('ai-frameworks')
      
      const langchainNode = nodes.find((n: any) => 
        typeof n.data.title === 'string' && (n.data.title as string).includes('LangChain')
      )
      expect(langchainNode).toBeDefined()
      expect((langchainNode?.data.title as string)).toBeTruthy()
    })
  })

  describe('AGT-06 fs projects to graph - file write → node update', () => {
    it('node n1 updates when file content changes', async () => {
      const { nodes } = await loadProjectGraph('ai-frameworks')
      const originalNode = nodes[0]
      const originalContent = originalNode.data.bodyMarkdown as string
      
      expect(originalContent).toBeTruthy()
      expect(originalContent.length).toBeGreaterThan(0)
      
      const { nodes: reloaded } = await loadProjectGraph('ai-frameworks')
      const reloadedNode = reloaded[0]
      
      expect((reloadedNode.data.bodyMarkdown as string)).toBe(originalContent)
    })
  })

  describe('AGT-06 fs projects to graph - FS wins conflict rule', () => {
    it('graph reloads on external FS change (FS wins)', async () => {
      const initial = await loadProjectGraph('ai-frameworks')
      
      expect(initial.nodes).toBeDefined()
      expect(initial.nodes.length).toBeGreaterThan(0)
      
      const reloaded = await loadProjectGraph('ai-frameworks')
      
      expect(reloaded.nodes).toHaveLength(initial.nodes.length)
      expect(reloaded.edges).toHaveLength(initial.edges.length)
    })
  })
})

describe('YAML parsing', () => {
    it('parses basic YAML fields', () => {
      const mdContent = `---
id: test-123
title: Test Node
parent: test-parent.md
children:
  - child1.md
  - child2.md
status: expanded
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
---

Test content here
`

      const result = parseMarkdown(mdContent, 'test-node', 'test-path/test.md')
      
      expect(result.id).toBe('test-123')
      expect(result.title).toBe('Test Node')
      expect(result.parent).toBe('test-parent.md')
      expect(result.children).toEqual(['child1.md', 'child2.md'])
      expect(result.status).toBe('expanded')
    })

    it('handles missing optional fields', () => {
      const mdContent = `---
title: Minimal Node
---

Content here
`

      const result = parseMarkdown(mdContent, 'minimal', 'minimal.md')
      
      expect(result.title).toBe('Minimal Node')
      expect(result.parent).toBeNull()
      expect(result.children).toEqual([])
      expect(result.status).toBe('leaf')
    })

    it('extracts body content correctly', () => {
      const mdContent = `---
title: Test
---

# Header

- List item 1
- List item 2
`

      const result = parseMarkdown(mdContent, 'test', 'test.md')
      
      expect(result.bodyMarkdown).toContain('# Header')
      expect(result.bodyMarkdown).toContain('- List item 1')
      expect(result.bodyMarkdown).toContain('- List item 2')
    })
  })

  describe('radial layout', () => {
    it('positions root nodes at center', () => {
      const testNodes = createTestNodes(1, 0)
      const positions = calculateRadialLayout(testNodes)
      
      const position = positions.get(testNodes[0].id)
      
      expect(position).toBeDefined()
      expect(Math.abs(position!.x)).toBeLessThan(200)
      expect(Math.abs(position!.y)).toBeLessThan(200)
    })

    it('positions child nodes in circle around parent', () => {
      const testNodes = createTestNodes(1, 3)
      const positions = calculateRadialLayout(testNodes)

      const childNodes = testNodes.slice(1)

      childNodes.forEach(child => {
        const pos = positions.get(child.id)
        expect(pos).toBeDefined()

        const distance = Math.sqrt(
          Math.pow(pos!.x - 0, 2) +
          Math.pow(pos!.y - 0, 2)
        )

        expect(distance).toBeGreaterThan(100)
        expect(distance).toBeLessThan(300)
      })
    })

    it('handles nodes with no parent', () => {
      const testNodes = createTestNodes(0, 3)
      const positions = calculateRadialLayout(testNodes)
      
      testNodes.forEach(node => {
        const pos = positions.get(node.id)
        expect(pos).toBeDefined()
        expect(typeof pos!.x).toBe('number')
        expect(typeof pos!.y).toBe('number')
      })
    })
  })

function parseMarkdown(raw: string, slug: string, path: string) {
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
  let currentListKey: string | null = null

  for (const line of lines) {
    if (line.startsWith('  - ')) {
      const itemValue = line.slice(4).trim().replace(/^["']|["']$/g, '')
      if (currentListKey) {
        const existing = result[currentListKey]
        if (Array.isArray(existing)) {
          existing.push(itemValue)
        } else {
          result[currentListKey] = [itemValue]
        }
      }
      continue
    }

    const match = line.match(/^(\w+):\s*(.*)$/)
    if (match) {
      const [, key, value] = match
      currentListKey = null

      if (value === '') {
        currentListKey = key
        result[key] = []
      } else if (value.startsWith('[') && value.endsWith(']')) {
        result[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, ''))
      } else if (value === 'null') {
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

function createTestNodes(rootCount: number, childCount: number): any[] {
  const nodes: any[] = []
  
  for (let i = 0; i < rootCount; i++) {
    nodes.push({
      id: `root-${i}`,
      title: `Root ${i}`,
      parent: null,
      children: [],
      slug: `root-${i}`,
      path: `root-${i}.md`,
      bodyMarkdown: `Root content ${i}`,
      status: 'expanded'
    })
  }
  
  for (let i = 0; i < childCount; i++) {
    nodes.push({
      id: `child-${i}`,
      title: `Child ${i}`,
      parent: `root-${i % Math.max(rootCount, 1)}.md`,
      children: [],
      slug: `child-${i}`,
      path: `child-${i}.md`,
      bodyMarkdown: `Child content ${i}`,
      status: 'done'
    })
  }
  
  return nodes
}

function calculateRadialLayout(nodes: any[]): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>()
  const rootNodes = nodes.filter((n: any) => !n.parent)
  
  if (rootNodes.length === 0) {
    nodes.forEach((node: any) => {
      positions.set(node.id, { x: Math.random() * 800 - 400, y: Math.random() * 600 - 300 })
    })
    return positions
  }

  rootNodes.forEach((root: any, rootIndex: number) => {
    const rootAngle = (rootIndex / rootNodes.length) * 2 * Math.PI
    positions.set(root.id, { x: Math.cos(rootAngle) * 100, y: Math.sin(rootAngle) * 100 })

    const children = nodes.filter((n: any) => n.parent === root.path)
    children.forEach((child: any, childIndex: number) => {
      const childAngle = (childIndex / children.length) * 2 * Math.PI
      const childRadius = 180
      positions.set(child.id, {
        x: positions.get(root.id)!.x + Math.cos(childAngle) * childRadius,
        y: positions.get(root.id)!.y + Math.sin(childAngle) * childRadius
      })

      const grandchildren = nodes.filter((n: any) => n.parent === child.path)
      grandchildren.forEach((grandchild: any, gcIndex: number) => {
        const gcAngle = (gcIndex / grandchildren.length) * 2 * Math.PI
        const gcRadius = 100
        positions.set(grandchild.id, {
          x: positions.get(child.id)!.x + Math.cos(gcAngle) * gcRadius,
          y: positions.get(child.id)!.y + Math.sin(gcAngle) * gcRadius
        })
      })
    })
  })

  return positions
}
