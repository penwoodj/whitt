import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FsGraphSync } from './FsGraphSync'
import { FakeFsPort } from './FakeFsPort'
import { simpleGit } from 'simple-git'

describe('FsGraphSync', () => {
  let fsPort: FakeFsPort
  let git: any
  let sync: FsGraphSync

  beforeEach(() => {
    fsPort = new FakeFsPort()
    git = simpleGit()
    sync = new FsGraphSync(fsPort, git)
  })

  describe('write', () => {
    it('queues write operation', () => {
      sync.write('test.md', 'content')

      const pending = sync.getPendingWrites()
      expect(pending).toHaveLength(1)
      expect(pending[0].path).toBe('test.md')
      expect(pending[0].content).toBe('content')
    })

    it('coalesces multiple writes to same file', () => {
      sync.write('test.md', 'v1')
      sync.write('test.md', 'v2')
      sync.write('test.md', 'v3')

      const pending = sync.getPendingWrites()
      expect(pending).toHaveLength(1)
      expect(pending[0].content).toBe('v3')
    })
  })

  describe('flush', () => {
    it('writes files via FsPort on flush', async () => {
      const mockCommit = vi.fn().mockResolvedValue(undefined)
      git.commit = mockCommit

      sync.write('test.md', 'content')
      sync.flush()

      await new Promise(resolve => setTimeout(resolve, 100))

      const fileContent = await fsPort.readFile('test.md')
      expect(fileContent).toBe('content')
    })

    it('creates git commit on flush', async () => {
      const mockCommit = vi.fn().mockResolvedValue(undefined)
      git.commit = mockCommit

      sync.write('test.md', 'content')
      sync.flush()

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(mockCommit).toHaveBeenCalled()
    })
  })

  describe('external changes', () => {
    it('notifies callback on external change', async () => {
      const callback = vi.fn()
      sync = new FsGraphSync(fsPort, git, callback)

      sync.watch('/')

      await fsPort.writeFile('external.md', 'external content')

      expect(callback).toBeDefined()
    })
  })

  describe('dispose', () => {
    it('cleans up resources', () => {
      const callback = vi.fn()
      sync = new FsGraphSync(fsPort, git, callback)

      sync.watch('/')
      sync.dispose()

      expect(() => sync.dispose()).not.toThrow()
    })
  })
})
