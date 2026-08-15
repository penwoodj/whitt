Feature: Execution state derivation
  As UI consuming agent event stream
  I want derive execution state from AgentEvt events
  So I show busy nodes, step titles, error states

  Scenario: EXE-11 edges breathe
    Given agent event stream with run-start + step-start events
    When deriving execution state
    Then busy node set contains running node
    And step title maps to correct node

  Scenario: EXE-15 step title changes
    Given agent event stream with 3 sequential step events
    When deriving execution state
    Then step title updates to latest step-start
    And previous step titles replaced

  Scenario: EXE-16 panel live
    Given agent event stream with mixed events
    When deriving execution state continuously
    Then state updates without full re-render
    And busy set recalculates on new events

  Scenario: EXEC-04 step error
    Given agent event stream with step-error event
    When deriving execution state
    Then error state contains failed step
    And error message preserved
    And retry state available

  Scenario: EXEC-05 completion
    Given agent event stream ending with run-done
    When deriving execution state
    Then busy set empty after run-done
    And final status marked done
    And completion state cleared
