Feature: fsGraphLoader repair (inject FsPort, fix 7 test failures)
  As FS sync layer
  I want repair fsGraphLoader w/ FsPort injection
  So 7 pre-existing test failures go green

  Scenario: Inject FakeFsPort for testing
    Given fsGraphLoader accepts FsPort parameter
    When FakeFsPort provided instead of ?raw imports
    Then loader uses port.readFile
    And tests pass with in-mem data

  Scenario: Fix YAML children array parsing
    Given YAML with children array:
      children:
        - child1.md
        - child2.md
    When parseMd processes YAML
    Then children field equals ["child1.md", "child2.md"]
    And not empty array

  Scenario: Fix status→lifecycle mapping
    Given FsNode with status = "done"
    When convertToFlowNodes processes node
    Then lifecycle field equals "done"
    And not "initial"

  Scenario: Fix edge building from children array
    Given nodes with parent/children relationships
    When buildGraphData processes nodes
    Then edges array not empty
    And edges connect parent to children correctly

  Scenario: Fix radial layout child positioning
    Given parent node with 3 children
    When calculateRadialLayout positions nodes
    Then children positioned at correct distance
    And distance less than 300

  Scenario: Maintain existing functionality after repair
    Given all 7 failures fixed
    When all fsGraphLoader tests run
    Then 14/14 tests pass
    And no regressions introduced
