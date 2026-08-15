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
| NAVX-01 | `NAVX-01 ctrl-accelerated pan` | drag empty with Ctrl | pan speed > normal pan (2x acceleration) |
| NAVX-02 | `NAVX-02 arrow keys pan` | press Arrow keys | canvas pans; suppressed when STT input focused |
| NAVX-03 | `NAVX-03 WASD pan` | press WASD keys | canvas pans; suppressed when STT input focused |
| NAVX-04 | `NAVX-04 expanded node drag via padding` | expand node; drag padding | node moves; connections follow |
| NAVX-05 | `NAVX-05 corner resize handles` | expand node; drag corner | node size changes; size persists across reload |
| NAVX-06 | `NAVX-06 node location and grouping persistence` | move node; change grouping | position + grouping stored in FS; persist across reload |
| NAVX-07 | `NAVX-07 node modal fit content default` | open modal | size fits content; no scroll when content fits |
| NAVX-08 | `NAVX-08 node modal expandable with min height` | expand/contract modal | min height enforced; faded shadow over text; soft-edge scrollbar |
| NAVX-09 | `NAVX-09 plain markdown body + metadata separation` | create node with content + metadata | body = plain markdown; metadata in .whitt folder |
| NAVX-10 | `NAVX-10 ESC zoom out one level historical` | zoom into group; press ESC | zoom out to parent level; current group contracts |
