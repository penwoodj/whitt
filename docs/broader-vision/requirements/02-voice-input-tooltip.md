# GWT — Voice Input + Tooltip + Prompt File

> Suite 2/9. Source: user vision dictation 2026-08-14. IDs `VOX-xx`.
> Covers: unexpanded bubble STT, tooltip, text input editing, send mechanics, prompt persistence.
> Related: `../user-flows.md` Flow B, C.

## VOX-01 Single click starts recording

```gherkin
Given unexpanded bubble of light (new node)
When user single left clicks bubble
Then speech-to-text starts recording
And no visual chrome beyond bubble itself ("invisibly")
```

**Why** (source: "if clicked would start recording you" + "starts to do speech
invisibly"): voice-first, chrome-free. User thinks out loud; interface must not add
friction. The bubble IS the button.

## VOX-02 Recording visual state — color shift

```gherkin
Given bubble recording
Then bubble color changes slightly vs idle state
```

**Why** (source: "changes colors slightly"): passive state signal — recording must be
visible from across canvas w/o reading anything, but subtle enough to not distract
from thinking.

## VOX-03 Recording visual state — volume breathing

```gherkin
Given bubble recording
Then bubble breathes (expands/contracts)
And breath cadence + amplitude follow user voice volume
```

**Why** (source: "expanding and contracting with your voice" + "soft breathing motion
in the cadence of the voice"): live feedback that mic hears you — the bubble feels
alive, "talking to a ball of light" magic. Amplitude-following proves liveness, not
just a static rec indicator.

## VOX-04 Hover shows live STT tooltip

```gherkin
Given bubble recording
When mouse hovers over bubble
Then tooltip pops showing text as voice-typed
```

**Why** (source: "expands out a menu showing what's being voice typed"): STT is
fallible; user must be able to verify capture at any moment. Hover = glanceable
check w/ zero commitment (no click needed).

## VOX-05 Tooltip side depends on surroundings

```gherkin
Given STT tooltip opening
Then tooltip opens right OR left of node
And side chosen by surrounding nodes + proximity (avoid overlap)
```

**Why** (source: "to the right or left of the node depending on what is surrounding it
and how close it is"): dense graphs = collision risk; tooltip must never cover
neighbor content user may be referencing while speaking.

## VOX-06 Click into tooltip pins it open

```gherkin
Given STT tooltip open (hovered)
When user clicks into tooltip
Then tooltip becomes text input
And stays open even if cursor leaves tooltip or node
```

**Why** (source: "could be clicked into And by doing so it stays open even if you are
not hovered"): editing session must survive mouse travel — you can't edit text if the
editor vanishes when you reach for it.

## VOX-07 STT appends into open input

```gherkin
Given tooltip converted to text input
And recording active
Then voice text continues typing at cursor position
And if cursor untouched, at end (bottom) of input
```

**Why** (source: "continues to type at the bottom of the text in the input" + "at the
end of the input or where the cursor is"): transcript growth must be predictable;
cursor-position respect enables mid-text voice insertion.

## VOX-08 In-input editing

```gherkin
Given text input open
When user clicks anywhere in text
Then cursor placed there
And subsequent voice text types at that cursor position
And user can highlight spans
And keyboard-type over them OR voice-type over them
So prompt editable before send
```

**Why** (source: "you can highlight things and voice type or keyboard type over them
To edit the prompt"): STT errors must be fixable pre-send; mixed voice+keyboard edit
serves both thinking (voice) and precision (keyboard).

## VOX-09 Enter sends

```gherkin
Given text input focused
When user presses Enter
Then prompt sent to agent system
```

**Why** (source: "When focused in the text input the enter key will send the prompt"):
standard text-input idiom — hands already on keyboard while editing, send follows
naturally.

## VOX-10 Shift+Enter newline

```gherkin
Given text input focused
When user presses Shift+Enter
Then newline inserted, no send
```

**Why** (source: "while Shift Enter makes a new line"): multi-line prompts must be
possible; must not conflict w/ send (VOX-09).

## VOX-11 Click out hides tooltip, recording continues

```gherkin
Given text input open
When user clicks outside text bubble
Then tooltip disappears
And recording continues
```

**Why** (source: "clicks out of the text bubble then the tool tip disappears while it
continues recording"): hide ≠ stop. Visual declutter while thought keeps flowing;
recording state is owned by the bubble, not the tooltip.

## VOX-12 Single click toggles recording off

```gherkin
Given bubble recording
When user single clicks bubble
Then recording stops
```

**Why** (source: "if the user single clicks the bubble of light it just stops
recording"): pause to think, highlight (see PIL-04), or end input. Same gesture as
start = symmetric mental model.

## VOX-13 Single click again resumes

```gherkin
Given recording stopped, input has content
When user single clicks bubble
Then recording restarts
And voice text appends at bottom/end of input
```

**Why** (source: "on an additional single click It starts recording and typing at the
box at the bottom of the text input again"): interrupted thoughts resume exactly where
left off — transcript continuity across pauses.

## VOX-14 Double left click sends

```gherkin
Given unexpanded bubble w/ or w/o tooltip open
When user double left clicks bubble
Then prompt sent to agent system
```

**Why** (source: "the other way To send the prompt is to double right click or double
left click"): send w/o opening tooltip — fast path when transcript is trusted.
Distinct from single click (toggle) so no accidental sends.

## VOX-15 Double right click sends

```gherkin
Given unexpanded bubble
When user double right clicks bubble
Then prompt sent to agent system
```

**Why** (source: same sentence as VOX-14): both mouse buttons send — handedness /
habit tolerance. Same double-click threshold either button.

## VOX-16 Prompt persisted debounced

```gherkin
Given prompt text exists in input
Then input debounced-saves to prompt file
And prompt file lives in hidden `.` folder inside same folder as node
And every prompt gets own file
```

**Why** (source: "debouncedly saves the prompt to a file Inside of the same folder as
the node in a hidden . folder So every prompt gets its own file"): prompts are
history/audit artifacts — nothing spoken is lost, even pre-send/crash. Hidden folder
keeps project tree clean; per-prompt files make prompts individually addressable
(time travel, agent review).

## VOX-17 Tooltip accessible while unhovered after pin

```gherkin
Given tooltip pinned open (clicked into)
When cursor moves away
Then tooltip remains open
And recording indicator (breathing) continues on bubble
```

**Why** (source: same as VOX-06 + breathing "whether you have the text tool tip edit
area open or not"): pin is a mode, not a hover trick; state persists until user acts.
Restates VOX-06 pin semantics from tooltip side — kept for bubble-side visibility.
