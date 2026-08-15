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

## Implementation References

| Source | What to adapt |
|---|---|
| React Flow `<Controls>`, `<MiniMap>`, `minZoom`/`maxZoom`, `zoomOnScroll`, `panOnDrag`, `panActivationKeyCode` | nearly all NAV cases are config-level |
| react-force-graph `zoomToFit(ms, padding, nodeFilter)` (survey §4) | animated fit + filtered fit (voice query fly-to later) |
| Fish-eye candidates (survey synthesis) | minimap (NAV-05) = tier 1; lens transform + border-ghost deferred |

## Open Questions

- NAV-02 hybrid pan/lasso mode — verify feel in Storybook vs pure slippy default; pick one, document in ADR revision.
- 3D tier navigation (orbit/fly controls) — react-force-graph-3d `controlType` when that tier lands.
