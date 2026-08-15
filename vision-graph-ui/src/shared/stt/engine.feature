Feature: STT engine wrapper + capability detect
  As usr on graph
  I want local STT engine w/ auto capability detect
  So I transcribe voice w/o manual config

  Scenario: Capability detects WebGPU support
    Given browser w/ WebGPU
    When createEngine called
    Then engine reports WebGPU available
    And engine uses WebGPU by default

  Scenario: Capability detects no WebGPU falls back to WASM
    Given browser w/o WebGPU
    When createEngine called
    Then engine reports WebGPU unavailable
    And engine uses WASM fallback
    And engine warns about perf

  Scenario: Capability detects mic access
    Given browser w/ mic permission
    When createEngine called
    Then engine reports mic available
    And mic access check succeeds

  Scenario: Capability detects secure context
    Given browser on HTTPS or localhost
    When createEngine called
    Then engine reports secure context
    And OPFS cache enabled

  Scenario: OPFS caches model after download
    Given engine created
    When model downloaded first time
    Then OPFS stores model weights
    And subsequent load from cache
    And download skipped

  Scenario: Model load progress events fire
    Given engine created
    When model download starts
    Then progress events fire 0-1
    And stage changes: loading→decoding→transcribing
