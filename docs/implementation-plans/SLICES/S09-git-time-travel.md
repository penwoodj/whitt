# S09 — Git Time Travel & Sync Implementation Plan

> Executes: `docs/feature-requirements/slices/09-git-time-travel.md` (cases: GIT-01..04, GITC-01..04)
> Validation spec: `docs/feature-requirements/validation/slice-09.validation.md`
> Status: NOT-STARTED
> Depends on: E3-fs-graph-sync

## 1. Objective

Deliver commit-per-edit git operations, agent commit cadence, and floating sync button with full state machine (idle/syncing/error/synced). Git becomes the trust substrate for all mutations, enabling time travel and remote backup via explicit user action.

## 2. Inputs (READ FIRST — in this order)

| Input | Path |
|---|---|
| Requirements slice | `docs/feature-requirements/slices/09-git-time-travel.md` |
| Inherited case source | `docs/broader-vision/requirements/08-git-time-travel-sync.md` |
| Validation spec | `docs/feature-requirements/validation/slice-09.validation.md` |
| User-flow narrative | `docs/broader-vision/user-flows.md` (Flow J, L) |
| Skills to load | `modern-react`, `storybook`, `fs-graph-sync`, `test-driven-development` |
| Code-rip sources | `none` |

## 3. File plan (REAL paths)

| Action | Path | Notes |
|---|---|---|
| create | `vision-graph-ui/src/features/git-sync/GitSync.stories.tsx` | Storybook fixture: floating button panel + mock git service |
| create | `vision-graph-ui/src/features/git-sync/GitSync.test.tsx` | Vitest tests mapping to validation spec asserts |
| create | `vision-graph-ui/src/features/git-sync/GitSync.tsx` | Floating sync button component (GIT-04) |
| create | `vision-graph-ui/src/features/git-sync/useGitCommit.ts` | Commit hook consuming E3 write queue flush events (GIT-01) |
| create | `vision-graph-ui/src/features/git-sync/useAgentCommitCadence.ts` | Agent commit cadence guard (GIT-02, GITC-04) |
| create | `vision-graph-ui/src/features/git-sync/commitMetadata.ts` | Commit metadata schema builder (GITC-03) |
| create | `vision-graph-ui/src/features/git-sync/gitSyncTypes.ts` | Type definitions for sync state + metadata |
| create | `vision-graph-ui/src/features/git-sync/gitSync.feature` | Gherkin scenarios for all 8 cases |
| modify | `vision-graph-ui/src/features/top-bar/SyncBtn.tsx` | Add error state + persistent error display (GITC-02) |
| modify | `vision-graph-ui/src/features/top-bar/topBarTypes.ts` | Extend SyncStatus type + error handling props |

## 4. Question-cycle gate (AGENTS.md §1 Stage 1 — MANDATORY before tests)

Ask user (2-3 questions max, `question` tool):

1. **Remote URL config UX**: How should users configure the git remote URL? (A) Settings panel field with GitHub OAuth token input, (B) First-time sync prompt with URL field, (C) Command-line flag only, (D) Other (specify).

2. **Sync conflict policy**: When `git push` fails due to remote divergence, what should happen? (A) Show error + manual resolve in external git client, (B) Auto-merge with force push option, (C) Pull-rebase-prompt in UI, (D) Other (specify).

Record answers in this file, then never re-ask.

## 5. Tasks (incremental, TDD, each ends green+committed)

### Task 9.1 — Commit-per-edit hook (cases: GIT-01)
- **Gherkin first**: `vision-graph-ui/src/features/git-sync/gitSync.feature` (scenario = GIT-01)
- **Red**: `GitSync.test.tsx` + scenario fails (commit spy not called on save)
- **Green**: `useGitCommit.ts` — hook subscribes to E3 write queue flush, calls fake git service commit with metadata
- **Rip (if any)**: none
- **Story**: `GIT-01 commit per save` in `GitSync.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run GitSync.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip `GIT-01` row → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(git-sync): Commit-per-edit hook (GIT-01)`

### Task 9.2 — Agent commit cadence (cases: GIT-02, GITC-04)
- **Gherkin first**: `vision-graph-ui/src/features/git-sync/gitSync.feature` (scenarios = GIT-02, GITC-04)
- **Red**: `GitSync.test.tsx` + scenarios fail (agent commits not at mutation boundaries, interleaves with user edits)
- **Green**: `useAgentCommitCadence.ts` — cadence guard queues agent commits, flushes after user editor close (no interleaving tear)
- **Rip (if any)**: none
- **Story**: `GIT-02 agent commits`, `GITC-04 cadence guard` in `GitSync.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run GitSync.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip `GIT-02`, `GITC-04` rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(git-sync): Agent commit cadence guard (GIT-02, GITC-04)`

