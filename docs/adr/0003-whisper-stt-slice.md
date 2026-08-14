# ADR-0003: Whisper STT Slice

**Status:** Proposed  
**Date:** 2026-08-08  
**Supersedes:** none

## Context

Voice input requires speech-to-text. Whisper provides local, CPU-only STT. Need streaming transcription. Connects to ADR-0001 voice input requirement.

## Decision

Integrate local Whisper for STT. Build streaming transcription to active node's prompt area. Ctrl+Space toggle, separate from Enter/Send.

## Consequences

- Offline voice input enabled
- STT becomes separate concern
- ADR-0004 node slice includes mic btn
- Real-time streaming to textarea

## Features

### Feature: Start STT on toggle

User toggles mic btn or presses Ctrl+Space. STT starts streaming transcribed text to prompt area.

```gherkin
Feature: Start STT on toggle
  As usr on graph
  I want start STT
  So I voice-input text

  Scenario: Mic btn starts STT
    Given Active node w/ mic btn off
    When usr clicks mic btn
    Then mic btn shows stop
    And STT starts listening
    And transcribed txt streams to prompt area

  Scenario: Ctrl+Space starts STT
    Given Active node w/ mic btn off
    When usr presses Ctrl+Space
    Then mic btn shows stop
    And STT starts listening
    And transcribed txt streams to prompt area

  Scenario: Stream txt in real-time
    Given STT active
    When usr speaks "hello world"
    Then "hello" appears immediately
    And "world" appears after utterance
    And full txt accumulates in prompt area
```

### Feature: Stop STT on toggle

User toggles mic btn or presses Ctrl+Space again. STT stops. Transcribed text saved to prompt area.

```gherkin
Feature: Stop STT on toggle
  As usr on graph
  I want stop STT
  So I finalize my input

  Scenario: Mic btn stops STT
    Given STT active
    When usr clicks mic btn
    Then mic btn shows rec
    And STT stops listening
    And final txt saved to prompt area

  Scenario: Ctrl+Space stops STT
    Given STT active
    When usr presses Ctrl+Space
    Then mic btn shows rec
    And STT stops listening
    And final txt saved to prompt area

  Scenario: Stop preserves transcript
    Given STT active w/ "hello world" transcribed
    When usr stops STT
    Then "hello world" remains in prompt area
    And txt can be edited
    And txt ready for submit
```

### Feature: STT error handling

Handle microphone access denied, audio device unavailable, STT model not loaded.

```gherkin
Feature: STT error handling
  As usr on graph
  I want STT errors handled gracefully
  So I know what went wrong

  Scenario: Microphone access denied
    Given STT not started
    When usr clicks mic btn
    And microphone access denied
    Then error msg shows "mic access denied"
    And mic btn stays off
    And STT not started

  Scenario: Audio device unavailable
    Given STT active
    When audio device disconnects
    Then STT stops automatically
    And error msg shows "audio device lost"
    And mic btn shows rec

  Scenario: STT model not loaded
    Given Whisper model not loaded
    When usr clicks mic btn
    Then error msg shows "STT model not loaded"
    And mic btn stays off
    And suggestion shows "load Whisper model in settings"
```

### Feature: STT language detection

Whisper auto-detects language. User can override. Multi-language support.

```gherkin
Feature: STT language detection
  As usr on graph
  I want STT detect language
  So I speak in any language

  Scenario: Auto-detect language
    Given STT active
    When usr speaks in Spanish
    Then Whisper detects Spanish
    And transcription shows Spanish text
    And language indicator shows "es"

  Scenario: Override language manually
    Given STT settings open
    When usr selects "English" manually
    Then STT forced to English
    And future transcriptions in English

  Scenario: Show detected language
    Given STT active
    When language detected
    Then language indicator shows in prompt area
    And indicator updates on language change
```

### Feature: STT punctuation

Whisper adds punctuation. User can toggle punctuation on/off.

```gherkin
Feature: STT punctuation
  As usr on graph
  I want STT add punctuation
  So I don't edit raw transcript

  Scenario: Auto-punctuation enabled
    Given Punctuation toggle on
    When usr speaks "hello world"
    Then transcript shows "Hello, world."
    And capitalization correct

  Scenario: Auto-punctuation disabled
    Given Punctuation toggle off
    When usr speaks "hello world"
    Then transcript shows "hello world"
    And no punctuation added

  Scenario: Toggle punctuation setting
    Given STT settings open
    When usr toggles punctuation
    Then setting saved
    And next transcription respects toggle
```

### Feature: STT model selection

User selects Whisper model size. Trade-off: accuracy vs speed. Local models only.

```gherkin
Feature: STT model selection
  As usr on graph
  I want select Whisper model
  So I balance speed + accuracy

  Scenario: Show available Whisper models
    Given STT settings open
    When usr opens model selector
    Then list shows "tiny", "base", "small", "medium"
    And each model shows estimated speed

  Scenario: Select faster model
    Given STT settings open
    When usr selects "tiny" model
    Then "tiny" model loads
    And transcription faster
    And accuracy slightly lower

  Scenario: Select more accurate model
    Given STT settings open
    When usr selects "medium" model
    Then "medium" model loads
    And transcription slower
    And accuracy higher
```

## Dependencies

- ADR-0001: Voice Graph Vision (master vision)
- ADR-0004: Graph UI Node Line Settings Slices (mic btn in node)
- ADR-0002: Llama.cpp Slice (model management patterns)
