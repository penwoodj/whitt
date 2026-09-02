Feature: Voice tooltip composer
  As usr on graph node
  I want right-side dialog composer
  So prompt voice stays beside node

  Scenario: Preview opens focused editor
    Given node dialog shows preview
    When usr activates preview
    Then labelled textarea appears and focuses

  Scenario: Right placement falls left
    Given node right edge collides
    When dialog opens
    Then dialog places left with matching arrow

  Scenario: Listening shows local transcript
    Given fake local STT starts
    When usr clicks mic
    Then dialog shows Listening status and red decorative dot
    And interim and final transcript remain visible

  Scenario: Capture stop streams recorded PCM
    Given injectable capture starts with PCM handle
    When usr stops mic
    Then capture handle stop supplies final segment

  Scenario: Amplitude drives glow
    Given capture amplitude starts at zero
    When capture amplitude rises
    Then dialog glow value changes

  Scenario: Reduced motion stays static
    Given reduced motion is enabled
    When usr starts mic
    Then recording indicator stays static

  Scenario: Outside hides but recording persists
    Given dialog is pinned and recording
    When usr dismisses canvas
    Then unpinned view hides without stopping recorder

  Scenario: Enter sends and Shift Enter newline
    Given textarea has prompt text
    When usr presses Enter
    Then prompt sends
    When usr presses Shift Enter
    Then newline remains

  Scenario: Adapter error preserves prompt
    Given fake local STT errors
    When usr starts voice
    Then prompt text remains and alert shows error
