# S10 — Canvas Manipulation Implementation Plan

> Executes: `docs/feature-requirements/slices/10-canvas-manipulation.md` (cases: GRP-01..11, GRPC-01..10)
> Validation spec: `docs/feature-requirements/validation/slice-10.validation.md`
> Status: NOT-STARTED
> Depends on: E4-react-flow-upgrade

## 1. Objective

Deliver canvas manipulation layer: multi-select, grouping (soft/hard), link drawing, node/edge deletion, physics feel (packed, calm, reheat-on-drag, settle). Completes Flow G (Group Nodes → Speak to Group) and Flow H (Move + Connect Nodes) from user-flows.md.

## 2. Inputs (READ FIRST — in this order)

| Input | Path |
|---|---|
| Requirements slice | `docs/feature-requirements/slices/10-canvas-manipulation.md` |
| Inherited case source | `docs/broader-vision/requirements/09-canvas-grouping-manipulation.md` (GRP-01..11) |
| Validation spec | `docs/feature-requirements/validation/slice-10.validation.md` |
| User-flow narrative | `docs/broader-vision/user-flows.md` (Flow G, H) |
| Skills to load | `react-flow`, `modern-react`, `test-driven-development`, `fs-graph-sync` (for GRPC-10), `storybook-agentic-e2e` |
| Code-rip sources | `.repos/ragflow/web/src/pages/agent/canvas/edge/index.tsx` (hover-delete pattern), `.repos/ragflow/web/src/pages/agent/hooks.tsx` (hasCycle validation) |

## 3. File plan (REAL paths)

| Action | Path | Notes |
|---|---|---|
| create | `vision-graph-ui/src/features/canvas-manipulation/CanvasOps.tsx` | Main canvas wrapper w/ ReactFlow v12 + physics sim hook |
| create | `vision-graph-ui/src/features/canvas-manipulation/CanvasOps.test.tsx` | Vitest tests mapping to Gherkin scenarios |
| create | `vision-graph-ui/src/features/canvas-manipulation/CanvasOps.stories.tsx` | Storybook stories for all 20 active cases |
| create | `vision-graph-ui/src/features/canvas-manipulation/useCanvasSelection.ts` | Selection model: click/ctrl+click/lasso/clear + multi-select state |
| create | `vision-graph-ui/src/features/canvas-manipulation/useGrouping.ts` | Soft/hard group logic, box/halo rendering, context tooltip |
| create | `vision-graph-ui/src/features/canvas-manipulation/useLinkDrawing.ts` | Connection drag: right-edge affordance, preview, validity, cancel |
| create | `vision-graph-ui/src/features/canvas-manipulation/usePhysicsSim.ts` | d3-force physics: reheat-on-drag, settle, collision pad, sleep |
| create | `vision-graph-ui/src/features/canvas-manipulation/GroupBox.tsx` | Visual group box renderer (selection surround region) |
| create | `vision-graph-ui/src/features/canvas-manipulation/EdgeWithDelete.tsx` | Custom edge w/ hover-X delete button (ragflow pattern) |
| create | `vision-graph-ui/src/features/canvas-manipulation/ConnectionLine.tsx` | Custom connection line w/ valid/invalid styling |
| modify | `vision-graph-ui/src/features/graph-sim/GraphSim.tsx` | Replace ReactFlow v11 → v12, wire new ops + hooks |
| create | `vision-graph-ui/src/adapted/edge-delete.tsx` FROM `.repos/ragflow/web/src/pages/agent/canvas/edge/index.tsx` | Port hover-X edge delete pattern (Apache-2.0) |
| create | `vision-graph-ui/src/adapted/has-cycle-validator.ts` FROM `.repos/ragflow/web/src/pages/agent/hooks.tsx` | Port hasCycle validation logic (Apache-2.0) |

## 4. Question-cycle gate (AGENTS.md §1 Stage 1 — MANDATORY before tests)

Ask user (2-3 questions max, `question` tool):
1. **Soft group persistence**: Should soft groups persist per-session only (disappear on reload) or persist to localStorage? (Options: session-only, localStorage)
2. **Default selection mode**: Should canvas start in lasso mode (drag-empty = select) or click-mode (drag-empty = pan, need lasso tool for select)? (Options: lasso-default, click-default)
3. **Hard-group gesture**: Should soft→hard promotion be (a) right-click menu "Make Permanent" or (b) double-click group? (Options: right-click-menu, double-click, both)

Record answers in this file, then never re-ask.

## 5. Tasks (incremental, TDD, each ends green+committed)

