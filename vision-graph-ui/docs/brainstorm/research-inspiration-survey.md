# Brainstorm — Research Findings: Inspiration Projects Survey

> Captured 2026-08-14. Agent research findings from 6 inspiration projects, mapped to
> user vision (see `user-vision-graph-interaction.md`). Status: survey, not commitments.

Projects: react-force-graph, ragflow, motion (motion.dev), matter-js, bubble-chart-js, charkoal.dev.
Method: parallel librarian research against repos/docs/demos. No code pulled.

## Fit Verdicts (against user vision)

| Project | Fit | Role |
|---|---|---|
| bubble-chart-js | ★★★ core | Bubble physics, packed layout, auto-sleep, tiny (<12kb). Bubbles-of-light base. |
| motion (motion.dev) | ★★★ core | Drag feel, momentum, springs, layout morphs. React-native. Conversation popover + node morph. |
| charkoal.dev | ★★★ core | Git-native canvas, nesting-as-navigation, group-vs-nested split, breadcrumbs. Validates FS mapping. |
| react-force-graph | ★★☆ partial | Edge particles, WebGL scale, camera fly-to. Later, at node-count scale. |
| matter-js | ★☆☆ marginal | Full rigid-body physics. Fun, heavy, React impedance. Defer/reject for v1. |
| ragflow | ★☆☆ rejected as UX, salvage patterns only | Node complexity = anti-goal. Steal: running-state viz, path highlight, cycle validation. NOT node forms/builders. |

## 1. bubble-chart-js — bubbles of light foundation

Playground: praga-dev.github.io/bubble-chart-js

- Packed-bubble physics layout. Params: `centerStrength` (0.012), `collisionPad` (3px),
  `velocityDecay` (0.82), `alphaDecay`, `maxVelocity` (8), `updateBehavior`
  (`restart`|`momentum`), deterministic `physics.seed`.
- Data-driven radius (value → size), per-bubble color/label/icon.
- Hover: `hoverScale` 1.08, ease, tooltips. Events: `bubble:click`, `bubble:hover` (pub/sub).
- Dual renderer: canvas (10k+) / svg (<50), auto mode. Auto-sleep when settled.
- Layer hooks: custom draw at background/bubbles/text/overlay.
- Zero deps, framework-agnostic (needs thin React wrapper, imperative `chart.update()`).

Mapping: bubble = md file node. Radius = content weight/child count. Color = status.
Deterministic seed = spatial memory (same layout per session). Auto-sleep = idle calm,
wake on agent mutation = graph "breathes" when agent moves things.

## 2. motion — interaction feel layer

Docs: motion.dev/docs/react-drag

- `drag` + `dragMomentum` (fling inertia), `dragElastic`, `dragConstraints` (ref/pixels),
  `dragSnapToOrigin`, axis lock, `dragDirectionLock`.
- `useDragControls` + `dragListener={false}` = drag from handle only.
- `whileDrag` visual state (lift/scale/shadow).
- **`layout` prop**: auto-animate size/position on re-render — node collapsed→expanded morph
  in one prop. **`layoutId`**: shared-element morph across components — sphere→square
  (ADR-0012) candidate.
- Springs: `type: 'spring'`, stiffness/damping, `bounceStiffness`/`bounceDamping`.

Mapping: conversation **popover right of node** = motion component, springs on open/close.
Node drag while staying connected = React Flow drag + motion `whileDrag` polish.
Group-drag (lasso → move region) = multi-node translate w/ layout animation.

## 3. charkoal.dev — canvas-as-file existence proof

Note: user said "charkoal.ai" — actual product **charkoal.dev** (VS Code extension, beta ~4k installs).

- `.canvas` files = JSON Canvas spec (Obsidian open format), **git-tracked, in repo**.
- **Nested canvases**: canvas-in-canvas node, fullscreen drill (F), breadcrumbs back.
  Hierarchy = navigation.
- **Group vs nested distinction**: visual cluster (geometry only) vs logical containment
  (data parent/child). Separate icons. — Adopt: user "group things into areas" = nested
  when it means folder; group when purely visual.
- **Backlink index**: sidebar shows which canvases reference file/symbol. Reverse links.
- Code-symbol live links via LSP, two-way sync.
- **Whiteboard mode**: temp unsaved canvas — scratch layer pattern for agent proposals
  before accept (maps to "always revertible" generation).
- Edge spec: `fromSide`/`toSide` attachment, arrow endpoints, label, color.
- Criticized: no auto-arrange (manual only), shortcut conflicts, sparse AI docs, no templates.

Mapping: grouping = folders is literally their model. Whitt ADR-0011 = same bet, richer
frontmatter. Breadcrumbs + nesting = zoom semantics without renderer swap. Scratch mode
= agent proposal staging. Auto-arrange = must-have (their failure = whitt requirement).

## 4. react-force-graph — scale tier, later

Repo: vasturiano/react-force-graph

