Feature: Audio ctx + analyser feed
  As usr on graph
  I want mic audio feed w/ level meter
  So I see breathing viz

  Scenario: AudioContext singleton init @16kHz
    Given no AudioContext exists
    When getAudioContext called
    Then AudioContext created w/ sampleRate 16000
    And same instance returned on subsequent calls

  Scenario: AudioContext resumable via user gesture
    Given suspended AudioContext
    When resumeAudioContext called
    Then AudioContext state becomes running
    And resume throws if already running

  Scenario: AudioContext StrictMode double-mount safe
    Given AudioContext initialized
    When destroyAudioContext called
    Then AudioContext closed
    And destroy called again throws no error
    And getAudioContext creates fresh instance after destroy

  Scenario: AnalyserNode w/ fftSize 256
    Given AudioContext w/ media stream source
    When createAnalyser called
    Then AnalyserNode created w/ fftSize 256
    And source connected to analyser

  Scenario: Analyser level calc 0-1
    Given AnalyserNode w/ audio data
    When getAnalyserLevel called
    Then level returned between 0 and 1
    And level calculated via RMS from frequency data

  Scenario: One source split to analyser
    Given media stream source
    When createAnalyser called w/ source
    Then source connected to analyser
    And source can connect to other nodes (worklet)
