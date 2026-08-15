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
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
`

const TopbarArea = styled.header`
  grid-row: 1;
  grid-column: 2;
  position: sticky;
  top: 0;
  z-index: 10;
`

const MainArea = styled.main`
  grid-row: 2;
  grid-column: 2;
  overflow: hidden;
  position: relative;
`

const ErrorArea = styled.div<{ $hasError: boolean }>`
  grid-row: 2;
  grid-column: 2;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  pointer-events: none;
  
  ${({ $hasError }) => !$hasError && 'display: none;'}
`

export default function AppShell({ sidebar, topbar, children, errorState }: AppShellProps) {
  const shellLog = useAppShellLogging()
  const hasError = !!errorState

  shellLog.debug('AppShell rendered', { hasSidebar: !!sidebar, hasTopbar: !!topbar, hasError })

  return (
    <Shell>
      {sidebar && <SidebarArea>{sidebar}</SidebarArea>}
      {topbar && <TopbarArea>{topbar}</TopbarArea>}
      <MainArea>{children}</MainArea>
      <ErrorArea $hasError={hasError}>{errorState}</ErrorArea>
    </Shell>
  )
}
