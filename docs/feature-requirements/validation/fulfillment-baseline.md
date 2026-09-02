# Fulfillment Baseline

> Captured 2026-08-31 before T0 implementation edits.

## Command

Run from `vision-graph-ui/`:

```bash
npx vitest run --reporter=verbose
```

Result: `4 failed | 625 passed | 629`.

## Known failures

1. `src/features/graph-sim/GraphSim.test.tsx > GraphSim > click project reveals graph page w/ top bar + node`
2. `src/features/graph-sim/GraphSim.test.tsx > GraphSim > each project click loads different graph`
3. `src/features/graph-sim/GraphSim.test.tsx > GraphSim > send flow triggers cycle then details`
4. `src/features/node/Node.test.tsx > Node > renders details panel when lifecycle is done and expanded`

Later regressions use exact test identity comparison against this list. Never compare aggregate pass counts. Every new test must pass. Any changed, missing, or additional failure is unexpected.
