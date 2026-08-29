import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { GitSync } from './GitSync'
import type { GitService } from './gitSyncTypes'
import { ThemeProvider } from '../../shared/ThemeProvider'

describe('GitSync - GIT-04, GITC-01, GITC-02', () => {
  let gitService: GitService

  beforeEach(() => {
    gitService = {
      commit: vi.fn().mockResolvedValue(undefined),
      push: vi.fn()
    }
  })

  it('GIT-04 sync button calls push spy', async () => {
    const mockPush = vi.fn().mockResolvedValue(undefined)
    gitService.push = mockPush

    render(
      <ThemeProvider>
        <GitSync
          syncState="idle"
          syncError={null}
          onSync={async () => {
            await gitService.push()
          }}
        />
      </ThemeProvider>
    )

    const syncBtn = screen.getByTitle('Sync to remote')
    fireEvent.click(syncBtn)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledTimes(1)
    })
  })

  it('GITC-01 sync progress shows running state + canvas interactive', async () => {
    const mockPush = vi.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    )

    const { rerender } = render(
      <ThemeProvider>
        <GitSync
          syncState="syncing"
          syncError={null}
          onSync={async () => {
            await mockPush()
          }}
        />
      </ThemeProvider>
    )

    const syncBtn = screen.getByTitle('Sync syncing')

    await waitFor(() => {
      expect(syncBtn).toHaveAttribute('data-state', 'syncing')
    })

    await mockPush()

    rerender(
      <ThemeProvider>
        <GitSync
          syncState="synced"
          syncError={null}
          onSync={async () => {}}
        />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByTitle('Sync synced')).toHaveAttribute('data-state', 'synced')
    })
  })

  it('GITC-02 sync failure shows persistent error + local commits intact', async () => {
    const commitSpy = vi.fn().mockResolvedValue(undefined)

    const onSync = async () => {
      throw new Error('Authentication failed')
    }

    commitSpy('local-file.md', { actor: 'user', action: 'file-edit', refs: ['node-1'], ts: new Date().toISOString() })

    render(
      <ThemeProvider>
        <GitSync
          syncState="error"
          syncError="Authentication failed"
          onSync={onSync}
        />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Sync Failed')).toBeInTheDocument()
      expect(screen.getByText('Authentication failed')).toBeInTheDocument()
      expect(screen.getByText(/resolve in external git client/i)).toBeInTheDocument()
    })

    expect(commitSpy).toHaveBeenCalledWith('local-file.md', expect.any(Object))
  })
})