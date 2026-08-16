# S06 — Agent Context & Mutation Semantics Implementation Plan

> Executes: `docs/feature-requirements/slices/06-agent-semantics.md` (cases: AGT-01..06, AGTC-01..03)
> Validation spec: `docs/feature-requirements/validation/slice-06.validation.md`
> Status: NOT-STARTED
> Depends on: E2-agent-runtime-bridge, E3-fs-graph-sync

## 1. Objective

Wires agent mutations → graph state via event bus + FS sync. Implements 7-op GraphMutation vocabulary, default context resolution, intervention gesture, and spawn placement semantics.

## 2. Inputs (READ FIRST — in this order)

| Input | Path |
|---|---|
| Requirements slice | `docs/feature-requirements/slices/06-agent-semantics.md` |
| Inherited case source | `docs/broader-vision/requirements/05-agent-context-semantics.md` |
| Validation spec | `docs/feature-requirements/validation/slice-06.validation.md` |
| User-flow narrative | `docs/broader-vision/user-flows.md` (Flow B, F) |
| Skills to load | `agent-runtime-bridge`, `fs-graph-sync`, `test-driven-development`, `modern-react`, `storybook`, `storybook-agentic-e2e` |
| Code-rip sources | `.repos/ragflow/web/src/pages/agent/hooks.tsx` |

## 3. File plan (REAL paths)

| Action | Path | Notes |
|---|---|---|
| create | `vision-graph-ui/src/features/agent-bridge/useAgentEvtStream.ts` | E2 event bus consumer, derives busy-set, step-title-by-node, lastMutation |
| create | `vision-graph-ui/src/features/agent-bridge/useAgentEvtStream.test.ts` | Tests derived sets, not raw events |
| create | `vision-graph-ui/src/features/agent-bridge/agentBridgeTypes.ts` | AgentEvt, GraphMutation types (AGTC-01 vocabulary) |
| create | `vision-graph-ui/src/features/agent-semantics/useAgentContext.ts` | AGT-01 default context resolution (spoken-to node) |
| create | `vision-graph-ui/src/features/agent-semantics/useAgentContext.test.ts` | Context resolution tests |
| create | `vision-graph-ui/src/features/agent-semantics/agentSemanticsTypes.ts` | PromptPayload with contextNodeId, linkedNodeIds |
| create | `vision-graph-ui/src/features/agent-semantics/agentSemantics.feature` | Gherkin for AGT-01..03, AGTC-03 |
| create | `vision-graph-ui/src/features/agent-semantics/AgentSemantics.stories.tsx` | Storybook validation stories per spec |
| create | `vision-graph-ui/src/features/agent-semantics/useGraphMutationHandler.ts` | AGTC-01 event→graph projection (7-op animation mapping) |
| create | `vision-graph-ui/src/features/agent-semantics/useGraphMutationHandler.test.ts` | Animation mapping asserts |
| create | `vision-graph-ui/src/features/agent-semantics/mutationAnimations.ts` | AGTC-01 canonical animation class lookup table |
| create | `vision-graph-ui/src/features/agent-semantics/useSpawnPlacement.ts` | AGTC-02 spawn offset calculation (spring distance from parent) |
| create | `vision-graph-ui/src/features/agent-semantics/useSpawnPlacement.test.ts` | Adjacent placement + fade-in animation asserts |
| create | `vision-graph-ui/src/features/agent-semantics/useIntervention.ts` | AGTC-03 intervention gesture (correction queue) |
| create | `vision-graph-ui/src/features/agent-semantics/useIntervention.test.ts` | Intervention queue + status interruption asserts |
| create | `vision-graph-ui/src/features/agent-semantics/AgentSemantics.stories.tsx` | All validation stories per spec |
| create | `vision-graph-ui/src/features/agent-semantics/fixtures/` | storybook-agentic-e2e JSONL fixtures for fake runtime |
| rip→port | `vision-graph-ui/src/features/agent-bridge/derivedSets.ts` FROM `.repos/ragflow/web/src/pages/agent/hooks.tsx` | Event-derived busy-set ONLY (hasCycle validation owned by S10 `src/adapted/has-cycle-validator.ts` — import, do not re-port) |
| modify | `vision-graph-ui/src/features/graph-sim/GraphSim.tsx` | Wire useAgentEvtStream, useGraphMutationHandler into graph state |
| modify | `vision-graph-ui/src/shared/fsGraphLoader.ts` | Add E3 watcher→graph projection (AGT-06 FS truth) |

## 4. Question-cycle gate (AGENTS.md §1 Stage 1 — MANDATORY before tests)

Ask user (2-3 questions max, `question` tool):

1. **Spawn placement radius (AGTC-02)**: What distance should new nodes appear from parent?
   - A. Fixed 200px radius (consistent radial placement)
   - B. Dynamic radius based on sibling count (crowd-aware)
   - C. Random offset within 150-250px ring (natural feel)

