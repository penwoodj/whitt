export type NodeStatus = 'idle' | 'recording' | 'running' | 'done'

export type NodeType = 'task' | 'workflow' | 'artifact' | 'peer'

export type NodeLifecycle = 'initial' | 'prompting' | 'agentic-running' | 'done'

export type TodoStatus = 'queued' | 'running' | 'done' | 'failed'

export type Todo = {
  label: string
  status: TodoStatus
}

export type NodeData = {
  id: string
  title: string
  status: NodeStatus
  type: NodeType
  lifecycle: NodeLifecycle
  promptTxt: string
  todos: Todo[]
  lastUpdate: Date | null
  detailExpanded: boolean
  todosExpanded: boolean
  isRec: boolean
  isCycleRun: boolean
}

export type NodeProps = {
  data: NodeData
  isActive?: boolean
  onSend?: (txt: string) => void
  onTitleChange?: (title: string) => void
}
