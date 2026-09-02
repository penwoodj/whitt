# Validation — Layered Evidence

> Manifest keeps full requirement inventory. Evidence layers stay separate:
> command-backed unit/GWT tests, composed Vite-app tests, Storybook-only states,
> and pending browser/offline smoke. A green unit test never proves browser or
> offline behavior.

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
| `coverage-manifest.tsv` | caseID → slice → validation reference → evidence status |
| `check-coverage.sh` | checks complete ID inventory and TSV shape |

## Status Semantics

- `unit-gwt` — named test or Gherkin-backed Vitest proof passed.
- `composed-vite` — named test exercises composed `App → GraphSim → ReactFlow` path.
- `storybook-only` — story or isolated visual state only. Not app-path proof.
- `pending` — requirement remains registered, but proof is missing.
- `offline-pending` — strict local/offline browser smoke still awaits T9.
- Browser screenshots are separate T9 evidence. No status here implies screenshot pass.

## Current command evidence

Fresh full Vitest run: `100 files, 684 tests passed`.
T8 records this result only beside matching test or Gherkin references. T9 owns
desktop Vite screenshots and strict local/offline STT smoke. Adapter, fake, and
jsdom tests cannot close offline claims.

## Out of Scope (tracked elsewhere)

Pre-existing 12 failing tests in vision-graph-ui (fsGraphLoader ×7, NodeDetailPanel,
Node, GraphSim act() ×3) — predate this suite; fix separately.
