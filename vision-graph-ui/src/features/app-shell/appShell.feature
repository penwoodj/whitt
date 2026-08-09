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
