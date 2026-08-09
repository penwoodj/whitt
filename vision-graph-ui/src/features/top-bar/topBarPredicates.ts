import type { SyncStatus } from './topBarTypes'

export const isSyncing = (status: SyncStatus): boolean => status === 'syncing'

export const canTravel = (canBack: boolean, canFwd: boolean): boolean => canBack || canFwd

export const hasCommit = (label: string): boolean => label.length > 0
