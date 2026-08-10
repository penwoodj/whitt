---
id: a5b6c7d8-e9f0-1234-8901-345678901234
title: YAML Workflows
parent: ./index.md
children:
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: done
focus_jump:
---

# YAML Workflows

YAML workflows provide human-readable, version-controlled definitions for agentic workflows in Whitt.

## Workflow Schema

### Complete Workflow Example
```yaml
name: "Daily Research Aggregation"
version: "1.2.0"
description: "Aggregates daily research from multiple sources"
author: "Research Team"

variables:
  slack_channel: "#research-updates"
  max_results: 10
  days_to_lookback: 1

hooks:
  on_init:
    - log: "Initializing research aggregation"
    - validate: "required-tools-installed"
  
  on_complete:
    - notify: "slack"
    - archive: "results-to-s3"

steps:
  - id: fetch-arxiv
    name: "Fetch ArXiv Papers"
    type: "tool"
    tool: "arxiv"
    action: "search"
    config:
      query: "machine learning reinforcement learning"
      max_results: "{{ max_results }}"
      sort_by: "submittedDate"
    hooks:
      on_step_success:
        - metric: "papers-found"
    on_success: "fetch-github"
    on_failure: "log-error"

  - id: fetch-github
    name: "Fetch GitHub Trending"
    type: "tool"
    tool: "github"
    action: "trending"
    config:
      language: "python"
      since: "daily"
      limit: 5
    on_success: "summarize-findings"
    on_failure: "fetch-arxiv"

  - id: summarize-findings
    name: "Summarize Research"
    type: "llm"
    model: "local-llama-3-8b"
    prompt: |
      Analyze and summarize these research findings:
      
      ## ArXiv Papers
      {{ fetch-arxiv.output }}
      
      ## GitHub Projects
      {{ fetch-github.output }}
      
      Provide:
      1. Key trends and patterns
      2. Notable papers and projects
      3. Actionable insights
      4. Future research directions
    config:
      temperature: 0.3
      max_tokens: 2000
    hooks:
      before_step:
        - check: "model-available"
      on_step_failure:
        - fallback: "summarize-findings-gpt4"
    on_success: "format-report"
    on_failure: "use-template"

  - id: format-report
    name: "Format Daily Report"
    type: "template"
    template: |
      # Daily Research Report
      
      **Date**: {{ timestamp }}
      **Papers Analyzed**: {{ fetch-arxiv.output.length }}
      **GitHub Projects**: {{ fetch-github.output.length }}
      
      ## Summary
      {{ summarize-findings.output }}
      
      ## Key Papers
      {% for paper in fetch-arxiv.output %}
      - [{{ paper.title }}]({{ paper.url }})
      {% endfor %}
      
      ## Trending Projects
      {% for project in fetch-github.output %}
      - [{{ project.name }}]({{ project.url }) - {{ project.stars }} stars
      {% endfor %}
    on_success: "post-slack"

  - id: post-slack
    name: "Post to Slack"
    type: "tool"
    tool: "slack"
    action: "post-message"
    config:
      channel: "{{ slack_channel }}"
      message: "{{ format-report.output }}"
    hooks:
      on_step_success:
        - cleanup: "temp-files"
    on_success: "complete"
    on_failure: "retry-slack"

  - id: complete
    name: "Workflow Complete"
    type: "end"
    message: "Daily research aggregation completed successfully"
```

## Step Types

### Tool Steps
Execute external tools:
```yaml
- id: run-script
  name: "Execute Python Script"
  type: "tool"
  tool: "python"
  action: "execute"
  config:
    script: "scripts/analysis.py"
    args: ["--input", "{{ input_file }}"]
    timeout: 300
```

### LLM Steps
Language model inference:
```yaml
- id: generate-response
  name: "Generate Response"
  type: "llm"
  model: "local-mistral-7b"
  prompt: |
    Context: {{ context }}
    Question: {{ question }}
    
    Provide a detailed response.
  config:
    temperature: 0.7
    top_p: 0.9
    max_tokens: 1500
    system_prompt: "You are a helpful research assistant."
```

### Template Steps
Text transformation:
```yaml
- id: generate-report
  name: "Generate Report"
  type: "template"
  template: |
    # Analysis Report
    
    Generated: {{ timestamp }}
    
    ## Results
    {{ analysis_results }}
    
    ## Recommendations
    {{ recommendations }}
```

### Conditional Steps
Workflow branching:
```yaml
- id: check-quality
  name: "Check Result Quality"
  type: "condition"
  condition: "{{ results.score }} > 0.8"
  on_success: "proceed-with-high-quality"
  on_failure: "improve-results"
```

## Variable System

### Variable Types
```yaml
variables:
  # String variables
  api_key: "{{ env.OPENAI_API_KEY }}"
  
  # Numeric variables
  timeout: 30
  max_retries: 3
  
  # Boolean variables
  debug: false
  verbose: true
  
  # Array variables
  allowed_models: 
    - "gpt-4"
    - "claude-3"
    - "local-llama"
  
  # Object variables
  model_config:
    temperature: 0.7
    max_tokens: 2000
    top_p: 0.9
```

### Variable References
```yaml
steps:
  - id: use-variable
    name: "Use Workflow Variable"
    type: "tool"
    config:
      timeout: "{{ timeout }}"
      retries: "{{ max_retries }}"
      models: "{{ allowed_models | join(',') }}"
```

## Error Handling

### Retry Strategies
```yaml
- id: flaky-operation
  name: "Potentially Failing Step"
  type: "tool"
  tool: "api"
  action: "call"
  config:
    retries: 3
    backoff: "exponential"
    initial_delay: 1000
  hooks:
    on_step_failure:
      - log: "Step failed, retrying..."
      - wait: "{{ backoff_delay }}"
```

### Fallback Mechanisms
```yaml
- id: primary-approach
  name: "Primary Approach"
  type: "llm"
  model: "local-model"
  prompt: "{{ user_prompt }}"
  on_failure: "fallback-approach"

- id: fallback-approach
  name: "Fallback Approach"
  type: "llm"
  model: "gpt-4"
  prompt: "{{ user_prompt }}"
  hooks:
    before_step:
      - log: "Using fallback model"
```

YAML workflows provide the foundation for reproducible, version-controlled agentic automation in Whitt, combining readability with powerful execution capabilities.