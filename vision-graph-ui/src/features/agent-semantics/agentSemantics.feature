Feature: Default context resolution
  As usr talking to graph via voice
  I want prompt w/out explicit ref default to spoken-to node
  So deictic language works ("make this clearer")

  Scenario: AGT-01 default context - spoken-to node
    Given usr focused on node n1 (node box expanded)
    And usr sends prompt w/out explicit node ref
    When useAgentContext resolves prompt
    Then prompt payload includes contextNodeId=n1
    And linkedNodeIds empty (no linked refs)

  Scenario: AGT-02 linked edit allowed
    Given usr focused on node n1
    And n1 has child link to node n2
    And usr prompt mentions "the child node" by ref
    When useAgentContext resolves prompt
    Then prompt payload includes contextNodeId=n1
    And linkedNodeIds includes n2 (linked ref resolved)
    And write allowed on both nodes

  Scenario: AGT-03 initial one file - single node init
    Given fresh graph w/ root node only
    And usr sends first prompt on root node
    When useAgentContext resolves prompt
    Then prompt payload has exactly 1 contextNodeId
    And linkedNodeIds empty
    And agent creates exactly 1 file (no multi-file blast)