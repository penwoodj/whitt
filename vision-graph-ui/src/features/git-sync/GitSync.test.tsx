import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGitCommit } from './useGitCommit'
import type { GitService } from './gitSyncTypes'
import { CommitBuilder } from '../../shared/fs/CommitBuilder'
import { simpleGit } from 'simple-git'

describe('useGitCommit - GIT-01 commit per save', () => {
  let gitService: GitService
  let mockCommit: vi.Mock

  beforeEach(() => {
    mockCommit = vi.fn()
    gitService = {
      commit: mockCommit,
      push: vi.fn()
    }
    localStorage.clear()
  })

  it('commits on write queue flush', async () => {
    const { result } = renderHook(() => useGitCommit(gitService))

    await act(async () => {
      await result.current.onFlush([{ path: 'test.md', content: 'new content' }])
    })

    expect(mockCommit).toHaveBeenCalledTimes(1)
    expect(mockCommit).toHaveBeenCalledWith(
      'test.md',
      expect.objectContaining({
        actor: 'user',
        action: 'file-edit',
        refs: expect.any(Array),
        ts: expect.any(String)
      })
    )
  })

  it('includes metadata fields in commit', async () => {
    const { result } = renderHook(() => useGitCommit(gitService))

    await act(async () => {
      await result.current.onFlush([{ path: 'node-abc.md', content: 'content' }])
    })

    const commitCall = mockCommit.mock.calls[0]
    const metadata = commitCall[1]

    expect(metadata).toHaveProperty('actor')
    expect(metadata).toHaveProperty('action')
    expect(metadata).toHaveProperty('refs')
    expect(metadata).toHaveProperty('ts')
    expect(metadata.actor).toBe('user')
    expect(metadata.refs).toContain('node-abc')
  })

  it('commits multiple files in single commit', async () => {
    const { result } = renderHook(() => useGitCommit(gitService))

    await act(async () => {
      await result.current.onFlush([
        { path: 'a.md', content: 'content a' },
        { path: 'b.md', content: 'content b' }
      ])
    })

    expect(mockCommit).toHaveBeenCalledTimes(1)
    expect(mockCommit).toHaveBeenCalledWith(
      ['a.md', 'b.md'],
      expect.any(Object)
    )
  })
})

describe('GITC-03 metadata schema', () => {
  it('produces parseable JSON footer in commit message', async () => {
    const git = simpleGit()
    const mockCommitMessage = vi.fn()
    git.commit = mockCommitMessage
    git.add = vi.fn().mockResolvedValue(undefined)

    const commitBuilder = new CommitBuilder(git)
    const metadata = {
      actor: 'user' as const,
      action: 'file-edit' as const,
      refs: ['node-123'],
      ts: '2026-08-15T00:00:00Z'
    }

    await commitBuilder.commit('test.md', metadata)

    const commitCall = mockCommitMessage.mock.calls[0]
    const messageBody = commitCall[1]['--message']
    const parsed = JSON.parse(messageBody)

    expect(parsed).toEqual({
      actor: 'user',
      action: 'file-edit',
      refs: ['node-123'],
      ts: '2026-08-15T00:00:00Z'
    })
  })
})