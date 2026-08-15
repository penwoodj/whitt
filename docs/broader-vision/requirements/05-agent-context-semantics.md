# GWT — Agent Context Semantics

> Suite 5/9. Source: user vision dictation 2026-08-14. IDs `AGT-xx`.
> Covers: default node context, cross-node references, initial file creation scope, mutation projection.
> Related: `../user-flows.md` Flow B, F.

## AGT-01 Spoken-to node is default context

```gherkin
Given user speaks prompt to node N
When agent interprets prompt
Then agent assumes user refers to node N's content by default
(unless prompt references other nodes/concepts)
```

**Why** (source: "the agentic execution will believe you are talking about the node
you are speaking to when referring to different ideas and concepts"): deictic
simplicity — "this section", "that subsection" resolve without naming. Speaking TO a
thing means the thing is the topic; removes prompt-scaffolding burden.

## AGT-02 Linked references may edit other files

```gherkin
Given prompt references other nodes OR concepts linked to other nodes
When agent executes
Then agent may edit other linked files
Beyond spoken-to node
```

**Why** (source: "However if you talk about other nodes or concepts that are links to
other nodes Then It could edit other linked files"): graph is the agent's context map
— links are permission paths. Natural language + graph structure jointly scope writes.

## AGT-03 Initial prompt creates one file

```gherkin
Given initial prompt on new node
When agent executes
Then only one file created for that node
No sibling/child files on first prompt
```

**Why** (source: "generally on an initial node prompt it only creates the one file for
that node"): predictable blast radius on first contact — graph grows one node per
prompt, not a surprise forest. Trust before proliferation.

## AGT-04 Graph reflects agent mutations as movement

```gherkin
Given agent executing changes (generating off node, moving, grouping, detaching)
Then graph shows corresponding movement in affected areas
Real time, user watches
```

**Why** (source: earlier vision session — "as the graph changes from the local agent
manipulating things It is reflected in movement in areas of the graph"): movement IS
the narration. User reads agent work as spatial events, not log lines — enables
watch-and-react supervision.

## AGT-05 Real-time reaction loop

```gherkin
Given agent manipulating graph
When result not what user wants
Then user can react (intervene) while/after execution
So corrections steerable
```

**Why** (source: earlier vision session — "I would want to see that in real time and
be able to react if certain things aren't happening like I want"): agent is
collaborator, not batch job. Supervision requires visibility (AGT-04) + the ability
to steer mid-flight.

## AGT-06 File mutations project onto graph

```gherkin
Given agent execution changes files in project folders
Then nodes on graph change accordingly
(file change ⇒ graph change, projection rule)
```

**Why** (source: "as a result the files in the relevant folders to the project and
thus the nodes on the graph Change as the agent execution happens"): FS is source of
truth (ADR-0011); graph is its projection. "Thus" in source = the causal rule: graph
never diverges from files, agent mutations included.
