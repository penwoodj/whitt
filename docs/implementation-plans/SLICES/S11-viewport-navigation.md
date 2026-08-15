# S11 — Viewport & Navigation Implementation Plan

> Executes: `docs/feature-requirements/slices/11-viewport-navigation.md` (cases: NAV-01..08)
> Validation spec: `docs/feature-requirements/validation/slice-11.validation.md`
> Status: NOT-STARTED
> Depends on: E4

## 1. Objective

Deliver standard slippy-map navigation (wheel zoom-to-cursor, pan modes, fit-view, minimap, cursors, keyboard nudge, spawn reveal) via React Flow 12 built-ins. Config-level tasks — no custom components needed.

## 2. Inputs (READ FIRST — in this order)

| Input | Path |
|---|---|
| Requirements slice | `docs/feature-requirements/slices/11-viewport-navigation.md` |
| Validation spec | `docs/feature-requirements/validation/slice-11.validation.md` |
| User-flow narrative | `docs/broader-vision/user-flows.md` (Flow B) |
| Migration facts | `docs/implementation-plans/CONTEXT/C2-xyflow12-migration-facts.md` |
| AGENTS rules | `vision-graph-ui/AGENTS.md` |
| Skills to load | `react-flow`, `modern-react`, `test-driven-development`, `storybook-agentic-e2e` |
| Code-rip sources | none (React Flow built-ins cover all NAV cases) |

## 3. File plan (REAL paths)

| Action | Path | Notes |
|---|---|---|
| modify | `vision-graph-ui/src/features/graph-sim/GraphSim.tsx:440-452` | Add NAV config to ReactFlow: minZoom, maxZoom, zoomOnScroll, panOnScroll, panActivationKeyCode, selectionOnDrag, fitView callback, onNodeMouseEnter/onNodeMouseLeave cursors, onKeyDown for nudge, MiniMap component |
| create | `vision-graph-ui/src/features/viewport-navigation/ViewportNavigation.feature` | Gherkin for NAV-01..08 |
| create | `vision-graph-ui/src/features/viewport-navigation/ViewportNavigation.test.tsx` | Vitest tests mapping to scenarios |
| create | `vision-graph-ui/src/features/viewport-navigation/ViewportNavigation.stories.tsx` | Storybook stories: "NAV-01 zoom to cursor", "NAV-02 pan modes", "NAV-03 zoom limits", "NAV-04 fit view", "NAV-05 minimap", "NAV-06 cursor semantics", "NAV-07 keyboard nudge", "NAV-08 spawn reveal" |

## 4. Question-cycle gate (AGENTS.md §1 Stage 1 — MANDATORY before tests)

Ask user (2-3 questions max, `question` tool):

1. **NAV-02 pan mode:** Hybrid (drag-empty=pan + space+drag + shift+drag=lasso) vs pure slippy default (React Flow default: pan=drag-empty, select=shift-drag)? Recommendation: hybrid aligns with GRPC-06 lasso while keeping one-gesture pan. Select: A) Hybrid (drag-empty OR space+drag = pan, shift+drag = lasso) B) Pure slippy (drag-empty = pan, shift-drag = select/lasso)

2. **Fit-view keyboard shortcut:** Propose `1` (per slice spec) or `Shift+1` (Figma convention)? Select: A) `1` B) `Shift+1` C) Other (specify)

Record answers in this file, then never re-ask.

## 5. Tasks (incremental, TDD, each ends green+committed)

### Task 11.1 — Zoom config (cases: NAV-01, NAV-03)
- **Gherkin first**: `ViewportNavigation.feature` (scenarios = NAV-01, NAV-03)
- **Red**: `ViewportNavigation.test.tsx` — wheel at point P, content stays at P; wheel beyond bounds, clamps at 0.1/2.5, no jitter
- **Green**: Add `minZoom={0.1}`, `maxZoom={2.5}`, `zoomOnScroll={true}`, `zoomOnPinch={true}` to ReactFlow in GraphSim.tsx (lines 440-452)
- **Rip (if any)**: none
- **Story**: "NAV-01 zoom to cursor", "NAV-03 zoom limits" in `ViewportNavigation.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ViewportNavigation.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip NAV-01, NAV-03 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(viewport-navigation): Zoom config (NAV-01, NAV-03)`

### Task 11.2 — Pan modes (cases: NAV-02)
- **Gherkin first**: `ViewportNavigation.feature` (scenario = NAV-02)
- **Red**: `ViewportNavigation.test.tsx` — drag empty = pan; space+drag on node = pan; drag node = node-move (3 steps, disjoint semantics)
- **Green**: Add `panOnScroll={false}`, `panOnDrag={true}`, `panActivationKeyCode={' '}`, `selectionOnDrag={true}` to ReactFlow per user answer from §4 (hybrid or pure slippy)
- **Rip (if any)**: none
- **Story**: "NAV-02 pan modes" in `ViewportNavigation.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ViewportNavigation.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip NAV-02 row → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(viewport-navigation): Pan modes (NAV-02)`

