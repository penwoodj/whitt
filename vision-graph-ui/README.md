# Vision: Graph UI for Whitt

> A **voice + mouse, infinite-canvas, fish-eye graph UI** for the whitt ecosystem. This folder holds the design vision and future planning materials. It is **not** an implementation plan — it is a direction statement to align future UI work across the ecosystem.

---

## One-Paragraph Vision

Whitt's UI becomes a single **infinite zoomable canvas** where every workflow is a subgraph, every task is a node, every hook is an edge, and every swarm peer is a constellation. The user navigates by **voice and mouse** — voice to declare intent ("show me today's failures", "make a new summarizer", "deploy to the Pi"), mouse to pan, zoom, drag, combine, and expand. The canvas uses a **fish-eye** representation: nodes near the cursor expand to show live state (tokens streaming, hook events firing, artifacts appearing), while distant nodes contract to summary chips. As the user digs deeper into any topic, the canvas **agentically generates** just-in-time detail — new nodes, new sub-workflows, new tool inspector panels — synthesized from the workflow library and the model router, never requiring the user to leave the canvas to author boilerplate.

## Five Pillars

### 1. Graph UI (not panels-and-tabs)

- Every artifact is a node: workflow, task, step, tool call, model, peer, artifact file, schedule, approval request.
- Every relationship is an edge: `enqueued-by`, `depends-on`, `produced`, `routed-to`, `running-on`, `approved-by`.
- **No more "tabs".** Scope (workspace / project / workflow / step) is preserved by graph nesting, not by tab switching.
- Existing surfaces (chat, queue, editor, monitor, metrics) become **node inspector panels** that appear when a node is focused — not separate screens.

### 2. Voice + Mouse Input

- **Voice** = intent declaration in natural language.
  - *"New workflow that summarizes my morning notes and posts to Slack."* → graph node appears, wired to a router-suggested model, queued.
  - *"Show everything that failed yesterday."* → graph filters + zooms to the failure subgraph.
  - *"Deploy the summarizer to the Pi."* → swarm topology node lights up; cross-compile + scp + restart chain animates.
- **Mouse** = spatial navigation and direct manipulation.
  - Pan / zoom (fish-eye).
  - Drag to reprioritize (projected onto queue engine's scheduler API, per ADR-0004's "drag-drop = scheduler API projection").
  - Drag to combine (two workflows → one merged workflow; UI generates candidate merge YAML via the engine).
  - Pinch / scroll to dig deeper (fish-eye expansion → just-in-time agentic generation).
- **Voice + mouse compose** — voice creates, mouse arranges.

### 3. Infinite Canvas

