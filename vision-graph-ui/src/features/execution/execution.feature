Feature: ExecutionPanel live updates + tooltips
  As user watching workflow execution
  I want ExecutionPanel with live tooltips + file previews
  So I can monitor progress without reopening panels

  Scenario: EXE-04 hover yaml tooltip
    Given ExecutionPanel with workflow rendered
    When user hovers over execution panel
    Then tooltip appears on right side with YamlWorkflowVisualizer
    And tooltip contains workflow tree structure

  Scenario: EXE-05 tooltip pins
    Given ExecutionPanel with visible tooltip
    When user clicks tooltip pin button
    Then tooltip stays visible after mouse leaves
    And pin button shows close icon

  Scenario: EXE-15 step title changes
    Given ExecutionPanel with workflow
    When three step-start events fire with different titles
    Then step title updates to match latest step-start event
    And MorphingLoader shows running state

  Scenario: EXE-16 panel live
    Given ExecutionPanel with active execution
    When events arrive with delays between them
    Then panel content updates without requiring reopen
    And status reflects latest event state

  Scenario: EXE-17 file preview on create
    Given ExecutionPanel with active execution
    When file-write event fires
    Then preview area appears with file path
    And preview shows file content placeholder

  Scenario: EXEC-04 step error
    Given ExecutionPanel with active execution
    When step-error event fires
    Then error banner displays with failed step name
    And retry button appears
    And status shows error state

  Scenario: EXEC-05 completion
    Given ExecutionPanel with running execution
    When run-done event fires with status done
    Then MorphingLoader stops spinning
    And done glow animation fades
    And final title shows completion status
    And preview shows final state