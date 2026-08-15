# S04 — Node Lifecycle Modal Implementation Plan

> Executes: `docs/feature-requirements/slices/04-node-lifecycle-modal.md` (cases: EXP-01..11, EXPC-01..04)
> Validation spec: `docs/feature-requirements/validation/slice-04.validation.md`
> Status: NOT-STARTED
> Depends on: E4

## 1. Objective

Extend existing 3-state node lifecycle (collapsed/hovered/expanded per ADR-0012) to full modal view. Modal provides bar-of-light slot at top, halo around node, single-modal constraint, size caps (~80% viewport), origin-anchored transitions (200-300ms), and three-way close (ESC/click-outside/X). Enables Flow B (voice → execute → expanded node) and Flow D (manual open + confirm before execute) user journeys.

## 2. Inputs (READ FIRST — in this order)

| Input | Path |
|---|---|
| Requirements slice | `docs/feature-requirements/slices/04-node-lifecycle-modal.md` |
| Inherited case source | `docs/broader-vision/requirements/03-expanded-node-modal.md` (EXP-01..11) |
| Validation spec | `docs/feature-requirements/validation/slice-04.validation.md` |
| User-flow narrative | `docs/broader-vision/user-flows.md` (Flow B, D) |
| Skills to load | `modern-react`, `react-flow`, `storybook`, `test-driven-development` |
| Code-rip sources | `none` |

## 3. File plan (REAL paths)

| Action | Path | Notes |
|---|---|---|
| create | `vision-graph-ui/src/features/node/features/node-modal.feature` | Gherkin scenarios = EXP-01..11, EXPC-01..04 |
| create | `vision-graph-ui/src/features/node/NodeModal.test.tsx` | Maps .feature scenarios; test doubles for send/execution |
| create | `vision-graph-ui/src/features/node/NodeModal.stories.tsx` | Stories per validation spec; fixtures from nodeData |
| create | `vision-graph-ui/src/features/node/NodeModalWrapper.tsx` | Modal container; size caps, position, overlay, close logic |
| create | `vision-graph-ui/src/features/node/NodeModalBarSlot.tsx` | Bar of light at top; breathing, click/dblclick, hover tooltip |
| create | `vision-graph-ui/src/features/node/NodeModalHalo.tsx` | Halo around modal; breathing when recording |
| create | `vision-graph-ui/src/features/node/NodeModalContent.tsx` | Scrollable content area (future S05/S07 interiors) |
| create | `vision-graph-ui/src/features/node/useModalState.ts` | Modal lifecycle: open/close, single-modal, size caps, origin pos |
| modify | `vision-graph-ui/src/features/node/Node.tsx` | Integrate modal; handle right-click, dblclick send, ESC precedence |
| modify | `vision-graph-ui/src/features/node/useNodeState.ts` | Add modal state; manage collapsed/hovered/expanded/modal |

<Every task in §5 touches ONLY files listed here. New file = new row.>

## 4. Question-cycle gate (AGENTS.md §1 Stage 1 — MANDATORY before tests)

Ask user (2-3 multiple-choice questions max, `question` tool):

1. **Modal max-size caps (C1 O5)**: Cap expanded modal size how?
   - A) Viewport percentages (e.g. 80vw × 80vh — scales w/ window)
   - B) Fixed px (e.g. 640 × 720 — predictable layout)
   - C) Hybrid (fixed w/ clamp to viewport %)

2. **ESC precedence order**: ESC pressed while tooltip pinned inside expanded modal — what closes first?
   - A) Tooltip first, then modal on second ESC (innermost-first)
   - B) Modal + tooltip together (one ESC = full collapse)
   - C) Modal only; tooltip needs X click

3. **Origin transition anchor**: Expansion morph anchors where?
   - A) Node center (symmetric growth)
   - B) Bubble position top-left (reads as "grows down-right")

Record answers in this file, then never re-ask.

## 5. Tasks (incremental, TDD, each ends green+committed)

### Task 5.1 — Modal state foundation (cases: EXPC-01, EXPC-04)

