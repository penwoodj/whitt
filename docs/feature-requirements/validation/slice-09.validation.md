# Slice 09 Validation — Git Time Travel & Sync

Fixture: `GitSync.stories.tsx` — canvas w/ floating button panel; mock git service
(commit/push spies; scriptable failures).

| Case | Story (`slice09 -- …`) | Play outline | Assert |
|---|---|---|---|
| GIT-01 | `GIT-01 commit per save` | trigger save (FIL-05 flow) | commit spy once; message contains metadata fields |
| GIT-02 | `GIT-02 agent commits` | run scripted agent w/ 3 mutations | ≥3 commits at mutation boundaries |
| GIT-03 | `GIT-03 all mutations logged` | perform edit + spawn + group | each produced a commit (count + types) |
| GIT-04 | `GIT-04 sync button` | click sync | push spy called |
| GITC-01 | `GITC-01 sync progress` | slow push | button shows running state; canvas interactive |
| GITC-02 | `GITC-02 sync failure` | push rejects (auth) | persistent error near button; local commits intact |
| GITC-03 | `GITC-03 metadata schema` | inspect commit messages | parseable footer: actor/action/refs per schema |
| GITC-04 | `GITC-04 cadence guard` | agent write during user edit | agent commit ordered after user editor flush (no interleave tear) |
