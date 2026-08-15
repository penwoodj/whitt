# Slice 10 — Canvas Manipulation

> Vertical slice: drag, connect, select, group (soft/hard), multi-node ops, physics feel.
> Heaviest convention-fill slice: user specified gestures + outcomes; conventions fill
> thresholds, feedback, cancels.

## Positive Requirements

1. **PR-10-1** Movement preserves meaning: connected nodes travel together (GRP-04);
   links never silently break.
2. **PR-10-2** Grouping has two commitment levels — soft (visual) and hard (folder + moves,
   ADR-0011) — with halo + group-prompt-context at either level.
3. **PR-10-3** Connection drawing is a gesture (hover-right → drag → drop), with live
   validity feedback and clean cancel.
4. **PR-10-4** Selection model is standard: click, ctrl/shift additive, lasso, click-empty
   clear, delete with guard.
5. **PR-10-5** Physics feel: packed, calm, reheat-on-drag, settle — bubble-chart-js
   semantics (research survey §1).

## Inherited Cases (full GWT + Why: `../../broader-vision/requirements/09-canvas-grouping-manipulation.md`)

| ID | Summary |
|---|---|
| GRP-01 | Multi-select bubbles, move together |
| GRP-02 | Selection focus surrounds region |
| GRP-03 | Right-click select boxes group |
| GRP-04 | Connected nodes pulled along |
| GRP-05 | Standalone floating nodes |
| GRP-06 | Drag lines between nodes (hover next to right) |
| GRP-07 | Soft vs hard grouping (hard = folder + moves) |
| GRP-08 | Grouping halo |
| GRP-09 | Grouping = prompt context (tooltip at side) |
| GRP-10 | Grouping node-like |
| GRP-11 | Nested graph in detail panel (eventual, deferred) |

## New Cases (convention-derived gap-fill)

### GRPC-01 Click-vs-drag threshold

```gherkin
Given pointer down on node
When movement < 4px before release
Then action = click (select / STT toggle per context)
And drag never fires
When movement ≥ 4px
Then action = node drag
```

**Why** `[C]`: React Flow `nodeDragThreshold` (default 1, configurable) /
Cytoscape `desktopTapThreshold: 4` — threshold separates VOX click semantics from
drag; without it single-click STT toggles would misfire during drags.

### GRPC-02 Drag cancel (ESC)

```gherkin
Given node drag in progress
When user presses ESC
Then drag aborts, node returns to drag-start position
And no link/position mutation committed
```

**Why** `[C]`: design-tool convention (tldraw/Figma ESC cancels in-flight ops);
cheap undo for accidental grabs.

### GRPC-03 Connection preview + validity feedback

```gherkin
Given connection drag in progress (from GRP-06 affordance)
Then dashed/animated preview line follows pointer
And hovering a valid target highlights it (state glow)
And hovering invalid target (e.g., would create self-loop) shows invalid styling
```

**Why** `[C]`: React Flow `connectionLineComponent` + `connectionStatus`
valid/invalid props — standard edge-draw feedback; user's GRP-06 needs the middle
state (while dragging) defined.

### GRPC-04 Connection cancel

```gherkin
Given connection drag in progress
When user presses ESC OR drops on empty canvas OR drops on invalid target
Then no link created, affordance disappears cleanly
```

**Why** `[C]`: React Flow connection cancel semantics; completes GRP-06's unhappy paths.

### GRPC-05 Edge deletion affordance

```gherkin
Given edge hovered or selected
Then delete affordance appears (X at edge midpoint on hover)
And clicking it removes the link (graph + FS mapping per ADR-0011)
And Backspace/Delete on selected edge does the same
```

**Why** `[C]`: ragflow hover-delete edge button (survey §6) + React Flow
`deleteKeyCode` convention; unlink needs a cheap inverse to GRP-06.

### GRPC-06 Selection model

```gherkin
Given canvas with nodes
When user clicks node → selects (replaces selection)
And ctrl/cmd+click → toggles node in selection
And drag on empty canvas → lasso (rubber-band) selects enclosed
And click empty canvas → clears selection
```

**Why** `[C]`: universal model (React Flow `selectionKeyCode`/`multiSelectionKeyCode`,
Cytoscape additive selection, G6 lasso) — GRP-01 multi-select needs a standard
acquisition path; lasso = the natural one on infinite canvas.

### GRPC-07 Delete guard on nodes

```gherkin
Given node(s) selected
When user presses Delete/Backspace
Then confirm affordance shown (nodes are FILES — deletion is FS deletion)
And confirm names scope (N files → trash/remove per ADR-0011 semantics)
And cancel keeps everything
```

**Why** `[I]`: nodes = files makes delete destructive; edges delete freely (GRPC-05)
but node deletion must be guarded. Trash-vs-delete = ADR-0011 decision, UI just gates.

### GRPC-08 Multi-node drag coherence

```gherkin
Given multi-selection (GRP-01)
When user drags any selected node
Then all selected nodes translate together (relative positions preserved)
And connected-but-unselected neighbors follow per GRP-04 pull semantics
```

**Why** `[C]`: G6 multi-drag w/ state / React Flow multi-drag; GRP-01's "move them
around into different groupings" made precise.

### GRPC-09 Physics: reheat and settle

```gherkin
Given node dragged and released
Then local simulation reheats (d3 simulation.restart semantics)
And released node carries release velocity, settles
And neighbors re-settle without overlap (collision pad)
And system sleeps when settled (no idle CPU burn)
```

**Why** `[C]`: d3-force reheat-on-drag + bubble-chart-js auto-sleep/collisionPad
(survey §1) — the "connected things pulled along" feel from source needs these
mechanics under it.

### GRPC-10 Hard-group creation gesture

```gherkin
Given soft group formed (GRP-03/07/08)
When user invokes "make permanent" (group affordance)
Then folder created, member files moved (ADR-0011 mapping)
And graph reflects as group box + halo persisting across sessions
And git records spawn of group + moves (AGTC-01/GITC-03)
```

**Why** `[I]`: resolves open question #2 (soft→hard promotion UX) minimally: soft is
the default state, promotion is one explicit gesture on the group; hard group
survives reload (soft does not — session-only).

## Implementation References

| Source | What to adapt |
|---|---|
| React Flow core props | `nodeDragThreshold`, `selectionKeyCode`, `multiSelectionKeyCode`, `deleteKeyCode`, `connectionLineComponent`, `connectionStatus`, `snapToGrid` (off default) |
| [bubble-chart-js](https://github.com/praga-dev/bubble-chart-js) (survey §1) | packed physics params: `centerStrength`, `collisionPad`, `velocityDecay`, `maxVelocity`, auto-sleep, deterministic seed |
| d3-force | `simulation.restart()`, alphaTarget drag-reheat, collide force |
| ragflow (survey §6) | hover-delete edge button pattern |
| AntV G6 | ghost-drag preview (optional polish; React nodes don't support — note) |

## Open Questions

- GRP-06 affordance exact hit zone ("hover next to the right of node") — prototype width (~24px right-edge strip); tune in Storybook.
- Should soft groups persist per-session only? (proposed yes in GRPC-10) — confirm.
