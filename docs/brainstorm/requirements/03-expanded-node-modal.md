# GWT — Expanded Node Modal

> Suite 3/9. Source: user vision dictation 2026-08-14. IDs `EXP-xx`.
> Covers: expansion into detail modal, halo, bar of light, right-click open, close.
> Related: `../user-flows.md` Flow B, D.

## EXP-01 Send expands node into modal

```gherkin
Given node w/ prompt sent (double click)
Then node expands into soft-corner square modal (detail view)
And agent execution begins
```

**Why** (source: "when clicked ... It opens up into a soft corner square modal" +
"after there is content in the node then it does the expansion behavior"): send =
commitment point; node graduates from ball-of-light (potential) to workspace
(working state). Expansion reveals execution + file surfaces the prompt triggers.

## EXP-02 Ball becomes halo

```gherkin
Given node expanded into modal
Then ball of light becomes halo around expanded node
```

**Why** (source: "the ball of light now being in halo around the node that is
expanded"): identity continuity — the thing you spoke to is still THE node, now
crowned. Halo keeps recording/breathing visuals (EXP-08) attached to node identity.

## EXP-03 Expansion auto-starts recording

```gherkin
Given node just expanded
Then STT recording starts immediately (same as unexpanded click behavior)
```

**Why** (source: "it immediately starts recording like before"): conversation is
continuous across expansion — user keeps talking through the transition, no re-click.

## EXP-04 Bar of light at top

```gherkin
Given node expanded
Then bar of light sits at top inside modal
And bar has soft corners + soft edges
```

**Why** (source: "the ball of light being inside of the top of the menu ... as a bar
of light with soft corners and soft edges"): the bubble's voice affordance stretches
into the modal — one continuous light-language. Bar form fits modal's horizontal top
edge; soft edges keep the aesthetic gentle.

## EXP-05 Bar hover opens input tooltip

```gherkin
Given expanded node
When user hovers bar of light
Then same tooltip input menu expands (edit text before send)
And behavior identical to unexpanded bubble tooltip (pin, edit, Enter send)
```

**Why** (source: "It expands that same tool tip input menu that allows you to edit
things before they are sent"): ONE editing idiom across both node forms — zero
relearning. Explicitly "that same" menu.

## EXP-06 Bar single click toggles STT

```gherkin
Given expanded node
When user single clicks bar of light
Then STT toggles on/off
Same as unexpanded bubble single click
And when on, text appends at end of input (or cursor position)
```

**Why** (source: "that is how the unexpanded ball of light node also response [responds]"):
symmetric toggle gesture across forms — user muscle memory transfers 1:1.

## EXP-07 Bar double click / Enter sends

```gherkin
Given expanded node w/ input content
When user double clicks bar of light OR presses Enter in focused input
Then prompt sent
```

**Why** (source: "when double clicked sends the text"): same send idiom as bubble
(VOX-14/15) + input Enter (VOX-09) — three paths, one action.

## EXP-08 Bar breathes with voice

```gherkin
Given expanded node recording
Then bar of light breathes in line w/ speaker volume
Whether tooltip open or not
So speaking always visually indicated
```

**Why** (source: "breathing in line with the volume of the speaker so it looks like a
visual indication of your speaking whether you have the text tool tip edit area open
or not to read it"): explicit why in source — speaking indicator must survive tooltip
closure; volume-follow = liveness proof.

## EXP-09 Right click opens without STT

```gherkin
Given node on graph
When user right clicks node
Then node opens expanded WITHOUT activating speech-to-text
So user can type/execute agent behavior manually
```

**Why** (source: "If you right click on the node It opens the node without activating
speech to text to send another prompt to the agent"): silent mode — review results,
type edits, re-execute — for environments where speaking is impossible or thought is
already formed.

## EXP-10 Running indicated on ball

```gherkin
Given agent executing for node
Then ball of light (unexpanded form) indicates running state
```

**Why** (source: "the ball of light indicates that it's running something"): at-a-glance
canvas-wide state — which nodes are busy is visible from zoomed-out view w/o opening
each.

## EXP-11 Expanded node close

```gherkin
Given node expanded
When user presses Escape OR clicks outside OR clicks close btn (X)
Then node collapses back to bubble form
```

**Why** (from ADR-0012 / AGENTS.md §17 node lifecycle; not in voice dictation):
every opening gesture needs a closing gesture; three paths (key, outside, button)
cover keyboard, spatial, and pointer habits.
