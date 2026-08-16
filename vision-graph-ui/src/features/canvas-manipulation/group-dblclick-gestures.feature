Feature: Double-click Group Gestures

  Scenario: Double-right-click expands group without recording
    Given group node (soft or hard) exists
    When user double-right-clicks the group
    Then group node expands to show contents
    And expansion shows group detail panel
    And speech-to-text recording NOT started
    And gesture works whether node expanded or not

  Scenario: Double-left-click expands group and starts recording
    Given group node (soft or hard) exists
    When user double-left-clicks the group
    Then group node expands to show contents
    And speech-to-text recording starts
    And STT tooltip appears in upper right-hand corner around the node
    And recording works whether node expanded or not
