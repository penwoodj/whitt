# GWT — Voice Input + Tooltip + Prompt File

> Suite 2/9. Source: user vision session 2026-08-14. IDs `VOX-xx`.
> Covers: unexpanded bubble STT, tooltip, text input editing, send mechanics, prompt persistence.
> Related: `../user-flows.md` Flow B, C.

## VOX-01 Single click starts recording

```gherkin
Given unexpanded bubble of light (new node)
When user single left clicks bubble
Then speech-to-text starts recording
And no visual chrome beyond bubble itself ("invisibly")
```

## VOX-02 Recording visual state — color shift

```gherkin
Given bubble recording
Then bubble color changes slightly vs idle state
```

## VOX-03 Recording visual state — volume breathing

```gherkin
Given bubble recording
Then bubble breathes (expands/contracts)
And breath cadence + amplitude follow user voice volume
```

## VOX-04 Hover shows live STT tooltip

```gherkin
Given bubble recording
When mouse hovers over bubble
Then tooltip pops showing text as voice-typed
```

## VOX-05 Tooltip side depends on surroundings

```gherkin
Given STT tooltip opening
Then tooltip opens right OR left of node
And side chosen by surrounding nodes + proximity (avoid overlap)
```

## VOX-06 Click into tooltip pins it open

```gherkin
Given STT tooltip open (hovered)
When user clicks into tooltip
Then tooltip becomes text input
And stays open even if cursor leaves tooltip or node
```

## VOX-07 STT appends into open input

```gherkin
Given tooltip converted to text input
And recording active
Then voice text continues typing at cursor position
And if cursor untouched, at end (bottom) of input
```

Source: "continues to type at the bottom of the text in the input" +
"at the end of the input or where the cursor is where the cursor of the input is".

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

## VOX-09 Enter sends

```gherkin
Given text input focused
When user presses Enter
Then prompt sent to agent system
```

## VOX-10 Shift+Enter newline

```gherkin
Given text input focused
When user presses Shift+Enter
Then newline inserted, no send
```

## VOX-11 Click out hides tooltip, recording continues

```gherkin
Given text input open
When user clicks outside text bubble
Then tooltip disappears
And recording continues
```

## VOX-12 Single click toggles recording off

```gherkin
Given bubble recording
When user single clicks bubble
Then recording stops
```

## VOX-13 Single click again resumes

```gherkin
Given recording stopped, input has content
When user single clicks bubble
Then recording restarts
And voice text appends at bottom/end of input
```

## VOX-14 Double left click sends

```gherkin
Given unexpanded bubble w/ or w/o tooltip open
When user double left clicks bubble
Then prompt sent to agent system
```

## VOX-15 Double right click sends

```gherkin
Given unexpanded bubble
When user double right clicks bubble
Then prompt sent to agent system
```

## VOX-16 Prompt persisted debounced

```gherkin
Given prompt text exists in input
Then input debounced-saves to prompt file
And prompt file lives in hidden `.` folder inside same folder as node
And every prompt gets own file
```

## VOX-17 Tooltip accessible while unhovered after pin

```gherkin
Given tooltip pinned open (clicked into)
When cursor moves away
Then tooltip remains open
And recording indicator (breathing) continues on bubble
```
