Feature: Debounced File System Reflection

  Scenario: Graph changes reflect to folder structure on debounce
    Given graph with live active memory in localStorage
    When user makes changes to group structure
    Then changes reflected in folder structure after debounce delay
    And live active memory graph provides immediate speed
    And file system sync occurs after debounce delay

  Scenario: Multiple rapid changes batch into single FS sync
    Given graph with live active memory in localStorage
    When user makes multiple rapid changes to group structure within debounce window
    Then only one file system sync occurs after debounce delay
    And all changes are included in the batched sync

  Scenario: Debounce delay uses ADR-0011 default (2s)
    Given graph with live active memory in localStorage
    When user makes changes to group structure
    Then file system sync occurs after 2 second delay
    And live active memory updates immediately

  Scenario: Live active memory persists across page reloads
    Given graph with live active memory in localStorage
    When user makes changes to group structure
    And page reloads before debounce delay expires
    Then changes are preserved in live active memory
    And file system sync continues after reload