### Task 11.3 — Fit-view control (cases: NAV-04)
- **Gherkin first**: `ViewportNavigation.feature` (scenario = NAV-04)
- **Red**: `ViewportNavigation.test.tsx` — spread nodes; click fit; all nodes bounded + padding; animated (transform transition)
- **Green**: Replace `<Controls />` with `<Controls showFitView={true} />` in GraphSim.tsx (line 451); add keyboard shortcut per user answer from §4 (use React Flow's `fitView` API via `useReactFlow` hook + `onKeyDown`)
- **Rip (if any)**: none
- **Story**: "NAV-04 fit view" in `ViewportNavigation.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ViewportNavigation.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip NAV-04 row → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(viewport-navigation): Fit-view control (NAV-04)`

### Task 11.4 — Minimap (cases: NAV-05, NAV-08)
- **Gherkin first**: `ViewportNavigation.feature` (scenarios = NAV-05, NAV-08)
- **Red**: `ViewportNavigation.test.tsx` — content beyond viewport; minimap nodes + viewport rect; drag rect pans; click jumps; user-caused spawn off-viewport = camera pans (animated); background spawn → minimap glow only
- **Green**: Add `<MiniMap pannable zoomable nodeStrokeWidth={3} nodeColor={({ node }) => node.data.status === 'running' ? theme.colors.primary : theme.colors.border} />` inside ReactFlow in GraphSim.tsx (after Controls, before closing tag); implement spawn reveal via `useReactFlow().fitView({ nodes: [newNode], duration: 800 })` in handleExpand/handleRefine for user-caused spawns; for background spawns (future E2), add glow effect to minimap node
- **Rip (if any)**: none
- **Story**: "NAV-05 minimap", "NAV-08 spawn reveal" in `ViewportNavigation.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ViewportNavigation.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip NAV-05, NAV-08 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(viewport-navigation): Minimap + spawn reveal (NAV-05, NAV-08)`

### Task 11.5 — Cursor semantics (cases: NAV-06)
- **Gherkin first**: `ViewportNavigation.feature` (scenario = NAV-06)
- **Red**: `ViewportNavigation.test.tsx` — hover states; grab/grabbing/pointer per surface
- **Green**: Add `onNodeMouseEnter={() => document.body.style.cursor = 'grab'}`, `onNodeMouseLeave={() => document.body.style.cursor = 'default'}`, `onNodeDragStart={() => document.body.style.cursor = 'grabbing'}`, `onNodeDragStop={() => document.body.style.cursor = 'grab'}` to ReactFlow in GraphSim.tsx
- **Rip (if any)**: none
- **Story**: "NAV-06 cursor semantics" in `ViewportNavigation.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ViewportNavigation.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip NAV-06 row → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(viewport-navigation): Cursor semantics (NAV-06)`

### Task 11.6 — Keyboard nudge (cases: NAV-07)
- **Gherkin first**: `ViewportNavigation.feature` (scenario = NAV-07)
- **Red**: `ViewportNavigation.test.tsx` — select; ArrowRight; Shift+Arrow; 1px / 10px position delta; physics reheats per GRPC-09 (if applicable in slice 10)
- **Green**: Add `onKeyDown={(evt) => { if (selectedNodeId) { const delta = evt.shiftKey ? 10 : 1; if (evt.key === 'ArrowRight') { setNodes(prev => prev.map(n => n.id === selectedNodeId ? { ...n, position: { x: n.position.x + delta, y: n.position.y } } : n)); evt.preventDefault(); } // repeat for other arrows } }` to ReactFlow in GraphSim.tsx (or use `useReactFlow` hook)
- **Rip (if any)**: none
- **Story**: "NAV-07 keyboard nudge" in `ViewportNavigation.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ViewportNavigation.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip NAV-07 row → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(viewport-navigation): Keyboard nudge (NAV-07)`

<4-8 tasks per slice. Task N depends only on N-1 and listed deps. No task spans >1 case-group.>

## 6. Skill + agent routing (per task)

| Task | Skills to load | Delegate to |
|---|---|---|
| 11.1 | `react-flow`, `test-driven-development`, `storybook-agentic-e2e` | `category="deep"` |
| 11.2 | `react-flow`, `test-driven-development`, `storybook-agentic-e2e` | `category="deep"` |
| 11.3 | `react-flow`, `test-driven-development`, `storybook-agentic-e2e` | `category="deep"` |
| 11.4 | `react-flow`, `test-driven-development`, `storybook-agentic-e2e` | `category="deep"` |
| 11.5 | `react-flow`, `test-driven-development`, `storybook-agentic-e2e` | `category="deep"` |
| 11.6 | `react-flow`, `test-driven-development`, `storybook-agentic-e2e` | `category="deep"` |

## 7. Live-system validation gate (slice DONE only when ALL pass)

1. Run validation stories: `npx vitest run --project=storybook -t "slice11"`
2. Every case ID in slice → story → play fn asserts pass (see validation spec assert table)
3. Manifest: all slice rows `pass` (or `deferred` w/ reason)
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

- Fish-eye lens dual-scale (deferred research, see broader-vision/research-inspiration-survey.md synthesis)
- 3D tier navigation (orbit/fly controls for react-force-graph-3d when that tier lands)
- Custom minimap styling beyond React Flow built-in props
- Non-React Flow navigation implementations

---
