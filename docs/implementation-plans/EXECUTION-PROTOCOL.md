# EXECUTION PROTOCOL — How Plan Suite Runs

> The loop every plan executes under. Read before ANY plan. Governed by AGENTS.md
> (vision-graph-ui) behavior-first workflow + requirements-regression skill.
> Goal: every GWT case PASSES live Storybook interaction tests — retry until real pass.

## 1. Units + gates

```
ENABLER (E1-E4)  → contract + fake ports + stories       gate: contract stories pass
SLICE (S01-S11)  → tasks → cases → stories → manifest    gate: ALL slice cases pass live
TASK             → Gherkin → red test → green → story → commit   gate: verify cmds exit 0
CASE             → story play fn asserts                 gate: manifest row → pass
```

Join key everywhere = CaseID (coverage-manifest.tsv). Never invent new IDs.

## 2. Task loop (per task, in order)

1. Load skills named in plan §6. Non-optional.
2. Gherkin `.feature` first (AGENTS.md §1 Stage 2) — scenarios = task's case IDs.
3. RED: step defs fail. Any scenario passing pre-implementation = test wrong, rewrite.
4. GREEN: minimum code. tsc clean. No `any`/`@ts-ignore` (AGENTS.md §6).
5. RIP (if plan rows say so): oss-code-adaptation skill — license gate → port →
   provenance header → THIRD_PARTY_NOTICES entry. READ-ONLY repos: pattern only.
6. Story: exact name from validation spec; play fn asserts per assert table.
7. Verify (all exit 0, from vision-graph-ui/):
   `npx tsc --noEmit && npx vitest run <task test file> && npm run build-storybook`
8. Manifest flip: case rows todo→ready→pass (requirements-regression skill).
9. Commit: `feat(<slice>): <task> (<case IDs>)`. Push.

## 3. Live-system validation gate (slice done)

```bash
cd vision-graph-ui
npx vitest run --project=storybook -t "<sliceNN>"   # every slice story
bash ../docs/feature-requirements/validation/check-coverage.sh   # GREEN
```

+ user manual review in Storybook UI (`npm run storybook`). Slice status → DONE
only when: all cases pass/deferred, coverage GREEN, user eyeballed it.

## 4. Retry loop (failure = iterate, NEVER skip)

```
attempt → fail
  → READ actual log lines (AGENTS.md §2 — no "should work")
  → hypothesis → minimal fix → re-run failing story only
  → fail ×2 → load systematic-debugging skill, full ctx re-diagnose
  → fail ×3 → escalate: oracle subagent (read-only) w/ test output + code
  → oracle fix → re-run
  → still fail → STOP. Report to user w/ evidence. Do NOT proceed past broken gate.
```

HARD FORBIDDEN (any of these = protocol violation, revert):
- delete/weaken a failing test
- skip/todo a case without user OK
- timeout increase >2× original
- `as any` / `@ts-ignore` to silence
- marking manifest pass without story run log line

### Flake policy (researched: Vitest retry + browser-mode flake patterns)

- `retry: 1` max, config-level, condition-gated: transient patterns only
  (`/timeout|network|fetch failed/i`). Assertion errors = regression, never retry-masked.
- Flake = fail attempt 1, pass attempt 2. Regression = fail all attempts.
  Track repeats: same test flaking >1 run in row → quarantine investigation.
- Animation flake guards (standard, from research):
  - assert FINAL states via `expect.element`/`expect.poll` (auto-retry) — never
    intermediate frames
  - drag tests: pointer sequences w/ intermediate points + activation-threshold
    nudge (5-10px) + interpolated `steps: 10-15` (never single jump)
  - CSS transition interference: `test-mode` body class (`transition: none
    !important`) in test setup — EXCEPT tests that assert animations (those use
    animationName/class asserts, per storybook-agentic-e2e skill)
  - never pixel asserts; semantic states + `data-state` attributes
- Quarantine (LAST resort, user-approved only): `test.skip('@quarantine <reason>')`
  runs in separate lane, never gates; un-quarantine after 50 consecutive green.
  Pre-existing 12 failures = already quarantined (Category E, not ours to fix here).

## 5. Wave order (dependencies from README suite map)

```
WAVE 1 (parallel): E1 stt-engine  |  E4 xyflow-upgrade
WAVE 2 (parallel): E2 agent-bridge | E3 fs-graph-sync
WAVE 3 (parallel): S01 app-shell | S03 light-language | S04 node-modal
WAVE 4: S02 voice-capture
WAVE 5 (parallel): S05 execution-viz | S10 canvas-manipulation | S11 viewport-nav
WAVE 6 (parallel): S06 agent-semantics | S07 file-visualization
WAVE 7: S08 context-pills
WAVE 8: S09 git-time-travel
```

Rules: slice starts only when its deps' status = DONE (enablers: contract stories pass).
Within wave, plans are independent — parallel agents OK (different feature folders,
no cross-slice imports per AGENTS.md §3).

## 6. Question-cycle discipline (AGENTS.md §1 Stage 1 + §14)

Each plan §4 lists its open questions. Executor asks ONCE per slice (2-3 Qs max,
`question` tool), records answers IN the plan file, never re-asks. Decision register:
`CONTEXT/C1-decision-register.md` (pre-answered defaults live there — check before asking).

## 7. Definition of DONE (suite level)

- 141 manifest rows: pass or deferred-with-reason (GRP-11, FIL-03 pre-deferred)
- check-coverage.sh GREEN
- All 4 verify commands exit 0 repo-wide: tsc, vitest full, build-storybook, vite build
- User manual Storybook review of every slice
- Zero protocol violations (§4 forbidden list)

## 8. Escalation ladder

task fail ×3 → oracle. slice stuck >1 day → stop, report, replan w/ user.
Contract drift between enabler + consumer slice → fix ENABLER, not consumer
(consumers depend on contracts; contracts change via enabler plan revision + version note).
