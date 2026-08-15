Feature: Confirm dialog
  As user about to execute workflow
  I want confirm dialog with YAML visualization
  So I can review workflow before executing

  Scenario: EXEC-01 confirm shows yaml
    Given confirm dialog opens
    When dialog renders
    Then same YAML component as EXE-06 displayed
    And testid matches visualizer
    And execute button available
    And cancel button available