2. **Intervention gesture surface (AGTC-03)**: Where does user type corrections during agent execution?
   - A. Existing modal composer (reuses EXP surface)
   - B. Dedicated intervention panel (new chrome)
   - C. Inline tooltip near running node (minimal intrusion)

3. **Stop/pause gesture**: Should there be an explicit stop button for agents?
   - A. Yes, in expanded modal execution area (explicit control)
   - B. No, intervention only (correction redirects flow)
   - C. Optional, per user settings (configurable)

ANSWERED 2026-08-16: Q1=B dynamic radius by sibling count (crowd-aware). Q2=C inline tooltip near running node (minimal intrusion). Q3=A yes, stop button in expanded modal execution area.

## 5. Tasks (incremental, TDD, each ends green+committed)

### Task 6.1 — Agent event bus + derived sets (cases: AGTC-01 foundation)
- **Gherkin first**: `vision-graph-ui/src/features/agent-bridge/useAgentEvtStream.feature` (scenarios = event stream → busy-set)
- **Red**: `useAgentEvtStream.test.ts` + scenarios fail (AgentEvt type not defined, derived sets not implemented)
- **Green**: implement `useAgentEvtStream`, define `AgentEvt`/`GraphMutation` types, derive `busyNodeIds`, `stepTitleByNode`, `lastMutation` via lodash/fp flow
- **Rip**: port `startButNotFinished` pattern from `.repos/ragflow/web/src/pages/agent/hooks.tsx` → `derivedSets.ts` via `oss-code-adaptation` skill (license: Apache-2.0, verified). hasCycle NOT ripped here — import `src/adapted/has-cycle-validator.ts` from S10 if needed for edge validation
- **Story**: `AgentEvtStream basic` in `AgentSemantics.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run useAgentEvtStream.test.ts` — all exit 0
- **Manifest**: flip AGTC-01 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(agent-bridge): Event bus + derived sets (AGTC-01 foundation)`

### Task 6.2 — Default context resolution (cases: AGT-01, AGT-02, AGT-03)
- **Gherkin first**: `vision-graph-ui/src/features/agent-semantics/agentSemantics.feature` (scenarios = spoken-to default, linked refs, single file)
- **Red**: `useAgentContext.test.ts` + scenarios fail (contextNodeId not in payload, linked refs not resolved)
- **Green**: implement `useAgentContext`, define `PromptPayload` type, resolve spoken-to node, resolve linked refs via graph edges, enforce single-file init
- **Story**: `AGT-01 default context`, `AGT-02 linked edit allowed`, `AGT-03 initial one file` in `AgentSemantics.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run useAgentContext.test.ts` — all exit 0
- **Manifest**: flip AGT-01, AGT-02, AGT-03 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(agent-semantics): Context resolution (AGT-01..03)`

### Task 6.3 — Graph mutation event projection (cases: AGTC-01, AGT-04)
- **Gherkin first**: `vision-graph-ui/src/features/agent-semantics/mutationAnimations.feature` (scenarios = 7-op animation mapping)
- **Red**: `useGraphMutationHandler.test.ts` + scenarios fail (animation class lookup not defined, graph state not mutated)
- **Green**: implement `useGraphMutationHandler`, create `mutationAnimations.ts` lookup table (spawn→fade+settle, edit→pulse, etc.), map GraphMutation ops to React Flow node/edge changes
- **Story**: `AGTC-01 event vocabulary`, `AGT-04 mutations as movement` in `AgentSemantics.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run useGraphMutationHandler.test.ts && npm run build-storybook` — all exit 0
- **Manifest**: flip AGTC-01, AGT-04 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(agent-semantics): Mutation event projection (AGTC-01, AGT-04)`

### Task 6.4 — Spawn placement semantics (cases: AGTC-02)
- **Gherkin first**: `vision-graph-ui/src/features/agent-semantics/useSpawnPlacement.feature` (scenarios = adjacent placement, fade-in, link draw)
- **Red**: `useSpawnPlacement.test.ts` + scenarios fail (offset calculation not implemented, animation class not applied)
- **Green**: implement `useSpawnPlacement`, calculate adjacent position (per question 1 answer), apply fade-in animation, draw parent link in same beat
- **Story**: `AGTC-02 spawn placement` in `AgentSemantics.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run useSpawnPlacement.test.ts && npm run build-storybook` — all exit 0
- **Manifest**: flip AGTC-02 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(agent-semantics): Spawn placement (AGTC-02)`

