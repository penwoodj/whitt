Feature: Intervention gesture
  As usr watching agent run
  I want interrupt agent mid-execution w/ correction
  So I redirect agent w/out stopping whole run

  Scenario: AGT-05 intervene - correction queue
    Given agent executing on node n1
    When usr opens node n1 and types correction
    Then correction queued to agent conversation
    And queue preserves order (first-in-first-out)

  Scenario: AGTC-03 intervention path - status interruption
    Given agent running (status=executing)
    When usr sends correction intervention
    Then execution status reflects interruption (paused/interrupted)
    And status bar shows "Interrupted by user"

  Scenario: AGTC-03 intervention path - no surface block
    Given agent executing
    When usr opens node (EXP) + speaks/types
    Then input surface remains responsive
    And usr can send correction (input not blocked)

  Scenario: AGTC-03 intervention path - stop button
    Given agent executing in expanded modal
    When usr clicks stop button
    Then execution halts immediately
    And status shows "Stopped by user"