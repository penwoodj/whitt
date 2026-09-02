Feature: Local STT speech state
  As usr speaking to graph
  I want local speech capture with visible state
  So transcript and amplitude stay deterministic

  Scenario: Unsupported capability blocks capture
    Given local STT capability is unsupported
    When usr requests capture
    Then speech state is error
    And error text remains visible

  Scenario: Permission pending then denied
    Given speech state is idle
    When capture permission request starts
    Then speech state is permission-pending
    When permission is denied
    Then speech state is denied

  Scenario: Error preserves committed text
    Given committed text is "keep this"
    When STT reports error
    Then speech state is error
    And committed text is "keep this"

  Scenario: Final segments stay ordered
    Given final segments arrive out of order
    When segments are reduced
    Then transcript follows segment timestamp order

  Scenario: Stop enters processing before final results
    Given speech state is listening
    When usr stops capture
    Then speech state is processing
    When final segment arrives
    Then speech state is stopped

  Scenario: Recorder transfer cancels prior owner
    Given recorder A is active
    When recorder B starts
    Then recorder A is cancelled before B starts

  Scenario: Amplitude maps to visible state
    Given amplitude levels are zero medium high
    When levels are reduced
    Then output levels are zero medium high

  Scenario: Reduced motion keeps static recording state
    Given reduced motion is enabled
    When speech state is listening
    Then recording indicator stays static

  Scenario: Stop cleans capture resources
    Given active stream and audio context exist
    When capture stops
    Then tracks stop context closes and engine disposes

  Scenario: Dev and preview isolate cross-origin resources
    Given Vite serves app
    When usr requests dev or preview resource
    Then COOP is same-origin
    And COEP is require-corp