### Task 6.5 — Intervention gesture (cases: AGT-05, AGTC-03)
- **Gherkin first**: `vision-graph-ui/src/features/agent-semantics/useIntervention.feature` (scenarios = correction queue, status interruption, no surface block)
- **Red**: `useIntervention.test.ts` + scenarios fail (queue not defined, status not updated, surface blocks input)
- **Green**: implement `useIntervention`, queue correction prompts, update execution status to reflect interruption, ensure input surface remains responsive (per question 2 answer)
- **Story**: `AGT-05 intervene`, `AGTC-03 intervention path` in `AgentSemantics.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run useIntervention.test.ts && npm run build-storybook` — all exit 0
- **Manifest**: flip AGT-05, AGTC-03 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(agent-semantics): Intervention gesture (AGT-05, AGTC-03)`

### Task 6.6 — FS→graph projection (cases: AGT-06)
- **Gherkin first**: `vision-graph-ui/src/features/agent-semantics/fsGraphProjection.feature` (scenarios = file write → node appear/update, FS truth)
- **Red**: modify `fsGraphLoader.test.ts`, add scenarios fail (watcher not wired, graph not reloaded on external edit)
- **Green**: modify `fsGraphLoader.ts`, add E3 watcher integration (per fs-graph-sync skill), reload node subtree on external FS change, enforce FS wins conflict rule
- **Story**: `AGT-06 fs projects to graph` in `AgentSemantics.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run fsGraphLoader.test.ts && npm run build-storybook` — all exit 0
- **Manifest**: flip AGT-06 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(fs-graph-sync): FS→graph projection (AGT-06)`

### Task 6.7 — Wire into GraphSim (cases: integration)
- **Gherkin first**: `vision-graph-ui/src/features/agent-semantics/graphIntegration.feature` (scenarios = end-to-end agent run → graph updates)
- **Red**: modify `GraphSim.test.ts`, add scenarios fail (useAgentEvtStream not wired, mutations not projected)
- **Green**: modify `GraphSim.tsx`, wire `useAgentEvtStream`, `useGraphMutationHandler`, `useAgentContext` into graph state, pass events to React Flow, integrate with existing `useAgenticTodoCycle`
- **Story**: `AGT-04..06 end-to-end` in `AgentSemantics.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run GraphSim.test.ts && npm run build-storybook` — all exit 0
- **Manifest**: verify all AGT/AGTC rows `pass` in coverage-manifest.tsv
- **Commit**: `feat(graph-sim): Agent semantics integration (end-to-end)`

### Task 6.8 — Fake runtime fixtures (cases: storybook validation)
- **Gherkin first**: `vision-graph-ui/src/features/agent-semantics/fixtures/runtime.feature` (scenarios = JSONL fixture generation)
- **Red**: create fixture files, add scenarios fail (fixtures not emit GraphMutation sequences)
- **Green**: implement `fixtures/` JSONL files per validation story, emit realistic AgentEvt sequences with GraphMutation ops (spawn, edit, move, group, detach, link, unlink), load via storybook-agentic-e2e skill
- **Story**: All slice06 stories in `AgentSemantics.stories.tsx` use fixtures
- **Verify**: `cd vision-graph-ui && npx vitest run --project=storybook -t "slice06" && npm run build-storybook` — all exit 0
- **Manifest**: verify all slice06 rows `pass` in coverage-manifest.tsv, run `check-coverage.sh` GREEN
- **Commit**: `feat(agent-semantics): Fake runtime fixtures (storybook validation)`

## 6. Skill + agent routing (per task)

| Task | Skills to load | Delegate to |
|---|---|---|
| 6.1 | `agent-runtime-bridge`, `test-driven-development`, `modern-react` | `category="deep"` |
| 6.2 | `test-driven-development`, `modern-react` | `category="deep"` |
| 6.3 | `agent-runtime-bridge`, `test-driven-development`, `modern-react`, `storybook` | `category="deep"` |
| 6.4 | `test-driven-development`, `modern-react`, `storybook` | `category="deep"` |
| 6.5 | `test-driven-development`, `modern-react`, `storybook` | `category="deep"` |
| 6.6 | `fs-graph-sync`, `test-driven-development`, `modern-react` | `category="deep"` |
| 6.7 | `test-driven-development`, `modern-react`, `agent-runtime-bridge` | `category="deep"` |
| 6.8 | `storybook-agentic-e2e`, `storybook`, `test-driven-development` | `category="quick"` |

## 7. Live-system validation gate (slice DONE only when ALL pass)

1. Run validation stories: `npx vitest run --project=storybook -t "slice06"`
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

- Real whitt-execution-engine integration (E2 fake runtime only for this slice)
- Actual agent workflow execution (storybook fixtures only)
- Git time travel (slice 09)
- Context pills (slice 08)
- Canvas manipulation physics (slice 10)
- Node lifecycle modal (slice 04)
- Voice capture STT (slice 02, slice 03)
- Project rail/app shell (slice 01)

---
