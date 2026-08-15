Feature: Voice capture hooks
  As usr on graph
  I want hooks for voice level + STT
  So I build voice UI easily

  Scenario: useVoiceLevel streams audio level 0-1
    Given FakeAnalyser w/ breathing curve
    When useVoiceLevel called w/ FakeAnalyser
    Then level updates in real-time
    And level always between 0 and 1

  Scenario: useStt shows interim ghost text
    Given FakeSttEngine w/ transcript ["Test", "Message"]
    When useStt called w/ FakeSttEngine
    Then interimTxt shows "Test"
    And interimTxt shows "Test Message"
    And finalTxt appends "Test Message"

  Scenario: useStt start/stop controls
    Given useStt mounted w/ FakeSttEngine
    When startRec called
    Then engine starts
    When stopRec called
    Then engine stops

  Scenario: StrictMode double-mount safe
    Given useVoiceLevel mounted
    When component unmounts
    Then cleanup happens
    And no memory leaks
