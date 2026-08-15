# E4 — ReactFlow Upgrade Implementation Plan

> Executes: enabler migration (reactflow 11 → @xyflow/react 12)
> Validation spec: per AGENTS.md §7 verification commands
> Status: DONE (2026-08-14) — commits cff3bd8 (dep swap), f2766f6 (imports ×4 files), 20f718b (nodeTypes memo). Verification: `npx tsc --noEmit` exit 0; `npx vitest run` 12 failed / 163 passed = exact pre-existing baseline (fsGraphLoader ×7, NodeDetailPanel ×1, Node ×1, GraphSim act() ×3), 0 new failures; `npm run build-storybook` exit 0; `npx vite build` exit 0 (190.92 kB js / 60.25 kB gzip); grep `from 'reactflow'` = 0. Storybook smoke (built static + playwright): GraphPage node drag 120px MOVED-OK 0 JS errors; GraphSim picker→project load→10 nodes render 0 JS errors. NOTE: `vitest --project=storybook` fails on PRE-EXISTING infra issue (dynamic-import + iframe CORS errors, affects all stories, not v12 — logged for later lane).
> Depends on: nothing (FIRST enabler, parallel w/ E1)

## 1. Objective

Migrate from `reactflow@11` to `@xyflow/react@12` with zero behavior change. Unblocks v12 features consumed by S04, S10, S11 (connectionStatus, nodeDragThreshold, onBeforeDelete, ViewportPortal). Surgical refactor: dep swap + import rename + nodeTypes memo + type fixes.

## 2. Inputs (READ FIRST — in this order)

| Input | Path |
|---|---|
| Template | `docs/implementation-plans/CONTEXT/TEMPLATE.md` |
| Migration facts | `docs/implementation-plans/CONTEXT/C2-xyflow12-migration-facts.md` (verified: 4 files, nodeTypes memo fix, rename map, Azure PR evidence) |
| Verification commands | `vision-graph-ui/AGENTS.md` §7 (tsc, vitest, build-storybook, vite build) |
| Root boundary | `vision-graph-ui/AGENTS.md` §11 (npm commands MUST run in vision-graph-ui/) |
| Skills to load | `react-flow`, `modern-react`, `verification-before-completion` |
| Code-rip sources | none |

## 3. File plan (REAL paths)

| Action | Path | Notes |
|---|---|---|
| modify | `vision-graph-ui/package.json` | Swap `reactflow` → `@xyflow/react@^12.11.3` |
| modify | `vision-graph-ui/src/features/graph-page/GraphPage.tsx` | Import rename: `reactflow` → `@xyflow/react`, CSS path update |
| modify | `vision-graph-ui/src/features/graph-page/GraphPage.stories.tsx` | Import rename: `reactflow` → `@xyflow/react` |
| modify | `vision-graph-ui/src/features/graph-sim/GraphSim.tsx` | Import rename + nodeTypes memo (line 391) |
| modify | `vision-graph-ui/src/shared/fsGraphLoader.ts` | Import rename: `reactflow` → `@xyflow/react` |

<Every task in §5 touches ONLY files listed here. No new files.>

## 4. Question-cycle gate (AGENTS.md §1 Stage 1 — MANDATORY before tests)

**SKIPPED** per AGENTS.md §1: "Skip this stage ONLY for trivial refactors (no behavior change)." This is a library upgrade with zero behavior change — pure mechanical migration per C2 facts.

## 5. Tasks (incremental, type-safe, each ends green+committed)

### Task 1 — Dependency swap (cases: none, infrastructure)
- **Action**: `cd vision-graph-ui && npm install @xyflow/react@^12.11.3 && npm uninstall reactflow`
- **Verify**: `cat package.json | grep -E "reactflow|xyflow"` — confirms swap, old gone
- **Commit**: `chore(deps): swap reactflow 11 → @xyflow/react 12`

### Task 2 — Import rename (4 files) (cases: none, infrastructure)
- **Modify**: 4 source files per file plan §3. Apply rename map from C2:
  ```typescript
  // OLD
  import ReactFlow from 'reactflow'
  import 'reactflow/dist/style.css'
  // NEW
  import { ReactFlow } from '@xyflow/react'
  import '@xyflow/react/dist/style.css'
  ```
- **Files touched**: GraphPage.tsx, GraphPage.stories.tsx, GraphSim.tsx, fsGraphLoader.ts
- **Verify**: `grep -r "from 'reactflow'" src/` — must return 0 (no matches)
- **Commit**: `refactor(react-flow): rename imports reactflow → @xyflow/react`

### Task 3 — NodeTypes memo (cases: none, infrastructure)
- **Modify**: `vision-graph-ui/src/features/graph-sim/GraphSim.tsx` line 391
- **Change**: Wrap nodeTypes in useMemo (v12 requirement, per C2 line 16)
  ```typescript
  // BEFORE
  const nodeTypes = {
    custom: (props: any) => <Node {...props} onSend={handleNodeSend} />,
  }
  // AFTER
  const nodeTypes = useMemo(() => ({
    custom: (props: any) => <Node {...props} onSend={handleNodeSend} />,
  }), [])
  ```
