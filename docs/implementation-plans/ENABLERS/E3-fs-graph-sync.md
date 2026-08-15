# E3 — FS↔Graph Sync Layer Implementation Plan

> Executes: `docs/adr/0011-graph-to-filesystem-mapping.md` (FS = truth, memory = cache)
> Validation spec: N/A (enabler, no GWT cases)
> Status: NOT-STARTED
> Depends on: none

## 1. Objective

Build filesystem↔graph sync layer per ADR-0011. Write queue (debounce 2s, coalesce per-path), atomic temp+rename, git commit-per-edit via simple-git, chokidar watcher with hash-diff external change detection, injectable FsPort (fake for Storybook, real for app), prompt file persistence (.prompts/<ts>-<slug>.md), repair existing fsGraphLoader.test.ts failures (7 blocked tests).

## 2. Inputs (READ FIRST — in this order)

| Input | Path |
|---|---|
| Spec (skill) | `vision-graph-ui/.opencode/skills/fs-graph-sync/SKILL.md` |
| ADR-0011 (mapping) | `docs/adr/0011-graph-to-filesystem-mapping.md` |
| AGENTS.md §16 (FS rules) | `vision-graph-ui/AGENTS.md` (lines 400-450) |
| Existing loader | `vision-graph-ui/src/shared/fsGraphLoader.ts` (330 lines, 7 test failures) |
| Existing tests | `vision-graph-ui/src/shared/fsGraphLoader.test.ts` (302 lines) |
| Consumer | `vision-graph-ui/src/features/graph-sim/GraphSim.tsx` (uses loadProjectGraph) |
| Skills to load | `fs-graph-sync`, `modern-react`, `test-driven-development`, `storybook` |
| Code-rip sources | none (enabler, no OSS code-rip) |

## 3. File plan (REAL paths)

| Action | Path | Notes |
|---|---|---|
| create | `vision-graph-ui/src/shared/fs/FsPort.ts` | Interface for read/write/watch operations |
| create | `vision-graph-ui/src/shared/fs/FakeFsPort.ts` | In-mem port for Storybook (no real FS) |
| create | `vision-graph-ui/src/shared/fs/WriteQueue.ts` | Per-path coalescing, 2s debounce, flush events |
| create | `vision-graph-ui/src/shared/fs/CommitBuilder.ts` | Git commit-per-edit via simple-git, metadata JSON |
| create | `vision-graph-ui/src/shared/fs/WatcherAdapter.ts` | Chokidar wrapper, 500ms debounce, hash-diff reload |
| create | `vision-graph-ui/src/shared/fs/PromptFileWriter.ts` | .prompts/<ts>-<slug>.md persistence |
| create | `vision-graph-ui/src/shared/fs/FsGraphSync.ts` | Orchestrator: wires queue+commit+watcher+port |
| modify | `vision-graph-ui/src/shared/fsGraphLoader.ts` | Inject FsPort, repair edge+YAML parsing failures |
| modify | `vision-graph-ui/src/shared/fsGraphLoader.test.ts` | Fix 7 failing tests, add port injection tests |
| modify | `vision-graph-ui/src/features/graph-sim/GraphSim.tsx` | Wire FsGraphSync for edit flows |
| modify | `vision-graph-ui/package.json` | Add chokidar, simple-git dependencies |
| create | `vision-graph-ui/src/shared/fs/FakeFsPort.test.ts` | Fake port behavior tests |
| create | `vision-graph-ui/src/shared/fs/WriteQueue.test.ts` | Debounce, coalesce, flush events |
| create | `vision-graph-ui/src/shared/fs/CommitBuilder.test.ts` | Git commit message format, metadata |
| create | `vision-graph-ui/src/shared/fs/WatcherAdapter.test.ts` | Chokidar events, hash-diff detection |
| create | `vision-graph-ui/src/shared/fs/PromptFileWriter.test.ts` | .prompts path, frontmatter, audit |
| create | `vision-graph-ui/src/shared/fs/FakeFsPort.stories.tsx` | Fake port stories for Storybook viz |
| create | `vision-graph-ui/src/shared/fs/WriteQueue.stories.tsx` | Debounce/coalesce visualization stories |

## 4. Question-cycle gate (AGENTS.md §1 Stage 1 — MANDATORY before tests)

Ask user (2-3 questions max, `question` tool):

1. **fsGraphLoader repair vs replace**: Existing loader has 7 test failures (edges not building, YAML children array broken, lifecycle status wrong). Should we (a) repair in-place (fix YAML parser, edge building, lifecycle mapping) OR (b) replace with new FsGraphLoader built on FsPort architecture from scratch? Impact: (a) faster, incremental; (b) cleaner, but more work.

2. **Real FsPort backend choice**: When building real FsPort (not fake), should we use (a) File System Access API (browser native, requires user permission per-folder) OR (b) desktop-shell IPC to Rust backend (Tauri later)? Decision affects API design: File System Access = async handles, desktop-shell = path strings. For now, we stub real port; this decision gates implementation.