- No viewports, no pages, no "back button". The canvas is the entire UI.
- Pan and zoom are unbounded. World coordinates are stable across sessions (the user's mental map persists).
- Clusters auto-layout (force-directed for related workflows; orthogonal for pipelines; geographic for swarm peers).
- Background grid is adaptive: coarse at low zoom (queue regions), fine at high zoom (individual token streams).
- **Persistent spatial memory** — where the user left a node is where they find it next session.

### 4. Fish-Eye Graph Representation

- **Distant nodes** = summary chips (status color + icon + count).
- **Mid-range nodes** = cards (title, status, last event, owner model).
- **Near nodes** = full inspectors (live token stream, hook timeline, artifact preview, template variable values resolved).
- **Focused node** = inline editor (YAML workflow with schema linting, hook configuration, retry budget, router explanation).
- The fish-eye is **not** a zoom level — it is a **continuous function of cursor proximity**. Multiple regions can be expanded simultaneously (the user's "current focus" is a set, not a point).
- State transitions animate (10 task states → 10 color flows; hooks fire → edge pulses; tools execute → badges bloom).

### 5. Just-In-Time Agentic Generation as User Digs Deeper

- When the user zooms into an unfamiliar area, the UI doesn't just show more detail — it **generates** more content.
- Examples:
  - Zoom into a "summarize notes" node → UI generates a candidate sub-workflow (fetch → chunk → summarize → format → deliver) using the workflow library + model router.
  - Zoom into a failed step → UI generates a debugging subgraph (re-run with verbose hooks, diff inputs, propose fix, test fix).
  - Zoom into a swarm peer → UI generates the live inference panel + recent artifacts + suggested next deploys.
- Generation is **always editable and always revertible**. The user accepts, modifies, or discards — never forced.
- This is the UI embodiment of the engine's existing **self-improvement loop** and the router's **two-layer recommendation**.

## How This Maps to the Whitt Ecosystem

| Ecosystem capability | Graph UI embodiment |
|---|---|
| `whitt-execution-engine` workflows | Subgraphs on the canvas |
| `whitt-execution-engine` 10 hook triggers | Animated edge pulses |
| `whitt-execution-engine` 50+ template variables | Fish-eye detail data |
| `whitt-agent-queue-engine` 10 task states | Node color + icon |
| `whitt-agent-queue-engine` 25 queue categories | Cluster regions |
| `whitt-agent-queue-engine` drag-drop reprioritize | Direct edge manipulation |
| `whitt-model-router` two-layer routing | Two-level fish-eye zoom |
| `whitt-model-router` "why this model" | Tap-to-explain badge |
| `whitt-hardware` Orange Pi Zero 3W swarm | Constellation layer |
| `whitt` ADR-0004 "projection layer" | Graph is rendered from sibling state, never owned |
| `whitt` ADR-0004 "multi-zoom navigation" | Fish-eye is the formalization |
| `whitt` Phase D marketplace | Marketplace region of the canvas |

## Relationship to Current Plans

This vision would be **Phase E+** in the umbrella roadmap (`whitt/opencode/plans/PHASE-TIMELINE.md` currently ends at Phase D; Phase E is not yet documented there). It depends on:

- ✅ Documented: ADR-0004 multi-zoom + projection-layer principles.
- ⏳ Phase 0 (8-12 wk): execution-engine prereqs.
- ⏳ MVP-A (6-8 wk): chat + queue + settings — the **strict subset** that must ship first.
- ⏳ Phase B (4-6 wk): multi-machine + TUI.
- ⏳ Phase C (4-6 wk): model-router integration.
- ⏳ Phase D (8-12 wk): swarm + marketplace.
- 🎯 **Phase E (this vision): graph UI unification.** Rough estimate: 12-16 wk after Phase D (not formally planned; runnable in parallel with Phase D once contracts stabilize).

The graph UI is **not a replacement** for MVP-A. It is the **destination** that MVP-A's surfaces evolve toward. Every MVP-A surface (chat panel, queue panel, editor, monitor, metrics, settings) should be designed so it can later become a node inspector in the graph.

## Open Design Questions (To Resolve Later)

1. **Voice stack.** Local Whisper (CPU-only, fits the ecosystem) vs cloud speech-to-text (violates local-first). Local preferred.
2. **Canvas rendering.** React Flow (per ADR-0004) scales to thousands of nodes; the infinite-canvas vision may need WebGL (e.g., `pixi.js`, `regl`) for 100k+ nodes. Performance ceiling unknown — needs benchmarking against a representative workload.
3. **Fish-eye math.** Continuous function vs discrete zoom levels. Continuous is the goal; discrete is the fallback.
4. **Multi-focus.** How many simultaneous expanded regions? Performance vs expressiveness.
5. **Agentic generation trust.** How prominently to label generated content vs authored content. Default: visual distinction until user promotes.
6. **Accessibility.** Voice-first does not replace keyboard navigation. Full keyboard map required.
7. **Mobile / Android.** Touch + voice on phone — pinch replaces scroll-zoom. Needs separate spec.
8. **Offline / local-only constraint.** Voice recognition and graph layout RAM requirements are unknown; both must run locally per the ecosystem's local-first principle. Needs verification.

## Folder Contents (Future)

- `README.md` (this file) — vision statement. **Status: complete.**
- *(planned)* `principles.md` — non-negotiable design principles derived from ADR-0004 + this vision. **Status: not started.**
- *(planned)* `mvp-slice.md` — what subset of the graph UI is buildable on top of MVP-A contracts. **Status: not started.**
- *(planned)* `tech-survey.md` — React Flow vs WebGL canvas libraries, voice stacks, fish-eye implementations. **Status: not started.**
- *(planned)* `migration-path.md` — how each MVP-A surface evolves into a graph node inspector. **Status: not started.**

## Source Material

- `whitt/inspiration-reports/yaml-to-rust-agentsdk/adr-0004-glyphnova-ui-control-plane.yml` — projection-layer + multi-zoom principles.
- `whitt/opencode/plans/PHASE-TIMELINE.md` — phase roadmap.
- `whitt/opencode/plans/AGENT-QUEUE-ANALYSIS.md` — UI ownership boundary.
- `whitt/opencode/plans/P2P-GAMIFICATION-VISION.md` — swarm + marketplace layer.
- `ui-implications-aggregate/REPORT.md` — synthesis of what each repo contributes to the UI.
- Per-repo `ui-implications-*/REPORT.md` — evidence and exact quotes.

---

**Status:** Vision statement only. No implementation, no commitment. Purpose is to align future UI decisions with a coherent destination.
