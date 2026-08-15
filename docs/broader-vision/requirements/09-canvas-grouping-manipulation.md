# GWT — Canvas Grouping + Node Manipulation

> Suite 9/9. Source: user vision dictation 2026-08-14. IDs `GRP-xx`.
> Covers: multi-select, grouping (soft/hard), connected drag, link drawing, future nesting.
> Related: `../user-flows.md` Flow G, H.

## GRP-01 Multi-select bubbles

```gherkin
Given graph w/ multiple nodes
When user highlights multiple bubbles
Then multi-selection held
And nodes movable together into groupings
```

**Why** (source: "Eventually I might want to highlight multiple Bubbles and move them
around into different groupings"): thoughts cluster — related nodes travel together;
spatial arrangement is part of the thinking, not decoration.

## GRP-02 Select focus surround

```gherkin
Given group of nodes highlighted
Then selection-type focus surrounds them
```

**Why** (source: "When I highlight a group ... They are surrounded with a select type
focus"): selection must be visible as a REGION, not per-node outlines — the group is
the operable unit now.

## GRP-03 Right click boxes group

```gherkin
Given multiple bubbles highlighted
When user right click selects
Then box drawn around them in 2D graph
```

**Why** (source: "With a right click select it puts a box around them in the 2D graph
of all of the balls of light that have been highlighted"): explicit, persistent
boundary — the box is the group's body, precursor to halo (GRP-08) and context
(GRP-09).

## GRP-04 Connected nodes pull along

```gherkin
Given node A connected to nodes B, C
When user moves A
Then B, C pulled around with A
(connections stay intact during movement)
```

**Why** (source: "whenever you move around a node ... the other things are pulled
around with them that are connected"): relationships are physical — moving a concept
drags its neighborhood; links never silently break. Matches "move things around while
they stay connected" (earlier vision session).

## GRP-05 Standalone floating nodes

```gherkin
Given canvas
Then user can create new standalone floating nodes
Unconnected, freely movable
```

**Why** (source: "Create new stand-alone floating nodes"): unformed thoughts need
parking spaces w/ no relationship claims — node before link, idea before structure.

## GRP-06 Drag lines between nodes

```gherkin
Given node on canvas
When user hovers next to right of node
Then connection line draggable from there
And droppable onto another node
Creating link
```

**Why** (source: "You can also easily drag and drop lines between nodes through
hovering next to the right of a Node"): linking = gesture, not dialog. Hover-reveal
keeps canvas clean; drag-to-target makes relationship creation spatial + obvious.

## GRP-07 Soft vs hard grouping

```gherkin
Given grouping created
Then grouping is either:
| soft = temporary (visual/session only)
| hard = permanent (folder + file moves, FS-backed)
```

**Why** (source: "When a grouping is made either soft and temporary or hard and
permanent" + earlier session: grouping "is just adding a folder and moving markdown
files into those folders"): two commitment levels — sketch a cluster (soft) vs
declare structure (hard = FS folder, git-visible). Machine translation of a spatial
act is a file operation.

## GRP-08 Grouping halo

```gherkin
Given grouping formed (soft or hard)
Then halo drawn around select border
```

**Why** (source: "It puts a halo around the select border"): halo = the light-language
mark of "this is a live entity" (same as EXP-02 node halo) — the group is becoming a
thing.

## GRP-09 Grouping becomes prompt context

```gherkin
Given grouping highlighted
Then grouping = context for STT prompt
And prompt tooltip appears at side of grouping
So speaking addresses grouped content as whole
```

**Why** (source: "the Grouping becomes the context for the speech-to-text prompt that
... highlights over to the side of the grouping on the graph"): multi-node thinking —
speak ABOUT a cluster; prompt tooltip attaches to the group like node popovers attach
to nodes.

## GRP-10 Grouping node-like

```gherkin
Given grouping formed
Then grouping behaves node-like
(addressable, expandable, speakable-to)
```

**Why** (source: "the grouping almost becomes node-like through the highlighting or
the selecting of it"): uniformity — everything speakable-to is a node-ish thing.
Groups inherit node interaction grammar instead of learning new one.

## GRP-11 Nested graph in detail panel (eventual)

```gherkin
Given future implementation
Then node detail panels support another graph inside
(infinite-canvas nesting)
And extra ergonomic features around that
```

**Why** (source: "the infinite canvas layer comes in when eventually I make the detail
panels of a node capable of supporting another graph inside ... probably further down
the line"): zoom = recursion. Group→open→graph inside = the infinite-canvas ladder;
explicitly deferred by user.
