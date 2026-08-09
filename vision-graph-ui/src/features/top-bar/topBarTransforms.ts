import type { SyncStatus } from './topBarTypes'

export const formatSyncLabel = (status: SyncStatus, timestamp: Date): string => {
  if (status === 'syncing') return 'Syncing...'
  if (status === 'error') return 'Sync failed'

  const now = new Date()
  const diffMs = now.getTime() - timestamp.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)

  if (diffSecs < 60) return `Synced ${diffSecs}s ago`
  if (diffMins < 60) return `Synced ${diffMins}m ago`
  return `Synced ${Math.floor(diffMins / 60)}h ago`
}
