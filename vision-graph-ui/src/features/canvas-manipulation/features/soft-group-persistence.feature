Feature: Soft group dual persistence
  As usr working on graph canvas
  I want soft groups persisted to localStorage + .whitt folder
  So groups survive page reload

  Scenario: Soft group persists to localStorage
    Given canvas w/ 3 nodes selected
    When usr creates soft group
    Then group saved to localStorage
    And group has correct bounds + member IDs

  Scenario: Soft group persists to .whitt folder
    Given canvas w/ 3 nodes selected in same parent folder
    When usr creates soft group
    Then group saved to .whitt/groups.json in closest parent folder
    And group structure includes bounds + member IDs + type: 'soft'

  Scenario: Soft group loads from localStorage on init
    Given localStorage has saved soft group
    When canvas initializes
    Then soft group restored from localStorage
    And group bounds + members match saved state

  Scenario: Soft group loads from .whitt folder on init
    Given .whitt/groups.json has saved soft group
    When canvas initializes
    Then soft group restored from .whitt folder
    And group bounds + members match saved state

  Scenario: Soft group dual persistence reload works
    Given canvas w/ 3 nodes selected
    When usr creates soft group
    And page reloads
    Then soft group visible in both localStorage + .whitt folder
    And group renders w/ correct bounds + members
