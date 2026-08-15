Feature: FsPort interface + fake implementation
  As FS sync layer
  I want injectable filesystem port abstraction
  So Storybook uses in-mem fake, app uses real FS

  Scenario: FakeFsPort reads file from in-mem store
    Given FakeFsPort w/ file "test.md" containing "# Test"
    When port reads "test.md"
    Then file content returned
    And content equals "# Test"

  Scenario: FakeFsPort writes file to in-mem store
    Given FakeFsPort
    When port writes "new.md" w/ content "# New"
    Then file stored in memory
    And port reads "new.md" returns "# New"

  Scenario: FakeFsPort lists directory contents
    Given FakeFsPort w/ files "a.md", "b.md", "c.md"
    When port lists dir "/"
    Then returns 3 files
    And contains "a.md", "b.md", "c.md"

  Scenario: FakeFsPort watch emits events on write
    Given FakeFsPort w/ watch callback
    When port writes "watched.md" w/ "changed"
    Then callback emits "change" event
    And event contains path "watched.md"

  Scenario: FakeFsPort overwrites existing file
    Given FakeFsPort w/ file "overwrite.md" containing "old"
    When port writes "overwrite.md" w/ "new"
    Then file content becomes "new"
    And port reads "overwrite.md" returns "new"

  Scenario: FakeFsPort read missing file throws
    Given FakeFsPort
    When port reads "missing.md"
    Then error thrown
    And error message contains "missing.md"
