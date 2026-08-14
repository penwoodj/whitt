---
id: 813e4567-e89b-12d3-a456-426614174024
title: YAML Workflows
parent: index.md
children:
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: done
focus_jump:
---

# YAML Workflows

YAML workflow definitions provide the declarative foundation for Whitt's orchestration system. These human-readable configuration files define complex agent workflows without requiring programming knowledge, making powerful automation accessible to users across technical backgrounds. The YAML format balances simplicity with expressiveness, enabling everything from simple linear sequences to complex multi-branch workflows with conditional logic.

The workflow schema is designed for composability and reusability. Workflows can import other workflows, define reusable templates, and specify dependencies explicitly. This approach enables a library of building blocks that users can combine to create sophisticated automation patterns. The Execution Engine parses these definitions, validates them against the schema, and orchestrates execution according to the specified logic.

## Workflow Structure

### Basic Components
```yaml
workflow:
  name: research_pipeline
  version: "1.0"
  description: "Automated research and summarization"

  # Metadata and documentation
  author: "Research Team"
  tags: [research, automation, summarization]
  created_at: "2026-08-09T00:00:00Z"

  # Execution configuration
  timeout: 3600  # 1 hour max execution time
  retry_policy:
    max_attempts: 3
    backoff: exponential

  # Workflow steps
  steps:
    - name: search_literature
      model: gpt-4
      tools: [web_search, academic_databases]
      timeout: 300

    - name: analyze_papers
      model: claude-3-opus
      depends_on: [search_literature]
      timeout: 600

    - name: create_summary
      model: gpt-3.5-turbo
      depends_on: [analyze_papers]
      timeout: 300
```

### Advanced Features

#### Conditional Execution
```yaml
steps:
  - name: data_analysis
    model: gpt-4
    condition: "${data_size > 1000}"

  - name: quick_summary
    model: gpt-3.5-turbo
    condition: "${data_size <= 1000}"

  - name: final_report
    model: claude-3-opus
    depends_on: [data_analysis, quick_summary]
    condition: "${analysis_quality > 0.8}"
```

#### Parallel Execution
```yaml
steps:
  - name: parallel_research
    parallel:
      - name: web_search
        model: gpt-4
        tools: [web_search]

      - name: database_query
        model: claude-3-opus
        tools: [sql_database]

      - name: api_fetch
        model: gpt-3.5-turbo
        tools: [rest_api]

  - name: consolidate_results
    model: gpt-4
    depends_on: [parallel_research]
```

## Template System

### Reusable Components
```yaml
# Template definition
templates:
  research_step:
    model: gpt-4
    tools: [web_search, note_taking]
    timeout: 300
    hooks:
      after_completion:
        - log_results
        - update_progress

# Template usage
steps:
  - name: topic_research
    template: research_step
    parameters:
      query: "quantum computing advances"

  - name: literature_review
    template: research_step
    parameters:
      query: "machine learning papers"
```

## Variable System

### Template Variables
```yaml
workflow:
  name: customizable_research
  variables:
    search_query: "default query"
    max_results: 10
    quality_threshold: 0.8

  steps:
    - name: search
      model: gpt-4
      parameters:
        query: "${search_query}"
        limit: "${max_results}"

    - name: filter
      model: claude-3-opus
      condition: "${result_quality >= quality_threshold}"
```

## Schema Validation

The Execution Engine validates workflows against a comprehensive schema:

- **Structure validation**: Correct YAML syntax and structure
- **Type checking**: Verify parameter types and formats
- **Dependency validation**: Ensure dependencies exist and are acyclic
- **Resource validation**: Check required tools and models are available

```typescript
interface WorkflowSchema {
  workflow: {
    name: string;
    version: string;
    steps: WorkflowStep[];
    variables?: Record<string, any>;
    templates?: Record<string, WorkflowTemplate>;
  };
}

function validateWorkflow(workflow: any): ValidationResult {
  const schema = loadWorkflowSchema();
  const validator = new Validator(schema);

  return validator.validate(workflow);
}
```

## Best Practices

### Workflow Design
- **Modular steps**: Keep individual steps focused
- **Clear dependencies**: Explicit dependency specification
- **Error handling**: Define failure modes and recovery
- **Resource limits**: Specify timeouts and resource constraints

### Performance Optimization
- **Parallel execution**: Use parallel steps when possible
- **Caching strategies**: Cache expensive operations
- **Appropriate model selection**: Match model complexity to task
- **Efficient tool usage**: Minimize tool calls

### Maintenance
- **Version control**: Track workflow changes
- **Documentation**: Document workflow purpose and usage
- **Testing**: Test workflows with various inputs
- **Monitoring**: Set up monitoring and alerting

YAML workflows make powerful automation accessible while maintaining the flexibility needed for complex orchestration scenarios.

> The best workflow definitions read like documentation—they explain the what and why, not just the how.