# E2 — Agent Runtime Bridge Implementation Plan

> Executes: `vision-graph-ui/.opencode/skills/agent-runtime-bridge/SKILL.md` (AgentEvt bus + fake runtime)
> Validation spec: `docs/feature-requirements/validation/slice-05.validation.md` + `slice-06.validation.md`
> Status: NOT-STARTED
> Depends on: none

## 1. Objective

Build transport-agnostic AgentEvt event bus + fake runtime (JSONL script player) enabling S05/S06/S09 to test agent execution semantics without live whitt-execution-engine. Deliver: event types, pub/sub bus w/ generation counters (stale-handler guard per n8n pattern), busy-set reducer (startButNotFinished), `useAgentEvtStream` hook, fake runtime + JSONL fixtures, `FsPort` bridge interface (E3 owns impl).

## 2. Inputs (READ FIRST — in this order)

| Input | Path |
|---|---|
| Plan template | `docs/implementation-plans/CONTEXT/TEMPLATE.md` |
| Reference repos | `docs/implementation-plans/CONTEXT/C0-reference-repos.md` |
| Spec (THE source) | `vision-graph-ui/.opencode/skills/agent-runtime-bridge/SKILL.md` |
| Consumer: execution viz | `docs/feature-requirements/slices/05-execution-viz.md` |
| Consumer: agent semantics | `docs/feature-requirements/slices/06-agent-semantics.md` |
| Validation protocol | `docs/feature-requirements/validation/README.md` |
| Project rules | `vision-graph-ui/AGENTS.md` |
| Ragflow pattern (busy-set) | `.repos/ragflow/web/src/pages/agent/hooks.tsx`, `canvas/node/node-wrapper.tsx` |

## 3. File plan (REAL paths)

| Action | Path | Notes |
|---|---|---|
| create | `vision-graph-ui/src/shared/agent/types.ts` | AgentEvt union type, GraphMutation 7-op vocabulary |
| create | `vision-graph-ui/src/shared/agent/eventBus.ts` | Pub/sub w/ generation counters, stale-handler guard (n8n pattern) |
| create | `vision-graph-ui/src/shared/agent/busySetReducer.ts` | startButNotFinished derivation, lodash/fp flow |
| create | `vision-graph-ui/src/shared/agent/useAgentEvtStream.ts` | Hook: bus.subscribe, expose busyNodeIds, stepTitleByNode, lastMutation |
| create | `vision-graph-ui/src/shared/agent/fakeRuntime.ts` | JSONL script player, playAgentScript harness (storybook-agentic-e2e) |
| create | `vision-graph-ui/src/shared/agent/fixtures/` | JSONL fixture files per S05/S06 validation story |
| create | `vision-graph-ui/src/shared/agent/index.ts` | Barrel exports: AgentEvt, createEvtBus, FakeRuntime, useAgentEvtStream, FsPort interface |
| create | `vision-graph-ui/src/shared/agent/__tests__/types.test.ts` | Type roundtrip tests |
| create | `vision-graph-ui/src/shared/agent/__tests__/eventBus.test.ts` | Pub/sub, generation counter, stale guard |
| create | `vision-graph-ui/src/shared/agent/__tests__/busySetReducer.test.ts` | startButNotFinished logic |
| create | `vision-graph-ui/src/shared/agent/__tests__/fakeRuntime.test.ts` | JSONL play, abort, emit timing |
| create | `vision-graph-ui/src/shared/agent/__tests__/useAgentEvtStream.test.ts` | Hook derived sets, subscription cleanup |
| create | `vision-graph-ui/src/shared/agent/__tests__/fixtures/` | Test fixture JSONL files |

## 4. Question-cycle gate

N/A — enabler plan. No open questions. Implementation follows spec exactly.

## 5. Tasks (incremental, TDD, each ends green+committed)

### Task 2.1 — AgentEvt types + GraphMutation vocabulary
- **Gherkin first**: `vision-graph-ui/src/shared/agent/__tests__/types.feature`
  - Scenario: AgentEvt union covers all 8 event kinds
  - Scenario: GraphMutation covers 7 ops (spawn/edit/move/group/detach/link/unlink)
  - Scenario: Type narrowing works on kind discriminator
