---
name: d3-graphics
description: >
  D3.js v7 for custom graph layouts, charts, and data visualization. Ideal for non-React DOM rendering,
  custom force-directed layouts, or when you need full control over SVG/Canvas elements. Use for
  custom visualizations, complex layouts, or when React Flow's node system is too restrictive.
---

## When to Use D3.js

Use D3.js for the Whitt graph UI when:
- Building custom force-directed layouts beyond React Flow's capabilities
- Rendering charts, heatmaps, or statistical visualizations
- Need fine-grained control over SVG/Canvas elements
- Creating non-standard graph visualizations (circular, hierarchical, geographic)
- Performance: 100-10,000 nodes (SVG), 1,000-100,000 nodes (Canvas)
- Want enter/update/exit pattern for animated transitions
- Need custom scales, axes, or color schemes

**VS other libraries:**
- **React Flow**: Use for standard node/edge graphs with React components
- **Pixi.js**: Use for WebGL performance at 100k+ nodes
- **Cytoscape.js**: Use for graph-theory algorithms or pre-built layouts

## Installation

```bash
npm install d3
npm install -D @types/d3
```

## Minimal Example (20 lines)

```tsx
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function ForceGraph({ data }: { data: { nodes: any[], links: any[] } }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(400, 300));

    simulation.on('tick', () => {
      svg.selectAll('.link').attr('d', (d: any) => `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`);
      svg.selectAll('.node').attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });
  }, [data]);

  return <svg ref={svgRef} width={800} height={600} />;
}
```

## Core Concepts (D3.js v7)

- **Selections**: `d3.select()` and `d3.selectAll()` for DOM manipulation. Use refs in React, not direct selection.
- **Enter/Update/Exit**: Pattern for handling dynamic data. `data().enter().append()`, `merge()`, `exit().remove()`.
- **Scales**: `scaleLinear`, `scaleOrdinal`, `scaleBand` for mapping data to visual attributes (position, color, size).
- **Axes**: `axisBottom`, `axisLeft` for chart axes with ticks and labels.
- **Shapes**: `line`, `area`, `arc`, `symbol` for generating SVG path data.
- **Transitions**: `transition()`, `duration()`, `ease()` for animated state changes.
- **Force Simulation**: `forceSimulation`, `forceLink`, `forceManyBody`, `forceCenter`, `forceCollide` for force-directed layouts.
- **Hierarchies**: `hierarchy()`, `tree()`, `cluster()`, `pack()`, `partition()` for tree/cluster layouts.
- **Geo**: `geoPath`, `geoMercator`, `geoOrthographic` for geographic visualizations (swarm topology).

## Whitt-Specific Patterns

### Mapping Whitt Concepts to D3.js

| Whitt Concept | D3.js Implementation |
|---------------|---------------------|
| Workflow DAG | Force-directed layout with `forceLink` for dependencies |
| Task Queue | Circular layout or timeline view |
| Swarm Topology | Geographic projection (Orange Pi Zero 3W locations) |
| Token Metrics | Line chart or area chart over time |
| Hook Events | Animated transitions on edge changes |
| Status Distribution | Pie chart or donut chart (PENDING/RUNNING/SUCCESS/FAILED) |
| Performance Heatmap | Rectangular heatmap with color scale |

### Force-Directed Workflow Graph

```tsx
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node { id: string; status: string; [key: string]: any }
interface Link { source: string; target: string; type: string }

export default function WorkflowForceGraph({ nodes, links }: { nodes: Node[], links: Link[] }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800, height = 600;

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(30));

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-width', 2);

    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 20)
      .attr('fill', (d: any) => {
        const colors = { PENDING: '#gray', RUNNING: '#blue', SUCCESS: '#green', FAILED: '#red' };
        return colors[d.status] || '#gray';
      });

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
    });

    return () => simulation.stop();
  }, [nodes, links]);

  return <svg ref={svgRef} width={800} height={600} />;
}
```

### Scales for Whitt Metrics

```tsx
import { scaleLinear, scaleOrdinal } from 'd3';

const tokenScale = scaleLinear()
  .domain([0, 1000, 10000])
  .range(['#lightblue', '#blue', '#darkblue']);

const statusScale = scaleOrdinal()
  .domain(['PENDING', 'RUNNING', 'SUCCESS', 'FAILED'])
  .range(['#gray', '#blue', '#green', '#red']);

const timeScale = scaleLinear()
  .domain([0, 60, 300, 1800]) // 0s, 1min, 5min, 30min
  .range(['#green', '#yellow', '#orange', '#red']);
```

### Enter/Update/Exit for Dynamic Workflows

