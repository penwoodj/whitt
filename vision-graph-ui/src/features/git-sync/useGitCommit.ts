import { useCallback } from 'react'
import type { GitService } from './gitSyncTypes'
import { buildCommitMetadata } from './commitMetadata'
import type { Write } from '../../shared/fs/WriteQueue'

type OnFlush = (writes: Write[]) => Promise<void>

export function useGitCommit(gitService: GitService): { onFlush: OnFlush } {
  const onFlush = useCallback(
    async (writes: Write[]) => {
      if (writes.length === 0) return

      const paths = writes.map(w => w.path)
      const primaryPath = paths[0]
      const nodeId = extractNodeId(primaryPath)

      const metadata = buildCommitMetadata('user', 'file-edit', nodeId ? [nodeId] : [])

      if (paths.length === 1) {
        await gitService.commit(paths[0], metadata)
      } else {
        await gitService.commit(paths, metadata)
      }
    },
    [gitService]
  )

  return { onFlush }
}

function extractNodeId(path: string): string | null {
  const match = path.match(/^(\w+-\w+)-?\d*\.md$/)
  return match ? match[1] : null
}