- **Gherkin first**: `vision-graph-ui/src/features/node/features/node-modal.feature` (scenarios = EXPC-01, EXPC-04)
- **Red**: `vision-graph-ui/src/features/node/NodeModal.test.tsx` + scenarios EXPC-01 (single modal), EXPC-04 (origin transition)
- **Green**: `vision-graph-ui/src/features/node/useModalState.ts` + `vision-graph-ui/src/features/node/NodeModalWrapper.tsx` (state mgmt, modal container)
- **Rip (if any)**: none
- **Story**: `EXPC-01 single modal` + `EXPC-04 origin transition` in `NodeModal.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run NodeModal.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip `EXPC-01`, `EXPC-04` rows → `ready`→`pass` in coverage-manifest.tsv (requirements-regression skill)
- **Commit**: `feat(node-modal): Modal state foundation (EXPC-01, EXPC-04)`

### Task 5.2 — Modal size caps + close paths (cases: EXP-11, EXPC-02)

- **Gherkin first**: `vision-graph-ui/src/features/node/features/node-modal.feature` (scenarios = EXP-11, EXPC-02)
- **Red**: `vision-graph-ui/src/features/node/NodeModal.test.tsx` + scenarios EXP-11 (close tri-path), EXPC-02 (size caps)
- **Green**: `vision-graph-ui/src/features/node/NodeModalWrapper.tsx` (size caps ~80% viewport, inner scroll, ESC/click-outside/X)
- **Rip (if any)**: none
- **Story**: `EXP-11 close tri-path` + `EXPC-02 size caps` in `NodeModal.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run NodeModal.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip `EXP-11`, `EXPC-02` rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(node-modal): Modal size caps + close paths (EXP-11, EXPC-02)`

### Task 5.3 — Bar of light slot (cases: EXP-04, EXP-05, EXP-06, EXP-07, EXP-08)

- **Gherkin first**: `vision-graph-ui/src/features/node/features/node-modal.feature` (scenarios = EXP-04, EXP-05, EXP-06, EXP-07, EXP-08)
- **Red**: `vision-graph-ui/src/features/node/NodeModal.test.tsx` + scenarios EXP-04 (bar slot), EXP-05 (hover tooltip), EXP-06 (toggle STT), EXP-07 (send), EXP-08 (breathing)
- **Green**: `vision-graph-ui/src/features/node/NodeModalBarSlot.tsx` + `vision-graph-ui/src/features/node/NodeModalContent.tsx` (bar slot, tooltip integration, breathing)
- **Rip (if any)**: none
- **Story**: `EXP-04 bar of light` + `EXP-05 bar hover tooltip` + `EXP-06 bar click toggles STT` + `EXP-07 bar dblclick sends` + `EXP-08 bar breathes` in `NodeModal.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run NodeModal.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip `EXP-04`, `EXP-05`, `EXP-06`, `EXP-07`, `EXP-08` rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(node-modal): Bar of light slot (EXP-04..08)`

### Task 5.4 — Halo + integration (cases: EXP-01, EXP-02, EXP-03, EXP-09, EXP-10)

- **Gherkin first**: `vision-graph-ui/src/features/node/features/node-modal.feature` (scenarios = EXP-01, EXP-02, EXP-03, EXP-09, EXP-10)
- **Red**: `vision-graph-ui/src/features/node/NodeModal.test.tsx` + scenarios EXP-01 (send expands), EXP-02 (halo), EXP-03 (auto-record), EXP-09 (right-click), EXP-10 (running state)
- **Green**: `vision-graph-ui/src/features/node/NodeModalHalo.tsx` + modify `vision-graph-ui/src/features/node/Node.tsx` + modify `vision-graph-ui/src/features/node/useNodeState.ts` (halo, dblclick send, right-click, running state)
- **Rip (if any)**: none
- **Story**: `EXP-01 send expands` + `EXP-02 ball becomes halo` + `EXP-03 expand auto-records` + `EXP-09 right click no STT` + `EXP-10 ball running state` in `NodeModal.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run NodeModal.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip `EXP-01`, `EXP-02`, `EXP-03`, `EXP-09`, `EXP-10` rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(node-modal): Halo + integration (EXP-01..03, EXP-09..10)`

### Task 5.5 — ESC precedence (cases: EXPC-03)

- **Gherkin first**: `vision-graph-ui/src/features/node/features/node-modal.feature` (scenarios = EXPC-03)
- **Red**: `vision-graph-ui/src/features/node/NodeModal.test.tsx` + scenario EXPC-03 (ESC precedence)
- **Green**: modify `vision-graph-ui/src/features/node/Node.tsx` (ESC handler: tooltip first, then modal)
- **Rip (if any)**: none
- **Story**: `EXPC-03 esc precedence` in `NodeModal.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run NodeModal.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip `EXPC-03` rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(node-modal): ESC precedence (EXPC-03)`

<4-8 tasks per slice. Task N depends only on N-1 and listed deps. No task spans >1 case-group.>

## 6. Skill + agent routing (per task)

| Task | Skills to load | Delegate to |
|---|---|---|
| 5.1 | `modern-react`, `storybook`, `test-driven-development` | `category="deep"` |
| 5.2 | `modern-react`, `storybook`, `test-driven-development` | `category="deep"` |
| 5.3 | `modern-react`, `storybook`, `test-driven-development` | `category="visual-engineering"` |
| 5.4 | `modern-react`, `react-flow`, `storybook`, `test-driven-development` | `category="deep"` |
| 5.5 | `modern-react`, `storybook`, `test-driven-development` | `category="deep"` |

## 7. Live-system validation gate (slice DONE only when ALL pass)

1. Run validation stories: `npx vitest run --project=storybook -t "slice04"`
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

- Bar of light visuals (EXP-02/04/08 breathing, halo effects) owned by S03 — cross-ref only, no re-implementation
- Modal interior surfaces (execution panel, file preview) owned by S05/S07 — container only
- New styling libs (motion.dev, framer-motion) — use repo standard styled-components transitions
- Implementation code — plan ONLY
- TBD placeholders — all paths, case IDs, story names must be exact

---

## Template rules (enforced by check-plans.sh)

1. Sections 1-9 present, in order, headings exact.
2. Every case ID mentioned exists in `docs/feature-requirements/validation/coverage-manifest.tsv`.
3. Every `.repos/` path mentioned exists on disk (checked against CONTEXT/C0).
4. Every `vision-graph-ui/` create/modify path matches slice layout rules (AGENTS.md §3/§11).
5. Every story name matches validation spec story column.
6. Status line filled. No TBD / TODO / <fill in> placeholders in final plans.
7. Rip tasks only from C0 "Rip-able" table. READ-ONLY repos never appear in rip rows.
