# Brainstorm — User Vision: Voice-Driven Graph of Bubbles of Light

> Captured 2026-08-14. User's own words + intent, separated from research findings
> (see `research-inspiration-survey.md` for library/project analysis). Status: direction statement, not spec.

## Core Idea

Graph of **bubbles of light**. Each bubble = **one markdown file** (other file types later, md first).
Simple nodes. Voice drives everything: generation, editing, graph manipulation.
Purpose: **help thinking through complex issues with lots of pieces of information**.
It is a **file viewer** at heart, with local AI features driving underlying mechanisms + design.

Magic target: *"feel almost like a magical experience of talking to a bubble of light."*

## What User Wants

### 1. Simple nodes, NOT complex canvas builders

- **ragflow rejected**: "adds way too much complexity on the node and interaction elements."
- No heavy node forms, no workflow-builder chrome.
- Wants instead: **highlight, visualization, drag** — simple features for **moving information around in space to read it**.

### 2. Grouping = folders (machine translation)

- Drag nodes into areas → highlight → **make group = another layer of infinite canvas**.
- Machine translation of grouping: **add folder + move markdown files into it**.
- Extra **memory layer** (in-mem + graph DB) for speed; FS stays source of truth.

### 3. Zoomed visualization + fish-eye spatial awareness

- **Charkoal-type zoomed visualization** wanted for navigation.
- **Fish-eye effect**: see **whole graph at once even when zoomed in** — keep spatial
  awareness of higher-order graph context while working inside a zoomed grouping of nodes.
- Two scales visible simultaneously: local detail + global structure.

### 4. Eventually 3D

- End state: **3D graph with bubbles that connect**.
- Movement semantics must be **intuitive**: move things around **while they stay connected**.

### 5. Voice → text → agent → graph mutation loop

Flow:

```
talk to bubble (voice)
  → local voice-to-text
  → text output EDITABLE by user (popover, see §7)
  → send to local agent
  → agent expands / manipulates graph
  → user watches changes in real time, reacts if wrong
```

- Local models only (STT + agent).
- Graph changes from agent = **visible movement** in graph areas: things generated off a
  specific node, things moved/grouped/detached.
- "Lots of different graph manipulation that means different things around different
  elements" — manipulation vocabulary = semantic (spawn, split, group, detach, merge...).

### 6. Bubbles as focusable context chunks

- Highlight + focus bubbles → **speak to them as chunks of context** added to the agent
  being talked to.
- Selecting/focusing nodes **directs agent attention**: selected nodes weighted more than
  others in graph.

Example voice command (verbatim user intent):

> "So with this node I don't really like this section of the document that talks about
> X Y Z and I want you to change that to be more like this. And then I want you to take
> this other subsection of this node and split it out into its own node and then expand on it."

Demonstrates required semantics: section-level edit within node, **split subsection → new
child node**, **expand on** generated content.

### 7. Conversation text = popover RIGHT of node

- Voice/text conversation visualization = **popover on the RIGHT of the node**.
- **NOT inside the node.** Node stays simple; conversation floats beside it.

## Aims Summary

| Aim | Statement |
|---|---|
| Simplicity | Node = md file. Minimal chrome. Reject builder UIs. |
| Thinking tool | Complex issues, many info pieces, spatial arrangement aids thought. |
| Voice-first | Voice creates, edits, splits, groups, expands. Mouse arranges. |
| Fish-eye | Global graph awareness while zoomed in — never lose context. |
| Grouping = FS | Group action = folder + file moves. Git-visible. Memory layer caches. |
| 3D eventual | Bubbles of light connected in 3D. Intuitive connected movement. |
| Real-time agent | Watch agent manipulate graph live; intervene when wrong. |
| Popover UX | Conversation/output text right of node, node interior stays clean. |

## Relationship to Existing Vision Docs

- Supersedes emphasis in `../vision-graph-ui.md` (five pillars) toward: simpler nodes,
  voice-centric, fish-eye dual-scale, bubbles-of-light aesthetic.
- Consistent with ADR-0011 (graph↔FS mapping — grouping = folders is exactly this).
- Consistent with ADR-0012 (sphere→square morph — bubbles of light = sphere form).
- Refines ADR-0004 multi-zoom: fish-eye = simultaneous multi-scale view, not just zoom levels.
