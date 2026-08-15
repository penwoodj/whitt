# Slice 11 — Viewport & Navigation

> Vertical slice: pan/zoom/fit/minimap — pure convention-fill (user specified no cases
> here; graph tools' standard expectations apply). Fish-eye dual-scale remains deferred
> research (see `../../broader-vision/research-inspiration-survey.md` synthesis).

## Positive Requirements

1. **PR-11-1** Navigation is standard slippy-map feel: wheel zoom-to-cursor, drag pan,
   pinch zoom — zero learning curve.
2. **PR-11-2** Never lost: fit-view + minimap available; rail (slice 01) anchors identity.
3. **PR-11-3** Zoom limits protect both extremes (no lost-in-pixels, no mush).
4. **PR-11-4** Navigation never fights selection/drag (modes are disjoint).

## Inherited Cases

None — this slice is entirely convention-derived (user deferred navigation specifics).

## New Cases

### NAV-01 Wheel zoom-to-cursor

```gherkin
Given pointer at canvas point P
When user scrolls wheel
Then zoom scales about P (content under cursor stays under cursor)
```

**Why** `[C]`: universal slippy-map rule (React Flow default, Cytoscape, Figma);
zooming about viewport center instead is the classic "wrong feel" bug.

### NAV-02 Pan modes

```gherkin
Given canvas
When user drags empty canvas → pan
And space+drag (any surface) → pan
And drag on node → node drag (slice 10), never pan
```

**Why** `[C]`: React Flow default mode (pan = drag empty, select = shift-drag) —
matches our canvas where selection is lasso-on-empty-drag? CONFLICT RESOLUTION:
we adopt design-tool hybrid — pan = drag empty OR space+drag; lasso = shift+drag
(aligns w/ GRPC-06 lasso while keeping one-gesture pan).

### NAV-03 Zoom limits

```gherkin
Given zooming in/out
Then scale clamps to [minZoom, maxZoom] (propose 0.1 .. 2.5)
And clamping does not bounce/jitter
```

**Why** `[C]`: Cytoscape minZoom/maxZoom convention; bounds keep bubbles legible
(bubbles at 0.05 = invisible dots; at 10 = one glow fills screen).

### NAV-04 Fit-view control

```gherkin
Given canvas w/ content
Then Controls include fit-view button (and keyboard shortcut, propose `1`)
And fit-view animates camera to bound all nodes w/ padding (~10%)
```

**Why** `[C]`: React Flow `<Controls showFitView>` + Figma `shift+1` convention;
the recover-my-bearings button.

### NAV-05 Minimap

```gherkin
Given canvas w/ content beyond viewport
Then minimap (corner, toggleable) shows all nodes + viewport rect
And dragging viewport rect pans
And clicking minimap jumps
```

**Why** `[C]`: React Flow `<MiniMap pannable zoomable>`; interim spatial-awareness
answer while fish-eye stays deferred (survey: minimap = candidate 1 of 3).

### NAV-06 Node hover cursor semantics

```gherkin
Given pointer over node
Then cursor = grab (idle), grabbing (dragging), pointer (over actionable affordance)
And over empty canvas = default/grab per pan mode
```

**Why** `[C]`: tldraw/G6 cursor conventions; cursor is the cheapest affordance signal.

### NAV-07 Keyboard nudge

```gherkin
Given node(s) selected
When user presses arrow keys
Then selection nudges 1px (10px w/ shift) — physics reheats per GRPC-09
```

**Why** `[C]`: Figma/design-tool precision nudge; voice-first product still needs
pixel-fidelity path.

### NAV-08 New-node viewport guarantee

```gherkin
Given agent/user spawns node outside current viewport
Then canvas auto-pans (animated) to reveal it
And only when spawn causally involves user (their prompt); background agent spawns
notify via glow on minimap instead of yanking camera
```

**Why** `[I]`: AGTC-02 made visible — camera yanking on every background mutation
would be seasickness; user-caused spawns deserve reveal.

### NAVX-01 Ctrl-accelerated pan

```gherkin
Given canvas with nodes
When user left-clicks and drags on empty canvas while holding Ctrl
Then pan speed is accelerated compared to normal pan
And pan direction follows mouse movement
```

**Why** `[S]`: "when control is used The pan is sped up"

### NAVX-02 Arrow keys pan

```gherkin
Given canvas with nodes
When user presses arrow keys (Up, Down, Left, Right)
And user is not focused in speech-to-text input
Then canvas pans in arrow key direction
And pan speed is consistent
```

**Why** `[S]`: "I want the same behavior with arrow keys... When not and not selected into a speech-to-text to text input"

### NAVX-03 WASD pan

```gherkin
Given canvas with nodes
When user presses W, A, S, or D keys
And user is not focused in speech-to-text input
Then canvas pans in corresponding direction (W=up, A=left, S=down, D=right)
And pan speed is consistent with arrow keys
```

**Why** `[S]`: "I want the same behavior with arrow keys and W A S D When not and not selected into a speech-to-text to text input"

### NAVX-04 Expanded node drag via padding

```gherkin
Given expanded node with padding area around content
When user left-clicks and drags in padding area (not on defined content areas)
Then node moves with drag
And all connections move with node
And drag works same as non-expanded node drag
```

**Why** `[S]`: "If the node is expanding expanded and you are not clicking into a defined area and you're clicking into the padding in between or around the neck around the node then you can drag the node as well that way when it is expanded"

### NAVX-05 Corner resize handles for expanded node

```gherkin
Given expanded node with rounded border
When user hovers over corners of rounded border
Then resize handles appear at corners
When user drags corner resize handle
Then expanded node size changes (expand or contract)
And new size persists across loading sessions
```

**Why** `[S]`: "I also want to be able two from the corners on the rounded border be able to Expand and contract the expanded state of the node and have that stored and stay between loading sessions"

### NAVX-06 Node location and grouping persistence

```gherkin
Given node with position and group membership
When user changes node location or grouping
Then node location stored to file system
And node grouping stored to file system
And both location and grouping persist across loading sessions
```

**Why** `[S]`: "So the node's location is stored and its grouping is stored in the file system"

### NAVX-07 Node modal fit content default

```gherkin
Given node modal opened for first time or with default sizing
Then modal size fits content
And modal displays all content without scrolling (when content fits viewport)
And modal height adapts to content length
```

**Why** `[S]`: "Have it in a default size that fits the content to content"

### NAVX-08 Node modal expandable with min height

```gherkin
Given node modal with content
When user expands or contracts modal size
Then modal has minimum height constraint
And minimum height includes content display plus minimum display area
And faded shadow appears over text when content exceeds modal height
And soft-edge scrollbar appears when content overflows
And all edges are soft (not sharp)
```

**Why** `[S]`: "once there is details or information in the document that is not metadata Then I want to be able to expand and contract with a min height and a faded shadow of shadow over the text and a scroll bar but all with soft edges And that is the minimum height of the node is the content plus that minimum height display for the document content"

### NAVX-09 Plain markdown body + metadata separation

```gherkin
Given node document with content and metadata
When node renders
Then document body always displays as plain markdown
And metadata always stored in appropriate .whitt folder
And metadata not mixed with markdown content
```

**Why** `[S]`: "I would also like this to be always plain markdown and always put metadata in the appropriate .whitt folder"

### NAVX-10 ESC zoom out one level historical

```gherkin
Given user zoomed into nested graph or group view
When user presses ESC
Then canvas zooms out one level
And view shows historical parent level of graph
And current grouping (soft or hard) contracts to smaller view
And zoom level matches previous zoom state before entering group
```

**Why** `[S]`: "esc zooms you out a level which does a historical view for the previous level up of the graph with the current grouping soft or hard being contracted to its smaller view"

## Implementation References

| Source | What to adapt |
|---|---|
| React Flow `<Controls>`, `<MiniMap>`, `minZoom`/`maxZoom`, `zoomOnScroll`, `panOnDrag`, `panActivationKeyCode` | nearly all NAV cases are config-level |
| react-force-graph `zoomToFit(ms, padding, nodeFilter)` (survey §4) | animated fit + filtered fit (voice query fly-to later) |
| Fish-eye candidates (survey synthesis) | minimap (NAV-05) = tier 1; lens transform + border-ghost deferred |

## Open Questions

- NAV-02 hybrid pan/lasso mode — verify feel in Storybook vs pure slippy default; pick one, document in ADR revision.
- 3D tier navigation (orbit/fly controls) — react-force-graph-3d `controlType` when that tier lands.
