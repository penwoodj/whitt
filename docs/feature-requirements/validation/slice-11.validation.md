# Slice 11 Validation — Viewport & Navigation

Fixture: `Viewport.stories.tsx` — canvas w/ spread nodes; React Flow viewport APIs
mocked/observable.

| Case | Story (`slice11 -- …`) | Play outline | Assert |
|---|---|---|---|
| NAV-01 | `NAV-01 zoom to cursor` | wheel at point P | content at P stays at P (viewport transform check) |
| NAV-02 | `NAV-02 pan modes` | drag empty = pan; space+drag on node = pan; drag node = node-move | 3 steps, disjoint semantics |
| NAV-03 | `NAV-03 zoom limits` | wheel beyond bounds | clamps at 0.1 / 2.5; no jitter (transform monotonic) |
| NAV-04 | `NAV-04 fit view` | spread; click fit | all nodes bounded + padding; animated (transform transition) |
| NAV-05 | `NAV-05 minimap` | content beyond viewport | minimap nodes + viewport rect; drag rect pans; click jumps |
| NAV-06 | `NAV-06 cursor semantics` | hover states | grab/grabbing/pointer per surface |
| NAV-07 | `NAV-07 keyboard nudge` | select; ArrowRight; Shift+Arrow | 1px / 10px position delta |
| NAV-08 | `NAV-08 spawn reveal` | user-caused spawn off-viewport | camera pans (animated); background spawn → minimap glow only |
