import argparse
import json
import pathlib
import re
import sys


def emit_node_template(name):
    interface = f"""export interface {name}Data {{
  id: string;
  label: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  [key: string]: any;
}}
"""
    component = f"""import {{ Handle, Position, NodeProps }} from '@xyflow/react';
import type {{ {name}Data }} from './types';

export default function {name}({{ data }}: NodeProps<{name}Data>) {{
  const statusColor = {{
    PENDING: '#gray',
    RUNNING: '#blue',
    SUCCESS: '#green',
    FAILED: '#red',
  }}[data.status];

  return (
    <div style={{{{
      border: `2px solid ${{statusColor}}`,
      padding: 8,
      borderRadius: 4,
      background: 'white',
      minWidth: 120,
    }}}}>
      <Handle type="target" position={{Position.Top}} />
      <div style={{{{ fontWeight: 'bold', marginBottom: 4 }}}}>
        {{data.label}}
      </div>
      <div style={{{{ fontSize: 12, color: statusColor }}}}>
        {{data.status}}
      </div>
      <Handle type="source" position={{Position.Bottom}} />
    </div>
  );
}}
"""
    types_file = pathlib.Path(f"{name}Node.types.ts")
    component_file = pathlib.Path(f"{name}Node.tsx")

    types_file.write_text(interface)
    component_file.write_text(component)

    print(f"Created: {types_file}")
    print(f"Created: {component_file}")
    return 0


def emit_edge_template(name):
    component = f"""import {{ EdgeProps, getBezierPath }} from '@xyflow/react';

export default function {name}Edge({{
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {{}},
  markerEnd,
}}: EdgeProps) {{
  const [edgePath] = getBezierPath({{
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  }});

  return (
    <>
      <path
        id={{id}}
        style={{{{ ...style, strokeWidth: 2 }}}}
        className="react-flow__edge-path"
        d={{edgePath}}
        markerEnd={{markerEnd}}
      />
    </>
  );
}}
"""
    component_file = pathlib.Path(f"{name}Edge.tsx")
    component_file.write_text(component)

    print(f"Created: {component_file}")
    return 0


def count_nodes_types(source):
    source_path = pathlib.Path(source)
    if not source_path.exists():
        print(f"Error: {source} does not exist", file=sys.stderr)
        return 1

    content = source_path.read_text()

    node_types = re.findall(r'(\w+)Node\s*[:=]', content)
    edge_types = re.findall(r'(\w+)Edge\s*[:=]', content)

    node_types = list(set(node_types))
    edge_types = list(set(edge_types))

    result = {
        "file": str(source_path),
        "node_types": node_types,
        "edge_types": edge_types,
        "node_count": len(node_types),
        "edge_count": len(edge_types),
    }

    print(json.dumps(result, indent=2))
    return 0


def main():
    parser = argparse.ArgumentParser(description="React Flow helper utilities")
    subparsers = parser.add_subparsers(dest="command", required=True)

    scaffold_node = subparsers.add_parser("scaffold-node", help="Emit custom node component")
    scaffold_node.add_argument("NAME", help="Node name (e.g., Task, Workflow, Hook)")

    scaffold_edge = subparsers.add_parser("scaffold-edge", help="Emit custom edge component")
    scaffold_edge.add_argument("NAME", help="Edge name (e.g., Dependency, DataFlow)")

    count_nodes = subparsers.add_parser("count-nodes", help="Count NodeTypes/EdgeTypes in file")
    count_nodes.add_argument("SRC", help="Source file to analyze")

    args = parser.parse_args()

    if args.command == "scaffold-node":
        return emit_node_template(args.NAME)
    elif args.command == "scaffold-edge":
        return emit_edge_template(args.NAME)
    elif args.command == "count-nodes":
        return count_nodes_types(args.SRC)

    return 0


if __name__ == "__main__":
    sys.exit(main())
