---
name: cytoscape
description: >
  Cytoscape.js v3 for graph theory algorithms and complex layouts. Ideal for analyzing workflow
  dependencies, finding critical paths, detecting cycles, or applying pre-built layouts (cose,
  breadthfirst, circle). Use when you need graph algorithms beyond simple rendering.
---

## When to Use Cytoscape.js

Use Cytoscape.js for the Whitt graph UI when:
- Need graph theory algorithms (shortest path, centrality, community detection)
- Want pre-built layouts beyond force-directed (circular, hierarchical, concentric)
- Analyzing workflow dependencies and critical paths
- Detecting cycles in task graphs
- Computing node importance (degree, betweenness, closeness centrality)
- Need advanced graph queries and selectors
- Performance: 1,000-10,000 nodes (algorithm-heavy, not rendering-focused)

**VS other libraries:**
- **React Flow**: Use for interactive node/edge editing with React components
- **D3.js**: Use for custom visualizations or SVG/Canvas rendering
- **Pixi.js**: Use for WebGL performance at 100k+ nodes

## Installation

```bash
npm install cytoscape
npm install react-cytoscapejs
```

For TypeScript:
```bash
npm install -D @types/cytoscape
```

## Minimal Example (20 lines)

```tsx
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';

export default function WorkflowGraph() {
  const elements = [
    { data: { id: 'task1', label: 'Task 1' } },
    { data: { id: 'task2', label: 'Task 2' } },
    { data: { source: 'task1', target: 'task2', label: 'depends' } },
  ];

  const layout = { name: 'breadthfirst' };

  return (
    <CytoscapeComponent
      elements={elements}
      layout={layout}
      style={{ width: '800px', height: '600px' }}
    />
  );
}
```

## Core Concepts (Cytoscape.js v3)

- **Elements**: Nodes and edges in `{ data: { id, ... } }` format. Nodes and edges share the same structure.
- **Layouts**: Pre-built algorithms for positioning nodes. `cose` (force-directed), `breadthfirst`, `circle`, `concentric`, `grid`, `random`.
- **Selectors**: CSS-like selectors for querying nodes/edges. `node[status="FAILED"]`, `edge[weight > 5]`, `node:selected`.
- **Events**: Tap, drag, hover, box select. `cy.on('tap', 'node', ...)` for event binding.
- **Styles**: Graph stylesheet for visual appearance. Define per-selector styles (color, size, label).
- **Collections**: `cy.nodes()`, `cy.edges()`, `cy.filter()` for querying and manipulating graph elements.
- **Algorithms**: Built-in graph theory functions. `cy.elements().shortestPath()`, `cy.$().degree()`, `cy.$().betweenness()`.
- **Extensions**: Additional algorithms via plugins. `cytoscape-dagre`, `cytoscape-cola`, `cytoscape-fcose`.
- **Core Instance**: The `cy` object represents the entire graph. Access via `ref` in React.

## Whitt-Specific Patterns

### Mapping Whitt Concepts to Cytoscape.js

| Whitt Concept | Cytoscape.js Implementation |
|---------------|---------------------------|
| Workflow DAG | Directed graph with `cose-bilkent` layout |
| Task Dependencies | Edges with `weight` attribute |
| Critical Path Analysis | `shortestPath()` algorithm on weighted edges |
| Cycle Detection | `eles.aStar()` or custom DFS |
| Node Importance | Centrality algorithms (degree, betweenness) |
| Status Filtering | Selector: `node[status="FAILED"]` |
| Swarm Topology | Concentric layout by peer ID |

### Workflow DAG with COSE Layout

```tsx
import CytoscapeComponent from 'react-cytoscapejs';
import fcose from 'cytoscape-fcose';

cytoscape.use(fcose);

export default function WorkflowDAG({ data }: { data: any[] }) {
  const elements = data.flatMap(row => [
    { data: { id: row.n.id, label: row.n.name, status: row.n.status } },
    ...(row.r ? [{ data: { source: row.r.startElementId, target: row.r.endElementId } }] : []),
  ]);

  const layout = {
    name: 'fcose',
    quality: 'proof',
    animate: false,
    nodeDimensionsIncludeLabels: true,
    fit: true,
    padding: 50,
  };

  const stylesheet = [
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(label)',
        'font-size': '12px',
      },
    },
    {
      selector: 'node[status="FAILED"]',
      style: {
        'background-color': '#ff0000',
      },
    },
    {
      selector: 'node[status="SUCCESS"]',
      style: {
        'background-color': '#00ff00',
      },
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle',
      },
    },
  ];

  return (
    <CytoscapeComponent
      elements={elements}
      layout={layout}
      stylesheet={stylesheet}
      style={{ width: '100%', height: '600px' }}
    />
  );
}
```

### Critical Path Analysis

```tsx
function useCriticalPath(cy: cytoscape.Core) {
  useEffect(() => {
    if (!cy) return;

    const edges = cy.edges();
    const maxDuration = Math.max(...edges.map(e => e.data('duration') || 1));
    edges.forEach(edge => {
      const weight = maxDuration - (edge.data('duration') || 1);
      edge.data('weight', weight);
    });

    const startNode = cy.nodes('[type="start"]');
    const endNode = cy.nodes('[type="end"]');

    if (startNode.length > 0 && endNode.length > 0) {
      const path = startNode.shortestPathTo(endNode, {
        weight: edge => edge.data('weight'),
      });

      path.path().style('line-color', '#ff0000');
      path.path().style('width', 4);
    }
  }, [cy]);
}
```

### Cycle Detection

