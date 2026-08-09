Feature: Top bar controls
  As usr on graph
  I want top bar w/ sync + time travel + settings
  So I control graph state

  Scenario: Render top bar elements
    Given TopBar w/ title "My Graph"
    When component renders
    Then shows graph title
    And shows sync btn
    And shows time travel ctrl
    And shows settings gear

  Scenario: Sync btn shows status
    Given TopBar w/ sync status "synced"
    When component renders
    Then sync btn shows "Synced just now"

  Scenario: Sync btn shows spinner when syncing
    Given TopBar w/ sync status "syncing"
    When component renders
    Then sync btn shows spinner

  Scenario: Time travel ctrl disabled when cannot travel
    Given TopBar w/ canTravelBack false
    When component renders
    Then back btn disabled
    And forward btn disabled

  Scenario: Time travel ctrl enabled when can travel
    Given TopBar w/ canTravelBack true
    When component renders
    Then back btn enabled
    And forward btn enabled

  Scenario: Click sync calls onSync
    Given TopBar rendered
    When usr clicks sync btn
    Then onSync called

  Scenario: Click travel back calls onTravelBack
    Given TopBar w/ canTravelBack true
    When usr clicks back btn
    Then onTravelBack called

  Scenario: Click travel forward calls onTravelForward
    Given TopBar w/ canTravelForward true
    When usr clicks forward btn
    Then onTravelForward called

  Scenario: Click settings gear calls onOpenSettings
    Given TopBar rendered
    When usr clicks settings gear
    Then onOpenSettings called