- 2D canvas / 3D WebGL / VR variants, same API.
- **Edge particles**: `linkDirectionalParticles` (+speed/width/color), `emitParticle(link)`
  on demand. Directional arrows w/ position (`linkDirectionalArrowRelPos`), curved links
  (`linkCurvature`), dashed (`linkLineDash`).
- Node drag + pin (`onNodeDragEnd` → `fx`/`fy` fixed coords).
- DAG modes (td/lr/radialout) + `onDagError` cycle detection.
- Live `graphData` swap → sim reheats, new nodes fly in + settle.
- Camera: `zoomToFit(ms, padding, nodeFilter)` = animated fly-to-subset. ← voice query
  "show failures" → camera flight.
- WebGL handles ~10k+ elements (examples to 74k w/ perf caveats; links = bottleneck;
  no web worker; no GPU instancing yet).
- NOT: no DOM/HTML nodes in canvas mode (custom draw = canvas paint only), no graph
  algorithms, no LOD.

Mapping: 3D eventual goal (user vision) — react-force-graph-3d or force-graph + Three.js
= credible 3D bubble path w/ particles as "agent is working" flows. DOM conflict: canvas
nodes ≠ rich popovers. Likely hybrid: force-graph for structure/motion, DOM overlay
(HTML positioned at projected coords) for focused node + popover. Defer until 2D proves out.

## 5. matter-js — physics playground (marginal)

Demo: brm.io/matter-js/demo/#mixed

- Rigid bodies, `restitution` bounce, `frictionAir`, collision filter category/mask/group,
  sleeping bodies, `Body.applyForce` fling.
- Springs: `Constraint.create({stiffness, damping})`, pin joints.
- `MouseConstraint` drag w/ physical tug. Collision events: `collisionStart/Active/End`.
- Vanilla JS; React wrapper = manual lifecycle + position sync each frame.

Mapping: only wins if "throw nodes, they collide + settle" becomes core desired feel.
Bubble-chart-js physics already covers packed layout + collision w/ far less integration
cost. Verdict: skip for now; revisit only if user wants true rigid-body play.

## 6. ragflow — rejected UX, salvage these patterns

Repo: infiniflow/ragflow (web/, @xyflow/react 12, Zustand, React 18)

**Rejected**: 24+ node types, form drawers per node, workflow-builder semantics. User
explicitly: too much node/interaction complexity.

**Salvage list** (execution-state visualization only):

- Running nodes: spinner via `startButNotFinishedNodeIds` set derived from
  `NodeStarted`/`NodeFinished` events (WebSocket event stream → derived state, no prop drilling).
- Post-run **path highlight**: edges in actual executed `path[]` get accent + thicker stroke.
- Cycle-proof connect validation: recursive `hasCycle` w/ `getOutgoers`; structured loop
  containers instead of raw cycles.
- Edge hover-delete button.
- Multi-node clipboard (custom `agent:nodes` format).

These translate to: agent-activity viz on simple bubbles (glow/pulse/spinner while agent
works, path glow for what it touched) — no builder UI required.

## Synthesis — Architecture Sketch (research-derived, not committed)

```
PRESENTATION   bubbles (canvas physics, deterministic seed)     bubble-chart-js
               drag feel, popover springs, node morphs          motion
               nesting nav, breadcrumbs, scratch layer          charkoal pattern
               activity glow, path highlight, spinners          ragflow patterns (viz only)
SPINE          node = md file, FS = truth, git-tracked          ADR-0011 (charkoal validates)
               memory layer: in-mem + Neo4j cache               ADR-0007
               voice → text → agent → graph mutation            ADR-0001/0002/0003 slices
SCALE LATER    3D bubbles + edge particles (WebGL)              react-force-graph(-3d)
               fish-eye continuous LOD tiers                    open problem
```

Fish-eye (dual-scale simultaneous view) — candidate implementations to evaluate later:
1. Persistent overview minimap (corner or edge-docked, always-on, cheap, known pattern).
2. True lens distortion (radial fisheye transform on node positions — d3 has fisheye
   plugin lineage; needs custom renderer math).
3. Scale-and-border canvas (zoomed-out ghost of whole graph rendered around viewport
   margins).
Research verdict: none of surveyed projects implement true fisheye graph LOD; this is
custom work. Bubble renderer's custom layer hooks are the insertion point.

## Feature Possibilities (menu, not roadmap)

1. Bubble glow/pulse states while agent works (ragflow event pattern on bubbles).
2. Edge particles = data/context flowing to focused node during conversation.
3. Deterministic seeded layout = stable spatial memory across sessions.
4. Group-lasso → "make area" → folder created (charkoal nesting + ADR-0011).
5. Scratch layer: agent-proposed splits/expansions appear ghosted; voice accept/discards.
6. Voice select-as-context: highlighted bubbles = weighted attention for agent.
7. Conversation popover right of node, spring physics, editable STT text before send.
8. Camera fly-to on voice queries (zoomToFit w/ filter).
9. Split-subsection-to-child-node gesture (voice §6 example) = graph + FS mutation.
10. 3D mode toggle later (WebGL tier), DOM overlay for focused node + popover.
