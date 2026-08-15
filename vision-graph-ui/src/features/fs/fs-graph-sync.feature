Feature: FsGraphSync orchestrator (wire queue+commit+watcher+port)
  As FS sync layer
  I want orchestrator wiring queue+commit+watcher+port
  So sync layer works as unified system

  Scenario: Sync write flows through queue to commit
    Given FsGraphSync w/ FakeFsPort
    When sync writes "test.md" w/ "content"
    Then write queued
    And after flush, file written via port
    And commit created via CommitBuilder

  Scenario: External change triggers reload via watcher
    Given FsGraphSync watching "/"
    When external file "test.md" changes
    Then watcher detects change
    And reload callback emitted

  Scenario: Port injection allows fake for Storybook
    Given FsGraphSync instantiated w/ FakeFsPort
    When sync writes "test.md"
    Then file written to in-mem store
    And not written to real FS

  Scenario: Multiple components can use same sync instance
    Given FsGraphSync instance
    When component A writes "a.md"
    And component B writes "b.md"
    Then both writes handled by same queue
    And single commit contains both files
