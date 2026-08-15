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

### GRPX-01 Soft group dual persistence

```gherkin
Given nodes selected and grouped as soft group
When soft group is created
Then group state persisted to localStorage
And group state also persisted in .whitt folder in closest parent node folder
```

**Why** `[S]`: "Local storage and persistent in the .whitt folder in the closest parent node folder. remember a node is a .md file (at least for now) and the hard grouping is a new folder and the soft grouping is stored in local storage and in the closest parent folder to all highlighted nodes .whitt folder"

### GRPX-02 Left-click pan vs right-click lasso

```gherkin
Given canvas with nodes
When user left-clicks on empty canvas and drags
Then canvas pans (move canvas)
When user right-clicks on empty canvas and drags
Then lasso selection creates selection region around enclosed nodes
```

**Why** `[S]`: "left click is move canvas, and right click is lasso select"

### GRPX-03 Selection halo + icon outside border

```gherkin
Given nodes selected forming a group
When selection is active
Then selection halo border surrounds all selected nodes
And + icon appears in upper right hand corner OUTSIDE of the selection halo border
And + icon is visible on hover over selection
And + icon is visible on click on selection
```

**Why** `[S]`: "then on that select there is a + icon to the upper right hand corner outside of the selection halo border that if hovered over or clicked allows you to Make Folder, along with Speak to Selected, and others in a selection list in a tooltip"

### GRPX-04 + icon tooltip menu actions

```gherkin
Given nodes selected with + icon visible
When user hovers over or clicks the + icon
Then tooltip menu appears with actions
And menu includes "Make Folder" action
And menu includes "Speak to Selected" action
And menu includes other selection actions
```

**Why** `[S]`: "if hovered over or clicked allows you to Make Folder, along with Speak to Selected, and others in a selection list in a tooltip"

### GRPX-05 Make Folder visual transformation

```gherkin
Given soft group selected with + icon menu open
When user selects "Make Folder" action
Then selection halo border becomes more pronounced and harsher
And halo border stays about the same size
And center of border glow becomes more solid
And center of border glow becomes less opaque
```

**Why** `[S]`: "when this is done the files and folders selected via their node representations are moved into a new folder and thus a new blank node .md doc at the top level also with a selection. when selecting make folder it makes the halo border have a more pronounced harsher border with the halo staying about the same but the center of the border glow being more solid and less opac"

### GRPX-06 Make Folder file system action

```gherkin
Given soft group selected and "Make Folder" action invoked
When Make Folder completes
Then all selected files and folders moved into new folder
And new blank node .md doc created at top level
And new node has selection active
And group becomes hard group (folder-based)
```

**Why** `[S]`: "when this is done the files and folders selected via their node representations are moved into a new folder and thus a new blank node .md doc at the top level also with a selection"

### GRPX-07 Group detail panel with full graph view

```gherkin
Given soft or hard group node
When group is spoken to (STT invocation)
Then group displays detail panel similar to node detail panel
And first section in detail panel is full-size graph view of group contents
```

**Why** `[S]`: "when the soft group that is just in local storage and .whitt folder or folder is spoken to the group has a detail pannel similar to the node but adds the first thing in the soft corner box would be just the normal graph full size"

### GRPX-08 Unfocused group bubble + halo + mini-window

```gherkin
Given group node not focused
When group renders in unfocused state
Then node becomes bubble of light
And soft or hard group halo border surrounds bubble
And inner graph displays zoomed-out view inside node
And node is reasonably sized (bigger than average node)
And mini-window shows subgraph of information within collapsed node
```

**Why** `[S]`: "then when not focused the node becomes a bubble of light but with that soft or hard group halo border around it and the inner graph zoomed out so the node can be reasonably sized while still seeing a bigger than the agerage node little window into the collapsed node that contains a subgraph of information"

### GRPX-09 Editable deterministic group titles

```gherkin
Given soft or hard group node
When user edits group title
Then title stored as dash case all lowercase
And title stored in state structure in correct .whitt folder
Or title stored as folder name (for hard groups)
And title persists across sessions
```

**Why** `[S]`: "I also want those to have editable titles that are determinstically stored with dash case all lower case either in the state strucutre in the correct .whitt folder, or as the folder name"

### GRPX-10 Debounced file system reflection

```gherkin
Given graph with live active memory in localStorage
When user makes changes to group structure
Then changes reflected in folder structure on debounced basis
And live active memory graph provides speed
And file system sync occurs after debounce delay
```

**Why** `[S]`: "I also want to make it so whatever the use does is reflected in the folder strucuture on a debounced basis with the live active memory of the graph for speed"

### GRPX-11 Double-right-click expand group

```gherkin
Given group node (soft or hard)
When user double-right-clicks the group
Then group node expands to show contents
And expansion shows group detail panel
And speech-to-text recording NOT started (reserved gesture)
```

**Why** `[S]`: "If you double right click Then it expands the node... those double right click or double left click are reserved for the recording gestures previously described in the requirements"

### GRPX-12 Double-left-click expand + record

```gherkin
Given group node (soft or hard)
When user double-left-clicks the group
Then group node expands to show contents
And speech-to-text recording starts
And STT tooltip appears in upper right-hand corner around the node
And recording works whether node expanded or not
```

**Why** `[S]`: "And If you double-left click it expands the node and the note and starts recording with the speech to text speech-to-text tool tip in the upper right-hand corner around the new around the node expanded or not. those double right click or double left click are reserved for the recording gestures previously described in the requirements"

### GRPX-13 Flatten Folder action

```gherkin
Given hard group folder with contents
When user invokes "Flatten Folder" action from + icon menu
Then folder structure removed
And all member files moved to parent level
And group reverts to soft group state
Or group dissolved (if no members remain)
```

**Why** `[S]`: "We want a + Button in the upper right hand corner on hover and select of a grouping node that has a Make Folder and a Flatten Folder"

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
