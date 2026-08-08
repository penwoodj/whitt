# UI Implications: `whitt-model-router`

> The **model routing design repo**. Documentation-only (no code). Defines a two-layer routing system (row selection + model ranking) with hybrid retrieval, designed to fit in ~380-400 MB on a 4 GB system. Targets a 3-phase rollout: TinyRouter → LearnedRouter → AdaptiveRouter. Phase C of the umbrella roadmap integrates this.

- **Repository:** `/home/jon/code/whitt-model-router`
- **Synthesized from:** `STATUS.md` (232 lines, root directory), `DECISIONS.md` (1,412 lines, complete with TOC), `inspiration-reports/` file listing, `final-decisions/` (empty), git log.
- **Last reviewed:** 2026-08-08

---

## What This Project IS (in 3 lines)

1. **A model router design** — picks the best LLM for a given task using two-layer scoring (specialization row selection + model ranking).
2. **Local-first, CPU-only, ~380-400 MB RAM target** — Python + FastEmbed + sqlite-vec + SQLite + NumPy. No cloud fallback, no GPU, no real-time ML.
3. **Research-backed.** 11 inspiration reports across 6 categories (cost-optimized, MCP routing, production routing, semantic patterns, vector-bandit, yaml-to-rust-agentsdk). All documentation complete; no implementation.

## What the UI Must Consume / Display

| Capability | Source | UI Surface |
|---|---|---|
| **Two-layer decision flow:** Layer 1 (specialization row selection) → Layer 2 (model ranking) | DECISIONS.md, STATUS.md | Two-stage decision visualization |
| **Hybrid scoring formula:** 0.45 dense + 0.25 sparse + 0.30 constraints | DECISIONS.md | "Why this model?" explanation panel |
| **Specialization retry budgets** per task type: Code=3, JSON=2, Debug=4 | DECISIONS.md | Retry-budget indicator |
| **Failure categorization** (categorical now → embedded later) | DECISIONS.md | Failure-mode browser |
| **Similarity-aware statistics:** "based on X similar attempts" | DECISIONS.md | Trust indicator next to recommendation |
| **Hardware-aware dynamic penalties** based on actual failures | DECISIONS.md | Active-penalty badges |
| **Verification chain** with early-exit optimization | DECISIONS.md | Stage-by-stage verification timeline |
| **Model metadata:** quantization, parameter count, context size, RAM footprint | configs in execution-engine; routed here | Model picker cards |
| **Cost / latency / quality tradeoffs** | inspiration-reports/cost-optimized | Sort / filter in picker |
| **Phase progression:** TinyRouter → LearnedRouter → AdaptiveRouter | STATUS.md | Capability badge per phase |

## Documented UI Hooks

**Status** (`STATUS.md`):
- Research phase ✅, Synthesis phase ✅, Documentation phase ✅.
- Phasing: TinyRouter (Weeks 1-4) → LearnedRouter (Weeks 5-12) → AdaptiveRouter (Weeks 13-24).
- Memory target: ~380-400 MB total (fits 4 GB systems).
- Stack: Python + FastEmbed + sqlite-vec + SQLite + NumPy.

**Explicit non-goals** (`STATUS.md`):
- No distributed service.
- No real-time ML.
- No cloud fallback.
- GPU-free.

**Inspiration reports inventory** (all >2 KB, not read in full here):
- `cost-optimized/`: litellm-complexity-router.md (15 KB), llm-switchboard.md (20 KB)
- `mcp-routing/`: smart-mcp.md (13 KB), tool-compass.md (18 KB)
- `production-routing/`: RouteLLM.md (15 KB), vLLM-Semantic-Router.md (16 KB), Aurelio-Semantic-Router.md (16 KB)
- `semantic-patterns/`: RedisVL-Semantic-Router.md (17 KB), LangChain-EmbeddingRouterChain.md (21 KB)
- `vector-bandit/`: ModelRouter-mohidf.md (13 KB), ParetoBandit.md (24 KB)
- `yaml-to-rust-agentsdk/`: model_routing_data.csv (72 KB), README.md (7.6 KB)

## Current State (code vs docs)

- **Code:** None. No `.py`, `.rs`, `.js`, `.ts` files.
- **`final-decisions/`:** Empty.
- **Documentation:** Complete. STATUS ✅, DECISIONS (1,412 lines) ✅, 11 inspiration reports ✅.
- **Phase:** Ready for Phase 1 (TinyRouter) implementation; not started.

## Gaps & Open Questions for UI

1. **Routing transparency UX.** Hybrid scoring weights (0.45 / 0.25 / 0.30) are a black box unless the UI exposes them. How much detail to show by default?
2. **Manual override.** Can the user force a model against the router's recommendation? How is the penalty / risk surfaced?
3. **Cold-start UX.** Before LearnedRouter has data, recommendations are heuristic. How does the UI communicate "low confidence"?
4. **Penalty visibility.** "Active hardware penalty" is a real-time concept — needs live data feed.
5. **Multi-model parallel execution.** If two models run in parallel for verification, how are both shown? Side-by-side diff?
6. **Cost ledger integration** with Phase D P2P credit system — out of scope for this repo.
7. **Model discovery.** Where does the UI get the model catalog (local GGUFs + HuggingFace + swarm peers)? Not in scope here; needs integration spec.

## Implications for the Graph UI Vision

The model router becomes the **invisible hand** shaping the graph: when the user creates a new node (task), the router silently assigns it to a model; when the user zooms into the node, the assignment becomes visible with a tap-to-explain "why this model" affordance. The two-layer decision flow maps naturally to a **two-level fish-eye zoom** (Layer 1 = cluster selection visible at mid-zoom; Layer 2 = model ranking visible at deep-zoom with full scoring breakdown). Hardware-aware penalties become animated edge weights in the swarm topology view (Phase D).
