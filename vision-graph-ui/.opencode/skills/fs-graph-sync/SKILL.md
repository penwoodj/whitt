---
name: fs-graph-sync
description: >
  Filesystem↔graph sync for whitt (ADR-0011). File watching, debounced writes,
  commit-per-edit git ops, hidden .prompts folder, FS-wins conflict rule.
  Use when implementing slice 07 (file viz saves), slice 09 (git time travel),
  VOX-16 prompt persistence, or any FS projection onto the graph.
---

## When to Use

- Implementing file save flows (FIL-04/05, FILC-03/04)
- Git commit-per-edit + agent commits (GIT-01..03, GITC-04)
- Prompt file persistence (VOX-16)
- Watcher→graph projection (AGT-06) + conflict handling (FS wins)
- Fixing/extending `src/features/graph-sim/fsGraphLoader.ts`

## Source of Truth Rules (ADR-0011 / AGENTS.md §16 — restate for skill use)

1. FS = truth. Memory layer (in-mem + Neo4j) = cache for speed. Graph = projection.
2. Mutations: write memory immediately (UI snappy) → queue FS write (debounce 2s)
   → git commit on flush.
3. External FS edit → FS wins, memory reloads, user warned.
4. Node lifecycle on disk: `slug.md` → `slug/index.md` on expand; children =
   `slug/child.md`. Renames = `git mv`, lazy-batched.
5. Frontmatter shape: id/title/parent/children/created_at/updated_at/status.

## Layer Design

```
ui event (edit/prompt/spawn)
  → memory store (instant)
  → writeQueue (debounced 2s, per-path coalesce)
  → fsWrite (atomic: temp+rename)
  → gitCommit (message = metadata JSON)
  → watcher evt (external edits)
  → reloadIfFresher (mtime + hash compare)
```

### Write queue

- Per-path coalescing: N edits to same file inside debounce window = 1 write +
  1 commit.
- Flush triggers: debounce expiry, focus-leave (FIL-05), explicit send, unmount.
- Atomic writes: write `path.tmp` → rename. Never partial-write md.

### Commit-per-edit (GIT-01)

simple-git (or engine-side git) per flush:

```typescript
const commitMeta = {
  actor: 'user' | 'agent',
  action: 'file-edit' | 'file-create' | 'prompt' | 'rename' | 'group',
  refs: [nodeId],
  ts: iso,
}
await git.add(path)
await git.commit(`whitt: ${meta.action} ${slug} [${meta.actor}]`)
```

- Agent runs commit on their own cadence (GIT-02/GITC-04) — do NOT fold agent
  commits into user queue.
- Sync button (GIT-04) = `git push` w/ explicit user click only. No auto-push.

### Prompt files (VOX-16)

- Location: `<node-dir>/.prompts/<ts>-<slug>.md`
- Content: frontmatter (nodeId, createdAt, sentAt?) + prompt text body
- Debounced save same as edits; NEVER deleted on send (audit trail).

## Watcher

- Watch project root recursively; ignore `.whitt/cache`, `.whitt/logs`, `node_modules`.
- Chokidar (or engine-side watcher → events) preferred over fs.watch for cross-platform.
- Debounce watcher events 500ms; then diff (hash) against memory; FS-newer → reload
  node subtree only, not whole graph.

## fsGraphLoader notes (existing code)

- Loads sample projects via Vite `?raw` imports (`../data/sample-projects/**`) —
  build-time fixture path, NOT runtime FS. Keep for Storybook fixtures.
- Runtime FS access = engine/sidecar responsibility (local-first app). Loader gets
  an injectable `FsPort` (read/write/watch) so Storybook uses in-mem fake port,
  app uses real port. 7 pre-existing failing tests in fsGraphLoader.test.ts —
  consult `requirements-regression` skill quarantine before claiming green.

## MUST NOT

- Auto-push to remote (user-click sync only)
- Write FS without queue (no direct fs.write from components)
- Trust memory over FS on conflict (FS wins — AGENTS.md §16)
- Delete prompt files
- Create graph state not backed by FS artifact (every node = file, ADR-0014)

## References

- ADR-0011: `../docs/adr/0011-graph-to-filesystem-mapping.md`
- AGENTS.md §16 (mapping), §2 (logs — use shared logger, never console.log)
- Slices 07/09: `docs/feature-requirements/slices/`
- Brainstorm: `docs/broader-vision/requirements/08-git-time-travel-sync.md`
