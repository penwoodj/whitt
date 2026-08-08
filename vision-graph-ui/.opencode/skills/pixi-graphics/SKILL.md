---
name: pixi-graphics
description: >
  Pixi.js v8 for WebGL-accelerated 2D graphics. Ideal for high-performance graph visualization
  at 100k+ nodes, fish-eye zoom effects, particle systems, and when DOM/SVG rendering is too slow.
  Use for large-scale workflow graphs, real-time token streaming visualization, or complex animations.
---

## When to Use Pixi.js

Use Pixi.js for the Whitt graph UI when:
- Rendering 10,000-100,000+ nodes (WebGL performance)
- Need fish-eye zoom with real-time distortion
- Building particle systems for token streams or hook events
- Performance is critical (60fps at scale)
- Need WebGL shaders for custom visual effects
- Interacting with massive graphs (drag 10k nodes smoothly)

**VS other libraries:**
- **React Flow**: Use for <1k nodes with React components
- **D3.js**: Use for SVG/Canvas at <10k nodes or custom layouts
- **Cytoscape.js**: Use for graph algorithms, not raw performance

## Installation

```bash
npm install pixi.js
npm install @pixi/react
```

## Minimal Example (20 lines)

```tsx
import { Stage, Container, Sprite, Text } from '@pixi/react';
import { useEffect, useState } from 'react';

export default function PixiGraph() {
  const [nodes] = useState(Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: Math.random() * 800,
    y: Math.random() * 600,
  })));

  return (
    <Stage width={800} height={600}>
      <Container>
        {nodes.map(node => (
          <Text
            key={node.id}
            text={node.id.toString()}
            x={node.x}
            y={node.y}
            style={{ fill: 0xffffff }}
          />
        ))}
      </Container>
    </Stage>
  );
}
```

## Core Concepts (Pixi.js v8)

- **Application + Canvas**: `new Application()` creates WebGL renderer. With `@pixi/react`, use `<Stage>` component.
- **Container**: Grouping element for scene graph. Can nest containers for hierarchical transforms.
- **Sprite**: Image/texture element. Use for node icons, backgrounds, or any bitmap graphics.
- **Graphics**: Vector drawing (circles, rectangles, lines). Use for custom node shapes, edges, indicators.
- **Text**: Text rendering with custom fonts. Use for labels, status badges, token counts.
- **Ticker Loop**: `app.ticker.add()` for animation (60fps by default). Use for live updates, animations.
- **ParticleContainer**: Optimized for thousands of identical particles (token streams, hook pulses).
- **Viewport Culling**: Only render visible nodes. Critical for 100k+ node performance.
- **Interaction Events**: `pointerdown`, `pointermove`, `pointerup` for drag/drop, hover, click.
- **Filters**: Shaders for blur, glow, displacement. Use for fish-eye distortion, glow effects.

## Whitt-Specific Patterns

### Mapping Whitt Concepts to Pixi.js

| Whitt Concept | Pixi.js Implementation |
|---------------|----------------------|
| 100k+ Node Graph | `ParticleContainer` with viewport culling |
| Fish-Eye Zoom | Custom shader or `Filter` with distortion |
| Token Streaming | `ParticleContainer` animating tokens along edges |
| Hook Pulses | Animated glow filters on edges |
| Swarm Constellation | 3D-like 2D rendering with depth scaling |
| Live Status Updates | Ticker loop updating Graphics colors |
| Drag/Zoom | Interaction events + container transforms |

### Fish-Eye Zoom with Shaders

```tsx
import { Filter } from 'pixi.js';

const fisheyeFragmentShader = `
  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;
  uniform vec2 uCenter;
  uniform float uRadius;
  uniform float uDistortion;

  void main() {
    vec2 coord = vTextureCoord - uCenter;
    float dist = length(coord);
    float scale = 1.0;

    if (dist < uRadius) {
      scale = 1.0 + uDistortion * (1.0 - dist / uRadius);
    }

    vec2 distortedCoord = coord * scale + uCenter;
    gl_FragColor = texture2D(uSampler, distortedCoord);
  }
`;

function FishEyeFilter({ center, radius = 200, distortion = 2.0 }) {
  const filter = new Filter(null, fisheyeFragmentShader);
  filter.uniforms.uCenter = center;
  filter.uniforms.uRadius = radius;
  filter.uniforms.uDistortion = distortion;
  return filter;
}
```

### Particle System for Token Streaming

```tsx
import { ParticleContainer } from '@pixi/particles';

function TokenStream({ source, target }: { source: {x,y}, target: {x,y} }) {
  const particles = Array.from({ length: 100 }, (_, i) => ({
    x: source.x,
    y: source.y,
    vx: (target.x - source.x) * 0.01,
    vy: (target.y - source.y) * 0.01,
    life: Math.random(),
  }));

  useTick((delta) => {
    particles.forEach(p => {
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.life -= 0.01 * delta;
    });
  });

  return (
    <ParticleContainer maxSize={1000}>
      {particles.map((p, i) => (
        <Graphics
          key={i}
          draw={g => {
            g.clear();
            g.beginFill(0x00ff00, p.life);
            g.drawCircle(p.x, p.y, 2);
            g.endFill();
          }}
        />
      ))}
    </ParticleContainer>
  );
}
```

### Viewport Culling for 100k Nodes

