import argparse
import json
import pathlib
import sys


def emit_pixi_app_template(name):
    template = """import { useEffect, useState } from 'react';
import { Stage, Container, Graphics, Text, useTick, useApp } from '@pixi/react';

interface NAMEProps {
  width?: number;
  height?: number;
  backgroundColor?: number;
}

export default function NAME({
  width = 800,
  height = 600,
  backgroundColor = 0x1a1a2e,
}: NAMEProps) {
  const [nodes, setNodes] = useState<Array<{ id: number; x: number; y: number; color: number }>>([]);
  const app = useApp();

  useEffect(() => {
    const initialNodes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      color: Math.random() * 0xffffff,
    }));
    setNodes(initialNodes);
  }, [width, height]);

  useTick((delta) => {
    setNodes(prevNodes =>
      prevNodes.map(node => ({
        ...node,
        x: (node.x + delta * 0.5) % width,
        y: (node.y + delta * 0.3) % height,
      }))
    );
  });

  return (
    <Stage
      width={width}
      height={height}
      options={{ backgroundColor, antialias: true, resolution: window.devicePixelRatio || 1 }}
    >
      <Container>
        {nodes.map(node => (
          <Graphics
            key={node.id}
            draw={(g) => {
              g.clear();
              g.beginFill(node.color);
              g.drawCircle(node.x, node.y, 10);
              g.endFill();
            }}
            x={0}
            y={0}
            eventMode={'static'}
            pointerdown={() => console.log('Clicked node', node.id)}
          />
        ))}
      </Container>
    </Stage>
  );
}"""

    component = template.replace("NAME", name)
    component_file = pathlib.Path(f"{name}.tsx")
    component_file.write_text(component)

    print(f"Created: {component_file}")
    return 0


def calculate_performance_budget(node_count):
    base_memory_per_node = 100
    graphics_overhead = 50
    particle_container_savings = 30

    budgets = {
        "100": {
            "estimated_memory_mb": round((node_count * base_memory_per_node) / (1024 * 1024), 2),
            "rendering": "GPU (WebGL)",
            "expected_fps": 60,
            "recommendation": "Use regular Container with Graphics objects",
        },
        "1000": {
            "estimated_memory_mb": round((node_count * base_memory_per_node) / (1024 * 1024), 2),
            "rendering": "GPU (WebGL)",
            "expected_fps": 60,
            "recommendation": "Use regular Container, consider viewport culling",
        },
        "10000": {
            "estimated_memory_mb": round((node_count * (base_memory_per_node + graphics_overhead)) / (1024 * 1024), 2),
            "rendering": "GPU (WebGL)",
            "expected_fps": "30-60",
            "recommendation": "Use viewport culling, batch similar nodes",
        },
        "100000": {
            "estimated_memory_mb": round((node_count * (base_memory_per_node - particle_container_savings)) / (1024 * 1024), 2),
            "rendering": "GPU (WebGL) with ParticleContainer",
            "expected_fps": "20-30",
            "recommendation": "Must use ParticleContainer + viewport culling + spatial partitioning",
        },
    }

    specific_budget = {
        "node_count": node_count,
        "memory_per_node_bytes": base_memory_per_node,
        "total_estimated_memory_bytes": node_count * base_memory_per_node,
        "total_estimated_memory_mb": round((node_count * base_memory_per_node) / (1024 * 1024), 2),
        "gpu_required": True,
        "recommended_approach": get_approach_for_count(node_count),
    }

    print(json.dumps(specific_budget, indent=2))
    print("\nReference budgets:")
    print(json.dumps(budgets, indent=2))
    return 0


def get_approach_for_count(count):
    if count < 1000:
        return "Regular Container with Graphics/Text objects"
    elif count < 10000:
        return "Regular Container + viewport culling + object pooling"
    elif count < 50000:
        return "ParticleContainer + viewport culling + spatial partitioning (quadtree)"
    else:
        return "ParticleContainer + aggressive culling + LOD (Level of Detail) + instanced rendering"


def main():
    parser = argparse.ArgumentParser(description="Pixi.js graphics helper utilities")
    subparsers = parser.add_subparsers(dest="command", required=True)

    scaffold_app = subparsers.add_parser("scaffold-app", help="Emit Pixi App component template")
    scaffold_app.add_argument("NAME", help="Component name (e.g., WorkflowGraph, TokenVisualizer)")

    perf_budget = subparsers.add_parser("perf-budget", help="Estimate memory/performance for node count")
    perf_budget.add_argument("NODE_COUNT", type=int, help="Number of nodes to estimate for")

    args = parser.parse_args()

    if args.command == "scaffold-app":
        return emit_pixi_app_template(args.NAME)
    elif args.command == "perf-budget":
        return calculate_performance_budget(args.NODE_COUNT)

    return 0


if __name__ == "__main__":
    sys.exit(main())
