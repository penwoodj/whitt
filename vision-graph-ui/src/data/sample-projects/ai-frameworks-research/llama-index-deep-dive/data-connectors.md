---
id: f6a7b8c9-d0e1-2345-f012-456789012345
title: Data Connectors
parent: ./index.md
children:
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: done
focus_jump:
---

# Data Connectors

LlamaIndex's data connectors form the foundation for building knowledge-augmented AI applications, providing universal access to diverse data sources.

## Connector Architecture

The connector system follows a consistent pattern:

```python
from llama_index import SimpleDirectoryReader, WikipediaReader, YoutubeTranscriptReader

# Local files
documents = SimpleDirectoryReader('./data').load_data()

# Online sources
wiki_docs = WikipediaReader().load_data(pages=['Machine Learning'])

# Video content
video_docs = YoutubeTranscriptReader().load_data(ytlinks=['...'])
```

### Supported Categories

**Local Files**:
- PDF, Word, PowerPoint documents
- Text and Markdown files
- CSV and JSON data files
- Images (with OCR capabilities)

**Databases**:
- PostgreSQL, MySQL, MongoDB
- Snowflake, BigQuery
- Elasticsearch, OpenSearch

**Online Sources**:
- Wikipedia, Notion, Confluence
- Google Drive, Dropbox
- Slack, Discord, email
- Web scraping and APIs

## Advanced Features

### Incremental Loading
Efficient updates for changing data:
- File system watchers for real-time updates
- Change detection and selective re-indexing
- Delta updates to minimize reprocessing
- Version control integration

### Data Processing Pipeline
Built-in transformation capabilities:
- Text cleaning and normalization
- Chunking strategies for optimal retrieval
- Metadata extraction and enrichment
- Custom processing hooks

### Authentication Management
Secure access to protected sources:
- OAuth2 flows for cloud services
- API key management
- Credential rotation
- Enterprise SSO integration

## Best Practices

For production deployments:
1. **Batch Processing**: Load data in chunks for memory efficiency
2. **Error Handling**: Implement retry logic and fallback strategies
3. **Monitoring**: Track connector health and performance
4. **Caching**: Cache frequently accessed data to reduce API calls

The connector system transforms the challenge of data access into a unified, manageable interface.