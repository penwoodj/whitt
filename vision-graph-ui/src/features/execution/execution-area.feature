Feature: Execution area + launch gestures
  As user wanting to execute workflow
  I want execution area below bar of light with launch gestures
  So I can start workflow execution quickly or with confirmation

  Scenario: EXE-01 area present
    Given node with execution capability
    When execution area renders
    Then area displayed below bar of light
    And workflow summary visible

  Scenario: EXE-02 dbl-left executes
    Given execution area displayed
    When user double-left-clicks execution area
    Then execution starts immediately
    And exec start spy called

  Scenario: EXE-03 dbl-right confirms
    Given execution area displayed
    When user double-right-clicks execution area
    Then confirm dialog opens with YAML
    And execution not started until confirm