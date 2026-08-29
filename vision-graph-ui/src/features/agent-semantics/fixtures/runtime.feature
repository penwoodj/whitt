Feature: Fake runtime fixtures
  As dev validating agent semantics in Storybook
  I want JSONL fixtures emitting realistic AgentEvt sequences
  So stories replay real agent behavior without real execution

  Scenario: AGT-01 default context - fixture emits
    Given AGT-01 fixture loaded
    When FakeRuntime plays
    Then graph-mutation with spawn op emitted
    And busy set tracks n1 during run

  Scenario: AGTC-01 event vocabulary - 7-op complete
    Given AGTC-01 fixture loaded
    When FakeRuntime plays
    Then spawn + edit + move ops emitted in sequence
    And each op has canonical animation class

  Scenario: AGTC-02 spawn placement - crowd-aware offset
    Given AGTC-02 fixture loaded (2 children)
    When FakeRuntime plays
    Then spawn n2 at angle 0
    And spawn n3 at angle π/2 (offset from sibling)

  Scenario: AGTC-03 intervention path - clean stop
    Given AGTC-03 fixture loaded
    When FakeRuntime plays
    Then run completes without interruption
    And surface remained responsive