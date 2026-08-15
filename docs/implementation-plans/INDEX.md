# INDEX — Implementation Plan Suite (canonical entry)

> START HERE. Single source of truth for suite navigation, execution order, validation.
> Plans only — suite NOT executed yet. Status tracking: per-plan `> Status:` line +
> `docs/feature-requirements/validation/coverage-manifest.tsv`.

## 1. Suite at a glance

| Plan | File | Cases | Depends on |
|---|---|---|---|
| E1 STT engine | [ENABLERS/E1-stt-engine.md](ENABLERS/E1-stt-engine.md) | infra | — |
| E2 agent bridge | [ENABLERS/E2-agent-runtime-bridge.md](ENABLERS/E2-agent-runtime-bridge.md) | infra | — |
| E3 FS-graph sync | [ENABLERS/E3-fs-graph-sync.md](ENABLERS/E3-fs-graph-sync.md) | infra | — |
| E4 xyflow upgrade | [ENABLERS/E4-react-flow-upgrade.md](ENABLERS/E4-react-flow-upgrade.md) | infra | — |
| S01 app shell | [SLICES/S01-app-shell.md](SLICES/S01-app-shell.md) | APP-01..07, APPC-01..03 | E4 |
| S02 voice capture | [SLICES/S02-voice-capture.md](SLICES/S02-voice-capture.md) | VOX-01,04..17, VOXC-01..05 | E1, E4 |
| S03 light language | [SLICES/S03-light-language.md](SLICES/S03-light-language.md) | VOX-02/03, EXP-02/04/08, EXE-11/12/14, GRP-08, LGT-01..08 | E1 |
| S04 node modal | [SLICES/S04-node-lifecycle-modal.md](SLICES/S04-node-lifecycle-modal.md) | EXP-01..11, EXPC-01..04 | E4 |
| S05 execution viz | [SLICES/S05-execution-viz.md](SLICES/S05-execution-viz.md) | EXE-01..17, EXEC-01..05 | E2 |
| S06 agent semantics | [SLICES/S06-agent-semantics.md](SLICES/S06-agent-semantics.md) | AGT-01..06, AGTC-01..03 | E2, E3 |
| S07 file viz | [SLICES/S07-file-visualization.md](SLICES/S07-file-visualization.md) | FIL-01..07, FILC-01..04 | E3 |
| S08 context pills | [SLICES/S08-context-pills.md](SLICES/S08-context-pills.md) | PIL-01..05, PILC-01..02 | S07, S02 |
| S09 git time travel | [SLICES/S09-git-time-travel.md](SLICES/S09-git-time-travel.md) | GIT-01..04, GITC-01..04 | E3 |
| S10 canvas manipulation | [SLICES/S10-canvas-manipulation.md](SLICES/S10-canvas-manipulation.md) | GRP-01..11, GRPC-01..10 | E4, E3 |
| S11 viewport nav | [SLICES/S11-viewport-navigation.md](SLICES/S11-viewport-navigation.md) | NAV-01..08 | E4 |

Context docs: [CONTEXT/C0-reference-repos.md](CONTEXT/C0-reference-repos.md) (rip paths +
license gates) · [C1-decision-register.md](CONTEXT/C1-decision-register.md) (open Qs →
plan gates) · [C2-xyflow12-migration-facts.md](CONTEXT/C2-xyflow12-migration-facts.md) ·
[TEMPLATE.md](CONTEXT/TEMPLATE.md) (plan format) ·
[EXECUTION-PROTOCOL.md](EXECUTION-PROTOCOL.md) (the loop).

## 2. Dependency graph (verified 2026-08-14, mechanical extraction)

```
E1 ──┬──► S02 ──┐
     └──► S03   │
E2 ──┬──► S05   ├──► S08
     └──► S06   │
E3 ──┬──► S06   │
     ├──► S07 ──┤
     ├──► S09   │
     └──► S10   │
E4 ──┬──► S01   │
     ├──► S02   │
     ├──► S04   │
     ├──► S10   │
     └──► S11 ──┘
```

No cycles. Only slice→slice edge: S08 → {S07, S02}.

## 3. Execution order

**Dependency-truth waves (max parallelism):**

| Wave | Plans | Why |
|---|---|---|
| 1 | E1, E2, E3, E4 | zero deps |
| 2 | S01..S07, S09, S10, S11 | deps all in wave 1 |
| 3 | S08 | needs S07 + S02 (wave 2) |