```tsx
function CullingContainer({ nodes, viewport }: { nodes: Node[], viewport: {x,y,width,height} }) {
  const visibleNodes = nodes.filter(node =>
    node.x >= viewport.x &&
    node.x <= viewport.x + viewport.width &&
    node.y >= viewport.y &&
    node.y <= viewport.y + viewport.height
  );

  return (
    <Container>
      {visibleNodes.map(node => (
        <NodeSprite key={node.id} node={node} />
      ))}
    </Container>
  );
}
```

### Interactive Graph with Pan/Zoom

```tsx
import { useApp } from '@pixi/react';

function InteractiveGraph({ nodes }: { nodes: Node[] }) {
  const app = useApp();
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const zoomSpeed = 0.001;
    const newScale = Math.max(0.1, Math.min(5, transform.scale - e.deltaY * zoomSpeed));
    setTransform(prev => ({ ...prev, scale: newScale }));
  };

  const handlePointerDown = (e: PointerEvent) => {
    // Implement drag logic
  };

  return (
    <Stage
      width={800}
      height={600}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
    >
      <Container
        x={transform.x}
        y={transform.y}
        scale={{ x: transform.scale, y: transform.scale }}
      >
        {nodes.map(node => (
          <NodeGraphics key={node.id} node={node} />
        ))}
      </Container>
    </Stage>
  );
}
```

### Neo4j Integration

```tsx
function mapCypherToPixi(cypherResult: any[]) {
  return cypherResult.map(row => ({
    id: row.n.id,
    x: parseFloat(row.n.x) || Math.random() * 800,
    y: parseFloat(row.n.y) || Math.random() * 600,
    status: row.n.status,
    color: getStatusColor(row.n.status),
  }));
}

function getStatusColor(status: string): number {
  const colors = {
    PENDING: 0x808080,
    RUNNING: 0x0000ff,
    SUCCESS: 0x00ff00,
    FAILED: 0xff0000,
  };
  return colors[status] || 0x808080;
}
```

## Performance Ceiling

- **10,000 nodes**: 60fps, smooth interaction
- **50,000 nodes**: 30-60fps with viewport culling
- **100,000 nodes**: 30fps with aggressive culling + ParticleContainer
- **Memory**: ~100B per node (no DOM overhead)
- **GPU**: Required for WebGL. Integrated GPUs may struggle at 50k+ nodes.

## Fish-Eye / Zoom Patterns

### Shader-Based Fish-Eye

```tsx
function FishEyeStage({ children, cursor }: { children: ReactNode, cursor: {x,y} }) {
  const filter = useMemo(() => new FishEyeFilter({
    center: [cursor.x / 800, cursor.y / 600],
    radius: 0.25,
    distortion: 2.0,
  }), [cursor]);

  return (
    <Stage width={800} height={600}>
      <Container filters={[filter]}>
        {children}
      </Container>
    </Stage>
  );
}
```

### GPU-Accelerated Zoom

```tsx
function ZoomableGraph({ nodes }: { nodes: Node[] }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  return (
    <Stage width={800} height={600}>
      <Container
        x={pan.x}
        y={pan.y}
        scale={{ x: zoom, y: zoom }}
        sortableChildren
      >
        {nodes.map(node => (
          <NodeGraphics key={node.id} node={node} zIndex={node.id} />
        ))}
      </Container>
    </Stage>
  );
}
```

## Anti-Patterns

1. **NOT using ParticleContainer for many identical objects**: Regular `Container` has overhead. Use `ParticleContainer` for 100+ identical sprites/particles.

2. **NOT ignoring viewport culling**: Rendering 100k nodes will kill performance. Always cull off-screen nodes.

3. **NOT creating new Graphics objects every frame**: Reuse Graphics objects, update their properties. Creating/destroying is expensive.

4. **NOT using Filters sparingly**: Shaders are powerful but expensive. Limit to 1-2 active filters.

5. **NOT mixing DOM and WebGL heavily**: Pixi renders to a canvas. Overlaying DOM elements kills performance. Keep UI in Pixi or use separate layers.

## React + Pixi Integration

### Using @pixi/react

```tsx
import { Stage, Container, Graphics, Text, useTick, useApp } from '@pixi/react';

function PixiComponent() {
  const [rotation, setRotation] = useState(0);

  useTick((delta) => {
    setRotation(prev => prev + 0.01 * delta);
  });

  return (
    <Stage width={800} height={600}>
      <Container x={400} y={300} rotation={rotation}>
        <Graphics
          draw={g => {
            g.clear();
            g.beginFill(0xff0000);
            g.drawCircle(0, 0, 50);
            g.endFill();
          }}
        />
      </Container>
    </Stage>
  );
}
```

### Custom Pixi Hooks

```tsx
function usePixiInteraction() {
  const app = useApp();
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e: PointerEvent) => {
    setDragging(true);
    setDragStart({ x: e.globalX, y: e.globalY });
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (dragging) {
      const dx = e.globalX - dragStart.x;
      const dy = e.globalY - dragStart.y;
      // Apply pan transform
    }
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  return { handlePointerDown, handlePointerMove, handlePointerUp };
}
```

## Common Gotchas

- **TypeScript**: Pixi.js v8 has full TypeScript support. No extra `@types` needed.
- **React 19**: `@pixi/react` supports React 19. Use hooks-based API.
- **Memory Leaks**: Always destroy textures, sprites, and filters in `useEffect` cleanup.
- **HiDPI**: Handle device pixel ratio for crisp text. `app.renderer.resolution = window.devicePixelRatio`.
- **Mobile**: Touch events map to pointer events in Pixi. Test on real devices.

Last updated: 2026-08-08
