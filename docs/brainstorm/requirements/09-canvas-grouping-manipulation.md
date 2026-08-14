# GWT — Canvas Grouping + Node Manipulation

> Suite 9/9. Source: user vision session 2026-08-14. IDs `GRP-xx`.
> Covers: multi-select, grouping (soft/hard), connected drag, link drawing, future nesting.
> Related: `../user-flows.md` Flow G, H.

## GRP-01 Multi-select bubbles

```gherkin
Given graph w/ multiple nodes
When user highlights multiple bubbles
Then multi-selection held
And nodes movable together into groupings
```

## GRP-02 Select focus surround

```gherkin
Given group of nodes highlighted
Then selection-type focus surrounds them
```

## GRP-03 Right click boxes group

```gherkin
Given multiple bubbles highlighted
When user right click selects
Then box drawn around them in 2D graph
```

## GRP-04 Connected nodes pull along

```gherkin
Given node A connected to nodes B, C
When user moves A
Then B, C pulled around with A
(connections stay intact during movement)
```

## GRP-05 Standalone floating nodes

```gherkin
Given canvas
Then user can create new standalone floating nodes
Unconnected, freely movable
```

## GRP-06 Drag lines between nodes

```gherkin
Given node on canvas
When user hovers next to right of node
Then connection line draggable from there
And droppable onto another node
Creating link
```

## GRP-07 Soft vs hard grouping

```gherkin
Given grouping created
Then grouping is either:
| soft = temporary (visual/session only)
| hard = permanent (folder + file moves, FS-backed)
```

## GRP-08 Grouping halo

```gherkin
Given grouping formed (soft or hard)
Then halo drawn around select border
```

## GRP-09 Grouping becomes prompt context

```gherkin
Given grouping highlighted
Then grouping = context for STT prompt
And prompt tooltip appears at side of grouping
So speaking addresses grouped content as whole
```

## GRP-10 Grouping node-like

```gherkin
Given grouping formed
Then grouping behaves node-like
(addressable, expandable, speakable-to)
```

## GRP-11 Nested graph in detail panel (eventual)

```gherkin
Given future implementation
Then node detail panels support another graph inside
(infinite-canvas nesting)
And extra ergonomic features around that
Deferred — further down implementation line
```
