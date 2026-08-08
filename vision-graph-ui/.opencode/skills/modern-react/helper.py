#!/usr/bin/env python3

import argparse
import ast
import re
import sys
from pathlib import Path


def parse_args():
    parser = argparse.ArgumentParser(description='Modern React linter/checker')
    subparsers = parser.add_subparsers(dest='command', required=True)

    check_parser = subparsers.add_parser('check', help='Check for violations')
    check_parser.add_argument('files', nargs='+', type=Path, help='Files to check')

    fix_parser = subparsers.add_parser('fix', help='Auto-fix violations')
    fix_parser.add_argument('files', nargs='+', type=Path, help='Files to fix')

    stats_parser = subparsers.add_parser('stats', help='Show statistics')
    stats_parser.add_argument('files', nargs='+', type=Path, help='Files to analyze')

    return parser.parse_args()


def is_tsx_file(path):
    return path.suffix in ['.tsx', '.ts']


def read_file(path):
    try:
        return path.read_text(encoding='utf-8')
    except Exception as e:
        print(f"Error reading {path}: {e}", file=sys.stderr)
        return None


def check_comments(content, path):
    violations = []

    line_comment_pattern = r'//'
    block_comment_pattern = r'/\*'

    for i, line in enumerate(content.split('\n'), 1):
        if re.search(line_comment_pattern, line):
            violations.append(f"{path}:{i}: line comment found")
        if re.search(block_comment_pattern, line):
            violations.append(f"{path}:{i}: block comment found")

    return violations


def check_class_components(content, path):
    violations = []

    class_pattern = r'class\s+\w+\s+extends\s+(React\.)?Component'

    for i, line in enumerate(content.split('\n'), 1):
        if re.search(class_pattern, line):
            violations.append(f"{path}:{i}: class component found (use functional component)")

    return violations


def check_type_any(content, path):
    violations = []

    any_patterns = [
        r':\s*any\b',
        r'<any>',
        r'as\s+any\b',
        r'@ts-ignore',
    ]

    for i, line in enumerate(content.split('\n'), 1):
        for pattern in any_patterns:
            if re.search(pattern, line):
                violations.append(f"{path}:{i}: any type or @ts-ignore found")
                break

    return violations


def check_lodash_imports(content, path):
    violations = []

    lodash_patterns = [
        r"import\s+_\s+from\s+['\"]lodash['\"]",
        r"import\s+\{\s*[^}]+\}\s+from\s+['\"]lodash['\"]",
    ]

    for i, line in enumerate(content.split('\n'), 1):
        for pattern in lodash_patterns:
            if re.search(pattern, line):
                violations.append(f"{path}:{i}: use lodash/fp imports instead")
                break

    return violations


def check_function_names(content, path):
    violations = []

    function_pattern = r'(?:const|function)\s+(\w+)\s*(?:\(|=>)'

    verb_prefixes = [
        'get', 'set', 'fetch', 'load', 'save', 'delete', 'update', 'create',
        'render', 'handle', 'process', 'transform', 'calculate', 'compute',
        'validate', 'check', 'test', 'find', 'filter', 'map', 'reduce',
        'sort', 'order', 'group', 'split', 'join', 'format', 'parse',
        'build', 'make', 'do', 'run', 'execute', 'start', 'stop', 'cancel',
        'send', 'receive', 'push', 'pull', 'open', 'close', 'toggle',
        'enable', 'disable', 'show', 'hide', 'add', 'remove', 'clear',
        'reset', 'refresh', 'reload', 'sync', 'copy', 'paste', 'cut',
        'undo', 'redo', 'commit', 'rollback', 'publish', 'subscribe',
        'notify', 'log', 'track', 'monitor', 'measure', 'benchmark',
    ]

    for i, line in enumerate(content.split('\n'), 1):
        matches = re.findall(function_pattern, line)
        for func_name in matches:
            is_verb = any(func_name.startswith(prefix) for prefix in verb_prefixes)
            is_boolean = re.match(r'^(is|has|should|can|will|did)[A-Z]', func_name)
            is_hook = func_name.startswith('use')
            is_component = bool(re.match(r'^[A-Z]', func_name))

            if not is_verb and not is_boolean and not is_hook and not is_component:
                violations.append(f"{path}:{i}: function '{func_name}' should start with a verb")

    return violations


