---
name: requirements-regression
description: >
  GWT requirements → regression test harness for whitt. Manifest-driven story/test
  naming, coverage gates, drift detection when cases change, status lifecycle,
  legacy-failure quarantine. Use when implementing validation stories, wiring CI,
  claiming a slice "done", or editing GWT cases anywhere in docs/.
---

## When to Use

- Implementing stories/tests from `docs/feature-requirements/validation/`
- Claiming any GWT case pass/ready (verification protocol)
- Editing cases in `docs/broader-vision/requirements/` or `docs/feature-requirements/`
- Wiring CI gates for the suite

## The Chain (ADR-0016)

```
GWT case (docs/) ──1:1──► manifest row (coverage-manifest.tsv)
                      ──1:1──► story name `sliceNN -- <CaseID> <name>`
                      ──1:1──► play fn assert table (slice-NN.validation.md)
```

Case ID is the join key everywhere. Never reference a test w/o its case ID.

## Manifest Protocol

`docs/feature-requirements/validation/coverage-manifest.tsv` — one row per case:

```
<CaseID>\t<sliceNN>\t<status>\t<note>
```

### Status lifecycle (strict transitions)

```
todo ──story+test written──► ready
ready ──test passing in CI──► pass
pass ──case edited or test broken──► fail  (fix before merging anything else)
todo ──explicitly deferred──► deferred  (note required, e.g. GRP-11, FIL-03)
```

- `pass` requires CI evidence, not local-only.
- `deferred` requires note naming owner condition ("when nested graphs activate").
- NEVER bulk-move statuses. One commit per status transition batch per slice.

## Gates

### check-coverage.sh (exists)

Greps slice files for IDs vs manifest. Exit 1 on gap. Run before any docs commit:

```bash
bash docs/feature-requirements/validation/check-coverage.sh
```

### Status gate (extend script when CI lands)

- Shipped slice = all its rows `pass` or `deferred`. Any `todo`/`fail` in a
  "shipped" slice blocks release claims.
- New PR touching `src/features/<slice>/` must not regress that slice's `pass` rows.

## Drift Detection (case edits)

When ANY GWT case changes in docs/:

1. `git diff --name-only` on `docs/broader-vision/requirements/` +
   `docs/feature-requirements/slices/` — list touched case IDs (grep `^## <ID>`).
2. For each touched ID: flip manifest row `pass → fail` (requirement moved under
   the test) + update validation spec row + story name if prose changed.
3. Deleting a case: manifest row → `deferred` w/ note `case-deleted <date>` or
   removed entirely + check-coverage.sh must stay green.
4. Commit docs + manifest together. Never let manifest lag docs.

## Quarantine (legacy failures)

Pre-existing failures MUST NOT block new-slice verification. Maintain in
validation/README.md §out-of-scope (current list, 2026-08-14):

- fsGraphLoader.test.ts ×7
- NodeDetailPanel.test.tsx ×1
- Node.test.tsx ×1
- GraphSim.test.tsx ×3 (act() warnings)

Rules: quarantine entries carry issue + date; each quarter, fix-or-flag; new tests
must not be added to quarantine (only pre-existing debt qualifies).

## Claiming Done (verification protocol)

Before claiming a case `pass`:

1. Story exists w/ exact name `sliceNN -- <CaseID> <name>`.
2. Play fn asserts the case's Then-block (all lines).
3. `npx vitest run --project storybook` (or test-runner) green for that story.
4. a11y `test: 'error'` passes (parameters set).
5. Manifest row updated in same commit.
6. Show log lines (AGENTS.md §2 — no "should work").

## MUST NOT

- Mark `pass` from local run only
- Rename stories away from `sliceNN -- <CaseID>` convention
- Leave manifest stale after doc edits
- Add new failures to quarantine
- Count `deferred` as covered in coverage reports

## References

- ADR-0016: `../docs/adr/0016-storybook-validation-architecture.md`
- Manifest: `docs/feature-requirements/validation/coverage-manifest.tsv`
- Validation specs: `docs/feature-requirements/validation/slice-*.validation.md`
- GWT suites: `docs/broader-vision/requirements/` (upstream), slices (expanded)
