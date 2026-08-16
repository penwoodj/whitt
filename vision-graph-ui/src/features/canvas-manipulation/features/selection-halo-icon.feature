Feature: Selection halo + icon outside border
  As usr working with selected nodes
  I want selection halo with + icon outside border
  I want tooltip menu with actions on hover/click
  So I can quickly access group actions

  Scenario: Selection halo surrounds selected nodes
    Given 3+ nodes selected
    When selection is active
    Then selection halo border surrounds all selected nodes
    And halo has dashed border style
    And halo bounds enclose all selected nodes

  Scenario: + icon appears outside halo border on hover
    Given nodes selected forming a group
    When usr hovers over selection
    Then + icon appears in upper right corner OUTSIDE of halo border
    And + icon is a circular button with plus sign
    And + icon has blue border and background

  Scenario: + icon appears outside halo border on click
    Given nodes selected forming a group
    When usr clicks on selection
    Then + icon appears in upper right corner OUTSIDE of halo border
    And + icon stays visible after click

  Scenario: + icon tooltip menu appears on hover
    Given nodes selected with + icon visible
    When usr hovers over + icon
    Then tooltip menu appears with actions
    And menu includes "Make Folder" action
    And menu includes "Speak to Selected" action
    And menu includes other selection actions

  Scenario: + icon tooltip menu appears on click
    Given nodes selected with + icon visible
    When usr clicks on + icon
    Then tooltip menu appears with actions
    And menu includes "Make Folder" action
    And menu includes "Speak to Selected" action
    And menu includes other selection actions
