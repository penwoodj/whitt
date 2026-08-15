# Slice 01 — App Shell & Project Rail

> Vertical slice: open app → see rail → load/switch projects → new project session.
> Node constraint: single node type (file bubbles). No new node types introduced.

## Positive Requirements

1. **PR-01-1** App opens into a usable new project within one interaction (zero picker walls).
2. **PR-01-2** The rail is always reachable and never occluded by graph content.
3. **PR-01-3** Project identity (title/letter) is user-owned; app never invents names.
4. **PR-01-4** Switching projects restores the exact prior graph arrangement (spatial memory).
5. **PR-01-5** Rail scales to many projects without breaking layout.

## Inherited Cases (full GWT + Why: `../../brainstorm/requirements/01-app-shell-projects.md`)

| ID | Summary |
|---|---|
| APP-01 | Opens into new blank project, single bubble |
| APP-02 | Rail fixed left, independent of graph state |
| APP-03 | Prior projects = letter bubbles (OpenCode-like) |
| APP-04 | New project bubble blank until titled |
| APP-05 | Title inline-editable, Google-Doc-style |
| APP-06 | Click project → load graph, restore state |
| APP-07 | New project = fresh ChatGPT-like session |

## New Cases (convention-derived gap-fill)

### APPC-01 Rail scrolls when overflowing

```gherkin
Given more projects than fit rail height
Then rail scrolls vertically
And current project stays visible/jumped-to on select
```

**Why** `[C]`: rail overflow was an open question (brainstorm/user-flows.md #7);
every fixed rail (VS Code, OpenCode, Slack) scrolls — least-surprise resolution.

### APPC-02 Empty rail on first launch

```gherkin
Given no prior projects exist
Then rail shows only the new-project bubble
And no empty-state filler beyond it
```

**Why** `[C]`: first-run state must not render broken/empty list chrome; the single
new bubble IS the empty state (consistent w/ APP-01 minimalism).

### APPC-03 Project load failure state

```gherkin
Given project graph fails to load (corrupt/missing files)
Then persistent error region shows near rail/canvas
With plain-language cause + retry action
And app never blames user nor crashes to blank
```

**Why** `[C]`: UX-pattern-guide error rules (persistent region, cause, recovery,
retry). FS-backed projects can fail to load; recovery path required.

## Implementation References

| Source | What to adapt |
|---|---|
| OpenCode (product reference) | rail-of-projects interaction model (visual target, not code) |
| React Flow `<Controls>` | fit-view/zoom once graph loads (used by slice 11) |
| UX pattern guide (Nielsen-style, via research) | empty/error state rules quoted in APPC-02/03 |

## Open Questions

- Rail item context menu (rename/delete project)? — defer until asked; title edit covers rename.
- Where project metadata (title) persists: folder name vs frontmatter — ties to ADR-0011 mapping.
