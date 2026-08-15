Feature: Fake runtime + JSONL fixtures
  As agent runtime bridge
  I want fake runtime playing JSONL event scripts
  So UI tests agent behavior without live engine

  Scenario: load JSONL fixture parses all lines
    Given JSONL fixture file with 5 events
    When load fixture
    Then 5 events parsed
    And each event valid AgentEvt

  Scenario: play() emits events at recorded timestamps
    Given loaded JSONL fixture with timestamps
    When play() called
    Then events emitted at correct relative delays
    And all events received in order

  Scenario: abort() stops emission mid-script
    Given loaded JSONL fixture with 10 events
    When play() started
    And abort() called after 3 events
    Then only first 3 events emitted
    And remaining 7 events NOT emitted

  Scenario: malformed JSONL line throws parse error
    Given JSONL fixture with invalid JSON on line 3
    When load fixture
    Then parse error thrown
    And error message includes line number
