Feature: GraphSim execution preview
  As usr on graph
  I want send run finish w/ file preview
  So I inspect and save agent output

  Scenario: Send expands execution panel
    Given loaded graph node w/ prompt dialog open
    When usr sends prompt
    Then expanded execution panel shows running step

  Scenario: Done run shows actual file preview
    Given sent graph prompt
    When run emits done file
    Then expanded panel shows generated markdown
    And FilePreview shows Edit control

  Scenario: App preview edits save
    Given completed graph run w/ generated markdown
    When usr clicks Edit then Save
    Then FilePreview returns to preview mode
