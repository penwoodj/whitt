export type AgenticTodoStatus = 'queued' | 'running' | 'done' | 'failed'

export type AgenticTodo = {
  id: string
  label: string
  status: AgenticTodoStatus
}

export type UseAgenticTodoCycle = {
  todos: AgenticTodo[]
  isCycleDone: boolean
  startCycle: () => void
  resetCycle: () => void
}

export type UseAgenticTodoCycleOpts = {
  onCycleDone?: () => void
}