### Task 10.1 — Selection model (cases: GRP-01, GRP-02, GRPC-06)
- **Gherkin first**: `vision-graph-ui/src/features/canvas-manipulation/selection.feature` (scenarios = GRP-01, GRP-02, GRPC-06)
- **Red**: `CanvasOps.test.tsx` + `useCanvasSelection.test.tsx` fail
- **Green**: `useCanvasSelection.ts` implements click, ctrl+click, lasso, clear; `GroupBox.tsx` renders selection surround
- **Rip (if any)**: none
- **Story**: `GRP-01 multi-select`, `GRP-02 selection surround`, `GRPC-06 selection model` in `CanvasOps.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run CanvasOps.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip GRP-01, GRP-02, GRPC-06 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(canvas-manipulation): Selection model (GRP-01, GRP-02, GRPC-06)`

### Task 10.2 — Grouping basics (cases: GRP-03, GRP-09, GRP-10)
- **Gherkin first**: `vision-graph-ui/src/features/canvas-manipulation/grouping.feature` (scenarios = GRP-03, GRP-09, GRP-10)
- **Red**: `CanvasOps.test.tsx` + `useGrouping.test.tsx` fail
- **Green**: `useGrouping.ts` implements right-click box, tooltip context, node-like behavior; `GroupBox.tsx` adds halo (defer visual to S03)
- **Rip (if any)**: none
- **Story**: `GRP-03 right-click box`, `GRP-09 group prompt context`, `GRP-10 group node-like` in `CanvasOps.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run CanvasOps.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip GRP-03, GRP-09, GRP-10 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(canvas-manipulation): Grouping basics (GRP-03, GRP-09, GRP-10)`

### Task 10.3 — Link drawing (cases: GRP-06, GRPC-03, GRPC-04)
- **Gherkin first**: `vision-graph-ui/src/features/canvas-manipulation/link-drawing.feature` (scenarios = GRP-06, GRPC-03, GRPC-04)
- **Red**: `CanvasOps.test.tsx` + `useLinkDrawing.test.tsx` fail
- **Green**: `useLinkDrawing.ts` implements right-edge hover affordance, connection drag, preview line, valid/invalid styling, cancel (ESC/empty/invalid); `ConnectionLine.tsx` renders styled preview
- **Rip (if any)**: `src/adapted/has-cycle-validator.ts` FROM ragflow hooks.tsx (hasCycle logic)
- **Story**: `GRP-06 drag link`, `GRPC-03 connection preview`, `GRPC-04 connection cancel` in `CanvasOps.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run CanvasOps.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip GRP-06, GRPC-03, GRPC-04 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(canvas-manipulation): Link drawing (GRP-06, GRPC-03, GRPC-04)`

### Task 10.4 — Edge deletion (cases: GRPC-05)
- **Gherkin first**: `vision-graph-ui/src/features/canvas-manipulation/edge-deletion.feature` (scenarios = GRPC-05)
- **Red**: `CanvasOps.test.tsx` + `EdgeWithDelete.test.tsx` fail
- **Green**: `EdgeWithDelete.tsx` implements hover-X button (ragflow pattern), Backspace/Delete keyboard delete; `CanvasOps.tsx` wires `isValidConnection` + `onBeforeDelete`
- **Rip (if any)**: `src/adapted/edge-delete.tsx` FROM ragflow edge/index.tsx (hover-X pattern)
- **Story**: `GRPC-05 edge delete` in `CanvasOps.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run CanvasOps.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip GRPC-05 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(canvas-manipulation): Edge deletion (GRPC-05)`

### Task 10.5 — Drag coherence (cases: GRP-04, GRPC-01, GRPC-02, GRPC-08)
- **Gherkin first**: `vision-graph-ui/src/features/canvas-manipulation/drag-coherence.feature` (scenarios = GRP-04, GRPC-01, GRPC-02, GRPC-08)
- **Red**: `CanvasOps.test.tsx` fail
- **Green**: `CanvasOps.tsx` implements nodeDragThreshold (4px), ESC cancel, multi-drag translation, connected neighbors follow; `usePhysicsSim.ts` adds pull semantics
- **Rip (if any)**: none
- **Story**: `GRP-04 connected pull`, `GRPC-01 click vs drag`, `GRPC-02 esc cancels drag`, `GRPC-08 multi-drag coherence` in `CanvasOps.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run CanvasOps.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip GRP-04, GRPC-01, GRPC-02, GRPC-08 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(canvas-manipulation): Drag coherence (GRP-04, GRPC-01, GRPC-02, GRPC-08)`

### Task 10.6 — Physics simulation (cases: GRPC-09)
- **Gherkin first**: `vision-graph-ui/src/features/canvas-manipulation/physics.feature` (scenarios = GRPC-09)
- **Red**: `CanvasOps.test.tsx` + `usePhysicsSim.test.tsx` fail
- **Green**: `usePhysicsSim.ts` implements d3-force: centerStrength, collisionPad, velocityDecay, maxVelocity, alphaTarget drag-reheat, collision resolve, auto-sleep; reuses params from bubble-chart-js (READ-ONLY inspiration only)
- **Rip (if any)**: none (bubble-chart-js READ-ONLY — reimplement via d3-force)
- **Story**: `GRPC-09 reheat settle` in `CanvasOps.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run CanvasOps.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip GRPC-09 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(canvas-manipulation): Physics simulation (GRPC-09)`

