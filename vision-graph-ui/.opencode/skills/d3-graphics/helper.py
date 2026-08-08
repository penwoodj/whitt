import argparse
import json
import pathlib
import sys


def emit_force_graph_skeleton():
    component = """import {{ useEffect, useRef }} from 'react';
import * as d3 from 'd3';

interface Node {{ id: string; group?: string; [key: string]: any }}
interface Link {{ source: string; target: string; value?: number }}

interface ForceGraphProps {{
  nodes: Node[];
  links: Link[];
  width?: number;
  height?: number;
}}

export default function ForceGraph({{
  nodes,
  links,
  width = 800,
  height = 600,
}}: ForceGraphProps) {{
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);

  useEffect(() => {{
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(30));

    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-width', (d: any) => Math.sqrt(d.value || 1) * 2);

    const node = g.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 20)
      .attr('fill', (d: any) => d3.schemeCategory10[d.group || 0])
      .call(d3.drag<SVGCircleElement, Node>()
        .on('start', (event, d) => {{
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }})
        .on('drag', (event, d) => {{
          d.fx = event.x;
          d.fy = event.y;
        }})
        .on('end', (event, d) => {{
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }}) as any);

    const labels = g.append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text((d: any) => d.id)
      .attr('font-size', 12)
      .attr('dx', 25)
      .attr('dy', 5);

    simulation.on('tick', () => {{
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      labels
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    }});

    simulationRef.current = simulation;

    return () => {{
      simulation.stop();
    }};
  }}, [nodes, links, width, height]);

  return <svg ref={{svgRef}} width={{width}} height={{height}} style={{{{ border: '1px solid #ccc' }}}} />;
}}
"""
    component_file = pathlib.Path("ForceGraph.tsx")
    component_file.write_text(component)

    print(f"Created: {component_file}")
    return 0


def emit_chart_component(kind):
    if kind == "bar":
        component = """import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface BarChartProps {
  data: { label: string; value: number }[];
  width?: number;
  height?: number;
}

export default function BarChart({ data, width = 600, height = 400 }: BarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([innerHeight, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    g.append('g')
      .call(d3.axisLeft(y));

    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label) || 0)
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.value))
      .attr('height', d => innerHeight - y(d.value))
      .attr('fill', 'steelblue');
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
}
"""
    elif kind == "line":
        component = """import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface LineChartProps {
  data: { x: number; y: number }[];
  width?: number;
  height?: number;
}

export default function LineChart({ data, width = 600, height = 400 }: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x) as [number, number])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.y) as [number, number])
      .range([innerHeight, 0]);

    const line = d3.line<{ x: number; y: number }>()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveMonotoneX);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    g.append('g')
      .call(d3.axisLeft(y));

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
}
"""
    elif kind == "scatter":
        component = """import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ScatterPlotProps {
  data: { x: number; y: number; group?: string }[];
  width?: number;
  height?: number;
}

export default function ScatterPlot({ data, width = 600, height = 400 }: ScatterPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x) as [number, number])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.y) as [number, number])
      .range([innerHeight, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    g.append('g')
      .call(d3.axisLeft(y));

    g.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y))
      .attr('r', 5)
      .attr('fill', d => color(d.group || 'default') as string);
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
}
"""
    else:
        print(f"Error: Unknown chart kind '{kind}'. Use: bar, line, scatter", file=sys.stderr)
        return 1

    component_file = pathlib.Path(f"{kind.capitalize()}Chart.tsx")
    component_file.write_text(component)

    print(f"Created: {component_file}")
    return 0


def main():
    parser = argparse.ArgumentParser(description="D3.js graphics helper utilities")
    subparsers = parser.add_subparsers(dest="command", required=True)

    scaffold_force = subparsers.add_parser("scaffold-force", help="Emit ForceGraph.tsx skeleton")

    scaffold_chart = subparsers.add_parser("scaffold-chart", help="Emit chart component")
    scaffold_chart.add_argument("KIND", choices=["bar", "line", "scatter"], help="Chart type")

    args = parser.parse_args()

    if args.command == "scaffold-force":
        return emit_force_graph_skeleton()
    elif args.command == "scaffold-chart":
        return emit_chart_component(args.KIND)

    return 0


if __name__ == "__main__":
    sys.exit(main())
