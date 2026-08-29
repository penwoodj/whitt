Feature: FS→graph projection
  As usr editing files externally
  I want external edits project to graph automatically
  So FS = source of truth, graph stays in sync

  Scenario: AGT-06 fs projects to graph - file write → node appear
    Given agent writes file via mock agent
    When FS write completes
    Then corresponding node appears in graph (loader→graph sync)
    And node title matches filename

  Scenario: AGT-06 fs projects to graph - file write → node update
    Given node n1 exists in graph (from file n1.md)
    When agent writes updated content to n1.md
    Then node n1 updates in graph (bodyMarkdown refreshed)
    And node shows latest content

  Scenario: AGT-06 fs projects to graph - FS wins conflict rule
    Given node n1 has content A in memory
    And external editor writes content B to n1.md
    When watcher detects external change
    Then graph reloads node n1 w/ content B (FS wins)
    And memory state discarded