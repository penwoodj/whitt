export const loremIpsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

export const sampleReportMd = `# Graph Viz Libs: React Flow vs D3 vs Pixi vs Cytoscape

## Overview
Research comparing 4 graph viz libs for whitt's infinite canvas vision. Each has strengths/tradeoffs.

## React Flow

### Pros
- **React native**: Fits our stack (React 19 + Vite)
- **Great docs**: Well-maintained, active community
- **Node/edge model**: Built-in custom node types, edge labels
- **Zoom/pan**: Out-of-box infinite canvas navigation

### Cons
- **Scale limit**: ~5K nodes before perf degrades
- **SVG rendering**: DOM bloat at large scale

### When to Use
MVP, <5K nodes, interactive editors.

---

## D3.js

### Pros
- **Data-driven**: Declarative data joins
- **Force layouts**: Robust d3-force algorithm
- **D3 scales**: Easy zooming, coordinate transforms
- **Flexible**: SVG, Canvas, or WebGL backends

### Cons
- **Learning curve**: Complex API, steep ramp
- **Not React-native**: Needs react-d3-wrapper or custom hooks
- **Manual state**: No built-in node/edge components

### When to Use
Complex layouts, scientific viz, data-driven animations.

---

## Pixi.js

### Pros
- **WebGL renderer**: 100K+ nodes at 60fps
- **Fish-eye perf**: GPU-accelerated transforms
- **Sprite batching**: Efficient for many identical nodes
- **Input handling**: Touch + mouse + gesture events

### Cons
- **Not React-native**: Needs pixi-react wrapper
- **Lower-level**: Must implement own graph logic
- **Dev overhead**: More boilerplate than React Flow

### When to Use
100K+ nodes, fish-eye zoom, real-time updates.

---

## Cytoscape.js

### Pros
- **Graph algorithms**: BFS, DFS, shortest path, centrality
- **Layouts**: 20+ built-in (force, circle, grid, tree)
- **Cypher-like**: Style rules for graph elements
- **Export**: PNG, JSON, GraphML

### Cons
- **Scale limit**: ~10K nodes before perf degrades
- **Not React-native**: Needs react-cytoscapejs wrapper
- **Styling DSL**: Separate from JSX

### When to Use
Graph analysis, algorithms, complex layouts.

---

## Comparison Table

| Feature | React Flow | D3 | Pixi | Cytoscape |
|---------|-----------|-----|------|-----------|
| Max nodes | 5K | 50K | 100K+ | 10K |
| React native | ✅ | ❌ | ❌ | ❌ |
| WebGL | ❌ | Optional | ✅ | ❌ |
| Force layout | Plugin | ✅ | Manual | ✅ |
| Graph algos | ❌ | ❌ | ❌ | ✅ |
| Dev speed | Fast | Slow | Medium | Medium |

---

## Recommendation for Whitt

**Phase 1 (MVP-A)**: Use React Flow
- <5K nodes, focus on UX, fast iteration

**Phase 2 (Phase B/C)**: Add D3 for complex layouts
- Force-directed, geographic, custom layouts

**Phase 3 (Phase D+)**: Migrate to Pixi for scale
- 100K+ nodes, fish-eye zoom, swarm viz

**Hybrid approach**:
- React Flow for editor (<1K nodes)
- Pixi for overview (100K+ nodes)
- D3 for layout algorithms
- Cytoscape for graph analysis

---

## Code Examples

### React Flow Node
\`\`\`typescript
const CustomNode = ({ data }) => (
  <div style={{ padding: 10, border: '1px solid #ccc' }}>
    <div>{data.label}</div>
    <Handle type="target" position={Position.Top} />
    <Handle type="source" position={Position.Bottom} />
  </div>
)
\`\`\`

### D3 Force Layout
\`\`\`typescript
const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links))
  .force('charge', d3.forceManyBody())
  .force('center', d3.forceCenter(width / 2, height / 2))
\`\`\`

### Pixi Fish-Eye Transform
\`\`\`typescript
const transform = (x, y, focusX, focusY, zoomLevel) => {
  const dx = x - focusX
  const dy = y - focusY
  const dist = Math.sqrt(dx * dx + dy * dy)
  const scale = 1 + (zoomLevel - 1) * Math.exp(-dist / 100)
  return { x: focusX + dx * scale, y: focusY + dy * scale, scale }
}
\`\`\`

### Cytoscape Shortest Path
\`\`\`typescript
const dijkstra = cy.elements().dijkstra({
  root: '#start',
  weight: (edge) => edge.data('weight')
})
const pathToTarget = dijkstra.pathTo('#end')
\`\`\`

---

## Next Steps

1. Benchmark: Load 10K nodes, measure FPS
2. Prototype: Fish-eye zoom with Pixi
3. Test: Hybrid React Flow + Pixi approach
4. Evaluate: Performance vs dev overhead

---

## References
- [React Flow docs](https://reactflow.dev)
- [D3 gallery](https://observablehq.com/@d3/gallery)
- [Pixi examples](https://pixijs.io/examples)
- [Cytoscape docs](https://js.cytoscape.org)
`
