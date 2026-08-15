# GWT — Agentic Execution Area

> Suite 4/9. Source: user vision dictation 2026-08-14. IDs `EXE-xx`.
> Covers: execution visualization, YAML workflow tooltip, status bar, morphing loader, confirm flow.
> Related: `../user-flows.md` Flow B, D, E. Deeper page design deferred (user: "I'll explain more ... in the future").

## EXE-01 Execution area below bar of light

```gherkin
Given node expanded
Then agentic execution area sits below bar of light
And area visualizes what is going to execute
```

**Why** (source: "After that then there is the execution area that helps you
visualize what is going to execute"): pre-execution transparency — agent actions must
be inspectable, not magic. Stacked below voice bar = voice in, execution out.

## EXE-02 Double left click executes immediately

```gherkin
Given execution area w/ pending workflow
When user double left clicks
Then workflow executes immediately
```

**Why** (source: "if you double click with the left click It immediately executes it"):
trusted fast path — matches bubble double-click-send idiom (VOX-14). Speed for the
common case.

## EXE-03 Double right click opens confirm

```gherkin
Given execution area w/ pending workflow
When user double right clicks
Then confirm dialog shows what will execute
And execution waits for user confirmation
```

**Why** (source: "if you Double click with a right click It lets you confirm What is
going to execute before it does"): safety path — same gesture, right button = cautious
variant. Inspect before irreversible agent mutations (files change, graph moves).

## EXE-04 Hover expands execution tooltip

```gherkin
Given execution area
When user hovers it
Then details tooltip expands (same interaction pattern as STT tooltip)
And tooltip positioned right of node
```

**Why** (source: "this area will be hoverable and on hover expands a details tool tip
similar to the text input tool tip"): one tooltip idiom everywhere — hover = peek,
zero clicks. Right of node = consistent w/ popover placement (node interior stays clean).

## EXE-05 Tooltip pins on click

```gherkin
Given execution tooltip open
When user clicks tooltip OR clicks into it
Then tooltip stays open (same pin semantics as input tooltip)
```

**Why** (source: "when hovered on you can hover over the tool tip and click into it
and then it stays up as well"): reading a long workflow must survive cursor travel —
identical pin rule as VOX-06.

## EXE-06 YAML workflow visualizer

```gherkin
Given execution tooltip open
Then tooltip shows YAML visualizer of workflow
```

**Why** (source: "It shows a YAML visualizer in essence of the workflow"): engine
workflows ARE YAML (whitt-execution-engine); visualizing the real artifact — not a
simplified diagram — means what you inspect is what runs. Fully transparent + editable
per project values.

## EXE-07 YAML sections colored + expandable

```gherkin
Given YAML visualizer shown
Then different sections different colors
And sections expandable/collapsible
```

**Why** (source: "Different sections would have different colors in the visualizer and
be expandable"): visual chunking — scan structure by color, dive by expanding;
collapsing keeps large workflows readable in a tooltip-sized surface.

## EXE-08 Dense YAML padding

```gherkin
Given YAML visualizer shown
Then small indent padding per level
And minimal padding between settings/elements
Dense, information-forward
```

**Why** (source: "with only really small indent padding and not much padding in
between different settings and elements"): maximize information density in limited
tooltip space — expert-readable, not marketing-spacious.

## EXE-09 Status bar minimal info card

```gherkin
Given node expanded
Then metadata status bar shows below bar of light
And bar is rounded-corner small card w/ very minimal information
```

**Why** (source: "a metadata very simple with very minimal information in the shape of
a rounded corner little area"): glanceable state — status is ambient info, not content;
minimal card avoids competing w/ file visualization below it.

## EXE-10 Status bar hover affordance

```gherkin
Given status bar shown
When user hovers
Then slight color change
And execution tooltip expands (see EXE-04)
```

**Why** (source: "whenever you hover has a slight color change ... and expands the
agentic execution to a execution tool to the right"): affordance signal — color shift
says "interactive, more here" before any click.

## EXE-11 Breathing edges while executing

```gherkin
Given agent executing
Then status bar edges breathe
And when idle, bar stays still
```

**Why** (source: "a shape where the edges breathe as things are executing and it stays
still as things are not occurring"): motion = life, stillness = done. Consistent w/
light-language (VOX-03, EXP-08): breathing always means active work.

## EXE-12 Border animations (eventual)

```gherkin
Given agent executing
Then status bar border animates (future polish)
More shape-expressive than ball glow
```

**Why** (source: "eventually with animations on the border when things are executing
of this more of a shape than a ball of light"): deferred polish — express execution
character through the card's own geometry rather than borrowing ball glow.

## EXE-13 Status text + loader only

```gherkin
Given status bar shown
Then bar contains only:
| status text
| loading indicator
Nothing else (minimal)
```

**Why** (source: "to only contain text of the status of the execution including a
loading indicator"): enforced minimalism — anything more belongs in the expandable
tooltip, not the always-visible card.

## EXE-14 Morphing icon loader

```gherkin
Given agent executing
Then loading indicator = icon morphing into next icon
Continuous morph cycle while execution runs
Style like Rovo / Claude loading indicators
```

**Why** (source: "a loading indicator of animorphing [animating/morphing] icons that
morph into the next icon ... Similar to Rovo or Claude loading indicator"): agentic
work is multi-phase; icon-per-phase morphing communicates progression, not just
busy-spinning. Named precedents = target quality bar.

## EXE-15 Current step title

```gherkin
Given agent executing
Then status bar shows title of current step
And title changes as execution progresses steps
```

**Why** (source: "a title for the current step that it is executing on similar to
other agent chat apps that have a ... changing title"): answer "what is it doing
RIGHT NOW" without opening anything — trust through narrated progress.

## EXE-16 Panel updates during execution

```gherkin
Given agent executing
Then execution tooltip/panel updates w/ info relevant to user
Live, not after completion
```

**Why** (source: "as you have an agent execute the information in the panel updates
with info relevant to the user"): user supervises agent in real time (AGT-05
intervention) — stale panel = blind supervision.

## EXE-17 File preview appears on creation

```gherkin
Given agent execution creates node markdown file
Then file text content displays in preview form
Inside expanded node (file visualization area)
```

**Why** (source: "once it creates a node file as a markdown file It displays the text
content in a preview way in the expanded node"): immediate payoff — spoken prompt
becomes visible artifact in-place; closes the loop voice → agent → readable output.
