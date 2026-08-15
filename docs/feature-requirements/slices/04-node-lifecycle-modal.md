# Slice 04 — Node Lifecycle & Detail Modal

> Vertical slice: bubble ↔ modal state machine, expansion triggers, close, stacking.
> Interior surfaces (execution, file) owned by slices 05/07; this slice owns the container.

## Positive Requirements

1. **PR-04-1** Every node has exactly two forms: bubble (collapsed) and detail modal
   (expanded) — plus halo when expanded. No third chrome type.
2. **PR-04-2** Expansion is content-triggered (send) or manual (right click) — both arrive
   at the same modal.
3. **PR-04-3** One modal expanded at a time (graph context stays legible behind).
4. **PR-04-4** Close is three-way (ESC / click-outside / X) and always returns to bubble
   at the same graph position.
5. **PR-04-5** Modal is sized to content, capped to viewport, and never traps the rail.

## Inherited Cases (full GWT + Why: `../../brainstorm/requirements/03-expanded-node-modal.md`)

| ID | Summary |
|---|---|
| EXP-01 | Send (dblclick) → expand into soft-corner modal + execution begins |
| EXP-02 | Ball becomes halo around modal |
| EXP-03 | Expansion auto-starts recording |
| EXP-04 | Bar of light at top, soft corners/edges |
| EXP-05 | Bar hover → same input tooltip (pin/edit/send) |
| EXP-06 | Bar single click toggles STT (symmetric w/ bubble) |
| EXP-07 | Bar dblclick / Enter sends |
| EXP-08 | Bar breathes w/ voice, tooltip-open or not |
| EXP-09 | Right click → open expanded WITHOUT STT |
| EXP-10 | Ball shows running state when agent executes |
| EXP-11 | Close = ESC / click-outside / X (ADR-0012) |

## New Cases (convention-derived gap-fill)

### EXPC-01 Single expanded modal

```gherkin
Given node A expanded
When user expands node B
Then A collapses to bubble (state preserved)
And B expands
And only one modal at any time
```

**Why** `[I]`: resolves stacking question; graph canvas legibility (PR-04-3) +
recording singularity (VOXC-04) both imply one-at-a-time. Modest screens make
overlapping modals unreadable.

### EXPC-02 Modal size caps

```gherkin
Given modal content (file preview, execution panel)
Then modal sizes to content
And caps at ~80% viewport w/h
And scroll happens inside modal regions, not the graph behind
```

**Why** `[C]`: dialog-sizing convention (Figma/tldraw property panels cap + inner-scroll);
protects spatial context — user must still SEE the graph around the modal (halo anchors it).

### EXPC-03 ESC precedence: tooltip → modal

```gherkin
Given modal open AND tooltip pinned
When user presses ESC
Then tooltip closes first, modal stays
When user presses ESC again
Then modal closes
```

**Why** `[C]`: innermost-first ESC dismissal (standard overlay stacking, e.g. VS Code
quick-input over editor). Resolves open question #2 half left open in brainstorm.

### EXPC-04 Expansion transition

```gherkin
Given node expanding or collapsing
Then transition is a single 200–300ms transform animation (scale/translate)
And the bubble's position on canvas is the transform origin
And no content flash/reflow mid-transition
```

**Why** `[C]`: motion polish convention (repo theme transitions: base 200ms, slow 400ms);
origin-anchored morph preserves spatial identity — the modal IS the bubble grown.

## Implementation References

| Source | What to adapt |
|---|---|
| Repo `Node.tsx` | existing 3-state lifecycle (collapsed/hovered/expanded) + 240ms transitions — extend |
| motion `layout`/`layoutId` (research survey §motion) | origin-anchored bubble→modal morph, shared-element continuity |
| Radix Dialog / shadcn patterns | ESC precedence + focus-trap + size-cap conventions |

## Open Questions

- Should collapse during active agent execution be allowed? Propose: yes, bubble shows running state (EXP-10) — execution never blocks navigation.
