Feature: AudioWorklet integration 16k chunks to STT
  As usr on graph
  I want AudioWorklet feeding 16k Float32 chunks to STT
  So I transcribe voice w/ real-time audio capture

  Scenario: AudioWorklet captures 16k Float32 chunks
    Given AudioContext w/ mic source
    When AudioWorklet processor connects
    Then processor emits Float32Array at 16kHz
    And chunks are mono single-channel

  Scenario: AudioWorklet splits feed from source
    Given AudioContext w/ mic source
    When source connects to analyser
    And source connects to worklet
    Then analyser gets level data
    And worklet gets PCM chunks
    And both streams run parallel

  Scenario: AudioWorklet handles audio buffer chunks
    Given worklet processor running
    When audio buffer arrives
    Then processor converts to Float32Array
    And processor emits chunk event
