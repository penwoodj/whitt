import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CommitBuilder } from './CommitBuilder'
import { simpleGit, SimpleGit } from 'simple-git'

describe('CommitBuilder', () => {
  let git: SimpleGit
  let commitBuilder: CommitBuilder
  let mockAdd: vi.Mock
  let mockCommit: vi.Mock

  beforeEach(() => {
    git = simpleGit()
    commitBuilder = new CommitBuilder(git)

    mockAdd = vi.fn()
    mockCommit = vi.fn()

    git.add = mockAdd
    git.commit = mockCommit
  })

  describe('commit', () => {
    it('commits file with metadata', async () => {
      const metadata = {
        actor: 'user' as const,
        action: 'file-edit' as const,
        refs: ['node-123'],
        ts: '2026-08-15T00:00:00Z'
      }

      await commitBuilder.commit('test.md', metadata)

      expect(mockAdd).toHaveBeenCalledWith('test.md')
      expect(mockCommit).toHaveBeenCalledWith(
        'whitt: file-edit test.md [user]',
        expect.objectContaining({
          '--message': expect.stringContaining('"actor":"user"')
        })
      )
    })

    it('formats commit message correctly', async () => {
      const metadata = {
        actor: 'agent' as const,
        action: 'file-create' as const,
        refs: ['node-456'],
        ts: '2026-08-15T00:00:00Z'
      }

      await commitBuilder.commit('agent-output.md', metadata)

      expect(mockCommit).toHaveBeenCalledWith(
        'whitt: file-create agent-output.md [agent]',
        expect.any(Object)
      )
    })

    it('includes metadata JSON in commit body', async () => {
      const metadata = {
        actor: 'user' as const,
        action: 'file-edit' as const,
        refs: ['node-123'],
        ts: '2026-08-15T00:00:00Z'
      }

      await commitBuilder.commit('test.md', metadata)

      const commitCall = mockCommit.mock.calls[0]
      const messageBody = commitCall[1]['--message']

      expect(messageBody).toContain('"actor":"user"')
      expect(messageBody).toContain('"action":"file-edit"')
      expect(messageBody).toContain('"refs":["node-123"]')
    })

    it('handles multiple files in single commit', async () => {
      const metadata = {
        actor: 'user' as const,
        action: 'file-edit' as const,
        refs: ['node-123'],
        ts: '2026-08-15T00:00:00Z'
      }

      await commitBuilder.commit(['a.md', 'b.md'], metadata)

      expect(mockAdd).toHaveBeenCalledWith('a.md')
      expect(mockAdd).toHaveBeenCalledWith('b.md')
      expect(mockCommit).toHaveBeenCalledTimes(1)
    })

    it('uses primary file in commit message for multiple files', async () => {
      const metadata = {
        actor: 'user' as const,
        action: 'file-edit' as const,
        refs: ['node-123'],
        ts: '2026-08-15T00:00:00Z'
      }

      await commitBuilder.commit(['a.md', 'b.md'], metadata)

      expect(mockCommit).toHaveBeenCalledWith(
        'whitt: file-edit a.md [user]',
        expect.any(Object)
      )
    })
  })
})