### Task 10.7 — Delete guard + standalone (cases: GRPC-07, GRP-05)
- **Gherkin first**: `vision-graph-ui/src/features/canvas-manipulation/delete-guard.feature` (scenarios = GRPC-07, GRP-05)
- **Red**: `CanvasOps.test.tsx` fail
- **Green**: `CanvasOps.tsx` implements `onBeforeDelete` guard for node deletion (confirm dialog naming N files), allows edge deletion; `useGrouping.ts` adds standalone node creation
- **Rip (if any)**: none
- **Story**: `GRPC-07 delete guard`, `GRP-05 standalone node` in `CanvasOps.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run CanvasOps.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip GRPC-07, GRP-05 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(canvas-manipulation): Delete guard + standalone (GRPC-07, GRP-05)`

### Task 10.8 — Hard group promotion (cases: GRP-07, GRPC-10)
- **Gherkin first**: `vision-graph-ui/src/features/canvas-manipulation/hard-group.feature` (scenarios = GRP-07, GRPC-10)
- **Red**: `CanvasOps.test.tsx` + `useGrouping.test.tsx` fail
- **Green**: `useGrouping.ts` implements soft→hard promotion gesture (right-click menu per question answer), calls FsPort.moveFiles (E3), creates folder, moves members, persists box+halo; `CanvasOps.tsx` reloads graph after promotion
- **Rip (if any)**: none (uses fs-graph-sync from E3)
- **Story**: `GRP-07 soft vs hard grouping`, `GRPC-10 hard group` in `CanvasOps.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run CanvasOps.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip GRP-07, GRPC-10 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(canvas-manipulation): Hard group promotion (GRP-07, GRPC-10)`

## 6. Skill + agent routing (per task)

| Task | Skills to load | Delegate to |
|---|---|---|
| 10.1 | `react-flow`, `modern-react`, `test-driven-development` | `category="deep"` |
| 10.2 | `react-flow`, `modern-react`, `test-driven-development` | `category="deep"` |
| 10.3 | `react-flow`, `modern-react`, `test-driven-development` | `category="deep"` |
| 10.4 | `react-flow`, `modern-react`, `test-driven-development`, `oss-code-adaptation` | `category="deep"` |
| 10.5 | `react-flow`, `modern-react`, `test-driven-development` | `category="deep"` |
| 10.6 | `react-flow`, `d3-graphics`, `modern-react`, `test-driven-development` | `category="deep"` |
| 10.7 | `react-flow`, `modern-react`, `test-driven-development` | `category="deep"` |
| 10.8 | `react-flow`, `modern-react`, `test-driven-development`, `fs-graph-sync` | `category="deep"` |

## 7. Live-system validation gate (slice DONE only when ALL pass)

1. Run validation stories: `npx vitest run --project=storybook -t "slice10"`
2. Every case ID in slice → story → play fn asserts pass (see validation spec assert table)
3. Manifest: all slice rows `pass` (GRP-11 `deferred` w/ reason: "eventual, user-explicitly-deferred")
4. `check-coverage.sh` GREEN
5. Manual review: user eyeballs stories in Storybook UI (serve: `npm run storybook`)

## 8. Retry loop (failure = iterate, NEVER skip)

```
attempt → fail → read actual log lines (AGENTS.md §2)
  → hypothesis → minimal fix → re-run story
  → fail again? ×2 → load systematic-debugging skill
  → fail ×3 → escalate: oracle subagent w/ full ctx → fix → re-run
  → NEVER: delete test, loosen assert, extend timeout >2×, mark skip w/o user OK
```

## 9. Out of scope / guards

- GRP-08 halo visual: owned by S03-light-language slice (cross-ref only here)
- GRP-11 nested graph in detail panel: deferred, placeholder story in validation spec marked `deferred`
- Drag-from-handle placeholder: ragflow has this pattern but GRP-06 only requires right-edge hover (per spec)
- Ghost-drag preview: optional polish (AntV G6 has this), not in MVP scope
- Direct manipulation inside node: S04 domain (node lifecycle)
- `nodeTypes` memoization: handled in E4 migration (GraphSim.tsx ~line 391)
- Physics params tuning: Storybook uses defaults; user feedback drives adjustment post-MVP
- Touch gestures: MVP mouse/keyboard only (pointer API covers both but not optimized for touch)
- Multi-touch lasso: not in scope

---