**Recommended staging (risk-ordered — how to actually run it):**

```
Stage 1: E4 + E1              (canvas foundation + audio; unblocks most)
Stage 2: E2 + E3              (agent events + FS truth)
Stage 3: S01 + S04 + S03      (shell, node lifecycle, glow — see results early)
Stage 4: S02                  (voice UX needs E1+E4 proven)
Stage 5: S10 + S11 + S05      (canvas manipulation, nav, execution viz)
Stage 6: S06 + S07            (agent semantics, file viz)
Stage 7: S08 + S09            (pills, git — need S07/S02 done)
```

Staging ≠ waves: stages sequence for review checkpoints, waves prove legality.
Rule: a plan may start when ALL its deps have `Status: DONE` (per-plan header).

## 4. How to execute any plan (meta loop)

Per [EXECUTION-PROTOCOL.md](EXECUTION-PROTOCOL.md) — summary:

1. **Load** plan + its §2 Inputs (READ FIRST table) + AGENTS.md rules + cited skills.
2. **Question gate** (§4): ask user 2-3 multiple-choice Qs ONCE, record answers in plan, never re-ask.
3. **Task loop** (§5, in order): Gherkin `.feature` first → red tests → green impl
   (rip rows via `oss-code-adaptation` skill + C0 license gates) → Storybook story →
   verify cmds → flip manifest rows → commit. One task = one commit.
4. **Live gate per task**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run
   <task tests> && npm run build-storybook` all exit 0 + story passes in
   `npx vitest --project=storybook` + user eyeballs the story.
5. **Retry loop**: fail → diagnose → fix → re-run (max 3 fix attempts, then oracle,
   then user). Retry≠skip: HARD FORBIDDEN list in EXECUTION-PROTOCOL §4.
6. **Plan done**: all §5 tasks green → flip plan `> Status:` to DONE → check-coverage.sh
   rows for its cases all `pass`.

## 5. Suite-level validation + verification

| Gate | Cmd | When | Pass = |
|---|---|---|---|
| Plan-suite integrity | `bash docs/implementation-plans/check-plans.sh` | after any plan-file edit | `PLANS GREEN` |
| Case coverage | `bash docs/feature-requirements/validation/check-coverage.sh` | after each task/plan | rows flipped, 0 untracked |
| Type check | `cd vision-graph-ui && npx tsc --noEmit` | every task | exit 0 |
| Unit + component | `cd vision-graph-ui && npx vitest run` | every task | green (pre-existing quarantine excluded) |
| Live interaction | `cd vision-graph-ui && npx vitest --project=storybook` | every task w/ story | story play passes |
| Storybook build | `cd vision-graph-ui && npm run build-storybook` | every task | exit 0 |
| Production build | `cd vision-graph-ui && npx vite build` | plan completion | exit 0 |
| User eyeball | open story in Storybook UI | every task | human confirms feel |

**Suite DONE** = every plan `Status: DONE` + coverage-manifest all `pass` (or `deferred`)
+ 12 pre-existing failing tests unchanged-or-fixed + final full-suite vitest run green.

## 6. Single-owner dedup rules (who owns what — do NOT re-implement)

| Artifact | Owner | Consumers import from |
|---|---|---|
| AudioContext + analyser + RAF level loop + STT worklet | E1 | `src/shared/audio/*` (S02, S03) |
| AgentEvt schema + event bus + fake runtime | E2 | `src/features/agent-bridge/*` (S05, S06, S09) |
| FsPort + write queue + watcher | E3 | `src/features/fs-sync/*` (S06, S07, S09, S10) |
| hasCycle validation port (ragflow) | S10 | `src/adapted/has-cycle-validator.ts` (S06 imports) |
| Glow keyframes + sprite cache + breathing tokens | S03 | `src/shared/theme.ts` + `src/features/light/*` (S05 loader, S10 halo) |
| busy-set derivation (ragflow startButNotFinished) | S06 | `src/features/agent-bridge/derivedSets.ts` |

## 7. Review log

| Date | Pass | Result |
|---|---|---|
| 2026-08-14 | suite built, check-plans.sh GREEN (147 refs) | commit `10b3948` |
| 2026-08-14 | momus full-suite review | REJECT → 5 fixes → GREEN, commit `012a88c` |
| 2026-08-14 | dependency audit + dedup pass + INDEX | S10 +E3 dep; hasCycle/analyser/RAF single-owner; this file |
