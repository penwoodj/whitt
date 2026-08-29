import { useRef, useCallback } from 'react'
import type { GitService } from './gitSyncTypes'
import { buildCommitMetadata } from './commitMetadata'

type AgentCommit = { path: string; content: string }

export function useAgentCommitCadence(gitService: GitService) {
  const queuedCommits = useRef<AgentCommit[]>([])
  const userEditing = useRef(false)

  const queueAgentCommit = useCallback((path: string, content: string) => {
    queuedCommits.current.push({ path, content })
  }, [])

  const onUserEditorClose = useCallback(async () => {
    const commits = [...queuedCommits.current]
    queuedCommits.current = []
    userEditing.current = false

    for (const commit of commits) {
      const nodeId = extractNodeId(commit.path)
      const metadata = buildCommitMetadata('agent', 'file-create', nodeId ? [nodeId] : [])

      await gitService.commit(commit.path, metadata)
    }
  }, [gitService])

  const onUserEditorOpen = useCallback(() => {
    userEditing.current = true
  }, [])

  return {
    queueAgentCommit,
    onUserEditorClose,
    onUserEditorOpen
  }
}

function extractNodeId(path: string): string | null {
  const match = path.match(/^(\w+-\w+)-?\d*\.md$/)
  return match ? match[1] : null
}