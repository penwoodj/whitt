# GWT — Git Time Travel + Sync

> Suite 8/9. Source: user vision session 2026-08-14. IDs `GIT-xx`.
> Covers: commit-per-edit, agent commits, remote sync.
> Related: `../user-flows.md` Flow J. Aligns ADR-0011 (FS = truth).

## GIT-01 Commit on every edit save

```gherkin
Given file save triggered (e.g. FIL-05 focus-leave)
Then git commit created
And commit message contains metadata about edit
Every edit = own commit
```

## GIT-02 Agents commit regularly

```gherkin
Given agent executing
Then agent regularly commits during run
So time-travel history captures agent work incrementally
```

## GIT-03 Everything time-travel logged

```gherkin
Given any mutation (user edit, agent edit, file create)
Then git history records it
So entire project state rewindable
```

## GIT-04 Floating sync button

```gherkin
Given graph canvas shown
Then floating button panel includes sync button
When user clicks sync
Then repo pushed to remote
```
