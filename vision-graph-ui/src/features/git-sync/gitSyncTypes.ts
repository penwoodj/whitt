import type { CommitActor, CommitAction, CommitMetadata } from '../../shared/fs/CommitBuilder'

export type SyncState = 'idle' | 'syncing' | 'error' | 'synced'

export type GitService = {
  commit: (files: string | string[], metadata: CommitMetadata) => Promise<void>
  push: () => Promise<void>
}

export type SyncError = {
  message: string
  hint?: string
}

export type GitSyncContext = {
  syncState: SyncState
  syncError: SyncError | null
  sync: () => Promise<void>
}