```tsx
useEffect(() => {
  const svg = d3.select(svgRef.current);

  const node = svg.selectAll('.node')
    .data(nodes, (d: any) => d.id);

  node.enter()
    .append('circle')
    .attr('class', 'node')
    .attr('r', 0)
    .transition()
    .duration(500)
    .attr('r', 20);

  node.transition()
    .duration(300)
    .attr('fill', (d: any) => statusScale(d.status));

  node.exit()
    .transition()
    .duration(500)
    .attr('r', 0)
    .remove();
}, [nodes]);
```

### Neo4j Integration

```tsx
function mapCypherToD3(cypherResult: any[]) {
  const nodes = cypherResult.map(row => ({
    id: row.n.id,
    status: row.n.status,
    group: row.n.type,
  }));

  const links = cypherResult
    .filter(row => row.r)
    .map(row => ({
      source: row.r.startElementId,
      target: row.r.endElementId,
      value: 1,
    }));

  return { nodes, links };
}
```

## Performance Ceiling

- **SVG rendering**: 100-10,000 nodes (DOM overhead limits scale)
- **Canvas rendering**: 1,000-100,000 nodes (no DOM, raster rendering)
- **Force simulation**: 100-5,000 nodes (O(n²) complexity)
- **Memory**: ~1KB per node (SVG), ~100B per node (Canvas)

## Fish-Eye / Zoom Patterns

### D3 Zoom Behavior

```tsx
import { zoom, zoomIdentity } from 'd3';

useEffect(() => {
  const svg = d3.select(svgRef.current);
  const g = svg.append('g');

  const zoomBehavior = zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

  svg.call(zoomBehavior as any);
}, []);
```

### Fish-Eye Distortion

```tsx
import { fisheye } from 'd3-fisheye';

useEffect(() => {
  const fisheyeScale = fisheye()
    .radius(200)
    .distortion(3);

  svg.selectAll('.node')
    .attr('cx', (d: any) => fisheyeScale({ x: d.x, y: d.y }).x)
    .attr('cy', (d: any) => fisheyeScale({ x: d.x, y: d.y }).y)
    .attr('r', (d: any) => {
      const distorted = fisheyeScale({ x: d.x, y: d.y });
      return distorted.r * 2;
    });
}, []);
```

## Anti-Patterns

1. **NOT using React refs for D3 selections**: Don't use `d3.select('.my-class')` directly in React. Use `useRef` to select the SVG/container once.

2. **NOT creating simulations on every render**: Move `d3.forceSimulation` outside the component or use `useMemo` to avoid re-creating on every render.

3. **NOT ignoring cleanup**: Always stop simulations and remove event listeners in `useEffect` cleanup.

4. **NOT mixing D3 and React state**: Don't try to sync D3 state with React state. Use D3 for rendering, React for container lifecycle.

5. **NOT using D3 for static charts**: For simple static charts, consider React-specific libraries (Recharts, Victory). D3 shines with dynamic, interactive visualizations.

## React + D3 Integration Patterns

### Pattern 1: D3 Controls, React Renders

```tsx
function Chart({ data }: { data: any[] }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    // D3 handles all rendering
  }, [data]);

  return <svg ref={ref} />;
}
```

### Pattern 2: React Renders, D3 Calculates

```tsx
function Chart({ data }: { data: any[] }) {
  const layout = useMemo(() => {
    return d3.forceSimulation(data)
      .force('charge', d3.forceManyBody())
      .stop();
  }, [data]);

  return (
    <svg>
      {data.map(d => (
        <circle key={d.id} cx={d.x} cy={d.y} r={5} />
      ))}
    </svg>
  );
}
```

### Pattern 3: Hybrid (Recommended for Whitt)

```tsx
function WorkflowGraph({ data }: { data: any }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState(data.nodes);

  useEffect(() => {
    const simulation = d3.forceSimulation(nodes)
      .on('tick', () => {
        setNodes([...nodes]); // Trigger React re-render
      });
  }, []);

  return (
    <svg ref={svgRef}>
      {nodes.map(node => (
        <TaskNode key={node.id} node={node} />
      ))}
    </svg>
  );
}
```

## Common Gotchas

- **TypeScript**: `@types/d3` is required. D3 v7 has full TypeScript support.
- **React 18/19**: Use `useLayoutEffect` instead of `useEffect` for D3 to avoid layout thrashing.
- **Strict Mode**: D3 simulations run twice in React Strict Mode. Use `useRef` to track if already initialized.
- **Performance**: For 1,000+ nodes, use Canvas instead of SVG, or consider Pixi.js for WebGL.

Last updated: 2026-08-08
