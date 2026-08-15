---
name: agent-runtime-bridge
description: >
  Wiring whitt-execution-engine (YAML workflows) to the vision-graph-ui. Event schema,
  transport, UI-state derivation (busy-set, step title), graph mutation projection.
  Use when integrating agent execution into the graph UI: slice 05 (execution viz),
  slice 06 (agent semantics), any live agent run in Storybook or app.
---

## When to Use

- Connecting whitt-execution-engine runs to graph UI states (EXE cases, AGT cases)
- Deriving busy/running states from execution events (EXE-10/11/14/15)
- Projecting agent file mutations onto the graph (AGT-04/06, AGTC-01/02)
- Building scripted-agent fixtures for Storybook (pair w/ `storybook-agentic-e2e`)

## Contract Overview

UI NEVER polls the engine for state. UI consumes an event stream. Transport
(WebSocket vs FS-watch events) is an engine-side decision — the UI-side contract
below works either way.

### Event schema (UI-side, transport-agnostic)

```typescript
type AgentEvt =
  | { kind: 'run-start'; runId: string; nodeId: string; workflow: string }
  | { kind: 'step-start'; runId: string; stepId: string; title: string }
  | { kind: 'step-done'; runId: string; stepId: string }
  | { kind: 'step-error'; runId: string; stepId: string; msg: string }
  | { kind: 'log'; runId: string; level: 'info' | 'warn' | 'error'; msg: string }
  | { kind: 'file-write'; runId: string; path: string; actor: 'agent' }
  | { kind: 'graph-mutation'; runId: string; mutation: GraphMutation }
  | { kind: 'run-done'; runId: string; nodeId: string; status: 'done' | 'error' }

type GraphMutation =
  | { op: 'spawn'; parentNodeId: string; newNodeId: string; title: string }
  | { op: 'edit'; nodeId: string }
  | { op: 'move'; nodeId: string; from: string; to: string }
  | { op: 'group'; nodeIds: string[]; groupId: string }
  | { op: 'detach'; nodeId: string }
  | { op: 'link'; source: string; target: string }
  | { op: 'unlink'; source: string; target: string }
```

Vocabulary = AGTC-01 (spawn/edit/move/group/detach/link/unlink). Map engine-side
workflow ops onto these seven; anything unmappable = extend AGTC-01 first, then here.

## UI-State Derivation (ragflow pattern — no prop drilling)

Single store subscription; nodes read derived sets:

```typescript
const busyNodeIds = derived((evts) => {
  const started = new Set(evts.filter(isRunOrStepStart).map(nodeOf))
  const finished = new Set(evts.filter(isRunOrStepDoneOrErr).map(nodeOf))
  return difference(started, finished)  // startButNotFinishedNodeIds
})
```

- EXE-10 running ball ← `busyNodeIds.has(nodeId)`
- EXE-15 current step title ← last `step-start` per nodeId
- EXE-11 breathing edges ← non-empty busy set; still when empty
- EXEC-05 completion state ← `run-done` transitions busy→done glow

Keep derivation pure (lodash/fp `flow`). Store slice: `features/agent-bridge/`.

## Graph Mutation Projection (AGT-06)

`graph-mutation` + `file-write` events drive graph changes. Ordering rules:

1. `file-write` events are TRUTH (ADR-0011: FS wins). `graph-mutation` is a hint
   for animation/placement only.
2. Spawn placement (AGTC-02): new node appears near `parentNodeId` w/ offset ring;
   physics settles after (GRPC-09 reheat→settle→sleep).
3. Batch mutations from one run land as ONE graph commit (avoid thrash).

## Integration Steps

1. Define event fixtures (JSONL) BEFORE wiring live engine — one file per slice-05
   validation story. See `storybook-agentic-e2e` skill for fixture harness.
2. Build `useAgentEvtStream(evtBus)` hook: subscribe, reduce into derived sets,
   expose `{ busyNodeIds, stepTitleByNode, lastMutation }`.
3. Wire engine transport adapter LAST (WebSocket or FS-watch) behind same hook.
4. Tests assert on derived sets, never raw event list.

## MUST NOT

- Poll engine state from components
- Mutate graph nodes directly from events — always through derivation + FS truth
- Introduce event kinds outside AGTC-01 vocabulary without updating slice 06 docs
- Prop-drill execution state (context/store only, per ragflow lesson)

## References

- `docs/feature-requirements/slices/05-execution-viz.md` (EXEC cases, event refs)
- `docs/feature-requirements/slices/06-agent-semantics.md` (AGTC-01 vocabulary)
- ragflow pattern: `docs/broader-vision/research-inspiration-survey.md` §6
- ADR-0011 (FS = truth): `docs/adr/0011-graph-to-filesystem-mapping.md` (repo-root path)
