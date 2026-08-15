Feature: YAML workflow visualizer
  As user viewing workflow
  I want see YAML as colored tree
  So I understand structure quickly

  Scenario: EXE-06 yaml visualizer
    Given YAML workflow content
    When visualizer renders
    Then YAML shown as tree structure
    And root node visible
    And nested sections indented

  Scenario: EXE-07 colored expandable
    Given YAML workflow with multiple sections
    When visualizer renders
    Then section colors differ
    And collapse/expand toggles work
    And expand shows children

  Scenario: EXE-08 dense padding
    Given nested YAML structure
    When visualizer renders
    Then indent uses minimal token
    And inter-element gap minimal
    And compact layout maintained

  Scenario: EXEC-01 confirm shows yaml
    Given YAML workflow in confirm dialog
    When dialog opens
    Then same component as EXE-06
    And testid matches visualizer

  Scenario: EXEC-03 yaml failure
    Given invalid YAML content
    When visualizer renders
    Then inline error shown
    And raw text displayed
    And execute disabled
