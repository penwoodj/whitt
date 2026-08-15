import type { ReactNode } from 'react'

export type AppShellProps = {
  sidebar?: ReactNode
  topbar?: ReactNode
  children: ReactNode
  errorState?: ReactNode
}

export type ProjectState = {
  activeProjectId: string | null
  isLoading: boolean
  error: string | null
}
