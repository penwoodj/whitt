---
id: 723e4567-e89b-12d3-a456-426614174006
title: Retrieval Patterns
parent: index.md
children:
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: done
focus_jump:
---

# Retrieval Patterns

Retrieval-augmented generation succeeds or fails based on retrieval quality. LlamaIndex provides sophisticated retrieval patterns that go far beyond simple vector similarity search, enabling applications to find the most relevant information regardless of query complexity or data characteristics. These patterns address real-world challenges like ambiguous queries, multi-faceted questions, and the need for diverse perspectives.

The framework implements retrieval as a composable pipeline where each stage can be optimized independently. Query transformations improve the search query, retrieval strategies fetch candidate documents, reranking algorithms refine results, and response synthesis generates the final answer. This modular approach enables data-driven optimization at each stage.

## Query Transformation

Before retrieval, queries can be transformed for better matching:
- **Query Decomposition**: Break complex queries into sub-queries
- **Hyde (Hypothetical Document Embeddings)**: Generate ideal answers, then retrieve similar documents
- **Query Rewriting**: Clarify and expand queries based on context
- **Step-back Abstraction**: Generate higher-level questions for better context

## Retrieval Strategies

### Vector Similarity
- Dense vector embeddings (OpenAI, HuggingFace, Cohere)
- Cosine similarity and Euclidean distance
- Multiple embedding models for different content types

### Hybrid Search
- Combine vector similarity with keyword matching
- BM25 and traditional information retrieval
- Fusion algorithms for optimal ranking

### Advanced Patterns
- **Auto-merging retrieval**: Merge child nodes into parent chunks
- **Recursive retrieval**: Hierarchical document traversal
- **Knowledge graph retrieval**: Entity and relationship-based search
- **Metadata filtering**: Pre-filter before semantic search

## Reranking and Refinement

Post-retrieval optimization dramatically improves quality:
- **Cross-encoder reranking**: More accurate but slower scoring
- **Relevance scoring**: Multiple relevance signals combined
- **Diversity sampling**: Ensure result variety
- **Deduplication**: Remove redundant content

```python
# Advanced retrieval pipeline
from llama_index.core import VectorStoreIndex
from llama_index.core.query_engine import RetryQueryEngine
from llama_index.core.postprocessor import SimilarityPostprocessor

# Create base engine
base_engine = index.as_query_engine(
  similarity_top_k=20,
  retrieval_mode="hybrid"
)

# Add reranking and filtering
query_engine = RetryQueryEngine(
  base_engine,
  retry_on_timeout=True,
  processor=SimilarityPostprocessor(similarity_cutoff=0.7)
)
```

## Response Synthesis

Different synthesis strategies for different use cases:
- **Compact**: Concise answers, minimal context
- **Tree Summarize**: Hierarchical summarization for large result sets
- **Refine**: Iteratively improve answers with more context
- **Multi-turn**: Conversational synthesis with chat history

## Evaluation and Optimization

LlamaIndex provides tools for measuring retrieval quality:
- Relevance scoring and ranking metrics
- Retrieval latency and throughput monitoring
- A/B testing different strategies
- User feedback integration

## Production Patterns

- Caching frequent queries
- Parallel retrieval for performance
- Fallback strategies for failed retrievals
- Query routing based on intent

> The difference between basic and advanced retrieval patterns is often the difference between a RAG system that works and one that provides real value.