# GWT — Agent Context Semantics

> Suite 5/9. Source: user vision session 2026-08-14. IDs `AGT-xx`.
> Covers: default node context, cross-node references, initial file creation scope.
> Related: `../user-flows.md` Flow B, F.

## AGT-01 Spoken-to node is default context

```gherkin
Given user speaks prompt to node N
When agent interprets prompt
Then agent assumes user refers to node N's content by default
(unless prompt references other nodes/concepts)
```

## AGT-02 Linked references may edit other files

```gherkin
Given prompt references other nodes OR concepts linked to other nodes
When agent executes
Then agent may edit other linked files
Beyond spoken-to node
```

## AGT-03 Initial prompt creates one file

```gherkin
Given initial prompt on new node
When agent executes
Then only one file created for that node
No sibling/child files on first prompt
```

## AGT-04 Graph reflects agent mutations as movement

```gherkin
Given agent executing changes (generating off node, moving, grouping, detaching)
Then graph shows corresponding movement in affected areas
Real time, user watches
```

## AGT-05 Real-time reaction loop

```gherkin
Given agent manipulating graph
When result not what user wants
Then user can react (intervene) while/after execution
So corrections steerable
```
