---
id: b0c1d2e3-f4a5-6789-3456-890123456789
title: Whitt Architecture
parent:
children:
  - graph-ui-slice/index.md
  - execution-engine-slice/index.md
  - queue-orchestration-slice/index.md
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: expanded
focus_jump:
---

# Whitt Architecture

Whitt is a fully local agentic orchestration IDE that enables users to automate their agentic thinking endlessly and safely. This document explores the architectural components that make this possible.

## System Overview

Whitt consists of three major architectural slices:

1. **Graph UI Slice**: Voice + mouse, infinite-canvas, fish-eye graph interface
2. **Execution Engine Slice**: YAML-based workflow execution with hooks system
3. **Queue Orchestration Slice**: 10-state task lifecycle with priority algorithms

These slices work together to provide a seamless, local-first AI development environment that prioritizes user privacy, offline capability, and deterministic behavior.

## Design Principles

### Local-First Everything
- **No Cloud Dependencies**: All processing happens locally
- **Offline Capability**: Full functionality without internet
- **Privacy by Design**: User data never leaves the device
- **Open Source**: Fully transparent and auditable

### Deterministic Execution
- **Reproducible Workflows**: Same inputs = same outputs
- **State Management**: Clear state transitions and lifecycle
- **Error Handling**: Predictable error recovery
- **Logging**: Comprehensive audit trails

### User Empowerment
- **Voice Control**: Natural language interface
- **Visual Programming**: Graph-based workflow design
- **Real-time Feedback**: Live execution monitoring
- **Extensibility**: Plugin architecture for custom tools

## Technology Stack

### Frontend
- **React 19**: Latest React with concurrent features
- **Vite 8**: Fast development and build tooling
- **TypeScript**: Type safety and developer experience
- **Styled Components**: Component-scoped styling
- **React Flow**: Graph visualization and interaction

### Backend
- **YAML Workflows**: Human-readable workflow definitions
- **Hooks System**: 10-point lifecycle hooks
- **Queue Engine**: Priority-based task scheduling
- **State Machine**: 10-state task lifecycle
- **File System**: Graph-to-filesystem mapping

### Development
- **Vitest**: Fast unit testing
- **Storybook**: Component development and testing
- **TypeScript Strict**: Maximum type safety
- **ESLint/Prettier**: Code quality and formatting

## Integration Points

The three slices communicate through well-defined interfaces:

- **Graph → Execution**: User triggers workflow execution from graph nodes
- **Execution → Queue**: Workflows submit tasks to the queue engine
- **Queue → Graph**: Task state updates reflected in graph visualization
- **All Slices → File System**: Persistent storage and version control

This architecture enables Whitt to provide a powerful, local-first AI development environment that respects user privacy while enabling sophisticated agentic workflows.