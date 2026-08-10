---
id: a7b8c9d0-e1f2-3456-0123-567890123456
title: Retrieval Patterns
parent: ./index.md
children:
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: done
focus_jump:
---

# Retrieval Patterns

LlamaIndex provides sophisticated retrieval patterns that go beyond simple similarity search, enabling more accurate and context-aware information retrieval.

## Advanced Retrieval Strategies

### Hybrid Retrieval
Combining multiple approaches for optimal results:
- **Vector Search**: Semantic similarity using embeddings
- **Keyword Search**: Traditional BM25/TF-IDF matching
- **Fusion Ranking**: Combining results with reciprocal rank fusion
- **Re-ranking**: Second-stage ranking with cross-encoders

### Hierarchical Retrieval
Multi-level retrieval for complex queries:
1. **Document-level**: Identify relevant documents first
2. **Section-level**: Drill down to specific sections
3. **Sentence-level**: Extract precise relevant passages
4. **Token-level**: Fine-grained context extraction

### Query Transformation
Improving retrieval through query enhancement:
- **Query Expansion**: Generate related queries
- **Query Decomposition**: Break complex queries into sub-queries
- **HyDE (Hypothetical Document Embeddings)**: Generate hypothetical answers
- **Reframing**: Rewrite queries for better matching

## Context Management

### Windowing Strategies
Balancing context and relevance:
- **Fixed Window**: Consistent context size
- **Variable Window**: Adapt based on content density
- **Sliding Window**: Overlapping context for continuity
- **Smart Window**: Content-aware sizing

### Relevance Scoring
Advanced scoring mechanisms:
- **Semantic Similarity**: Embedding-based cosine similarity
- **Keyword Matching**: Exact and fuzzy text matching
- **Freshness**: Recency-based scoring for time-sensitive data
- **Authority**: Source credibility weighting

## Specialized Patterns

### Multi-Document QA
Questions spanning multiple documents:
- Cross-document relationship extraction
- Contradiction detection and resolution
- Synthesis of information from diverse sources
- Citation and attribution tracking

### Time-Series Retrieval
Temporal information retrieval:
- Time-aware indexing and search
- Trend analysis and pattern detection
- Causal relationship extraction
- Forecasting based on historical data

### Code and Technical Documentation
Specialized handling for technical content:
- Syntax-aware code indexing
- API documentation navigation
- Code example retrieval
- Technical concept explanation

These patterns enable building sophisticated applications that can reason over complex, multi-source information landscapes.