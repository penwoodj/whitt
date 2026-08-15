Feature: Event bus w/ generation counters (n8n stale-handler guard)
  As agent runtime bridge
  I want pub/sub event bus w/ stale-handler protection
  So UI doesn't react to events from outdated handlers

  Scenario: emit broadcasts to all subscribers
    Given event bus with 3 subscribers
    When event emitted
    Then all 3 subscribers receive event
    And subscribers receive in subscription order

  Scenario: subscribers receive events in order
    Given event bus with subscriber
    When 3 events emitted in sequence
    Then subscriber receives all 3 events
    And events arrive in emit order

  Scenario: stale handlers skipped when generation counter mismatch
    Given event bus at generation 5
    And subscriber registered at generation 3
    When event emitted
    Then stale subscriber does NOT receive event
    And bus increments generation to 6

  Scenario: unsubscribe removes handler
    Given event bus with 2 subscribers
    When first subscriber unsubscribes
    And event emitted
    Then only remaining subscriber receives event
