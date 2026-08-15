Feature: Busy-set reducer (startButNotFinished derivation)
  As agent runtime bridge
  I want derive busy node set from events
  So UI shows running state (EXE-10/11/14/15)

  Scenario: empty events → empty busy set
    Given empty event list
    When derive busy node IDs
    Then result is empty set

  Scenario: run-start adds node to busy set
    Given event list with run-start for node n1
    When derive busy node IDs
    Then n1 is in busy set
    And set size is 1

  Scenario: step-done removes node from busy set
    Given event list with run-start then step-done for node n1
    When derive busy node IDs
    Then n1 is NOT in busy set
    And set is empty

  Scenario: step-error removes node from busy set
    Given event list with run-start then step-error for node n1
    When derive busy node IDs
    Then n1 is NOT in busy set
    And set is empty

  Scenario: multiple runs tracked independently
    Given event list with run-start for n1 and n2
    And step-done for n1 only
    When derive busy node IDs
    Then n1 is NOT in busy set
    And n2 is in busy set
    And set size is 1
