Feature: T7b composed graph surfaces
  As usr on graph
  I want context, execution, agent, and GitSync surfaces
  So I can run, inspect, retry, and continue work

  Scenario: Context pills support remove jump send
    Given app graph node has source context pill
    When usr removes pill
    Then pill leaves composer
    When usr jumps to pill
    Then app records pill jump
    When usr sends prompt
    Then payload includes prompt and pill context

  Scenario: Run start shows loading
    Given app graph node has prompt
    When usr starts execution
    Then execution loading shows running

  Scenario: Step error supports retry
    Given execution step fails
    Then error banner shows failure
    And retry btn shows
    When usr clicks retry btn
    Then execution loading shows running

  Scenario: Confirmation gates execution
    Given app graph node has prompt
    When usr opens execution confirmation
    Then confirmation dialog shows
    When usr confirms execution
    Then execution loading shows running

  Scenario: Agent context follows execution events
    Given execution starts on graph node
    Then agent status shows Running
    And agent context shows node title

  Scenario: GitSync unavailable keeps graph interactive
    Given GitSync is unavailable
    Then Git unavailable shows
    And graph node remains expandable
