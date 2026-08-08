# UI Implications: `whitt-hardware`

> A **single-file documentation repo** specifying how to port `whitt-execution-engine` to an ARM64 CPU-only Orange Pi Zero 3W SBC. No code, no scripts. The UI implications are all **constraints** (headless, low RAM, no GPU, cross-compiled) and **role** (Tier A/B micro-orchestrator in a future swarm).

- **Repository:** `/home/jon/code/whitt-hardware`
- **Synthesized from:** `opi-zero3w-build-prompt.md` (595 lines, ~24 KB), git log (none — no commits yet as of 2026-08-08).

---

## What This Project IS (in 3 lines)

1. **A spec document** for cross-compiling `whitt-execution-engine` from x86_64 to aarch64.
2. **Targets one board:** Orange Pi Zero 3W (Allwinner A733, 8-core big.LITTLE, 12 GB LPDDR5, PowerVR GPU with NO open-source driver).
3. **Defines the swarm edge node profile** — headless, always-on, low-power, CPU-only inference at ~1-4 tok/s on 3B models.

## Hardware Target

| Spec | Value | UI Consequence |
|---|---|---|
| Board | Orange Pi Zero 3W | Reference target for swarm edge |
| SoC | Allwinner A733 | ARM64 toolchain |
| CPU | 2×A76@2.0 GHz + 6×A55@1.8 GHz (8 core) | Mixed-core scheduling hints |
| RAM | 12 GB LPDDR5 @2400 MHz (~19.2 GB/s) | Tight; OS + model + KV cache must fit |
| GPU | PowerVR BXM-4-64, **NO open-source driver, NO Vulkan** | CPU-only inference |
| OS | Debian Bookworm minimal server, BSP kernel `6.6.98-sun60iw2` | Headless |
| Display | **No X11 / Wayland** | No local GUI possible |
| Performance | ~1-4 tok/s (3B), ~0.5-1.5 tok/s (7B-9B) | UI must set user expectations |

## What the UI Must Support on This Hardware

The board is **headless**. UI must therefore be **remote**:

1. **No local UI on the SBC.** Tauri desktop app cannot run here. A future TUI (Ratatui) twin — referenced in umbrella vision docs (`opencode/plans/*.md`), not the README — also cannot run here; no display server.
2. **The SBC is a managed node**, not a UI host. UI surfaces needed:
   - **Discovery / pairing** — find SBCs on LAN.
   - **Deploy** — push cross-compiled binary (`scp target/aarch64-unknown-linux-gnu/release/whitt user@opi-zero3w:~/`).
   - **Remote monitor** — CPU temp, RAM usage, active model, queue depth, tok/s.
   - **Remote control** — start/stop server, load/unload model, drain queue.
   - **Log streaming** — `journalctl` / structured logs over SSH or HTTP.
   - **Update workflow** — replace binary, restart service.

## Documented Constraints (exact quotes)

- *"No X11/Wayland display server (headless only)"*
- *"The engine itself is headless (no GUI)"*
- *"No Vulkan userspace on stock images (PowerVR BXM-4-64 has no open-source driver, no ICD)"*
- *"No GPU device nodes (`/dev/dri` doesn't exist)"*
- *"No Docker with GPU passthrough"*
- *"12GB LPDDR5"*
- *"9B Q4_K_M ≈ 6GB model + KV cache. At 100K ctx with q8_0 cache, KV alone could be 3-4GB. 6GB + 4GB = 10GB, leaving 2GB for OS + everything else. Tight and likely OOM."*
- *"Reduce `context.size` to `4096` or `8192`"*
- *"Compiling on the 12GB ARM SBC would take hours and may OOM during linking. ALL Rust compilation must happen on the x86_64 host, then scp the binary to the SBC."*
- *"391 crates with LTO + codegen-units=1"*
- *"This is a Tier A/B micro-orchestrator, not a Tier C speed rig."*

## Current State (code vs docs)

- **Code:** None. Documentation-only.
- **Repo has no commits yet** (as of 2026-08-08). `"fatal: your current branch 'main' does not have any commits yet."`
- **Single file:** `opi-zero3w-build-prompt.md` (595 lines).
- **Implementation:** Not started. The prompt is a spec for changes that would land in `~/code/whitt-execution-engine/`, not in this repo.

## How This Fits the Broader Whitt Ecosystem

- **Phase B** (`whitt/opencode/plans/PHASE-TIMELINE.md`): local network multi-machine + TUI mode.
- **Phase D** (`whitt/opencode/plans/P2P-GAMIFICATION-VISION.md`): P2P swarm, compute credits, marketplace.
- **README mentions:** "Headless Mode", "<4GB RAM CPU support", "Multi-Machine 'Swarm' Orchestration", "Android UI & Support".
- The Orange Pi Zero 3W is the **canonical edge node** for the swarm — cheap, always-on, low-power, sufficient RAM for a single 3B-9B model.

## Gaps & Open Questions for UI

1. **Remote access mechanism undefined.** SSH tunnel? HTTP API on the SBC? libp2p? No spec.
2. **No web console spec.** If the SBC is headless and the desktop UI is on another machine, is there a minimal HTTP server on the SBC for status? Not specified.
3. **Cross-platform deployment UX.** How does the user push a new binary? One-click "deploy to swarm" button? Manual scp? Not designed.
4. **Android UI ambiguity.** README mentions Android. Is Android a remote client to the SBC, or does the SBC run Android? Unclear.
5. **Dynamic resource tuning.** README mentions "Dynamic tuning of default workflow files to system resources." Does the UI auto-detect the Orange Pi Zero 3W profile and clamp `context.size`? Not specified.
6. **Multi-node visualization.** When the swarm has N SBCs, how are they visualized? List? Map? Topology graph? No design.

## Implications for the Graph UI Vision

The graph UI's **fish-eye** concept maps directly to the swarm: zoomed-out, the swarm is a constellation of SBC nodes; zoomed-in, each node expands to show its current model, queue, RAM, tok/s. The "just-in-time agentic generation as the user digs deeper" vision applies cleanly — selecting an SBC node auto-generates a detail panel showing live inference, recent artifacts, and the workflow subgraph currently running on it. The SBC profile (12 GB, no GPU, ARM64) becomes a **first-class node type** in the graph's visual vocabulary.
