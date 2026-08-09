import styled from 'styled-components'
import type { AppShellProps } from './appShellTypes'
import { useAppShellLogging } from './useAppShellLogging'

const Shell = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 60px 1fr;
  grid-template-rows: 48px 1fr;
  background-color: ${({ theme }) => theme.colors.bg};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, ${({ theme }) => theme.cinematic.vignetteStrength}) 100%);
    pointer-events: none;
    z-index: -1;
  }
`

const SidebarArea = styled.aside`
  grid-row: 1 / -1;
  grid-column: 1;
`

const TopbarArea = styled.header`
  grid-row: 1;
  grid-column: 2;
`

const MainArea = styled.main`
  grid-row: 2;
  grid-column: 2;
  overflow: hidden;
`

export default function AppShell({ sidebar, topbar, children }: AppShellProps) {
  const shellLog = useAppShellLogging()

  shellLog.debug('AppShell rendered', { hasSidebar: !!sidebar, hasTopbar: !!topbar })

  return (
    <Shell>
      {sidebar && <SidebarArea>{sidebar}</SidebarArea>}
      {topbar && <TopbarArea>{topbar}</TopbarArea>}
      <MainArea>{children}</MainArea>
    </Shell>
  )
}
