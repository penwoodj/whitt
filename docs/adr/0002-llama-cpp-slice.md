# ADR-0002: Llama.cpp Slice

**Status:** Proposed  
**Date:** 2026-08-08  
**Supersedes:** none

## Context

Local model management required for offline-first agentic system. Llama.cpp provides CPU-only inference. Need load/unload/search/download UI. Connects to ADR-0001 local model requirement.

## Decision

Integrate llama.cpp for local model operations. Build UI for model management: load, unload, search, download, switch active model.

## Consequences

- Offline capability ensured
- Model management becomes separate concern
- ADR-0004 settings slice includes model picker
- All prompts route through selected local model

## Features

### Feature: Load local model

User loads model from local FS. Models stored in known location. UI shows available models.

```gherkin
Feature: Load local model
  As usr on graph
  I want load local model
  So I run agentic system offline

  Scenario: Show available models
    Given Settings panel open
    And models present in local FS
    When usr opens model picker
    Then list shows available models
    And each model shows name + size + params

  Scenario: Load model on selection
    Given Model picker open
    When usr selects model "llama-3-8b"
    Then model loads into memory
    And active model indicator shows "llama-3-8b"
    And model ready for inference

  Scenario: Handle model load failure
    Given Model picker open
    When usr selects corrupted model file
    Then error msg shows
    And model not loaded
    And previous model stays active
```

### Feature: Unload active model

User unloads active model to free memory. Graceful shutdown of inference.

```gherkin
Feature: Unload active model
  As usr on graph
  I want unload active model
  So I free memory

  Scenario: Unload current model
    Given Model "llama-3-8b" active
    When usr clicks "unload model"
    Then model unloads from memory
    And active model indicator shows "none"
    And inference disabled

  Scenario: Prevent unload during inference
    Given Model active
    And inference in progress
    When usr clicks "unload model"
    Then unload blocked
    And msg shows "inference in progress"
    And model stays loaded
```

### Feature: Search local models

User searches through available models. Filter by name, size, parameters.

```gherkin
Feature: Search local models
  As usr on graph
  I want search local models
  So I find specific model quickly

  Scenario: Filter models by name
    Given Model picker shows 10 models
    When usr types "llama" in search
    Then list shows only models matching "llama"
    And other models hidden

  Scenario: Filter models by size
    Given Model picker open
    When usr selects filter "size < 8GB"
    Then list shows only models under 8GB
    And larger models hidden

  Scenario: Clear search filter
    Given Model picker filtered
    When usr clicks "clear filter"
    Then all models show
    And search input cleared
```

### Feature: Download model

User downloads model from remote source. Progress tracking. Resume capability.

```gherkin
Feature: Download model
  As usr on graph
  I want download model
  So I add new models to collection

  Scenario: Start model download
    Given Model picker open
    When usr selects "download model"
    And enters model URL
    Then download starts
    And progress bar shows
    And model appears in list as "downloading"

  Scenario: Resume interrupted download
    Given Model download interrupted
    When usr opens model picker
    Then "resume" btn shows on interrupted model
    When usr clicks "resume"
    Then download continues from last byte

  Scenario: Download complete notification
    Given Model downloading
    When download completes
    Then notification shows "model ready"
    And model status changes to "available"
    And model can be loaded
```

### Feature: Switch active model

User switches between loaded models. Hot-swap without reload if already in memory.

```gherkin
Feature: Switch active model
  As usr on graph
  I want switch active model
  So I use different model for task

  Scenario: Switch to already loaded model
    Given Model A active
    And Model B already loaded in memory
    When usr selects Model B
    Then active model changes to B
    And switch instant (no reload)

  Scenario: Switch to unloaded model
    Given Model A active
    And Model B not loaded
    When usr selects Model B
    Then Model B loads
    And active model changes to B
    And Model A unloaded

  Scenario: Switch during inference blocked
    Given Model A active
    And inference in progress
    When usr attempts switch to Model B
    Then switch blocked
    And msg shows "wait for inference to complete"
```

### Feature: Model settings

User configures model parameters. Context length, temperature, max tokens.

```gherkin
Feature: Model settings
  As usr on graph
  I want configure model params
  So I control inference behavior

  Scenario: Adjust context length
    Given Model settings panel open
    When usr changes context length
    Then setting saved
    And next inference uses new length

  Scenario: Adjust temperature
    Given Model settings panel open
    When usr changes temperature
    Then setting saved
    And next inference uses new temperature

  Scenario: Reset to defaults
    Given Model settings modified
    When usr clicks "reset defaults"
    Then all settings revert to defaults
    And changes saved
```

## Dependencies

- ADR-0001: Voice Graph Vision (master vision)
- ADR-0004: Graph UI Node Line Settings Slices (settings UI)
- ADR-0006: Whitt Folder Markdown YAML Slice (model config storage)
