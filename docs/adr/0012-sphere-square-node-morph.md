# ADR-0012: Minimized Box → Expanded Box Node Lifecycle

**Status:** Proposed
**Date:** 2026-08-09
**Supersedes:** ADR-0012 (Sphere-Square Node Morph)

## Context

User wants SAME BOX throughout node lifecycle, just minimized vs expanded size (NOT sphere→square morph). Node starts as minimized box showing title + state badge. Hover expands to full box with composer + UI. Click pins box open (focused) until explicitly closed.

## Decision

3-state node lifecycle: collapsed (minimized box) → hovered (expanded box) → expanded (focused/pinned).

### States

- **collapsed**: minimized box (small width ~120-180px, single row title + state badge, no composer). Bg: bgElevated. Border: subtle.
- **hovered**: expanded box (full width ~320-420px, title+state header + composer visible + conditional todos/details). Bg: bgElevated. Border: subtle. NOT focused.
- **expanded (focused)**: same as hovered but border: borderActive (primary blue), box-shadow: md (more prominent). Auto-focus textarea. Stays open until close action.

### Transitions

- collapsed → hovered: mouse enter NodeBox
- hovered → collapsed: mouse leave (only if NOT focused AND not actively typing)
- hovered → expanded (focused): click anywhere on NodeBox
- expanded → collapsed: Escape OR click outside OR click close btn

### Morph Animation

240ms ease on width, height, padding, border-color, box-shadow. Same box shape throughout (border-radius 12px). Minimized = small box. Expanded = full box.

## Consequences

Same box shape throughout (visual consistency). User controls engagement level (hover preview, click commit). Focused state prevents accidental collapse during typing. Close actions explicit (X btn, Escape, click outside).

## Features

```gherkin
Feature: Node minimized→expanded box lifecycle
  As usr on graph
  I want node start as minimized box w/ title + state
  So canvas stays compact until I engage

  Scenario: Minimized box by default
    Given new node spawned
    When rendered
    Then box visible (not just text)
    And box shows title + state tag
    And no composer visible

  Scenario: Hover expands box
    Given minimized box
    When usr hovers box
    Then box expands (240ms ease)
    And composer visible (textarea + mic + send)
    And conditional todos visible (if lifecycle warrants)
    And conditional details visible (if lifecycle=done)

  Scenario: Click pins box open
    Given hovered (expanded) box
    When usr clicks box
    Then box border becomes primary (focused)
    And textarea auto-focused
    And box stays expanded on mouse leave

  Scenario: Close btn collapses
    Given focused (expanded) box
    When usr clicks X btn
    Then collapses to minimized box
    And focus cleared

  Scenario: Escape collapses
    Given focused box
    When usr presses Escape
    Then collapses to minimized box

  Scenario: Click outside collapses
    Given focused box
    When usr clicks canvas outside node
    Then collapses to minimized box
```
