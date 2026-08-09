Feature: New project modal
  As usr
  I want new project modal w/ name + folder
  So I create fresh graph

  Scenario: Closed by default
    Given NewProjectModal rendered
    When usr views
    Then modal hidden

  Scenario: Open shows form
    Given NewProjectModal isOpen=true
    When rendered
    Then name input visible
    And folder input visible
    And Create btn disabled (validation)

  Scenario: Valid input enables Create
    Given modal open w/ empty inputs
    When usr types name "My Graph" + folder "/tmp/graph"
    Then Create btn enabled

  Scenario: Create calls onCreate
    Given modal open w/ valid inputs
    When usr clicks Create
    Then onCreate called w/ {name, folder}

  Scenario: Cancel dismisses
    Given modal open
    When usr clicks Cancel
    Then onCancel called