- **Red**: `__tests__/types.test.ts` — all scenarios fail
- **Green**: `types.ts` — AgentEvt union, GraphMutation union, predicates (isRunStart, isStepStart, etc.)
- **Story**: N/A (types only, no UI)
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/shared/agent/__tests__/types.test.ts` — exit 0
- **Commit**: `feat(shared/agent): AgentEvt types + GraphMutation 7-op vocabulary`

### Task 2.2 — Event bus w/ generation counters (n8n stale-handler guard)
- **Gherkin first**: `__tests__/eventBus.feature`
  - Scenario: emit broadcasts to all subscribers
  - Scenario: subscribers receive events in order
  - Scenario: stale handlers skipped when generation counter mismatch
  - Scenario: unsubscribe removes handler
- **Red**: `__tests__/eventBus.test.ts` — all scenarios fail
- **Green**: `eventBus.ts` — createEvtBus(), emit(), subscribe() w/ gen counter, stale check
- **Story**: N/A (infra only)
- **Verify**: `npx tsc --noEmit && npx vitest run src/shared/agent/__tests__/eventBus.test.ts` — exit 0
- **Commit**: `feat(shared/agent): event bus w/ generation counters (stale-handler guard)`

### Task 2.3 — Busy-set reducer (startButNotFinished derivation)
- **Gherkin first**: `__tests__/busySetReducer.feature`
  - Scenario: empty events → empty busy set
  - Scenario: run-start adds node to busy set
  - Scenario: step-done removes node from busy set
  - Scenario: step-error removes node from busy set
  - Scenario: multiple runs tracked independently
- **Red**: `__tests__/busySetReducer.test.ts` — all scenarios fail
- **Green**: `busySetReducer.ts` — deriveBusyNodeIds(evts), lodash/fp flow, difference(started, finished)
- **Story**: N/A (pure reducer)
- **Verify**: `npx tsc --noEmit && npx vitest run src/shared/agent/__tests__/busySetReducer.test.ts` — exit 0
- **Commit**: `feat(shared/agent): busy-set reducer (startButNotFinished derivation)`

### Task 2.4 — Fake runtime + JSONL fixtures
- **Gherkin first**: `__tests__/fakeRuntime.feature`
  - Scenario: load JSONL fixture parses all lines
  - Scenario: play() emits events at recorded timestamps
  - Scenario: abort() stops emission mid-script
  - Scenario: malformed JSONL line throws parse error
- **Red**: `__tests__/fakeRuntime.test.ts` — all scenarios fail
- **Green**: `fakeRuntime.ts` — FakeRuntime class, load(jsonlPath), play(), abort(), event emitter
- **Story**: N/A (test infra only)
- **Fixtures**: `fixtures/` — JSONL files per S05/S06 validation story (e.g., `simple-execution.jsonl`, `agent-spawn.jsonl`)
- **Verify**: `npx tsc --noEmit && npx vitest run src/shared/agent/__tests__/fakeRuntime.test.ts` — exit 0
- **Commit**: `feat(shared/agent): fake runtime + JSONL fixtures`

### Task 2.5 — useAgentEvtStream hook + story integration
- **Gherkin first**: `__tests__/useAgentEvtStream.feature`
  - Scenario: hook subscribes to bus on mount
  - Scenario: hook exposes busyNodeIds derived set
  - Scenario: hook exposes stepTitleByNode map
  - Scenario: hook exposes lastMutation (graph-mutation event)
  - Scenario: hook unsubscribes on unmount
- **Red**: `__tests__/useAgentEvtStream.test.ts` — all scenarios fail
- **Green**: `useAgentEvtStream.ts` — useAgentEvtStream(bus) hook, subscription, derived sets
- **Story**: `AgentRuntimeBridge.stories.tsx` — "Scripted run passes", "Scripted run fails", "Abort mid-run"
- **Verify**: `npx tsc --noEmit && npx vitest run src/shared/agent/__tests__/useAgentEvtStream.test.ts && npm run build-storybook` — exit 0
- **Commit**: `feat(shared/agent): useAgentEvtStream hook + story integration`

### Task 2.6 — FsPort bridge interface (E3 owns impl)
- **Gherkin first**: `__tests__/fsPort.feature`
  - Scenario: FsPort interface defines write() contract
  - Scenario: FsPort interface defines read() contract
  - Scenario: FsPort interface defines delete() contract
- **Red**: `__tests__/fsPort.test.ts` — type checks fail (interface missing)
- **Green**: `index.ts` — FsPort interface (write, read, delete signatures)
- **Story**: N/A (interface only)
- **Verify**: `npx tsc --noEmit` — exit 0
- **Commit**: `feat(shared/agent): FsPort bridge interface`

### Task 2.7 — Barrel exports + final verification
- **Gherkin first**: N/A (integration test only)
- **Red**: N/A
- **Green**: `index.ts` — barrel exports all public types/functions
- **Story**: Verify stories pass: `npx vitest run --project=storybook -t "AgentRuntimeBridge"`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/shared/agent/__tests__/ && npm run build-storybook && npx vite build` — all exit 0
- **Commit**: `feat(shared/agent): barrel exports + E2 complete`

<5-7 tasks per enabler. Task N depends only on N-1.>

## 6. Skill + agent routing (per task)

| Task | Skills to load | Delegate to |
|---|---|---|
| 2.1 | `modern-react`, `agent-runtime-bridge` | `category="deep"` |
| 2.2 | `modern-react`, `agent-runtime-bridge` | `category="deep"` |
| 2.3 | `modern-react`, `test-driven-development` | `category="deep"` |
| 2.4 | `agent-runtime-bridge`, `storybook-agentic-e2e` | `category="deep"` |
| 2.5 | `modern-react`, `test-driven-development`, `storybook` | `category="deep"` |
| 2.6 | `modern-react` | `category="quick"` |
| 2.7 | `modern-react`, `test-driven-development`, `verification-before-completion` | `category="deep"` |

## 7. Live-system validation gate (enabler DONE only when ALL pass)

1. Run all enabler tests: `cd vision-graph-ui && npx vitest run src/shared/agent/__tests__/`
2. All stories in `AgentRuntimeBridge.stories.tsx` pass in Storybook: `npm run storybook` → manual verify
3. TypeScript clean: `npx tsc --noEmit`
4. Storybook builds: `npm run build-storybook`
5. Production build: `npx vite build`

## 8. Retry loop (failure = iterate, NEVER skip)

```
attempt → fail → read actual log lines (AGENTS.md §2)
  → hypothesis → minimal fix → re-run test
  → fail again? ×2 → load systematic-debugging skill
  → fail ×3 → escalate: oracle subagent w/ full ctx → fix → re-run
  → NEVER: delete test, loosen assert, extend timeout >2×, mark skip w/o user OK
```

## 9. Out of scope / guards

- NO live whitt-execution-engine integration (E2 = transport-agnostic only)
- NO WebSocket or FS-watch adapters (live engine decision — later slices)
- NO FsPort implementation (E3 owns this)
- NO UI components (S05/S06 own consumption)
- NO real agent runs (fake runtime only for this enabler)

---
