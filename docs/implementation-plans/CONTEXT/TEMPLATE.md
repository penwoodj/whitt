# TEMPLATE — Slice/Enabler Plan File

> STRICT format. Every `S??-*.md` and `E?-*.md` plan follows this exactly.
> Plans are EXECUTION-READY: real paths, real case IDs, real story names, no TBDs.
> Caveman-terse per AGENTS.md §12 (plans live at repo root — normal-terse, not ultra).

---

```markdown
# SNN — <Slice Name> Implementation Plan

> Executes: `docs/feature-requirements/slices/NN-<slug>.md` (cases: <ID RANGE>)
> Validation spec: `docs/feature-requirements/validation/slice-NN.validation.md`
> Status: NOT-STARTED | IN-PROGRESS | CASES-PASSING (<n>/<total>) | DONE
> Depends on: <enablers/slices that must land first>

## 1. Objective

<1-3 sentences: what this slice delivers, which user flow it completes.>

## 2. Inputs (READ FIRST — in this order)

| Input | Path |
|---|---|
| Requirements slice | `docs/feature-requirements/slices/NN-*.md` |
| Inherited case source | `docs/broader-vision/requirements/*.md` (IDs listed in slice) |
| Validation spec | `docs/feature-requirements/validation/slice-NN.validation.md` |
| User-flow narrative | `docs/broader-vision/user-flows.md` (Flow X) |
| Skills to load | `<exact skill names>` (see §6) |
| Code-rip sources | `<.repos/... paths or "none">` (see CONTEXT/C0) |

## 3. File plan (REAL paths)

| Action | Path | Notes |
|---|---|---|
| create | `vision-graph-ui/src/features/<slice>/<Component>.tsx` | <one-line purpose> |
| create | `vision-graph-ui/src/features/<slice>/<Component>.test.tsx` | maps .feature scenarios |
| create | `vision-graph-ui/src/features/<slice>/<Component>.stories.tsx` | story names from validation spec |
| create | `vision-graph-ui/src/features/<slice>/<hook>.ts` | <purpose> |
| modify | `<existing file>` | <what changes> |
| rip→port | `src/adapted/<name>.ts` FROM `<.repos/path>` | per oss-code-adaptation skill |

<Every task in §5 touches ONLY files listed here. New file = new row.>

## 4. Question-cycle gate (AGENTS.md §1 Stage 1 — MANDATORY before tests)

Ask user (2-3 questions max, `question` tool): <list the specific open decisions
this slice still owns — pull from slice "Open questions" section + decision register
in EXECUTION-PROTOCOL.md>. Record answers in this file, then never re-ask.

## 5. Tasks (incremental, TDD, each ends green+committed)

### Task N.N — <name> (cases: <IDs>)
- **Gherkin first**: `vision-graph-ui/src/features/<slice>/<name>.feature` (scenarios = <IDs>)
- **Red**: <test file + which scenarios fail>
- **Green**: <files implemented, min code>
- **Rip (if any)**: source `<.repos/...>` → `src/adapted/...` via `oss-code-adaptation`
- **Story**: `<story name from validation spec>` in `<Component>.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run <testfile> && npm run build-storybook` — all exit 0
- **Manifest**: flip `<IDs>` rows → `ready`→`pass` in coverage-manifest.tsv (requirements-regression skill)
- **Commit**: `feat(<slice>): <name> (<case IDs>)`

<4-8 tasks per slice. Task N depends only on N-1 and listed deps. No task spans >1 case-group.>

## 6. Skill + agent routing (per task)

| Task | Skills to load | Delegate to |
|---|---|---|
| N.N | `<skill names>` | `category="deep"` / `"quick"` / `"visual-engineering"` / do-not-delegate |

## 7. Live-system validation gate (slice DONE only when ALL pass)

1. Run validation stories: `npx vitest run --project=storybook -t "<sliceNN>"` 
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

- <Explicit non-goals + files this plan must NOT touch>
```

---

## Template rules (enforced by check-plans.sh)

1. Sections 1-9 present, in order, headings exact.
2. Every case ID mentioned exists in `docs/feature-requirements/validation/coverage-manifest.tsv`.
3. Every `.repos/` path mentioned exists on disk (checked against CONTEXT/C0).
4. Every `vision-graph-ui/` create/modify path matches slice layout rules (AGENTS.md §3/§11).
5. Every story name matches validation spec story column.
6. Status line filled. No TBD / TODO / <fill in> placeholders in final plans.
7. Rip tasks only from C0 "Rip-able" table. READ-ONLY repos never appear in rip rows.
