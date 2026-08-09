import type { NodeData, NodeStatus, NodeType, TodoStatus, NodeLifecycle } from './nodeTypes'

const createBaseNode = (id: string, type: NodeType): NodeData => ({
  id,
  title: 'New Node',
  status: 'idle' as NodeStatus,
  type,
  lifecycle: 'initial' as NodeLifecycle,
  promptTxt: '',
  todos: [],
  lastUpdate: null,
  detailExpanded: false,
  todosExpanded: false,
  isRec: false,
  isCycleRun: false,
})

export const emptyNode = (id: string = '1', type: NodeType = 'task'): NodeData =>
  createBaseNode(id, type)

export const busyNode = (id: string = '1', type: NodeType = 'task'): NodeData => ({
  ...createBaseNode(id, type),
  status: 'running',
  lifecycle: 'agentic-running',
  promptTxt: 'Analyzing data...',
  todos: [
    { label: 'research', status: 'queued' as TodoStatus },
    { label: 'draft', status: 'queued' as TodoStatus },
  ],
  lastUpdate: new Date(),
  todosExpanded: true,
})

export const recordingNode = (id: string = '1'): NodeData => ({
  ...createBaseNode(id, 'task'),
  status: 'recording',
  isRec: true,
})

export const doneNode = (id: string = '1'): NodeData => ({
  ...createBaseNode(id, 'task'),
  status: 'done',
  lifecycle: 'done',
  promptTxt: 'Completed task',
  todos: [
    { label: 'research', status: 'done' as TodoStatus },
    { label: 'draft', status: 'done' as TodoStatus },
  ],
  lastUpdate: new Date(),
})
