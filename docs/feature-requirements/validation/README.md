# Validation — Storybook Live-System Testing

> Per ADR-0016. Every GWT case (85 inherited + 56 new = 141) maps to exactly one
> Storybook story; the story's play function IS the When/Then. Coverage audited by
> `check-coverage.sh`.

## Infra (already in `vision-graph-ui/`)

- Storybook 10.5.7 (`@storybook/react-vite`), `@storybook/addon-vitest`,
  `@storybook/addon-a11y`, Vitest + `@vitest/browser-playwright` (headless chromium).
- Run: `npm run storybook` (dev) / Vitest browser project (CI).

## Conventions

- **Story name**: `sliceNN -- <CaseID> <short name>` (1:1 case↔story↔test).
- **Imports**: `import { expect, fn, userEvent, waitFor, within, step } from '@storybook/test'`.
- **Pointer gestures** (drag / dblclick / right-click):
  ```ts
  await userEvent.pointer([
    { keys: '[MouseLeft]', target: node },
    { target: node, coords: { deltaX: 120, deltaY: 40 } },
    { keys: '[/MouseLeft]' },
  ]);
  await userEvent.dblClick(node);
  await userEvent.pointer({ keys: '[MouseRight]', target: node });
  ```
- **React Flow mocks** (jsdom): ResizeObserver, DOMMatrixReadOnly, offsetHeight/Width,
  SVGElement.getBBox — per xyflow testing guide (see ADR-0016 research).
- **Web Audio mock**: FakeAudioContext w/ scriptable level sequence (drives LGT-02/03
  breathing asserts — assert `animationName`/class + sampled scale, not raw frames).
- **Animation asserts**: class/`animationName`/`animationDuration` via
  `getComputedStyle`; RAF-loop asserts via call-count wrapper.
- **A11y**: `parameters: { a11y: { test: 'error' } }` on interaction stories.
- **Reduced motion**: story parameter emulating `prefers-reduced-motion` (LGT-07).

## Files

| File | Covers |
|---|---|
| `slice-01.validation.md` … `slice-11.validation.md` | per-slice story specs (story, play outline, asserts) |
| `coverage-manifest.tsv` | caseID → slice → story name → status (todo/ready) |
| `check-coverage.sh` | greps slice docs for case IDs; reports unmapped |

## Status Semantics

- `todo` — spec written; story not yet implemented (default for all rows today).
- `ready` — story exists in `vision-graph-ui/src/**/` and passes.
- Script exits non-zero if any case ID lacks a manifest row (never on `todo`).

## Out of Scope (tracked elsewhere)

Pre-existing 12 failing tests in vision-graph-ui (fsGraphLoader ×7, NodeDetailPanel,
Node, GraphSim act() ×3) — predate this suite; fix separately.
