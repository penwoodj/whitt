import argparse
import json
import pathlib
import re
import sys


def emit_cytoscape_component(name):
    template = """import CytoscapeComponent from 'react-cytoscapejs';
import { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';

interface NAMEProps {
  elements: any[];
  layout?: string;
  height?: string;
}

export default function NAME({
  elements,
  layout = 'cose',
  height = '600px',
}: NAMEProps) {
  const [cy, setCy] = useState<cytoscape.Core | null>(null);
  const stylesheet = [
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(label)',
        'font-size': '12px',
        'text-valign': 'center',
        'text-halign': 'center',
      },
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
      },
    },
    {
      selector: ':selected',
      style: {
        'background-color': '#ff0000',
        'line-color': '#ff0000',
        'target-arrow-color': '#ff0000',
        'source-arrow-color': '#ff0000',
      },
    },
  ];

  useEffect(() => {
    if (!cy) return;

    const handleTap = (evt: cytoscape.EventObject) => {
      const target = evt.target;
      console.log('Tapped:', target.id());
    };

    cy.on('tap', 'node', handleTap);

    return () => {
      cy.removeListener('tap', 'node', handleTap);
    };
  }, [cy]);

  return (
    <CytoscapeComponent
      cy={setCy}
      elements={elements}
      layout={{ name: layout }}
      stylesheet={stylesheet}
      style={{ width: '100%', height }}
    />
  );
}"""

    component = template.replace("NAME", name)
    component_file = pathlib.Path(f"{name}.tsx")
    component_file.write_text(component)

    print(f"Created: {component_file}")
    return 0


def convert_css_to_stylesheet(css_content):
    lines = css_content.strip().split('\n')
    stylesheet = []

    current_selector = None
    current_styles = {}

    for line in lines:
        line = line.strip()
        if not line or line.startswith('/*'):
            continue

        if line.endswith('{') or line.endswith('{ '):
            current_selector = line.replace('{', '').strip()
            current_styles = {}
        elif line == '}' or line == '};':
            if current_selector and current_styles:
                stylesheet.append({
                    'selector': current_selector,
                    'style': current_styles
                })
            current_selector = None
            current_styles = {}
        elif ':' in line and current_selector:
            parts = line.split(':', 1)
            if len(parts) == 2:
                prop = parts[0].strip()
                value = parts[1].strip().rstrip(';').rstrip('}')

                prop_camel = re.sub(r'-([a-z])', lambda g: g.group(1).upper(), prop)

                current_styles[prop_camel] = value

    return stylesheet


def convert_css_tokens_file(css_file_path):
    try:
        css_path = pathlib.Path(css_file_path)
        if not css_path.exists():
            print(f"Error: {css_file_path} does not exist", file=sys.stderr)
            return 1

        css_content = css_path.read_text()
        stylesheet = convert_css_to_stylesheet(css_content)

        print(stylesheet)
        return 0
    except Exception as e:
        print(f"Error processing CSS file: {e}", file=sys.stderr)
        return 1


def convert_custom_properties(css_content):
    properties = re.findall(r'--([\w-]+):\s*([^;]+);', css_content)

    color_mappings = {
        '--color-primary': '#ff0000',
        '--color-secondary': '#00ff00',
        '--color-success': '#00ff00',
        '--color-error': '#ff0000',
        '--color-warning': '#ffff00',
        '--color-info': '#0000ff',
    }

    stylesheet = []

    for prop, value in properties:
        clean_value = value.strip()
        if prop in color_mappings:
            selector_value = clean_value if clean_value.startswith('#') else color_mappings[prop]
            stylesheet.append({
                'selector': 'node[data-color="{}"]'.format(prop),
                'style': {
                    'background-color': selector_value
                }
            })
        elif prop.startswith('--font-'):
            stylesheet.append({
                'selector': 'node',
                'style': {
                    'font-family': clean_value
                }
            })

    print(json.dumps(stylesheet, indent=2))
    return 0


def main():
    parser = argparse.ArgumentParser(description="Cytoscape.js helper utilities")
    subparsers = parser.add_subparsers(dest="command", required=True)

    scaffold = subparsers.add_parser("scaffold", help="Emit Cytoscape component template")
    scaffold.add_argument("NAME", help="Component name (e.g., WorkflowGraph, DependencyTree)")

    style_from_tokens = subparsers.add_parser("style-from-tokens", help="Convert CSS custom properties to Cytoscape stylesheet")
    style_from_tokens.add_argument("CSS_FILE", help="CSS file path to convert")

    args = parser.parse_args()

    if args.command == "scaffold":
        return emit_cytoscape_component(args.NAME)
    elif args.command == "style-from-tokens":
        return convert_css_tokens_file(args.CSS_FILE)

    return 0


if __name__ == "__main__":
    sys.exit(main())
