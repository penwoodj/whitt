Feature: Editable Deterministic Group Titles

  Scenario: User edits soft group title
    Given soft group node exists
    When user edits group title to "My Custom Group"
    Then title stored as "my-custom-group" (dash-case lowercase)
    And title persisted to localStorage
    And title persisted to .whitt folder in closest parent node folder

  Scenario: User edits hard group title
    Given hard group node exists (folder-based)
    When user edits group title to "Project Documents"
    Then title stored as "project-documents" (dash-case lowercase)
    And folder renamed to "project-documents"
    And title persists across sessions

  Scenario: Title persists across sessions for soft group
    Given soft group with title "existing-group" saved to localStorage and .whitt
    When page reloads
    Then soft group title displays as "existing-group"
    And dash-case formatting preserved

  Scenario: Title persists across sessions for hard group
    Given hard group folder named "archive-folder" exists
    When page reloads
    Then hard group title displays as "archive-folder"
    And folder name unchanged
