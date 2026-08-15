Feature: GraphSim wiring (consume FsGraphSync for edit flows)
  As graph simulation UI
  I want GraphSim wired to FsGraphSync for edit flows
  So user edits persist to FS via queue+commit

  Scenario: Node title edit triggers queue write
    Given GraphSim w/ FsGraphSync instance
    When user edits node title to "New Title"
    Then sync.write called w/ node path and new content
    And write queued for debounce

  Scenario: Flush on component unmount writes to FS
    Given GraphSim w/ pending edits in queue
    When component unmounts
    Then sync.flush called
    And file written via FsPort

  Scenario: External change triggers node reload
    Given GraphSim watching for external changes
    When external file edited
    Then reload callback triggered
    And node content updated

  Scenario: Multiple edits coalesce into single commit
    Given GraphSim w/ FsGraphSync
    When user makes 3 rapid edits to same node
    Then single flush w/ final content
    And single git commit created
