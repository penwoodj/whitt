Feature: Project picker sidebar
  As usr on graph
  I want select project from left sidebar
  So I work on specific whitt folder

  Scenario: Render project list
    Given ProjectPicker w/ projects A, B, C
    When component renders
    Then shows 3 project icons
    And each icon shows single letter
    And NewProjectBtn at bottom

  Scenario: Active project highlighted
    Given ProjectPicker w/ active project B
    When component renders
    Then project B shows active border
    And other projects show no border

  Scenario: Click project calls onSelect
    Given ProjectPicker w/ project A
    When usr clicks project A icon
    Then onSelect called with project A id

  Scenario: Click new project calls onNew
    Given ProjectPicker rendered
    When usr clicks NewProjectBtn
    Then onNew called

  Scenario: ProjectIcon hover state
    Given ProjectIcon rendered
    When usr hovers over icon
    Then background becomes lighter
    When hover ends
    Then background restored
