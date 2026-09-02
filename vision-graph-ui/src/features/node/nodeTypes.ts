export type NodeStatus = 'idle' | 'recording' | 'running' | 'done'

export type NodeType = 'task' | 'workflow' | 'artifact' | 'peer'

export type NodeLifecycle = 'initial' | 'prompting' | 'agentic-running' | 'done'

export type NodeViewState = 'collapsed' | 'hovered' | 'expanded'

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
  nodeViewState: NodeViewState
  focused: boolean
  promptTxt: string
  todos: Todo[]
  lastUpdate: Date | null
  detailExpanded: boolean
  todosExpanded: boolean
  isRec: boolean
  isCycleRun: boolean
  bodyMarkdown?: string
  isStream: boolean
  streamedTxt: string
  contextPills?: import('../context-pills/contextPillTypes').ContextPill[]
}

export type NodeProps = {
  data: NodeData
  isActive?: boolean
  onSend?: (txt: string) => void
  onActivate?: () => void
  onTitleChange?: (title: string) => void
  onRemovePill?: (pillId: string) => void
  onJumpToPill?: (pillId: string) => void
  onSendPayload?: (payload: import('../context-pills/contextPillTypes').PromptPayload) => void
  onRetry?: (stepId: string) => void
  executionEvents?: import('../../shared/agent/types').AgentEvt[]
  workflow?: string
  writeQueue?: import('../../shared/fs/WriteQueue').WriteQueue
}
