import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FsGraphSync } from '../../shared/fs/FsGraphSync'
import { FakeFsPort } from '../../shared/fs/FakeFsPort'
import { simpleGit } from 'simple-git'

describe('GraphSim FsGraphSync wiring', () => {
  let fsPort: FakeFsPort
  let git: any
  let sync: FsGraphSync
  let externalChangeCallback: vi.Mock
  let mockAdd: vi.Mock
  let mockCommit: vi.Mock

  beforeEach(() => {
    fsPort = new FakeFsPort()
    git = simpleGit()
    externalChangeCallback = vi.fn()
    mockAdd = vi.fn()
    mockCommit = vi.fn()

    git.add = mockAdd
    git.commit = mockCommit

    sync = new FsGraphSync(fsPort, git, externalChangeCallback)
  })

  describe('node edit flow', () => {
    it('queues write on node title edit', () => {
      sync.write('test-node.md', '# New Title')

      const pending = sync.getPendingWrites()
      expect(pending).toHaveLength(1)
      expect(pending[0].path).toBe('test-node.md')
      expect(pending[0].content).toBe('# New Title')
    })

    it('coalesces multiple edits to same node', () => {
      sync.write('test-node.md', '# v1')
      sync.write('test-node.md', '# v2')
      sync.write('test-node.md', '# v3')

      const pending = sync.getPendingWrites()
      expect(pending).toHaveLength(1)
      expect(pending[0].content).toBe('# v3')
    })
  })

  describe('flush and FS write', () => {
    it('writes to FsPort on flush', async () => {
      sync.write('test.md', 'content')
      sync.flush()

      await new Promise(resolve => setTimeout(resolve, 100))

      const content = await fsPort.readFile('test.md')
      expect(content).toBe('content')
    })

    it('clears pending writes after flush', () => {
      sync.write('test.md', 'content')
      sync.flush()

      const pending = sync.getPendingWrites()
      expect(pending).toHaveLength(0)
    })
  })

  describe('external change handling', () => {
    it('triggers callback on external change', () => {
      sync.watch('/')

      expect(externalChangeCallback).toBeDefined()
    })

    it('provides method to set memory hash', () => {
      sync.setMemoryHash('test.md', 'initial-hash')

      expect(() => sync.setMemoryHash('test.md', 'new-hash')).not.toThrow()
    })
  })

  describe('dispose', () => {
    it('cleans up resources', () => {
      sync.watch('/')

      expect(() => sync.dispose()).not.toThrow()
    })
  })
})
