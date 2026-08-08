# Storybook 10.x — React 19 + Vite + TypeScript

## When to Load
Auto-load in `vision-graph-ui/` when any of these match:
- User mentions `.stories.tsx` or "story"
- Adding new component to App without story
- Writing BDD feature files (.feature)
- Running Storybook commands

## Core Conventions

### File Structure
```
src/
  components/
    Button/
      Button.tsx
      Button.stories.tsx  # MUST exist for every component
```

### CSF3 Format (Component Story Format v3)
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import Button from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: 'Click me',
    variant: 'primary',
  },
}

export const Loading: Story = {
  args: {
    children: 'Loading...',
    variant: 'primary',
    loading: true,
  },
}

export const Error: Story = {
  args: {
    children: 'Error',
    variant: 'danger',
  },
}

export const Empty: Story = {
  args: {
    children: null,
  },
}
```

### ArgsType/Args Typing Rules
```tsx
// GOOD: Use component's prop types
import type { ComponentProps } from 'react'

type ButtonProps = ComponentProps<typeof Button>

export const Default: StoryObj<ButtonProps> = {
  args: {
    variant: 'primary',
  },
}

// BAD: No `any`
export const Bad: StoryObj<any> = {} // FORBIDDEN
```

### Required Exports
- **`Default`**: Always present — represents typical usage
- **Named variants**: Add where applicable
  - `Loading`: Spinner/skeleton state
  - `Error`: Failure state
  - `Empty`: No data state
  - Other domain states per component (e.g., `Success`, `Warning`)

### Play Functions (Interaction Tests)
```tsx
import { expect, fn, userEvent, waitFor } from '@storybook/test'

export const Clickable: Story = {
  args: {
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')

    await userEvent.click(button)

    await waitFor(() => {
      expect(args.onClick).toHaveBeenCalled()
    })
  },
}
```

### BDD Mapping (Gherkin → Stories)
Every `.feature` scenario → ≥1 story with play function:

```gherkin
# Button.feature
Feature: Button Clicks
  Scenario: User clicks primary button
    When user clicks button
    Then onClick handler fires
```

Maps to:
```tsx
export const UserClicksButton: Story = {
  args: { variant: 'primary', onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')
    await userEvent.click(button)
    await waitFor(() => expect(args.onClick).toHaveBeenCalled())
  },
}
```

## Commands
- **Dev**: `npm run storybook` → http://localhost:6006
- **Build for CI**: `npm run build-storybook`
- **Test runner**: `npm run test-storybook` (uses `@storybook/test-runner`)

## When to Add Stories
**Mandatory** before component promotion to App-level:
1. Component file created (`Component.tsx`)
2. Immediately create `Component.stories.tsx` with `Default` story
3. Add variant stories (Loading/Error/Empty) as applicable
4. Add play functions for interactive behavior
5. Map BDD scenarios to stories if feature file exists

## Test Runner (@storybook/test-runner)
For DOM assertions in CI:
```tsx
// In .storybook/test-runner.ts
import { test, expect } from '@storybook/test-runner'

test('button renders', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--default')
  const button = await page.locator('button')
  await expect(button).toHaveText('Click me')
})
```

## Helper Script (`helper.py`)
```bash
# Generate new story from component
python3 .opencode/skills/storybook/helper.py new-story src/components/MyComponent/MyComponent.tsx

# List all stories
python3 .opencode/skills/storybook/helper.py list-stories

# Check coverage (components without stories)
python3 .opencode/skills/storybook/helper.py check-coverage
```

## Token-Aware Rules
- Load this skill once per session in `vision-graph-ui/`
- Don't re-derive CSF3 patterns — use this as reference
- Helper.py infers props via regex (no AST dependency) for speed
- Stories live NEXT to components (co-located) for context locality
