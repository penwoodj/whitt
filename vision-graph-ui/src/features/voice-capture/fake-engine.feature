Feature: Fake engine + fake analyser
  As usr testing voice UI
  I want scripted fake engine + analyser
  So I test UI w/o real mic/STT

  Scenario: FakeSTT emits interim + final events
    Given FakeSTT w/ scripted transcript ["Hello", "World"]
    When FakeSTT started
    Then emits interim event "Hello"
    And emits interim event "Hello World"
    And emits final event "Hello World"

  Scenario: FakeSTT stops cleanly
    Given FakeSTT started
    When stop called
    Then engine in stopped state
    And no more events emitted

  Scenario: FakeAnalyser emits level curve
    Given FakeAnalyser w/ breathing curve [0.1, 0.5, 0.8, 0.3]
    When level requested
    Then returns first level 0.1
    And next call returns 0.5
    And cycles through curve

  Scenario: FakeAnalyser compatible w/ real AnalyserNode
    Given FakeAnalyser created
    When getByteFrequencyData called
    Then populates Uint8Array w/ fake data
    And fftSize matches real AnalyserNode (256)
