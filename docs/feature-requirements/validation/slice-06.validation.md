# Slice 06 Validation — Agent Semantics

Fixture: `AgentSemantics.stories.tsx` — graph + mocked agent runtime consuming prompt
spies, emitting mutation events (AGTC-01 vocabulary).

| Case | Story (`slice06 -- …`) | Play outline | Assert |
|---|---|---|---|
| AGT-01 | `AGT-01 default context` | send prompt w/ node ref absent | prompt payload includes spoken-to node id as context |
| AGT-02 | `AGT-02 linked edit allowed` | prompt names linked node | payload includes both ids; write allowed on linked |
| AGT-03 | `AGT-03 initial one file` | first prompt on new node | exactly 1 file created (create spy count) |
| AGT-04 | `AGT-04 mutations as movement` | emit spawn/move events | graph nodes animate to new state (position delta observed) |
| AGT-05 | `AGT-05 intervene` | executing; type correction; send | correction queued; status reflects interruption |
| AGT-06 | `AGT-06 fs projects to graph` | write file via mock agent | corresponding node appears/updates (loader→graph sync) |
| AGTC-01 | `AGTC-01 event vocabulary` | emit each of 7 event types | each maps to its canonical animation class (lookup table assert) |
| AGTC-02 | `AGTC-02 spawn placement` | emit spawn off N | new node adjacent (distance window), fade-in, link drawn |
| AGTC-03 | `AGTC-03 intervention path` | executing; open modal; speak | correction accepted; no surface blocks input |
