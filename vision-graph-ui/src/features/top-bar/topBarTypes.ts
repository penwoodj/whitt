export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'unavailable'

export type TopBarProps = {
  graphTitle: string
  syncStatus: SyncStatus
  lastSyncLabel: string
  canTravelBack: boolean
  canTravelForward: boolean
  commitLabel: string
  onSync: () => void
  onTravelBack: () => void
  onTravelForward: () => void
  onOpenSettings: () => void
}

export type GraphTitleProps = {
  title: string
}

export type SyncBtnProps = {
  syncStatus: SyncStatus
  lastSyncLabel: string
  onClick: () => void
}

export type TimeTravelCtrlProps = {
  canTravelBack: boolean
  canTravelForward: boolean
  commitLabel: string
  onTravelBack: () => void
  onTravelForward: () => void
}

export type SettingsGearProps = {
  onClick: () => void
}
