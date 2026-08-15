Feature: FsPort bridge interface (E3 owns impl)
  As agent runtime bridge
  I want FsPort interface for filesystem operations
  So E3 implements real FS adapter

  Scenario: FsPort interface defines write() contract
    Given FsPort interface
    Then write() method accepts path and content
    And returns Promise<void>

  Scenario: FsPort interface defines read() contract
    Given FsPort interface
    Then read() method accepts path
    And returns Promise<string>

  Scenario: FsPort interface defines delete() contract
    Given FsPort interface
    Then delete() method accepts path
    And returns Promise<void>
