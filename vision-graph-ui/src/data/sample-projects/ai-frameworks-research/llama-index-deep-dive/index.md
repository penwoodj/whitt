---
id: e5f6a7b8-c9d0-1234-ef01-345678901234
title: LlamaIndex Deep Dive
parent: ../index.md
children:
  - data-connectors.md
  - retrieval-patterns.md
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: expanded
focus_jump:
---

# LlamaIndex Deep Dive

LlamaIndex focuses on connecting LLMs to external data sources, enabling knowledge-augmented AI applications that can reason over private and public information.

## Data Framework Philosophy

LlamaIndex takes a data-first approach to LLM applications:

- **Data Ingestion**: Connectors for 150+ data sources
- **Indexing**: Efficient data structures for retrieval
- **Querying**: Natural language interface to indexed data
- **Synthesis**: Combining retrieved information with LLM reasoning

This framework solves the fundamental problem of giving LLMs access to relevant, up-to-date information beyond their training data.

## Core Components

### Data Connectors
Universal data ingestion supporting:
- **Structured Data**: SQL databases, CSV, JSON
- **Unstructured Text**: PDFs, Word docs, web pages
- **Code Repositories**: Git, GitHub, code search
- **APIs**: REST, GraphQL, custom integrations

### Indexing Strategies
Multiple indexing approaches for different use cases:
- **Vector Index**: Semantic search with embeddings
- **Keyword Index**: Traditional text search
- **Tree Index**: Hierarchical summarization
- **Graph Index**: Relationship-based retrieval

### Query Engines
Advanced retrieval and synthesis:
- **Vector Store Query**: Semantic similarity search
- **Router Query**: Dynamic selection of data sources
- **Auto-merging Query**: Combines results from multiple indexes
- **Hybrid Query**: Combines multiple retrieval strategies

## Knowledge Graph Integration

LlamaIndex supports knowledge graph construction:
- Entity extraction and relationship mapping
- Graph-based reasoning and traversal
- Combining vector search with graph queries
- Multi-hop reasoning across connected concepts

This enables more sophisticated applications that understand relationships between concepts.