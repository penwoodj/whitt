import styled from 'styled-components'
import type { TopBarProps } from './topBarTypes'
import { useTopBarLogging } from './useTopBarLogging'
import GraphTitle from './GraphTitle'
import SyncBtn from './SyncBtn'
import TimeTravelCtrl from './TimeTravelCtrl'
import SettingsGear from './SettingsGear'

const Bar = styled.header`
  height: 48px;
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  position: relative;
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;
  min-width: 0;
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

export default function TopBar({
  graphTitle,
  syncStatus,
  lastSyncLabel,
  canTravelBack,
  canTravelForward,
  commitLabel,
  onSync,
  onTravelBack,
  onTravelForward,
  onOpenSettings,
}: TopBarProps) {
  const barLog = useTopBarLogging()

  const handleSync = () => {
    onSync()
    barLog.debug('Sync clicked', { status: syncStatus })
  }

  const handleTravelBack = () => {
    onTravelBack()
    barLog.debug('Travel back clicked')
  }

  const handleTravelForward = () => {
    onTravelForward()
    barLog.debug('Travel forward clicked')
  }

  const handleOpenSettings = () => {
    onOpenSettings()
    barLog.debug('Settings opened')
  }

  return (
    <Bar>
      <LeftSection>
        <GraphTitle title={graphTitle} />
      </LeftSection>
      <RightSection>
        <SyncBtn syncStatus={syncStatus} lastSyncLabel={lastSyncLabel} onClick={handleSync} />
        <TimeTravelCtrl
          canTravelBack={canTravelBack}
          canTravelForward={canTravelForward}
          commitLabel={commitLabel}
          onTravelBack={handleTravelBack}
          onTravelForward={handleTravelForward}
        />
        <SettingsGear onClick={handleOpenSettings} />
      </RightSection>
    </Bar>
  )
}
