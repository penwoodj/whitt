# S11 — Viewport & Navigation Implementation Plan

> Executes: `docs/feature-requirements/slices/11-viewport-navigation.md` (cases: NAV-01..08, NAVX-01..10)
> Validation spec: `docs/feature-requirements/validation/slice-11.validation.md`
> Status: DONE (2026-08-16). All 14 tasks + repairs: commits 0482709..69f76d4, a990ec9 (provider restructure GraphSimFlow + ReactFlowProvider), 213b710 (graph-ready harness: project-click + canvas testid). Gate: viewport 20/20, GraphSim 3f/11p = baseline trio, full 5 failed/533 pass EXACT baseline, tsc 0, SB 0. Manifest NAV+NAVX 18 rows pass w/ slice11 story names.
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

**User answers (verbatim from dictation):**

**Answer 1 (ctrl-accelerated pan, arrow keys + WASD, expanded node drag via padding, corner resize, persistence, modal sizing, markdown + metadata separation):**
"This has already been answered in previous answers in this? machine in the chain but the left click on a non- non-node and non- connection allows you to pan and when control is used The pan is sped up, and I want the same behavior with arrow keys and W A S D When not and not selected into a speech-to-text to text input. If you normal left click a node you can drag and move it around and all of its connections move with it. If the node is expanding expanded and you are not clicking into a defined area and you're clicking into the padding in between or around the neck around the node then you can drag the node as well that way when it is expanded. I also want to be able two from the corners on the rounded border be able to Expand and contract the expanded state of the node and have that stored and stay between loading sessions So the node's location is stored and its grouping is stored in the file system And I also want the individual node modal window sizes to be Have it in a default size that fits the content to content but once there is details or information in the document that is not metadata Then I want to be able to expand and contract with a min height and a faded shadow of shadow over the text and a scroll bar but all with soft edges And that is the minimum height of the node is the content plus that minimum height display for the document content. I would also like this to be always plain markdown and always put metadata in the appropriate .whitt folder"

**Answer 2 (ESC zoom-out historical):**
"esc zooms you out a level which does a historical view for the previous level up of the graph with the current grouping soft or hard being contracted to its smaller view"

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

### Task 11.7 — Ctrl-accelerated pan (cases: NAVX-01)
- **Gherkin first**: `ViewportNavigation.feature` (scenario = NAVX-01)
- **Red**: `ViewportNavigation.test.tsx` — drag empty with Ctrl; verify pan speed > normal pan
- **Green**: Modify `onMove` handler in GraphSim.tsx to detect `evt.ctrlKey` and multiply pan speed (propose 2x acceleration)
- **Rip (if any)**: none
- **Story**: "NAVX-01 ctrl-accelerated pan" in `ViewportNavigation.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ViewportNavigation.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip NAVX-01 row → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(viewport-navigation): Ctrl-accelerated pan (NAVX-01)`

### Task 11.8 — Arrow keys + WASD pan (cases: NAVX-02, NAVX-03)
- **Gherkin first**: `ViewportNavigation.feature` (scenarios = NAVX-02, NAVX-03)
- **Red**: `ViewportNavigation.test.tsx` — press Arrow keys; press WASD; verify pan; verify suppressed when STT input focused
- **Green**: Extend `onKeyDown` handler in GraphSim.tsx to handle ArrowUp/Down/Left/Right and W/A/S/D for panning when NOT focused in STT input; use `useReactFlow().setTransform` for pan; check STT input focus state
- **Rip (if any)**: none
- **Story**: "NAVX-02 arrow keys pan", "NAVX-03 WASD pan" in `ViewportNavigation.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ViewportNavigation.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip NAVX-02, NAVX-03 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(viewport-navigation): Arrow keys + WASD pan (NAVX-02, NAVX-03)`

### Task 11.9 — Expanded node drag via padding (cases: NAVX-04)
- **Gherkin first**: `ViewportNavigation.feature` (scenario = NAVX-04)
- **Red**: `ViewportNavigation.test.tsx` — expand node; drag padding area; verify node moves with connections
- **Green**: Modify node drag handlers in GraphSim.tsx to detect clicks on padding areas (not on defined content areas) when expanded; reuse existing node drag logic for padding drags
- **Rip (if any)**: none
- **Story**: "NAVX-04 expanded node drag via padding" in `ViewportNavigation.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ViewportNavigation.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip NAVX-04 row → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(viewport-navigation): Expanded node drag via padding (NAVX-04)`

