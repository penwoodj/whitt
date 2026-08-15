Feature: App shell layout
  As usr on graph app
  I want consistent layout w/ sidebar + topbar + main
  So app UI stable across pages

  Scenario: Render full layout
    Given AppShell w/ sidebar + topbar + children
    When component renders
    Then sidebar spans full height left
    And topbar spans width right top
    And children fills remaining space

  Scenario: Render without sidebar
    Given AppShell w/ topbar + children only
    When component renders
    Then topbar spans full width top
    And children fills remaining space

  Scenario: Render without topbar
    Given AppShell w/ sidebar + children only
    When component renders
    Then sidebar spans full height left
    And children fills remaining space

  Scenario: Render with children only
    Given AppShell w/ children only
    When component renders
    Then children fills full space

  Scenario: APP-01 opens new project
    Given AppShell mounted w/o active project
    When component renders
    Then single white bubble rendered in canvas
    And project picker hidden

  Scenario: APP-02 rail fixed
    Given AppShell w/ project rail visible
    When usr pans canvas hard right
    Then rail still at left edge
    And rail unaffected by canvas pan/zoom

  Scenario: APP-03 project letter bubbles
    Given AppShell w/ seeded projects A, B, C
    When component renders
    Then shows one letter bubble per project
    And letters match project titles

  Scenario: APP-04 new project blank
    Given AppShell w/ new project button
    When usr clicks new bubble
    Then title empty
    And no letter glyph shown

  Scenario: APPC-02 empty rail
    Given AppShell w/ zero projects
    When component renders
    Then only new-project bubble visible
    And no list chrome shown

  Scenario: APP-05 title inline edit
    Given AppShell w/ project icon
    When usr clicks title
    And usr types "Deep Work"
    And usr blurs
    Then title text updated
    And rail letter now "D"

  Scenario: APP-06 select loads graph
    Given AppShell w/ project rail
    When usr clicks project bubble B
    Then mock loader called w/ B
    And nodes of B rendered

  Scenario: APP-07 fresh session
    Given AppShell w/ project B loaded
    When usr clicks new bubble
    Then canvas reset to single bubble

  Scenario: APPC-01 rail scrolls
    Given AppShell w/ 30 projects seeded
    When component renders
    Then rail scrollable
    And selected stays visible

  Scenario: APPC-03 load failure
    Given AppShell w/ project loading
    When mock loader rejects
    Then error region visible w/ cause
    And retry clickable
