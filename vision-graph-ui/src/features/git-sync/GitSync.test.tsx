import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGitCommit } from './useGitCommit'
import { useAgentCommitCadence } from './useAgentCommitCadence'
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

describe('useAgentCommitCadence - GIT-02 agent commits', () => {
  let gitService: GitService
  let mockCommit: vi.Mock
  let mockPush: vi.Mock

  beforeEach(() => {
    vi.useFakeTimers()
    mockCommit = vi.fn()
    mockPush = vi.fn()
    gitService = {
      commit: mockCommit,
      push: mockPush
    }
    localStorage.clear()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('queues agent commits and flushes after user editor close', async () => {
    const { result } = renderHook(() => useAgentCommitCadence(gitService))

    await act(async () => {
      result.current.queueAgentCommit('agent-output-1.md', 'output 1')
      result.current.queueAgentCommit('agent-output-2.md', 'output 2')
      result.current.queueAgentCommit('agent-output-3.md', 'output 3')

      expect(mockCommit).not.toHaveBeenCalled()

      result.current.onUserEditorClose()
      vi.advanceTimersByTime(100)
    })

    expect(mockCommit).toHaveBeenCalledTimes(3)
    expect(mockCommit).toHaveBeenNthCalledWith(1, 'agent-output-1.md', expect.objectContaining({ actor: 'agent' }))
    expect(mockCommit).toHaveBeenNthCalledWith(2, 'agent-output-2.md', expect.objectContaining({ actor: 'agent' }))
    expect(mockCommit).toHaveBeenNthCalledWith(3, 'agent-output-3.md', expect.objectContaining({ actor: 'agent' }))
  })

  it('produces ≥3 commits at mutation boundaries', async () => {
    const { result } = renderHook(() => useAgentCommitCadence(gitService))

    await act(async () => {
      for (let i = 1; i <= 3; i++) {
        result.current.queueAgentCommit(`mutation-${i}.md`, `content ${i}`)
      }

      result.current.onUserEditorClose()
      vi.advanceTimersByTime(100)
    })

    expect(mockCommit.mock.calls.length).toBeGreaterThanOrEqual(3)
  })
})

describe('GITC-04 cadence guard', () => {
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

  it('orders agent commit after user editor flush (no interleave)', async () => {
    const { result: agentResult } = renderHook(() => useAgentCommitCadence(gitService))
    const { result: userResult } = renderHook(() => useGitCommit(gitService))

    await act(async () => {
      agentResult.current.queueAgentCommit('agent-write.md', 'agent content')

      expect(mockCommit).not.toHaveBeenCalled()

      await userResult.current.onFlush([{ path: 'user-edit.md', content: 'user edit' }])

      expect(mockCommit).toHaveBeenCalledTimes(1)
      expect(mockCommit).toHaveBeenCalledWith(
        'user-edit.md',
        expect.objectContaining({ actor: 'user' })
      )

      agentResult.current.onUserEditorClose()
    })

    expect(mockCommit).toHaveBeenCalledTimes(2)
    expect(mockCommit).toHaveBeenNthCalledWith(1, 'user-edit.md', expect.objectContaining({ actor: 'user' }))
    expect(mockCommit).toHaveBeenNthCalledWith(2, 'agent-write.md', expect.objectContaining({ actor: 'agent' }))
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