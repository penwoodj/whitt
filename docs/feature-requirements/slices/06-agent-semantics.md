# Slice 06 — Agent Context & Mutation Semantics

> Vertical slice: what the agent assumes, what it may touch, how mutations become
> graph events. The "meaning" layer between prompts and the FS/graph.

## Positive Requirements

1. **PR-06-1** Spoken-to node is the default referent (AGT-01) — deictic prompts work.
2. **PR-06-2** Links are permission paths: cross-node edits only via reference or link (AGT-02).
3. **PR-06-3** Initial prompts create exactly one file (AGT-03) — predictable blast radius.
4. **PR-06-4** Every FS mutation projects to a graph movement event, real time (AGT-04/06).
5. **PR-06-5** User can intervene mid-execution (AGT-05) — supervision is a first-class act.

## Inherited Cases (full GWT + Why: `../../broader-vision/requirements/05-agent-context-semantics.md`)

| ID | Summary |
|---|---|
| AGT-01 | Spoken-to node = default context |
| AGT-02 | Linked references may edit other files |
| AGT-03 | Initial prompt → one file only |
| AGT-04 | Agent mutations appear as graph movement, real time |
| AGT-05 | Real-time reaction/intervention loop |
| AGT-06 | File mutations project onto graph (FS = truth) |

## New Cases

### AGTC-01 Mutation event grammar (fixed vocabulary)

```gherkin
Given any agent mutation
Then it emits exactly one of a fixed event vocabulary:
| spawn    (new file/node appears off a parent)
| edit     (node content changes, glow pulse)
| move     (node changes position/parent)
| group    (nodes enclosed, halo forms)
| detach   (node/link removed from grouping)
| link     (new connection)
| unlink   (connection removed)
And UI maps each event type to ONE canonical animation
```

**Why** `[I]`: source says "lots of different graph manipulation that means different
things" — a closed vocabulary makes manipulation READABLE (user learns 7 motions,
not arbitrary churn). Also the contract for EXEC step narration + validation asserts.

### AGTC-02 Spawn placement

```gherkin
Given agent spawns a child file off node N
Then new bubble appears adjacent to N (spring distance, offset from siblings)
And entrance animation = fade + settle (never teleport)
And parent link draws itself in the same beat
```

**Why** `[C]`: force-graph live-update convention (graphData swap → new nodes fly in
+ settle — react-force-graph behavior from research survey §4); adjacent placement
keeps causality visible (it came from HERE).

### AGTC-03 Intervention gesture

```gherkin
Given agent executing
When user opens the node (EXP) and speaks/types a correction
Then correction prompt queues to the agent conversation
And execution state reflects interruption (status bar)
And user never loses the ability to stop/redirect
```

**Why** `[I]`: AGT-05 made concrete — intervention needs an actual gesture path;
reuses existing surfaces (modal + prompt input) rather than new chrome.

## Implementation References

| Source | What to adapt |
|---|---|
| react-force-graph live `graphData` swap (survey §4) | reheat + settle entrance semantics for AGTC-02 |
| ragflow event-derived states (survey §6) | NodeStarted/Finished event stream → AGTC-01 event bus |
| d3-force `simulation.restart()` + alphaTarget | drag/mutation reheat physics (shared w/ slice 10) |

## Open Questions

- Stop/pause agent gesture: propose explicit stop button in expanded modal execution area — needs user confirmation before encoding.
- Event vocabulary sufficiency: 7 types cover observed flows; revisit after engine integration.
