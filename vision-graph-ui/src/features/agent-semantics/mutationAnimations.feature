Feature: Graph mutation event projection
  As usr watching graph during agent run
  I want agent mutations appear as graph movement
  So I see real-time agent work (not jump cuts)

  Scenario: AGTC-01 event vocabulary - 7-op animation mapping
    Given agent emits spawn mutation
    When useGraphMutationHandler processes event
    Then spawn maps to fade+settle animation
    And new node appears w/ animation class

  Scenario: AGTC-01 event vocabulary - edit pulse
    Given agent emits edit mutation
    When useGraphMutationHandler processes event
    Then edit maps to pulse animation
    And affected node glows briefly

  Scenario: AGTC-01 event vocabulary - move shift
    Given agent emits move mutation
    When useGraphMutationHandler processes event
    Then move maps to shift animation
    And node slides to new position

  Scenario: AGTC-01 event vocabulary - group halo
    Given agent emits group mutation
    When useGraphMutationHandler processes event
    Then group maps to halo animation
    And nodes enclosed w/ visual halo

  Scenario: AGTC-01 event vocabulary - detach fade
    Given agent emits detach mutation
    When useGraphMutationHandler processes event
    Then detach maps to fade-out animation
    And node fades from view

  Scenario: AGTC-01 event vocabulary - link draw
    Given agent emits link mutation
    When useGraphMutationHandler processes event
    Then link maps to draw animation
    And new edge drawn smoothly

  Scenario: AGTC-01 event vocabulary - unlink erase
    Given agent emits unlink mutation
    When useGraphMutationHandler processes event
    Then unlink maps to erase animation
    And edge fades out

  Scenario: AGT-04 mutations as movement
    Given sequence of spawn+move mutations emitted
    When useGraphMutationHandler processes events
    Then nodes animate to new state (position delta observed)
    And no teleport (smooth transition)