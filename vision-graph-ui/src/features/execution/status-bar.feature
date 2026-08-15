Feature: Status bar card
  As user viewing execution state
  I want minimal status card with text + loader
  So I see execution progress without clutter

  Scenario: EXE-09 status card minimal
    Given execution area expanded
    When status card renders
    Then rounded card displayed
    And card contains only status text
    And card contains only loader

  Scenario: EXE-10 hover affordance
    Given status card displayed
    When user hovers card
    Then color shifts on hover
    And tooltip opens on hover

  Scenario: EXE-13 only text+loader
    Given status card displayed
    When card renders
    Then no third content type in card
    And DOM audit shows only text + loader

  Scenario: EXEC-02 title truncation
    Given status card with long step title
    When card renders
    Then title shows ellipsis at card edge
    And hovering title shows full text