3. **Prompt file audit retention**: Should .prompts files (VOX-16) be (a) never deleted (full audit trail, disk grows) OR (b) prune after 30 days (balanced) OR (c) prune after send (minimal)? ADR-0011 says "NEVER deleted on send" but long-term storage policy needs decision.

Record answers in this file, then never re-ask.

## 5. Tasks (incremental, TDD, each ends green+committed)

### Task 5.1 — FsPort interface + fake implementation
- **Gherkin first**: `vision-graph-ui/src/features/fs/fs-port.feature` (scenarios: read file, write file, list dir, watch path)
- **Red**: `src/shared/fs/FsPort.test.ts` + `FakeFsPort.test.ts` (interface compliance, in-mem behavior)
- **Green**: `src/shared/fs/FsPort.ts` (interface: readFile, writeFile, listDir, watch) + `FakeFsPort.ts` (Map-based in-mem implementation)
- **Story**: `FakeFsPort stories` in `FakeFsPort.stories.tsx` (read, write, list viz)
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/shared/fs/FakeFsPort.test.ts && npm run build-storybook` — all exit 0
- **Manifest**: N/A (enabler, no cases)
- **Commit**: `feat(fs): FsPort interface + FakeFsPort for Storybook`

### Task 5.2 — Write queue (debounce, coalesce, flush events)
- **Gherkin first**: `vision-graph-ui/src/features/fs/write-queue.feature` (scenarios: single write, coalesce same path, 2s debounce, flush on trigger, multiple paths)
- **Red**: `src/shared/fs/WriteQueue.test.ts` (queue.write, per-path coalesce, timer, flush events { written, committed })
- **Green**: `src/shared/fs/WriteQueue.ts` (Map<path, content>, debounce 2s, flush on timeout/focus-leave/unmount, emit events)
- **Story**: `WriteQueue stories` in `WriteQueue.stories.tsx` (viz coalesce timing, debounce window)
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/shared/fs/WriteQueue.test.ts && npm run build-storybook` — all exit 0
- **Manifest**: N/A
- **Commit**: `feat(fs): WriteQueue w/ 2s debounce + per-path coalesce`

### Task 5.3 — Commit builder (git operations via simple-git)
- **Gherkin first**: `vision-graph-ui/src/features/fs/commit-builder.feature` (scenarios: commit file, commit w/ metadata JSON, agent vs actor, no auto-push)
- **Red**: `src/shared/fs/CommitBuilder.test.ts` (simple-git add/commit, message format `whitt: <action> <slug> [<actor>]`, metadata JSON)
- **Green**: `src/shared/fs/CommitBuilder.ts` (simple-git wrapper, commit meta: {actor, action, refs, ts}, git.add, git.commit)
- **Story**: N/A (git ops not visual)
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/shared/fs/CommitBuilder.test.ts` — exit 0
- **Manifest**: N/A
- **Commit**: `feat(fs): CommitBuilder w/ simple-git + metadata JSON`

### Task 5.4 — Watcher adapter (chokidar + hash-diff)
- **Gherkin first**: `vision-graph-ui/src/features/fs/watcher-adapter.feature` (scenarios: watch dir, debounce 500ms, hash-diff compare, external change detected, reload node)
- **Red**: `src/shared/fs/WatcherAdapter.test.ts` (chokidar watch, debounce, hash compare, emit onExternalChange)
- **Green**: `src/shared/fs/WatcherAdapter.ts` (chokidar.watch, debounce 500ms, hash file vs memory, FS-newer → emit event)
- **Story**: N/A (watcher not visual)
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/shared/fs/WatcherAdapter.test.ts` — exit 0
- **Manifest**: N/A
- **Commit**: `feat(fs): WatcherAdapter w/ chokidar + hash-diff`

### Task 5.5 — Prompt file writer (.prompts persistence)
- **Gherkin first**: `vision-graph-ui/src/features/fs/prompt-file-writer.feature` (scenarios: write prompt, .prompts/<ts>-<slug>.md path, frontmatter (nodeId, createdAt), never delete)
- **Red**: `src/shared/fs/PromptFileWriter.test.ts` (path format, YAML frontmatter, body text, audit retention)
- **Green**: `src/shared/fs/PromptFileWriter.ts` (generate path `<nodeDir>/.prompts/<ts>-<slug>.md`, write frontmatter + body via queue)
- **Story**: N/A (persistence not visual)
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/shared/fs/PromptFileWriter.test.ts` — exit 0
- **Manifest**: N/A
- **Commit**: `feat(fs): PromptFileWriter w/ .prompts/<ts>-<slug>.md`

### Task 5.6 — FsGraphSync orchestrator (wire queue+commit+watcher+port)
- **Gherkin first**: `vision-graph-ui/src/features/fs/fs-graph-sync.feature` (scenarios: sync write, queue→flush→commit, external change→reload, port injection)
- **Red**: `src/shared/fs/FsGraphSync.test.ts` (orchestration, FakeFsPort injection, event flow)
- **Green**: `src/shared/fs/FsGraphSync.ts` (accept FsPort, wire WriteQueue→CommitBuilder→WatcherAdapter, expose queue.write, watcher.onExternalChange, port.atomicRename)
- **Story**: N/A (orchestrator internal)
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/shared/fs/FsGraphSync.test.ts` — exit 0
- **Manifest**: N/A
- **Commit**: `feat(fs): FsGraphSync orchestrator (queue+commit+watcher+port)`

