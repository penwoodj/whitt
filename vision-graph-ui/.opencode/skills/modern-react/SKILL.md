# Modern React 19 + TypeScript Functional Style

This skill enforces strict functional-react + point-free + lodash-fp conventions. When editing React code in this project, follow these rules.

## Naming Conventions

### Booleans
Extract to variables with predicate names: `isActive`, `shouldRender`, `hasError`, `canSubmit`, `willRetry`, `didSucceed`. Pattern: `^(is|has|should|can|will|did)[A-Z]`.

### Functions
Use verbs: `fetchUser`, `renderNode`, `cancelTask`, `transformData`, `handleClick`. Not: `userFetch`, `nodeRender`, `taskCancel`.

### Data
Use nouns: `user`, `taskList`, `workflowGraph`, `activeNodes`, `filteredEdges`. Not: `getUser`, `renderTasks`.

## Functional Style

### Components
Always functional components: `function MyComponent({ prop }: Props) { return <div>{prop}</div> }`. NEVER class components.

### Hooks
Use hooks only: `useState`, `useReducer`, `useEffect`, `useMemo`, `useCallback`, `useRef`, custom hooks.

### Point-Free Style
Use `flow()` for composition:
```tsx
import flow from 'lodash/fp/flow'
import filter from 'lodash/fp/filter'
import map from 'lodash/fp/map'
import take from 'lodash/fp/take'
const result = flow([filter(isActive), map(transform), take(5)])(items)
```

NOT nested calls: `const result = take(5, map(transform, filter(isActive, items)))`.

### lodash/fp Imports
Destructured per-function: `import filter from 'lodash/fp/filter'`. NOT whole-module: `import _ from 'lodash'`.

## Extraction Rules

### Depth > 1
Anything nested >1 level deep MUST be extracted:
```tsx
function MyComponent({ items }) {
  const activeItems = filter(isActive)(items)
  const transformedItems = map(transform)(activeItems)
  const topFive = take(5)(transformedItems)
  return <ul>{topFive.map(renderItem)}</ul>
}
```

### Human Readability
Build data incrementally:
```tsx
function MyComponent({ tasks, users }) {
  const loadedTasks = filter(isLoaded)(tasks)
  const activeTasks = filter(isActive)(loadedTasks)
  const renderable = map(toRenderable)(activeTasks)
  return <TaskList items={renderable} />
}
```

## Forbiddens

### Comments
NEVER use comments. Code extraction = documentation.

### Class Components
NEVER use `class` for components. Functional components only.

### Type Safety
NEVER use `any`, `@ts-ignore`, `as unknown as`.

### Mutability
NEVER mutate props or state: `props.items.push(newItem)`, `state.tasks = [...state.tasks, newTask]`.

### Inline Business Logic in JSX
NEVER inline business logic: `<div>{items.filter(i => i.active).map(i => <Item />)}</div>`. Extract to variable first:
```tsx
function MyComponent({ items }) {
  const activeItems = filter(isActive)(items)
  const renderItem = flow([map(toRenderable), map(renderNode)])
  return <div>{renderItem(activeItems)}</div>
}
```

## JSX Rules

### Styling
Inline style objects OK for trivial styling: `<div style={{ padding: 10 }}>Content</div>`. CSS modules / Tailwind for everything else.

### Conditional Rendering
Extract to boolean variable:
```tsx
function MyComponent({ user }) {
  const shouldShowHeader = hasPremiumAccess(user)
  const shouldShowFooter = hasAnalytics(user)
  return (
    <>
      {shouldShowHeader && <Header />}
      <Content />
      {shouldShowFooter && <Footer />}
    </>
  )
}
```

### List Rendering
Extract render callback:
```tsx
function MyComponent({ tasks }) {
  const renderTask = useCallback((task) => <TaskCard key={task.id} task={task} />, [])
  return <div>{tasks.map(renderTask)}</div>
}
```

## Hook Rules

### Custom Hooks
`use` prefix, return typed tuple or object:
```tsx
function useTasks(query: TaskQuery): [Task[], boolean, Error | null] {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  useEffect(() => {
    fetchTasks(query).then(setTasks).catch(setError).finally(() => setLoading(false))
  }, [query])
  return [tasks, loading, error]
}
```

### Effect Dependencies
ALL dependencies in array, no eslint-disable: `useEffect(() => { fetchData(id, token).then(setData).catch(setError) }, [id, token])`.

### Memoized Callbacks
Memoize callbacks passed to memoized children:
```tsx
const handleClick = useCallback(() => { onAction(id) }, [id, onAction])
```

## File Structure

### One Component Per File
`MyComponent.tsx` exports `MyComponent` (default). One component per file.

### Tests Adjacent
`MyComponent.tsx` - component, `MyComponent.test.tsx` - tests, `MyComponent.stories.tsx` - stories.

## Type Safety

### Strict TypeScript
Always use strict types:
```tsx
interface Props { user: User; tasks: Task[]; onAction: (id: string) => void }
function MyComponent({ user, tasks, onAction }: Props) { return <div>{tasks.length}</div> }
```

### No Type Assertions
Use type guards: `const isUser = (value: unknown): value is User => typeof value === 'object' && value !== null && 'id' in value`. NOT `const user = data as User`.

## Performance

### Memoization
Memoize expensive computations:
```tsx
const filteredItems = useMemo(() => flow([filter(isActive), map(transform)])(items), [items])
```

### Callback Stabilization
Stabilize callbacks to prevent unnecessary re-renders:
```tsx
const handleClick = useCallback(() => { onAction(id) }, [id, onAction])
```

## Testing

### Test Structure
```tsx
describe('MyComponent', () => {
  it('renders with required props', () => {
    const { getByText } = render(<MyComponent {...props} />)
    expect(getByText('Content')).toBeInTheDocument()
  })
})
```

### Test Naming
Use descriptive test names that describe behavior.

## Linting

Run the project linter before committing: `python3 .opencode/skills/modern-react/helper.py check src/**/*.tsx src/**/*.ts`.
