import type { NodeData } from './nodeTypes'

export const isIdle = (node: NodeData): boolean => node.status === 'idle'

export const isRecording = (node: NodeData): boolean => node.status === 'recording'

export const isRunning = (node: NodeData): boolean => node.status === 'running'

export const isDone = (node: NodeData): boolean => node.status === 'done'

export const isBusy = (node: NodeData): boolean => isRecording(node) || isRunning(node)

export const hasMicBtn = (node: NodeData): boolean => node.type === 'task'

export const hasTodos = (node: NodeData): boolean => node.todos.length > 0

export const isRec = (node: NodeData): boolean => node.isRec

export const hasPromptTxt = (node: NodeData): boolean => node.promptTxt.length > 0

export const isDetailExpanded = (node: NodeData): boolean => node.detailExpanded

export const isTodosExpanded = (node: NodeData): boolean => node.todosExpanded
