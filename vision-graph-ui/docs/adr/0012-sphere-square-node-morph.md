# ADR-0012: Sphere-Square Node Morph Lifecycle

**Status:** Proposed
**Date:** 2026-08-09

## Context

User wants minimal canvas presence. Nodes start as title text only floating (no shape, no composer). Hover reveals sphere outline (visual indicator of interactivity). Click morphs sphere to square containing composer (committed workspace). This reduces visual noise and requires deliberate user engagement.

## Decision

3-state node lifecycle: collapsed → hovered → expanded.

### States

- **collapsed**: title text floating, transparent bg, no shape
- **hovered**: title in sphere outline (dashed primary border), minimal padding
- **expanded**: square composer (textarea + mic + send), elevated bg, auto-focused

### Transitions

- collapsed → hovered: mouse enter
- hovered → collapsed: mouse leave (if not focused)
- hovered → expanded: click
- expanded → collapsed: Escape key OR click outside node

### Morph Animation

240ms ease on border-radius, width, height, padding, background-color.

Sphere (border-radius 50%, transparent bg, tight padding) → Square (border-radius 12px, elevated bg, expanded padding).

## Consequences

Less visual noise on canvas. Intentional engagement required (hover reveals intent, click commits). Morph animation provides tactile feedback. Details panel appears only after full agentic cycle (lifecycle='done').

## Features

```gherkin
Feature: Node collapse/hover/expand lifecycle
  As usr on graph
  I want node start as title text
  So canvas clean until I engage

  Scenario: Collapsed by default
    Given new node spawned
    When rendered
    Then title text visible
    And no composer visible
    And no sphere shape

  Scenario: Hover shows sphere outline
    Given collapsed node
    When usr hovers title
    Then sphere outline visible (border 1px dashed primary)
    And title inside sphere

  Scenario: Click morphs to square composer
    Given hovered node
    When usr clicks sphere
    Then sphere morphs to square (240ms ease)
    And composer visible (textarea + mic + send)
    And textarea auto-focused

  Scenario: Escape collapses
    Given expanded node
    When usr presses Escape
    Then square morphs back to sphere
    And composer hidden
    And title text remains

  Scenario: Click outside collapses
    Given expanded node
    When usr clicks canvas (outside node)
    Then collapses back to title-only
```