### Task 5.7 — fsGraphLoader repair (inject FsPort, fix 7 test failures)
- **Gherkin first**: `vision-graph-ui/src/features/fs/loader-repair.feature` (scenarios: inject FakeFsPort, build edges from children array, parse YAML children list, map status→lifecycle)
- **Red**: `src/shared/fsGraphLoader.test.ts` (current 7 failures must pass: edges > 0, lifecycle='done', children array parse, parent-child relationships, radial layout)
- **Green**: `src/shared/fsGraphLoader.ts` (accept FsPort param, use port.readFile instead of ?raw imports, fix parseYaml children array parsing, fix status→lifecycle mapping, fix buildGraphData edge building)
- **Story**: N/A (loader internal)
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/shared/fsGraphLoader.test.ts` — all 14 tests pass
- **Manifest**: N/A
- **Commit**: `fix(fs): Repair fsGraphLoader (FsPort injection + 7 test fixes)`

### Task 5.8 — GraphSim wiring (consume FsGraphSync for edit flows)
- **Gherkin first**: `vision-graph-ui/src/features/graph-sim/fs-sync-wiring.feature` (scenarios: node edit → queue.write, flush → commit, external change → reload)
- **Red**: `src/features/graph-sim/GraphSim.test.tsx` (FsGraphSync integration, edit→queue flow, watcher→reload flow)
- **Green**: `src/features/graph-sim/GraphSim.tsx` (instantiate FsGraphSync with FakeFsPort, wire node title edit → queue.write, wire watcher.onExternalChange → reload node)
- **Story**: N/A (GraphSim existing stories sufficient)
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/features/graph-sim/GraphSim.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: N/A
- **Commit**: `feat(graph-sim): Wire FsGraphSync for edit flows`

## 6. Skill + agent routing (per task)

| Task | Skills to load | Delegate to |
|---|---|---|
| 5.1 | `fs-graph-sync`, `test-driven-development`, `storybook` | `category="deep"` |
| 5.2 | `fs-graph-sync`, `test-driven-development`, `storybook` | `category="deep"` |
| 5.3 | `fs-graph-sync`, `test-driven-development` | `category="deep"` |
| 5.4 | `fs-graph-sync`, `test-driven-development` | `category="deep"` |
| 5.5 | `fs-graph-sync`, `test-driven-development` | `category="deep"` |
| 5.6 | `fs-graph-sync`, `test-driven-development` | `category="deep"` |
| 5.7 | `fs-graph-sync`, `test-driven-development` | `category="deep"` |
| 5.8 | `fs-graph-sync`, `test-driven-development` | `category="deep"` |

## 7. Live-system validation gate (enabler DONE only when ALL pass)

1. Run all new tests: `npx vitest run src/shared/fs/`
2. Run repaired loader tests: `npx vitest run src/shared/fsGraphLoader.test.ts` (14/14 pass)
3. Run GraphSim integration: `npx vitest run src/features/graph-sim/GraphSim.test.tsx`
4. Build Storybook: `npm run build-storybook` (all stories render)
5. Type check: `npx tsc --noEmit`
6. Manual review: serve Storybook `npm run storybook`, verify FakeFsPort + WriteQueue stories visualize debounce/coalesce

## 8. Retry loop (failure = iterate, NEVER skip)

```
attempt → fail → read actual log lines (AGENTS.md §2)
  → hypothesis → minimal fix → re-run test
  → fail again? ×2 → load systematic-debugging skill
  → fail ×3 → escalate: oracle subagent w/ full ctx → fix → re-run
  → NEVER: delete test, loosen assert, extend timeout >2×, mark skip w/o user OK
```

## 9. Out of scope / guards

- **NOT implementing** real FsPort backend (File System Access API OR desktop-shell) — stub only, decision gated by question-cycle
- **NOT implementing** Neo4j memory layer (gap D3, out of scope for E3)
- **NOT modifying** `vision-graph-ui/src/data/sample-projects/` (keep for Storybook fixtures)
- **NOT touching** `src/App.tsx` or app-level routing (GraphSim is only consumer for now)
- **NOT adding** auto-push to remote git (user-click sync only, per skill spec)
- **NOT deleting** .prompts files (audit trail per spec, retention policy gated by question-cycle)
- **NOT implementing** concurrent edit conflict resolution across multiple machines (ADR-0011 open question)
