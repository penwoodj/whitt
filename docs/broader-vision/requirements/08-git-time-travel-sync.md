# GWT — Git Time Travel + Sync

> Suite 8/9. Source: user vision dictation 2026-08-14. IDs `GIT-xx`.
> Covers: commit-per-edit, agent commits, remote sync.
> Related: `../user-flows.md` Flow J, L. Aligns ADR-0011 (FS = truth).

## GIT-01 Commit on every edit save

```gherkin
Given file save triggered (e.g. FIL-05 focus-leave)
Then git commit created
And commit message contains metadata about edit
Every edit = own commit
```

**Why** (source: "whenever the file is saved on an edit a commit with a message
containing metadata about the edit are added on every edit"): edit granularity =
rewind granularity. Metadata-bearing messages make history human-readable + agent-
queryable ("what changed here and why").

## GIT-02 Agents commit regularly

```gherkin
Given agent executing
Then agent regularly commits during run
```

**Why** (source: "When agents are running They are regularly committing"): agent work
must be inspectable mid-run and recoverable at any checkpoint — not one opaque
end-of-run dump. Enables AGT-05 intervention w/ safe rollback points.

## GIT-03 Everything time-travel logged

```gherkin
Given any mutation (user edit, agent edit, file create)
Then git history records it
So entire project state rewindable
```

**Why** (source: "everything is basically time travel logged through Git"):
experimental thinking requires safe undo — try an agent suggestion, rewind if wrong.
Git = the trust substrate for agentic generation ("always revertible").

## GIT-04 Floating sync button

```gherkin
Given graph canvas shown
Then floating button panel includes sync button
When user clicks sync
Then repo pushed to remote
```

**Why** (source: "there is sync feature capability on the floating button panel on
the graph visualization that allows you to sync with remote which is pushing the git
repo to the remote location"): local-first ≠ local-only. Sync is explicit user action
(control), one click from the canvas (no leaving the graph), backup + multi-machine.