### Task 11.10 — Corner resize handles (cases: NAVX-05)
- **Gherkin first**: `ViewportNavigation.feature` (scenario = NAVX-05)
- **Red**: `ViewportNavigation.test.tsx` — expand node; hover corners; drag corner; verify size change; verify size persists
- **Green**: Add resize handles at rounded corners in NodeDetailPanel component; implement resize logic with mouse drag; persist size to node metadata in .whitt folder; load size on node open
- **Rip (if any)**: none
- **Story**: "NAVX-05 corner resize handles for expanded node" in `ViewportNavigation.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ViewportNavigation.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip NAVX-05 row → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(viewport-navigation): Corner resize handles (NAVX-05)`

### Task 11.11 — Node location + grouping persistence (cases: NAVX-06)
- **Gherkin first**: `ViewportNavigation.feature` (scenario = NAVX-06)
- **Red**: `ViewportNavigation.test.tsx` — move node; change grouping; reload; verify persistence
- **Green**: Extend node metadata persistence to store position and group membership in .whitt folder; load on graph init; debounced sync with FS
- **Rip (if any)**: none (uses fs-graph-sync from E3)
- **Story**: "NAVX-06 node location and grouping persistence" in `ViewportNavigation.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ViewportNavigation.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip NAVX-06 row → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(viewport-navigation): Node location + grouping persistence (NAVX-06)`

### Task 11.12 — Node modal sizing (cases: NAVX-07, NAVX-08)
- **Gherkin first**: `ViewportNavigation.feature` (scenarios = NAVX-07, NAVX-08)
- **Red**: `ViewportNavigation.test.tsx` — open modal; verify fit content; expand/contract; verify min height + shadow + scrollbar
- **Green**: Implement fit-content default sizing in NodeDetailPanel; add expand/contract affordance; enforce min height = content + min display; add faded shadow over text when overflow; add soft-edge scrollbar
- **Rip (if any)**: none
- **Story**: "NAVX-07 node modal fit content default", "NAVX-08 node modal expandable with min height" in `ViewportNavigation.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ViewportNavigation.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip NAVX-07, NAVX-08 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(viewport-navigation): Node modal sizing (NAVX-07, NAVX-08)`

### Task 11.13 — Plain markdown + metadata separation (cases: NAVX-09)
- **Gherkin first**: `ViewportNavigation.feature` (scenario = NAVX-09)
- **Red**: `ViewportNavigation.test.tsx` — create node with content + metadata; verify separation
- **Green**: Ensure NodeDetailPanel always renders body as plain markdown; ensure all metadata stored in .whitt folder (not in markdown file); verify separation on load/save
- **Rip (if any)**: none
- **Story**: "NAVX-09 plain markdown body + metadata separation" in `ViewportNavigation.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ViewportNavigation.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip NAVX-09 row → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(viewport-navigation): Plain markdown + metadata separation (NAVX-09)`

### Task 11.14 — ESC zoom-out historical (cases: NAVX-10)
- **Gherkin first**: `ViewportNavigation.feature` (scenario = NAVX-10)
- **Red**: `ViewportNavigation.test.tsx` — zoom into group; press ESC; verify zoom out to parent level; verify group contracts
- **Green**: Implement ESC key handler in GraphSim.tsx that tracks zoom history; on ESC, pop previous zoom level and fit view; contract current grouping to smaller view (soft/hard)
- **Rip (if any)**: none
- **Story**: "NAVX-10 ESC zoom out one level historical" in `ViewportNavigation.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ViewportNavigation.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip NAVX-10 row → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(viewport-navigation): ESC zoom-out historical (NAVX-10)`

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
| 11.7 | `react-flow`, `test-driven-development`, `storybook-agentic-e2e` | `category="deep"` |
| 11.8 | `react-flow`, `test-driven-development`, `storybook-agentic-e2e` | `category="deep"` |
| 11.9 | `react-flow`, `test-driven-development`, `storybook-agentic-e2e` | `category="deep"` |
| 11.10 | `react-flow`, `test-driven-development`, `storybook-agentic-e2e` | `category="deep"` |
| 11.11 | `react-flow`, `test-driven-development`, `fs-graph-sync`, `storybook-agentic-e2e` | `category="deep"` |
| 11.12 | `react-flow`, `test-driven-development`, `storybook-agentic-e2e` | `category="deep"` |
| 11.13 | `react-flow`, `test-driven-development`, `storybook-agentic-e2e` | `category="deep"` |
| 11.14 | `react-flow`, `test-driven-development`, `storybook-agentic-e2e` | `category="deep"` |

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