- **Verify**: `grep -A2 "const nodeTypes" src/features/graph-sim/GraphSim.tsx` — shows useMemo wrapper
- **Commit**: `refactor(react-flow): memoize nodeTypes (v12 requirement)`

### Task 4 — Type fixes until tsc clean (cases: none, infrastructure)
- **Run**: `cd vision-graph-ui && npx tsc --noEmit`
- **Fix**: Any type errors (expect minimal per C2 line 55). Common v12 patterns:
  - `nodeInternals` → `nodeLookup`
  - `parentNode` → `parentId`
  - `posX/posY` → `positionAbsoluteX/Y`
  - `node.width/height` → `node.measured?.width/?.height`
  - `updateEdge` → `reconnectEdge`
- **Verify**: `npx tsc --noEmit` — exits 0
- **Commit**: `fix(types): v12 type fixes after migration`

### Task 5 — Full verify suite (cases: none, infrastructure)
- **Run vitest**: `cd vision-graph-ui && npx vitest run` — must exit 0. Note: 12 pre-existing failing tests (baseline). Verify NO NEW failures added.
- **Run storybook build**: `npm run build-storybook` — must exit 0
- **Run prod build**: `npx vite build` — must exit 0
- **Quarantine note**: If 12 baseline tests fail, they were failing before E4. Do NOT block on them. Document: "12 pre-existing failing tests (see requirements-regression skill quarantine rules). No NEW failures vs baseline."
- **Commit**: `refactor(react-flow): migration complete, verify suite green`

### Task 6 — Storybook smoke test (cases: none, infrastructure)
- **Start**: `npm run storybook` (let it spin up)
- **Verify**: Open GraphPage story → renders without error
- **Verify**: Open GraphSim story → renders without error
- **Verify**: Drag node by pointer → moves, no console errors
- **Stop**: Ctrl+C storybook
- **Note**: Snapshot baselines may legitimately change due to nodeTypes memo. Document in commit: "nodeTypes memo change — snapshot updates expected."
- **Commit**: `test(react-flow): storybook smoke passes (GraphPage + GraphSim render + drag)`

<6 tasks total. Task N depends only on N-1. This is a refactor, no new behavior, no .feature files.>

## 6. Skill + agent routing (per task)

| Task | Skills to load | Delegate to |
|---|---|---|
| 1-2 | `react-flow`, `modern-react` | do-not-delegate (mechanical) |
| 3 | `react-flow`, `modern-react` | do-not-delegate (1-line memo wrap) |
| 4 | `react-flow`, `modern-react` | do-not-delegate (type fixes) |
| 5 | `verification-before-completion`, `modern-react` | do-not-delegate (verify only) |
| 6 | `verification-before-completion`, `storybook` | do-not-delegate (smoke test) |

## 7. Live-system validation gate (enabler DONE only when ALL pass)

1. All 6 tasks complete, each committed
2. `npx tsc --noEmit` — 0 errors
3. `npx vitest run` — 0 exit, no NEW failures vs 12-test baseline
4. `npm run build-storybook` — 0 exit
5. `npx vite build` — 0 exit
6. Storybook runs, GraphPage + GraphSim stories render, drag works

## 8. Retry loop (failure = iterate, NEVER skip)

```
attempt → fail → read actual log lines (AGENTS.md §2)
  → hypothesis → minimal fix → re-run verify cmd
  → fail again? ×2 → load systematic-debugging skill
  → fail ×3 → escalate: oracle subagent w/ full ctx → fix → re-run
  → NEVER: delete test, loosen assert, extend timeout >2×, mark skip w/o user OK
```

## 9. Out of scope / guards

- NO new files (this is a refactor, no .feature, no new components)
- NO behavior change — styled-components untouched, UI identical
- NO breaking changes to public API of GraphPage/GraphSim
- Skip question cycle per AGENTS.md §1 (trivial refactor)
- Snapshot/story baselines may change (nodeTypes memo) — document in commit
- Do NOT fix 12 pre-existing failing tests — they are pre-migration baseline
- Do NOT touch files outside §3 file plan
- Do NOT add v12 features yet (S04/S10/S11 will consume them)

---

## Template rules (enforced by check-plans.sh)

1. Sections 1-9 present, in order, headings exact.
2. Every case ID mentioned exists in `docs/feature-requirements/validation/coverage-manifest.tsv`.
3. Every `.repos/` path mentioned exists on disk (checked against CONTEXT/C0).
4. Every `vision-graph-ui/` create/modify path matches slice layout rules (AGENTS.md §3/§11).
5. Every story name matches validation spec story column.
6. Status line filled. No TBD / TODO / <fill in> placeholders in final plans.
7. Rip tasks only from C0 "Rip-able" table. READ-ONLY repos never appear in rip rows.
