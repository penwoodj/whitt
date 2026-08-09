Feature: Markdown highlight menu
  As usr reading markdown
  I want expand/refine menu on text select
  So I grow graph from selected text

  Scenario: Menu shows on text select
    Given MarkdownHighlightMenu w/ selected text "React Flow"
    And position { x: 100, y: 200 }
    When component renders
    Then menu visible at position
    And shows Expand btn
    And shows Refine btn

  Scenario: Menu hidden when no selection
    Given MarkdownHighlightMenu w/ empty selected text
    When component renders
    Then menu not visible

  Scenario: Click Expand calls onExpand
    Given MarkdownHighlightMenu w/ selected text "React Flow"
    When usr clicks Expand btn
    Then onExpand called with "React Flow"
    And onClose called

  Scenario: Click Refine calls onRefine
    Given MarkdownHighlightMenu w/ selected text "React Flow"
    When usr clicks Refine btn
    Then onRefine called with "React Flow"
    And onClose called

  Scenario: Click outside calls onClose
    Given MarkdownHighlightMenu visible
    When usr clicks outside menu
    Then onClose called
