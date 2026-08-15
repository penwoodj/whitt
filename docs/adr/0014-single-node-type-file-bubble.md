# ADR-0014: Single Node Type — File Bubble

Date: 2026-08-14
Status: proposed

## Context

User constraint (2026-08-14 slice session): "I don't want to use different node types
yet, I want all nodes to just be files." This rejects ragflow-style 24-node-type
workflow builders (research survey §6) — node complexity was explicitly called out as
an anti-goal.

## Decision

1. Exactly ONE node type exists: the **file bubble** (markdown now; other file types
   later still render as file bubbles w/ type-specific preview per FIL-03).
2. No node-type palettes, no per-node forms, no type dropdowns on creation.
3. All richness lives in: light-language states (ADR-0015), voice interaction, agent
   behavior, and grouping semantics (groups become node-LIKE, not a new node TYPE —
   GRP-10).
4. Group boxes/halos are canvas constructs, not nodes; nested-graph detail panels
   (GRP-11) stay deferred and will not introduce node types when they land.

## Consequences

- Any feature proposal that requires a second node type is out of scope until user
  explicitly revisits (would be a new ADR superseding this).
- File type diversity enters through the preview/edit surface (slice 07), not the graph
  topology — graph stays semantically uniform (everything = file).
- Validation stories need only one node component family — simpler Storybook matrix.
