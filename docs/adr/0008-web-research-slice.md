# ADR-0008: Web Research Slice

**Status:** Proposed  
**Date:** 2026-08-08  
**Supersedes:** none

## Context

Agentic system needs web research capability. External knowledge from web. Summarized as markdown docs. Linked as nodes to start node. Connects to ADR-0001 web research requirement.

## Decision

Build web research capability. Agentic system searches web, summarizes results, creates markdown doc, links to start node. User can prompt for research topics.

## Consequences

- External knowledge accessible
- Web dependency
- Summary quality varies by source
- New nodes created automatically

## Features

### Feature: Web research prompt

User prompts for web research. Agentic system detects research intent. Starts web search.

```gherkin
Feature: Web research prompt
  As usr on graph
  I want prompt for web research
  So I get external knowledge

  Scenario: Detect research intent
    Given Active node prompt area
    When usr types "research latest AI trends"
    Then agentic system detects research intent
    And web search initiated

  Scenario: Show research status
    Given Web research started
    Then node shows "researching" status
    And progress indicator shows search progress

  Scenario: Handle no research intent
    Given Active node prompt area
    When usr types "summarize my notes"
    Then agentic system does not trigger web search
    And local inference runs
```

### Feature: Web search execution

Agentic system executes web search. Uses search API. Collects results from multiple sources.

```gherkin
Feature: Web search execution
  As usr on graph
  I want web search executed
  So I get relevant results

  Scenario: Execute search query
    Given Research prompt: "latest AI trends"
    When search executes
    Then query sent to search API
    And results collected from top sources

  Scenario: Collect multiple sources
    Given Search query executed
    Then results collected from: Google, Bing, DuckDuckGo
    And results deduplicated
    And results ranked by relevance

  Scenario: Handle search API failure
    Given Search query executing
    When search API fails
    Then error logged
    And fallback search engine tried
    If all fail
    Then error msg shown to usr
```

### Feature: Summarize search results

Agentic system summarizes search results. Creates markdown doc. Includes citations to sources.

```gherkin
Feature: Summarize search results
  As usr on graph
  I want results summarized
  So I get concise knowledge

  Scenario: Generate summary
    Given Search results collected
    When summarization starts
    Then LLM generates concise summary
    And summary covers key points
    And summary structured with headings

  Scenario: Include citations
    Given Summary generated
    Then each claim includes citation
    And citation links to source
    And citation format consistent

  Scenario: Save summary as markdown
    Given Summary generated
    Then markdown file created in .whitt/research/
    And filename reflects topic
    And YAML frontmatter includes: topic, sources, date
```

### Feature: Link research to start node

Research doc linked as child node to start node. Edge labeled "research". Graph expands.

```gherkin
Feature: Link research to start node
  As usr on graph
  I want research linked to node
  So I see knowledge context

  Scenario: Create research node
    Given Summary doc created
    Then new node created for research
    And node title = research topic
    And node content = summary

  Scenario: Link to start node
    Given Research node created
    Then line created from start node to research node
    And line labeled "research"
    And graph shows new connection

  Scenario: Expand graph to show research
    Given Research linked
    Then graph auto-expands to show new node
    And node positioned near parent
```

### Feature: Multiple research prompts

User can submit multiple research prompts. Each creates separate research node. All linked to start node.

```gherkin
Feature: Multiple research prompts
  As usr on graph
  I want multiple research prompts
  So I gather broad knowledge

  Scenario: First research creates node
    Given First research prompt submitted
    Then first research node created
    And linked to start node

  Scenario: Second research creates another node
    Given First research completed
    When second research prompt submitted
    Then second research node created
    And linked to start node
    And first research preserved

  Scenario: Show all research nodes
    Given 3 research nodes created
    Then graph shows all 3 nodes
    And each linked to start node
    And nodes organized around parent
```

### Feature: Research quality indicators

Show confidence scores, source reliability, recency. Help user assess research quality.

```gherkin
Feature: Research quality indicators
  As usr on graph
  I want quality indicators
  So I assess research reliability

  Scenario: Show confidence score
    Given Research node created
    Then node shows confidence score
    And score reflects source reliability

  Scenario: Show source recency
    Given Research node created
    Then node shows date range of sources
    And recent sources highlighted

  Scenario: Show source count
    Given Research node created
    Then node shows number of sources
    And more sources = higher confidence
```

### Feature: Research follow-up

User can ask follow-up questions on research. Refines or expands on previous research.

```gherkin
Feature: Research follow-up
  As usr on graph
  I want ask follow-up questions
  So I deepen research

  Scenario: Ask follow-up on research node
    Given Research node exists
    When usr selects node
    And prompts "expand on point 2"
    Then new research triggered
    And focused on specific point

  Scenario: Link follow-up to original
    Given Follow-up research completed
    Then new node created
    And linked to original research node
    And line labeled "expands"

  Scenario: Combine research nodes
    Given Multiple related research nodes
    When usr prompts "combine these"
    Then agentic system merges summaries
    And new combined node created
```

## Dependencies

- ADR-0001: Voice Graph Vision (master vision)
- ADR-0005: Agentic Todo Execution Slice (agentic execution)
- ADR-0006: Whitt Folder Markdown YAML Slice (research doc storage)
- Search API (Google, Bing, DuckDuckGo)
