Feature: Graph integration - end-to-end agent run → graph updates
  As usr watching agent work
  I want full agent lifecycle reflected in graph
  So I see real-time progress + final state

  Scenario: AGT-04..06 end-to-end - agent run → graph updates
    Given agent runs on node n1
    And agent spawns child node n2
    And agent moves node n2
    And agent writes file to n1
    When agent execution completes
    Then graph shows n2 spawned (fade+settle)
    And n2 moved to new position (shift animation)
    And n1 updated w/ new content (pulse)
    And FS reflects all changes (agent wrote files)

  Scenario: Integration - all hooks wired together
    Given useAgentEvtStream derives busy-set
    And useGraphMutationHandler maps events → animations
    And useAgentContext resolves prompts to nodes
    When agent emits sequence of events
    Then busy nodes glow
    And mutations animate correctly
    And prompts resolve to context nodes