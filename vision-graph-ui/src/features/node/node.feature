Feature: Node slice
  As usr on graph
  I want Node w/ mic btn + prompt + todos + detail
  So I talk to graph + see agent work

  Scenario: Mic btn toggles rec
    Given Node w/ mic btn off
    When usr clicks mic btn
    Then mic btn shows stop icon
    And txt streams to prompt area

  Scenario: Prompt send on Enter
    Given Node w/ prompt txt "hello"
    When usr presses Enter in prompt
    Then onSend called w/ "hello"
    And prompt cleared

  Scenario: Todos dropdown expand
    Given Node w/ todos collapsed
    When usr clicks expand btn
    Then todos list visible
    And shows >=1 placeholder todo

  Scenario: Status badge reflects state
    Given Node in <state>
    When Node renders
    Then badge color is <color>
    Examples:
      | state      | color       |
      | idle       | gray        |
      | recording  | red pulse   |
      | running    | blue pulse  |
      | done       | green       |

  Scenario: Tooltip on hover
    Given Node rendered
    When usr hovers Node
    Then tooltip visible
    And tooltip shows title + status

  Scenario: Detail panel toggle
    Given Node w/ detail collapsed
    When usr clicks expand detail btn
    Then detail panel visible
    And panel renders markdown placeholder

  Scenario: Title editable on dblclick
    Given Node w/ title "New Node"
    When usr dblclicks title
    Then title becomes input
    And on blur title saved via onTitleChange
