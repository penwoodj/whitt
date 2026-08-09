import type { TopBarProps } from './topBarTypes'

export const buildDefaultTopBarProps = (): TopBarProps => ({
  graphTitle: 'New Research',
  syncStatus: 'idle',
  lastSyncLabel: 'Synced 2s ago',
  canTravelBack: false,
  canTravelForward: false,
  commitLabel: 'abc1234 • Add Node B',
  onSync: () => {},
  onTravelBack: () => {},
  onTravelForward: () => {},
  onOpenSettings: () => {},
})
