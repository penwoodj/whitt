Feature: Prompt file writer (.prompts persistence)
  As FS sync layer
  I want .prompts/<ts>-<slug>.md persistence w/ frontmatter
  So prompt audit trail never deleted

  Scenario: Write prompt file with correct path
    Given PromptFileWriter for node "test-node" in directory "topic/"
    When writer writes prompt "test prompt"
    Then file created at "topic/.prompts/<ts>-test-node.md"
    And file contains YAML frontmatter w/ nodeId

  Scenario: Frontmatter includes metadata
    Given PromptFileWriter for node "node-123" created at "2026-08-15T00:00:00Z"
    When writer writes prompt "prompt text"
    Then frontmatter contains nodeId: "node-123"
    And frontmatter contains createdAt: "2026-08-15T00:00:00Z"

  Scenario: Prompt body preserved in file
    Given PromptFileWriter
    When writer writes prompt "# Header\n- List item"
    Then file body contains "# Header\n- List item"

  Scenario: Multiple prompts create multiple files
    Given PromptFileWriter for node "test-node"
    When writer writes prompt "first"
    And writer writes prompt "second" 1s later
    Then two .prompts files exist
    And files have different timestamps

  Scenario: Prompt files never deleted
    Given PromptFileWriter with existing prompts
    When new prompt written
    Then old prompt files still exist
    And no files deleted
