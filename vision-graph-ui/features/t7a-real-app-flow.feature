Feature: Real app execution to file preview
  As usr on graph
  I want send prompt run node to done
  So I can inspect and edit result file

  Scenario: Send starts deterministic run
    Given usr opened project graph
    When usr opens node composer and sends prompt
    Then node shows running state
    And execution panel shows active step

  Scenario: Completion expands done node
    Given node run started
    When completion event arrives
    Then node shows done state
    And expanded node shows execution panel
    And expanded node shows file preview

  Scenario: File write reaches preview
    Given completed run emitted file write
    When preview renders
    Then preview shows generated markdown

  Scenario: User edits and saves preview
    Given expanded done node shows file preview
    When usr edits markdown and saves
    Then preview shows saved markdown