```tsx
function detectCycles(cy: cytoscape.Core): boolean {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function hasCycle(node: cytoscape.NodeSingular): boolean {
    const id = node.id();

    if (recursionStack.has(id)) return true;
    if (visited.has(id)) return false;

    visited.add(id);
    recursionStack.add(id);

    const neighbors = node.outgoers().nodes();
    for (const neighbor of neighbors) {
      if (hasCycle(neighbor)) return true;
    }

    recursionStack.delete(id);
    return false;
  }

  const sources = cy.nodes().filter(node => node.indegree() === 0);
  return sources.some(node => hasCycle(node));
}
```

### Node Centrality Analysis

```tsx
function analyzeCentrality(cy: cytoscape.Core) {
  const nodes = cy.nodes();

  const results = nodes.map(node => ({
    id: node.id(),
    degree: node.degree(),
    inDegree: node.indegree(),
    outDegree: node.outdegree(),
    betweenness: node.betweennessCentrality({ directed: true }),
  }));

  const sorted = results.sort((a, b) => b.betweenness - a.betweenness);
  return sorted.slice(0, 10); // Top 10 most important nodes
}
```

### Neo4j Integration

```tsx
function mapCypherToCytoscape(cypherResult: any[]) {
  const elements: any[] = [];

  const nodeIds = new Set<string>();

  cypherResult.forEach(row => {
    if (row.n) {
      const nodeId = row.n.id;
      if (!nodeIds.has(nodeId)) {
        elements.push({
          data: {
            id: nodeId,
            label: row.n.name,
            status: row.n.status,
            type: row.n.type,
          },
        });
        nodeIds.add(nodeId);
      }
    }

    if (row.r) {
      elements.push({
        data: {
          id: `${row.r.startElementId}-${row.r.endElementId}`,
          source: row.r.startElementId,
          target: row.r.endElementId,
          relationship: row.r.type,
        },
      });
    }
  });

  return elements;
}
```

## Performance Ceiling

- **1,000 nodes**: Fast, all algorithms run in <1s
- **5,000 nodes**: Good performance, layout takes 1-3s
- **10,000 nodes**: Slower, layout takes 5-10s, consider simplifying graph
- **Memory**: ~5KB per node (includes algorithm overhead)

## Fish-Eye / Zoom Patterns

### Built-in Zoom/Pan

```tsx
import { useRef } from 'react';

function CytoscapeZoom({ elements }: { elements: any[] }) {
  const cyRef = useRef<cytoscape.Core>();

  const handleZoomIn = () => {
    cyRef.current?.zoom(cyRef.current.zoom() * 1.2);
  };

  const handleZoomOut = () => {
    cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  };

  const handleFit = () => {
    cyRef.current?.fit(undefined, 50);
  };

  return (
    <div>
      <div>
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
        <button onClick={handleFit}>Fit</button>
      </div>
      <CytoscapeComponent
        cy={(cy) => { cyRef.current = cy; }}
        elements={elements}
        style={{ width: '100%', height: '500px' }}
      />
    </div>
  );
}
```

### Custom Fish-Eye with Node Sizing

```tsx
function applyFishEye(cy: cytoscape.Core, cursor: { x: number, y: number }) {
  const radius = 100;
  const maxScale = 2.0;

  cy.nodes().forEach(node => {
    const pos = node.position();
    const distance = Math.sqrt(
      Math.pow(pos.x - cursor.x, 2) + Math.pow(pos.y - cursor.y, 2)
    );

    let scale = 1.0;
    if (distance < radius) {
      scale = 1.0 + (maxScale - 1.0) * (1 - distance / radius);
    }

    node.style('width', `${20 * scale}px`);
    node.style('height', `${20 * scale}px`);
    node.style('font-size', `${12 * scale}px`);
  });
}
```

## Anti-Patterns

1. **NOT using React wrapper incorrectly**: Don't try to access `cy` before it's initialized. Use the `cy` prop callback or `useEffect`.

2. **NOT ignoring layout performance**: Complex layouts like `cose` are slow. Test with realistic data before committing to a layout.

3. **NOT mutating elements directly**: Use `cy.add()`, `cy.remove()`, or element methods. Direct mutation breaks Cytoscape's internal state.

4. **NOT running algorithms on every render**: Graph algorithms are expensive. Memoize results or run on user interaction.

5. **NOT mixing graph types**: Cytoscape handles directed/undirected/mixed graphs. Pick one and stick to it for consistency.

## React + Cytoscape Integration

### Using react-cytoscapejs

```tsx
import CytoscapeComponent from 'react-cytoscapejs';

function GraphComponent({ data }: { data: any[] }) {
  const [cy, setCy] = useState<cytoscape.Core | null>(null);

  useEffect(() => {
    if (!cy) return;

    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      console.log('Tapped node:', node.id());
    });

    return () => {
      cy.removeAllListeners();
    };
  }, [cy]);

  return (
    <CytoscapeComponent
      cy={setCy}
      elements={data}
      layout={{ name: 'cose' }}
      style={{ width: '100%', height: '600px' }}
    />
  );
}
```

## Common Gotchas

- **TypeScript**: `@types/cytoscape` is required. The `cy` object type is `cytoscape.Core`.
- **React 19**: `react-cytoscapejs` supports React 19. No migration needed.
- **Memory Leaks**: Always remove event listeners in `useEffect` cleanup.
- **Layout Convergence**: Some layouts (cose) may not converge. Set `animate: false` for reproducible results.
- **Element IDs**: Must be unique strings. Numbers are converted to strings automatically.

## Available Layouts

| Layout | Best For | Directed? |
|--------|----------|-----------|
| `cose` | General force-directed | No |
| `fcose` | Fast force-directed | No |
| `breadthfirst` | Hierarchical/trees | Yes |
| `circle` | Circular clusters | No |
| `concentric` | Radial by metric | No |
| `grid` | Regular grids | No |
| `random` | Initial positioning | No |

Last updated: 2026-08-08
