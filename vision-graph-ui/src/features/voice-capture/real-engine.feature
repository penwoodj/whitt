Feature: Real browser-whisper integration
  As usr on graph
  I want real STT engine with browser-whisper
  So I transcribe voice locally w/ Whisper models

  Scenario: Real transcribe stream works
    Given browser w/ WebGPU support
    When real engine starts
    Then transcribe stream processes audio
    And text appears in real-time

  Scenario: Interim and final semantics work
    Given real engine running
    When audio streams in
    Then interim text updates frequently
    And final text commits periodically
    And interim clears on final commit

  Scenario: Model switch works
    Given engine created w/ base model
    When user switches to tiny model
    Then engine loads new model
    And transcription continues w/ new model

  Scenario: No WebGPU falls back gracefully
    Given browser lacks WebGPU
    When real engine starts
    Then engine falls back to WASM
    And transcription continues w/ reduced perf
