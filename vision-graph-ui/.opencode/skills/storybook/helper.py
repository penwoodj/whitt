#!/usr/bin/env python3

import argparse
import os
import re
import sys
from pathlib import Path
from typing import List, Set, Tuple


def parse_component_props(file_path: Path) -> List[str]:
    if not file_path.exists():
        print(f"Error: Component file not found: {file_path}", file=sys.stderr)
        sys.exit(1)

    content = file_path.read_text()

    patterns = [
        r'interface\s+(\w+Props)\s*{([^}]+)}',
        r'type\s+(\w+Props)\s*=\s*{([^}]+)}',
        r'interface\s+(\w+)\s*{([^}]+)}',
    ]

    props: Set[str] = set()

    for pattern in patterns:
        matches = re.findall(pattern, content, re.DOTALL)
        for _, props_block in matches:
            prop_names = re.findall(r'(\w+)\s*:', props_block)
            props.update(prop_names)

    if not props:
        props = {'children', 'className', 'disabled', 'onClick'}

    return sorted(list(props))


def generate_story_content(component_name: str, props: List[str]) -> str:
    imports = [
        "import type { Meta, StoryObj } from '@storybook/react'",
        "import { expect, within } from '@storybook/test'",
        f"import {component_name} from './{component_name}'",
    ]

    meta = [
        f"const meta: Meta<typeof {component_name}> = {{",
        f"  title: 'Components/{component_name}',",
        f"  component: {component_name},",
        "  tags: ['autodocs'],",
        "}",
        "",
        "export default meta",
        f"type Story = StoryObj<typeof {component_name}>",
        "",
    ]

    default_story = [
        "export const Default: Story = {",
        "  args: {",
    ]

    if 'children' in props:
        default_story.append("    children: 'Example',")
    elif 'label' in props:
        default_story.append("    label: 'Example',")

    default_story.extend([
        "  },",
        "}",
        "",
    ])

    variants = []
    if 'loading' in props:
        variants.extend([
            "export const Loading: Story = {",
            "  args: {",
        ])
        if 'children' in props:
            variants.append("    children: 'Loading...',")
        elif 'label' in props:
            variants.append("    label: 'Loading...',")
        variants.extend([
            "    loading: true,",
            "  },",
            "}",
            "",
        ])

    if 'error' in props or 'error' in str(props).lower():
        variants.extend([
            "export const Error: Story = {",
            "  args: {",
        ])
        if 'children' in props:
            variants.append("    children: 'Error',")
        elif 'label' in props:
            variants.append("    label: 'Error',")
        if 'error' in props:
            variants.append("    error: true,")
        variants.extend([
            "  },",
            "}",
            "",
        ])

    if 'empty' in str(props).lower() or not variants:
        variants.extend([
            "export const Empty: Story = {",
            "  args: {",
        ])
        if 'children' in props:
            variants.append("    children: null,")
        elif 'label' in props:
            variants.append("    label: '',")
        variants.extend([
            "  },",
            "}",
            "",
        ])

    return '\n'.join(imports + meta + default_story + variants)


def create_new_story(component_path: str) -> None:
    component_file = Path(component_path)

    if not component_file.suffix == '.tsx':
        print(f"Error: Expected .tsx file, got {component_file.suffix}", file=sys.stderr)
        sys.exit(1)

    component_name = component_file.stem
    story_file = component_file.parent / f"{component_name}.stories.tsx"

    if story_file.exists():
        print(f"Error: Story file already exists: {story_file}", file=sys.stderr)
        sys.exit(1)

    props = parse_component_props(component_file)
    story_content = generate_story_content(component_name, props)

    story_file.write_text(story_content)
    print(f"Created: {story_file}")


def list_stories() -> None:
    src_dir = Path('src')

    if not src_dir.exists():
        print("Error: src/ directory not found", file=sys.stderr)
        sys.exit(1)

    for story_file in src_dir.rglob('*.stories.tsx'):
        content = story_file.read_text()
        story_names = re.findall(r'export\s+const\s+(\w+)\s*:\s*Story', content)

        if story_names:
            relative_path = story_file.relative_to(src_dir)
            print(f"{relative_path}: {', '.join(story_names)}")


def find_components() -> List[Path]:
    src_dir = Path('src')

    if not src_dir.exists():
        return []

    component_files: List[Path] = []

    for tsx_file in src_dir.rglob('*.tsx'):
        if 'stories' in tsx_file.name:
            continue

        content = tsx_file.read_text()
        if re.search(r'export\s+(default\s+)?(function|const|class)\s+\w+', content):
            component_files.append(tsx_file)

    return component_files


def check_coverage() -> None:
    component_files = find_components()
    uncovered: List[Path] = []

    for component_file in component_files:
        component_name = component_file.stem
        story_file = component_file.parent / f"{component_name}.stories.tsx"

        if not story_file.exists():
            uncovered.append(component_file)

    if uncovered:
        for component in uncovered:
            relative_path = component.relative_to(Path('src'))
            print(f"Missing story: {relative_path}")
        sys.exit(1)
    else:
        print("All components have stories.")


def main() -> None:
    parser = argparse.ArgumentParser(description='Storybook helper script')
    subparsers = parser.add_subparsers(dest='command', required=True)

    new_story_parser = subparsers.add_parser('new-story', help='Generate new story file')
    new_story_parser.add_argument('component_path', help='Path to Component.tsx file')

    subparsers.add_parser('list-stories', help='List all .stories.tsx files and their stories')

    subparsers.add_parser('check-coverage', help='Report components without stories')

    args = parser.parse_args()

    if args.command == 'new-story':
        create_new_story(args.component_path)
    elif args.command == 'list-stories':
        list_stories()
    elif args.command == 'check-coverage':
        check_coverage()


if __name__ == '__main__':
    main()
