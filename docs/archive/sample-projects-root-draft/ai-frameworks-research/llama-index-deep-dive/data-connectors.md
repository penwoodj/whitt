---
id: 623e4567-e89b-12d3-a456-426614174005
title: Data Connectors
parent: index.md
children:
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: done
focus_jump:
---

# Data Connectors

LlamaIndex's data connectors form the foundation of its data-centric approach. With 100+ built-in loaders spanning databases, file systems, APIs, and proprietary platforms, the framework eliminates the boilerplate typically required to make data accessible to LLMs. This extensive connector ecosystem means developers spend time on application logic rather than data ingestion plumbing.

The connector architecture goes beyond simple file reading by implementing sophisticated parsing, chunking, and metadata extraction. Each connector understands the structure of its data source, extracting not just raw text but semantic information like document hierarchies, code relationships, and entity links that improve retrieval quality.

## Connector Categories

### Unstructured Data
- PDF, Word, PowerPoint documents
- Images and scanned documents (OCR)
- Audio and video files (transcription)
- Web pages and HTML content

### Structured Data
- SQL databases (PostgreSQL, MySQL, Snowflake)
- NoSQL databases (MongoDB, Elasticsearch)
- Data warehouses (BigQuery, Redshift)
- APIs and web services

### Code and Technical Data
- Git repositories and codebases
- Documentation sites
- Jira and project management tools
- Communication platforms (Slack, Discord)

## Advanced Features

### Incremental Loading
- Change detection and delta updates
- Efficient re-indexing strategies
- File system watching
- Database change data capture

### Metadata Extraction
- Automatic document metadata
- Custom metadata pipelines
- Entity extraction and linking
- Hierarchical structure preservation

```python
# Multi-source data loading
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.readers.web import SimpleWebPageReader

# Load local documents
docs = SimpleDirectoryReader('reports/').load_data()

# Load web content
web_docs = SimpleWebPageReader(html_to_text=True).load_data([
    'https://example.com/docs/overview',
    'https://example.com/docs/api'
])

# Combine and index
all_docs = docs + web_docs
index = VectorStoreIndex.from_documents(all_docs)
```

## Custom Connectors

Building custom connectors involves implementing the `BaseReader` interface:
- `load_data()` method for data ingestion
- Metadata enrichment capabilities
- Error handling and retry logic
- Progress tracking and logging

## Best Practices

- Use appropriate chunking strategies per data type
- Preserve metadata during ingestion
- Implement incremental updates for large datasets
- Cache intermediate results for performance

## Production Considerations

- Authentication and credential management
- Rate limiting and API quota handling
- Data privacy and compliance
- Error recovery and monitoring

> The breadth of LlamaIndex connectors is its unsung hero—most projects spend 80% of time on data ingestion, and LlamaIndex reduces this to 20%.