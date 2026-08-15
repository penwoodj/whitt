# Slice 09 — Git Time Travel & Sync

> Vertical slice: commit-per-edit, agent commit cadence, remote sync button + states.

## Positive Requirements

1. **PR-09-1** Edit granularity = rewind granularity: every save commits (GIT-01).
2. **PR-09-2** Agent work is checkpointed mid-run, not dumped at end (GIT-02).
3. **PR-09-3** All state rewindable — git is the trust substrate (GIT-03).
4. **PR-09-4** Sync is explicit, one click, from the canvas (GIT-04).

## Inherited Cases (full GWT + Why: `../../broader-vision/requirements/08-git-time-travel-sync.md`)

| ID | Summary |
|---|---|
| GIT-01 | Commit w/ metadata message on every edit save |
| GIT-02 | Agents commit regularly during runs |
| GIT-03 | Everything time-travel logged |
| GIT-04 | Floating-panel sync button → push to remote |

## New Cases (convention-derived gap-fill)

### GITC-01 Sync in-progress state

```gherkin
Given user clicks sync
Then button shows in-progress state (spinner/pulse per LGT-01 running)
And canvas stays interactive during push
And completion shows brief success affordance
```

**Why** `[C]`: async-button convention; pushes can take seconds — state must be
visible, UI never blocked.

### GITC-02 Sync failure state

```gherkin
Given push fails (auth/network/conflict)
Then persistent error near button (cause, plain language, retry)
And local commits NEVER lost or rolled back on failed push
And conflict case names the remote divergence
```

**Why** `[C]`: error rules + local-first principle — a failed sync must degrade to
"not yet synced", never to data risk.

### GITC-03 Commit metadata schema

```gherkin
Given any commit created by the app
Then message carries structured metadata:
| actor: user | agent:<name>
| action: edit | spawn | group | move | prompt | sync
| refs: node/file ids touched
In a stable parseable format (e.g., yaml footer in message)
```

**Why** `[I]`: GIT-01 says "metadata about the edit" — schema makes metadata
machine-queryable (time-travel UI later: "show me what the agent did at 3pm")
and aligns with AGTC-01 vocabulary (same action names).

### GITC-04 Agent commit cadence is non-blocking

```gherkin
Given agent executing + committing regularly
Then commits happen on mutation boundaries (AGTC-01 events)
And never mid-write of user's open editor (ordering guard)
And user edits + agent commits interleave cleanly in history
```

**Why** `[I]`: GIT-02 + FILC-03 interplay — cadence tied to mutation events gives
clean checkpoints; ordering guard prevents history spam + torn states.

## Implementation References

| Source | What to adapt |
|---|---|
| isomorphic-git / simple-git (ecosystem) | programmatic commit/push from renderer/backend service |
| ragflow DSL versioning (survey §6) | version-snapshot-per-save pattern (UserCanvasVersion analog) |
| Repo `fsGraphLoader` + ADR-0011 mapping | commit hooks ride existing FS watch pipeline |

## Open Questions

- Remote auth model (token vs ssh) — ADR-0009 git/github oauth slice territory.
- History-browse UI (time travel player) — explicitly NOT this slice; cases only guarantee the substrate.
