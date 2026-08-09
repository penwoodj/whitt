Feature: Agentic todo cycle hook
  As sim
  I want 3 todos cycle over 3s
  So usr sees agent work

  Scenario: Initial state all queued
    Given useAgenticTodoCycle invoked
    When returns
    Then todos = [research/draft/verify] all status='queued'
    And isCycleDone = false

  Scenario: Start cycle runs each todo
    Given hook w/ initial todos
    When startCycle called
    Then 'research web' status='running' (1s)
    And after 1s: 'research web'='done', 'draft outline'='running' (1s)
    And after 2s: 'draft outline'='done', 'verify + cite'='running' (1s)
    And after 3s: all 'done', isCycleDone=true

  Scenario: Cycle done triggers callback
    Given cycle running
    When 3s pass
    Then onCycleDone callback fires
