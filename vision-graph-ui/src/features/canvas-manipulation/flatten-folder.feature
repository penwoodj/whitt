Feature: Flatten Folder Action

  Scenario: Flatten Folder action moves children to parent level
    Given hard group folder with contents exists
    When user invokes "Flatten Folder" action from + icon menu
    Then folder structure removed
    And all member files moved to parent level
    And group reverts to soft group state
    Or group dissolved (if no members remain)

  Scenario: Flatten Folder dissolves empty group
    Given hard group folder with only one file exists
    When user invokes "Flatten Folder" action from + icon menu
    Then folder structure removed
    And file moved to parent level
    And group dissolved (no soft group remains)

  Scenario: Flatten Folder converts hard group to soft group
    Given hard group folder with multiple files exists
    When user invokes "Flatten Folder" action from + icon menu
    Then folder structure removed
    And all member files moved to parent level
    And group converted to soft group with same members
    And soft group visuals persist (halo, border)
