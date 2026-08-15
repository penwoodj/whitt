Feature: Node mic btn rec toggle
  As usr on graph
  I want mic btn toggle rec
  So I talk to graph

  Scenario: VOXC-01 mic permission flow
    Given Node w/ mic btn off
    And mic permission denied
    When usr clicks mic btn
    Then mic btn shows error state
    And recovery text visible
    And app not crash

  Scenario: VOX-01 click starts recording
    Given Node w/ mic btn off
    When usr clicks mic btn
    Then STT engine started
    And tooltip chrome not auto-opened

  Scenario: VOXC-02 interim styling
    Given mic rec active
    When STT emits interim text "hello"
    Then text styled w/ data-interim attr
    And text dimmed italic

  Scenario: VOX-04 hover tooltip live text
    Given mic rec active
    When usr hovers bubble
    Then tooltip visible
    And streamed words appear

  Scenario: VOX-05 tooltip side adaptive
    Given Node w/ neighbor on right
    When usr hovers bubble
    Then tooltip opens LEFT
    And collision avoided

  Scenario: VOX-06 click pins tooltip
    Given tooltip visible on hover
    When usr clicks into tooltip
    Then tooltip persists unhovered
    And input focused

  Scenario: VOX-07 append at cursor
    Given pinned input w/ text "hello"
    And STT emits final "world"
    When usr clicks mid-text before "world"
    Then "world" inserted at cursor
    And not at end

  Scenario: VOX-08 edit over highlight
    Given input w/ text "hello"
    When usr highlights "hello"
    And types "goodbye"
    Then "hello" replaced by "goodbye"
    And voice continues at cursor

  Scenario: VOX-09 enter sends
    Given input w/ text
    When usr presses Enter
    Then send spy called once

  Scenario: VOX-10 shift-enter newline
    Given input focused
    When usr presses Shift+Enter
    Then newline in value
    And send spy NOT called

  Scenario: VOX-11 click-out keeps recording
    Given pinned input rec active
    When usr clicks canvas
    Then tooltip hidden
    And STT still streaming

  Scenario: VOX-12 click stops
    Given mic rec active
    When usr clicks mic btn
    Then STT stopped

  Scenario: VOX-13 click resumes appends
    Given mic stopped w/ text "hello"
    When usr clicks mic btn
    Then STT resumed
    And new text appended at end

  Scenario: VOX-14 dblclick sends
    Given content present in input
    When usr dblClicks bubble
    Then send spy called

  Scenario: VOX-15 dbl-right-click sends
    Given content present in input
    When usr dblClicks w/ MouseRight
    Then send spy called

  Scenario: VOX-16 debounced prompt file
    Given input w/ text "hello"
    When usr types
    And waits 2s debounce
    Then writer spy called once w/ text
    And path under .prompts folder

  Scenario: VOX-17 pinned survives unhover
    Given tooltip pinned
    When usr moves pointer away
    Then tooltip still open
    And bubble still breathing class

  Scenario: VOXC-03 stt error preserves text
    Given input w/ text "hello"
    When STT engine errors
    Then status visible near input
    And text intact in prompt file

  Scenario: VOXC-04 single recorder
    Given rec active on Node A
    When usr clicks Node B mic btn
    Then Node A stopped cleanly
    And Node B sole recorder

  Scenario: VOXC-05 empty send noop
    Given input empty
    When usr dblClicks bubble
    Then send spy NOT called
    And shake affordance class applied