def check_boolean_names(content, path):
    violations = []

    const_pattern = r'const\s+(\w+)\s*='

    for i, line in enumerate(content.split('\n'), 1):
        matches = re.findall(const_pattern, line)
        for var_name in matches:
            is_boolean = re.match(r'^(is|has|should|can|will|did)[A-Z]', var_name)
            is_likely_bool = re.search(r'(true|false|>\s*\d|<\s*\d|===|!==|&&|\|\||!)\s*$', line)

            if is_likely_bool and not is_boolean and var_name[0].islower():
                violations.append(f"{path}:{i}: boolean '{var_name}' should use is/has/should/can/will/did prefix")

    return violations


def check_jsx_nesting(content, path):
    violations = []

    try:
        tree = ast.parse(content)

        class NestingChecker(ast.NodeVisitor):
            def __init__(self, filename):
                self.filename = filename
                self.violations = []

            def visit_Call(self, node):
                if isinstance(node.func, ast.Name) and node.func.id == 'createElement':
                    nesting = self._count_nesting(node)
                    if nesting > 3:
                        line = getattr(node, 'lineno', '?')
                        self.violations.append(f"{self.filename}:{line}: JSX nesting >3 levels, extract subcomponent")

            def _count_nesting(self, node, depth=1):
                max_depth = depth
                if isinstance(node, ast.Call):
                    if len(node.args) > 1:
                        child = node.args[1]
                        if isinstance(child, (ast.List, ast.Tuple)):
                            for item in child.elts:
                                if isinstance(item, ast.Call):
                                    child_depth = self._count_nesting(item, depth + 1)
                                    max_depth = max(max_depth, child_depth)
                return max_depth

        checker = NestingChecker(path)
        checker.visit(tree)
        violations.extend(checker.violations)
    except SyntaxError:
        pass

    return violations


def check_file(path):
    content = read_file(path)
    if content is None:
        return []

    if not is_tsx_file(path):
        return []

    violations = []

    violations.extend(check_comments(content, path))
    violations.extend(check_class_components(content, path))
    violations.extend(check_type_any(content, path))
    violations.extend(check_lodash_imports(content, path))
    violations.extend(check_function_names(content, path))
    violations.extend(check_boolean_names(content, path))
    violations.extend(check_jsx_nesting(content, path))

    return violations


def run_check(files):
    all_violations = []

    for file_path in files:
        if not file_path.exists():
            print(f"Warning: {file_path} does not exist", file=sys.stderr)
            continue

        violations = check_file(file_path)
        all_violations.extend(violations)

    if all_violations:
        for violation in all_violations:
            print(violation)
        return 1

    return 0


def run_fix(files):
    print("Auto-fix is disabled for this project.")
    print("Manual extraction required for all violations.")
    return 0


def count_components(content):
    components = 0
    hooks = 0
    lambdas = 0

    function_pattern = r'(?:function|const)\s+(\w+)\s*(?:\(|=>)'
    arrow_pattern = r'(\w+)\s*=>'
    lambda_pattern = r'\([^)]*\)\s*=>'

    for line in content.split('\n'):
        matches = re.findall(function_pattern, line)
        for name in matches:
            if re.match(r'^[A-Z]', name):
                components += 1
            elif name.startswith('use'):
                hooks += 1

        if re.search(arrow_pattern, line):
            lambdas += 1

        if re.search(lambda_pattern, line):
            lambdas += 1

    return components, hooks, lambdas


def run_stats(files):
    total_components = 0
    total_hooks = 0
    total_lambdas = 0

    for file_path in files:
        if not file_path.exists():
            print(f"Warning: {file_path} does not exist", file=sys.stderr)
            continue

        if not is_tsx_file(file_path):
            continue

        content = read_file(file_path)
        if content is None:
            continue

        components, hooks, lambdas = count_components(content)

        print(f"{file_path}:")
        print(f"  Components: {components}")
        print(f"  Hooks: {hooks}")
        print(f"  Lambdas: {lambdas}")

        total_components += components
        total_hooks += hooks
        total_lambdas += lambdas

    print()
    print("Total:")
    print(f"  Components: {total_components}")
    print(f"  Hooks: {total_hooks}")
    print(f"  Lambdas: {total_lambdas}")

    return 0


def main():
    args = parse_args()

    if args.command == 'check':
        return run_check(args.files)
    elif args.command == 'fix':
        return run_fix(args.files)
    elif args.command == 'stats':
        return run_stats(args.files)

    return 1


if __name__ == '__main__':
    sys.exit(main())
