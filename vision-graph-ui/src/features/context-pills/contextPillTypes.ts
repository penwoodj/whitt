export type ContextPill = {
  id: string
  lineRange: string
  startLine: number
  endLine: number
  textSnippet: string
  filePath?: string
}

export type ContextPillData = {
  pills: ContextPill[]
  hasPills: boolean
}

export type ContextPillCallbacks = {
  onRemove: (pillId: string) => void
  onJump: (pillId: string) => void
}

export type PromptPayload = {
  text: string
  contextPills?: ContextPill[]
  weightedContext: boolean
}