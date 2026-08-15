# Slice 02 — Voice Capture & STT Pipeline

> Vertical slice: mic → analyser → STT → prompt input (tooltip) → send → prompt file.
> Breathing visuals owned by slice 03; this slice owns capture + text mechanics.

## Positive Requirements

1. **PR-02-1** One gesture (click) starts capture; zero chrome appears (VOX-01).
2. **PR-02-2** Transcript is always inspectable (hover) and editable (pin) before send.
3. **PR-02-3** Recording survives tooltip hide, cursor travel, and node expansion.
4. **PR-02-4** Every spoken prompt is persisted (debounced, per-prompt file) even if never sent.
5. **PR-02-5** Mic/STT failures degrade gracefully with visible state + recovery.

## Inherited Cases (full GWT + Why: `../../broader-vision/requirements/02-voice-input-tooltip.md`)

| ID | Summary |
|---|---|
| VOX-01 | Single click starts invisible recording |
| VOX-04 | Hover shows live STT tooltip |
| VOX-05 | Tooltip side adaptive (right/left, surroundings) |
| VOX-06 | Click-into pins tooltip as text input |
| VOX-07 | STT appends at cursor (default: end) |
| VOX-08 | Click anywhere → edit there; voice/keyboard overwrite |
| VOX-09 | Enter sends |
| VOX-10 | Shift+Enter newline |
| VOX-11 | Click-out hides tooltip, recording continues |
| VOX-12 | Single click stops recording |
| VOX-13 | Single click resumes, appends at end |
| VOX-14 | Double left click sends |
| VOX-15 | Double right click sends |
| VOX-16 | Debounced save → hidden `.` folder, per-prompt file |
| VOX-17 | Pinned tooltip persists unhovered |

(VOX-02/03 visual states → slice 03.)

## New Cases (convention-derived gap-fill)

### VOXC-01 Mic permission flow

```gherkin
Given browser mic permission not yet granted
When user triggers STT (click bubble)
Then permission prompt requested
And while undetermined bubble shows pending-recording state
And on deny: bubble shows denied state + tooltip explains recovery
And no crash, no silent failure
```

**Why** `[C]`: `getUserMedia` permission is a mandatory browser gate (mdn convention);
denied-state UX per error-pattern rules (cause + recovery action).

### VOXC-02 Interim vs final transcript styling

```gherkin
Given STT streaming
Then interim (unfinalized) words render visually distinct (e.g. dimmed/italic)
And finalize to normal styling as STT confirms
And cursor-follow typing never jumps when text finalizes
```

**Why** `[C]`: every live-caption STT UI (YouTube live captions, dictation apps)
distinguishes interim text; prevents user editing words about to change.

### VOXC-03 STT confidence/error handling

```gherkin
Given STT engine errors or returns persistent low confidence
Then status shown near input (not modal)
And recording state exits cleanly
And spoken-so-far text preserved in prompt file
```

**Why** `[C]`: local STT (whisper) can fail mid-stream; preserved partial text
honors PR-02-4 (nothing spoken is lost).

### VOXC-04 Single active recording

```gherkin
Given recording active on node A
When user starts recording on node B
Then A stops recording cleanly (state saved)
And B becomes the sole active recorder
```

**Why** `[I]`: resolves open question #3 (brainstorm/user-flows.md) — single mic,
single audio pipeline; last-click wins is the least-surprise rule.

### VOXC-05 Send requires content

```gherkin
Given input empty (no text, no pills)
When user invokes send (double click / Enter)
Then no-op w/ subtle shake/flash feedback
And no empty prompt dispatched or file created
```

**Why** `[C]`: guard-rail convention; prevents empty-agent-runs + prompt-file litter.

## Implementation References

| Source | File/Path | What to adapt |
|---|---|---|
| [BasedHardware/omi](https://github.com/BasedHardware/omi) | `web/app/src/lib/audioCapture.ts` | mic stream + analyser wiring (`fftSize: 256`), permission handling |
| [AutoGPT](https://github.com/Significant-Gravitas/AutoGPT) | `.../BrainDumpStep/components/useAudioBars.ts` | level metering hook (`fftSize 512`, `smoothingTimeConstant 0.45`) |
| [unsloth](https://github.com/unslothai/unsloth) | `studio/frontend/src/features/chat/adapters/dictation-level.ts` | RAF tick loop `getByteFrequencyData` → level → UI |
| [openai-cookbook](https://github.com/openai/openai-cookbook) | `.../wavtools/lib/analysis/audio_analysis.js` | RMS/level computation reference |

## Open Questions

- Prompt file naming/format (open #4 in brainstorm summary) — propose `.<node-id>/prompt-<n>.md` w/ frontmatter (timestamp, sent-state); decide at slicing time.
- STT engine: whisper.cpp streaming vs chunked (ADR-0003 territory) — engine-agnostic cases here.