### Task 9.3 — Commit metadata schema (cases: GITC-03)
- **Gherkin first**: `vision-graph-ui/src/features/git-sync/gitSync.feature` (scenario = GITC-03)
- **Red**: `GitSync.test.tsx` + scenario fails (commit messages lack parseable metadata footer)
- **Green**: `commitMetadata.ts` — builder creates YAML footer: `actor: user|agent`, `action: edit|spawn|group|move|prompt|sync`, `refs: [nodeId]`, `ts: iso`
- **Rip (if any)**: none
- **Story**: `GITC-03 metadata schema` in `GitSync.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run GitSync.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip `GITC-03` row → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(git-sync): Commit metadata schema (GITC-03)`

### Task 9.4 — Floating sync button (cases: GIT-04, GITC-01, GITC-02)
- **Gherkin first**: `vision-graph-ui/src/features/git-sync/gitSync.feature` (scenarios = GIT-04, GITC-01, GITC-02)
- **Red**: `GitSync.test.tsx` + scenarios fail (button not on canvas, states wrong, error handling missing)
- **Green**: `GitSync.tsx` — floating button panel component, state machine (idle/syncing/error/synced), push via fake git service; extend `SyncBtn.tsx` with error state display
- **Rip (if any)**: none
- **Story**: `GIT-04 sync button`, `GITC-01 sync progress`, `GITC-02 sync failure` in `GitSync.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run GitSync.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip `GIT-04`, `GITC-01`, `GITC-02` rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(git-sync): Floating sync button + states (GIT-04, GITC-01, GITC-02)`

### Task 9.5 — All mutations logged (cases: GIT-03)
- **Gherkin first**: `vision-graph-ui/src/features/git-sync/gitSync.feature` (scenario = GIT-03)
- **Red**: `GitSync.test.tsx` + scenario fails (not all mutation types produce commits)
- **Green**: Integration test verifying edit + spawn + group all produce commits (count + types assert)
- **Rip (if any)**: none
- **Story**: `GIT-03 all mutations logged` in `GitSync.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run GitSync.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip `GIT-03` row → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(git-sync): All mutations logged verification (GIT-03)`

## 6. Skill + agent routing (per task)

| Task | Skills to load | Delegate to |
|---|---|---|
| 9.1 | `modern-react`, `storybook`, `fs-graph-sync`, `test-driven-development` | `category="deep"` |
| 9.2 | `modern-react`, `storybook`, `fs-graph-sync`, `test-driven-development` | `category="deep"` |
| 9.3 | `modern-react`, `storybook`, `test-driven-development` | `category="deep"` |
| 9.4 | `modern-react`, `storybook`, `fs-graph-sync`, `test-driven-development` | `category="visual-engineering"` |
| 9.5 | `modern-react`, `storybook`, `test-driven-development` | `category="deep"` |

## 7. Live-system validation gate (slice DONE only when ALL pass)

1. Run validation stories: `npx vitest run --project=storybook -t "slice09"`
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

- Remote URL config UX (O12 from decision register) — question-gate blocks implementation until answered
- Real git operations via simple-git — E3 FsPort backend provides real port, this slice uses fake port for Storybook tests
- Sync conflict resolution policy (O12 from decision register) — question-gate blocks implementation
- Time travel UI (git history browser) — explicitly NOT this slice per slice spec Open Questions
- Auto-push to remote — FORBIDDEN per fs-graph-sync skill, sync is user-click only

---

## Template rules (enforced by check-plans.sh)

1. Sections 1-9 present, in order, headings exact.
2. Every case ID mentioned exists in `docs/feature-requirements/validation/coverage-manifest.tsv`.
3. Every `.repos/` path mentioned exists on disk (checked against CONTEXT/C0).
4. Every `vision-graph-ui/` create/modify path matches slice layout rules (AGENTS.md §3/§11).
5. Every story name matches validation spec story column.
6. Status line filled. No TBD / TODO / <fill in> placeholders in final plans.
7. Rip tasks only from C0 "Rip-able" table. READ-ONLY repos never appear in rip rows.
