# S08 — Context Pills Implementation Plan

> Executes: `docs/feature-requirements/slices/08-context-pills.md` (cases: PIL-01..05, PILC-01..02)
> Validation spec: `docs/feature-requirements/validation/slice-08.validation.md`
> Status: NOT-STARTED
> Depends on: S07-file-visualization, S02-voice-capture

## 1. Objective

Deliver highlighted file content → context pills in STT tooltip → weighted prompt package flow. Consumes S07's highlight selections (ctrl-multi-highlight, ctrl+F matches), renders pills in S02's STT tooltip with Cursor-style chip visual grammar, provides hover removal, overflow handling, and hover preview → jump affordances.

## 2. Inputs (READ FIRST — in this order)

| Input | Path |
|---|---|
| Requirements slice | `docs/feature-requirements/slices/08-context-pills.md` |
| Inherited case source | `docs/broader-vision/requirements/07-context-pills.md` |
| Validation spec | `docs/feature-requirements/validation/slice-08.validation.md` |
| User-flow narrative | `docs/broader-vision/user-flows.md` (Flow F) |
| Skills to load | modern-react, storybook, test-driven-development |
| Code-rip sources | none (styled-components + theme tokens only, per AGENTS.md §15) |

## 3. File plan (REAL paths)

| Action | Path | Notes |
|---|---|---|
| create | `vision-graph-ui/src/features/context-pills/contextPills.feature` | Gherkin scenarios for PIL cases |
| create | `vision-graph-ui/src/features/context-pills/ContextPills.stories.tsx` | Stories from validation spec (STT tooltip fixture) |
| create | `vision-graph-ui/src/features/context-pills/ContextPills.test.tsx` | Tests map to .feature scenarios |
| create | `vision-graph-ui/src/features/context-pills/ContextPill.tsx` | Single pill component (removable, line numbers, hover preview) |
| create | `vision-graph-ui/src/features/context-pills/ContextPillRow.tsx` | Pill row container with overflow handling (+N more) |
| create | `vision-graph-ui/src/features/context-pills/usePillHoverPreview.ts` | Hover preview state + jump scroll logic |
| create | `vision-graph-ui/src/features/context-pills/contextPillTypes.ts` | Type definitions for pill data + callbacks |
| modify | `vision-graph-ui/src/features/node/NodePromptArea.tsx` | Render ContextPillRow above composer when pills present |
| modify | `vision-graph-ui/src/features/node/Node.tsx` | Pass highlight selections from file preview to NodePromptArea |

Every task in §5 touches ONLY files listed here. New file = new row.

## 4. Question-cycle gate (AGENTS.md §1 Stage 1 — MANDATORY before tests)

Ask user (2-3 questions max, `question` tool):

1. **Pill content format**: Show only line numbers on pill face (e.g., "L12-18"), with full text snippet on hover preview (PILC-02 resolves this placement)? Or include snippet prefix on pill too (Cursor-style "filename: snippet...")?

2. **Pill overflow threshold**: Cap visible pills at 6 before collapsing to "+N more" (PILC-01 suggests ~6)? Confirm number.

3. **Preview jump behavior**: When clicking pill preview's jump affordance (PILC-02), should it scroll the file preview to the highlighted span AND expand the span visually, or just scroll to position?

Record answers in this file, then never re-ask.

## 5. Tasks (incremental, TDD, each ends green+committed)

### Task 5.1 — Pill data flow from highlights (cases: PIL-01)

- **Gherkin first**: `vision-graph-ui/src/features/context-pills/contextPills.feature` (scenario: PIL-01 pills on highlight)
- **Red**: `ContextPills.test.tsx` → mock highlight selections → expect pills passed to NodePromptArea, rendered in tooltip
- **Green**: `Node.tsx` extracts highlight selections from file preview state, passes to NodePromptArea; `NodePromptArea.tsx` accepts pill data prop, renders ContextPillRow when present
- **Rip (if any)**: none (styled-components + theme tokens only)
- **Story**: `PIL-01 pills on highlight` in `ContextPills.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ContextPills.test.tsx && npm run build-storybook`
- **Manifest**: flip PIL-01 row → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(context-pills): pill data flow from highlights (PIL-01)`

### Task 5.2 — Single pill rendering + removal (cases: PIL-02, PIL-03)

- **Gherkin first**: `contextPills.feature` (scenarios: PIL-02 remove via X, PIL-03 line numbers)
- **Red**: `ContextPills.test.tsx` → hover pill → expect X button visible; click X → expect remove callback; pill text shows line range format "L12-18"
- **Green**: `ContextPill.tsx` renders chip with line numbers, hover shows close button, onClick removes pill from list via callback
- **Rip (if any)**: none (styled-components + theme tokens per AGENTS.md §15)
- **Story**: `PIL-02 remove via X`, `PIL-03 line numbers` in `ContextPills.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ContextPills.test.tsx && npm run build-storybook`
- **Manifest**: flip PIL-02, PIL-03 rows → `ready`→`pass`
- **Commit**: `feat(context-pills): single pill rendering + removal (PIL-02, PIL-03)`

### Task 5.3 — Pill row overflow handling (cases: PILC-01)

- **Gherkin first**: `contextPills.feature` (scenario: PILC-01 overflow stacking)
- **Red**: `ContextPills.test.tsx` → pass 8 highlight selections → expect 6 pills rendered + "+2 more" pill; click "+2" → expect overflow list shown
- **Green**: `ContextPillRow.tsx` caps visible pills at 6, renders overflow pill with count, shows list on click
- **Rip (if any)**: none (styled-components + theme tokens only)
- **Story**: `PILC-01 overflow stacking` in `ContextPills.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ContextPills.test.tsx && npm run build-storybook`
- **Manifest**: flip PILC-01 row → `ready`→`pass`
- **Commit**: `feat(context-pills): pill row overflow handling (PILC-01)`

### Task 5.4 — Pill hover preview + jump (cases: PILC-02)

- **Gherkin first**: `contextPills.feature` (scenario: PILC-02 hover preview)
- **Red**: `ContextPills.test.tsx` → hover pill → expect preview shows text snippet + line range; click preview jump → expect scroll callback with span position
- **Green**: `ContextPill.tsx` uses `usePillHoverPreview` hook for hover state, renders preview popover with snippet + jump button; click jump triggers scroll callback
- **Rip (if any)**: none (styled-components + theme tokens only)
- **Story**: `PILC-02 hover preview` in `ContextPills.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ContextPills.test.tsx && npm run build-storybook`
- **Manifest**: flip PILC-02 row → `ready`→`pass`
- **Commit**: `feat(context-pills): pill hover preview + jump (PILC-02)`

### Task 5.5 — Prompt composition with pills (cases: PIL-04, PIL-05)

- **Gherkin first**: `contextPills.feature` (scenarios: PIL-04 pause highlight speak, PIL-05 attention weighting)
- **Red**: `ContextPills.test.tsx` → stop STT, highlight spans, speak, send → expect payload includes transcript text + pill references with line ranges; send spy receives weighted context flag
- **Green**: `NodePromptArea.tsx` composes payload = `{ text: spokenTranscript, contextPills: [{ lineRange, textSnippet }] }` on send; marks weighted flag true when pills present
- **Rip (if any)**: none (composition logic new)
- **Story**: `PIL-04 pause highlight speak`, `PIL-05 attention weighting` in `ContextPills.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ContextPills.test.tsx && npm run build-storybook`
- **Manifest**: flip PIL-04, PIL-05 rows → `ready`→`pass`
- **Commit**: `feat(context-pills): prompt composition with pills (PIL-04, PIL-05)`

## 6. Skill + agent routing (per task)

| Task | Skills to load | Delegate to |
|---|---|---|
| 5.1 | modern-react, test-driven-development | category="deep" |
| 5.2 | modern-react, storybook | category="visual-engineering" |
| 5.3 | modern-react, storybook | category="visual-engineering" |
| 5.4 | modern-react, storybook | category="visual-engineering" |
| 5.5 | modern-react, test-driven-development | category="deep" |

## 7. Live-system validation gate (slice DONE only when ALL pass)

1. Run validation stories: `npx vitest run --project=storybook -t "slice08"`
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

- Actual agent attention weighting logic (PIL-05 sends weighted flag, but E2 agent-bridge implements the weighting algorithm)
- File preview scrolling implementation (jump callback scrolls preview, but preview component owns scroll logic — S07 surface)
- Highlight persistence across modal close/reopen → open question in S07 (session-only proposed)
- Ctrl+F scope (node-only vs whole project) → open question in S07
- Non-markdown file types → FIL-03 future slice
- Advanced diff UI for concurrent edit → FILC-03 minimal version only (notice + choice)
- Prompt file naming convention details → E3 (fs-graph-sync) owns this
- STT engine integration → E1 (stt-engine) owns transcript stream

---

## Template rules (enforced by check-plans.sh)

1. Sections 1-9 present, in order, headings exact.
2. Every case ID mentioned exists in `docs/feature-requirements/validation/coverage-manifest.tsv`.
3. Every `.repos/` path mentioned exists on disk (checked against CONTEXT/C0).
4. Every `vision-graph-ui/` create/modify path matches slice layout rules (AGENTS.md §3/§11).
5. Every story name matches validation spec story column.
6. Status line filled. No TBD / TODO / <fill in> placeholders in final plans.
7. Rip tasks only from C0 "Rip-able" table. READ-ONLY repos never appear in rip rows.
