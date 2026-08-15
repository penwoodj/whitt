import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { FsPort } from './FsPort'
import { FakeFsPort } from './FakeFsPort'

describe('FakeFsPort', () => {
  let port: FakeFsPort

  beforeEach(() => {
    port = new FakeFsPort()
  })

  describe('readFile', () => {
    it('reads file from in-mem store', async () => {
      await port.writeFile('test.md', '# Test')

      const content = await port.readFile('test.md')

      expect(content).toBe('# Test')
    })

    it('throws on missing file', async () => {
      await expect(port.readFile('missing.md')).rejects.toThrow('missing.md')
    })

    it('preserves exact content including whitespace', async () => {
      const content = '# Test\n\n  Indented line\n'
      await port.writeFile('whitespace.md', content)

      const read = await port.readFile('whitespace.md')

      expect(read).toBe(content)
    })
  })

  describe('writeFile', () => {
    it('writes file to in-mem store', async () => {
      await port.writeFile('new.md', '# New')

      const content = await port.readFile('new.md')

      expect(content).toBe('# New')
    })

    it('overwrites existing file', async () => {
      await port.writeFile('overwrite.md', 'old')
      await port.writeFile('overwrite.md', 'new')

      const content = await port.readFile('overwrite.md')

      expect(content).toBe('new')
    })

    it('supports multiple concurrent writes', async () => {
      await Promise.all([
        port.writeFile('a.md', 'content a'),
        port.writeFile('b.md', 'content b'),
        port.writeFile('c.md', 'content c')
      ])

      expect(await port.readFile('a.md')).toBe('content a')
      expect(await port.readFile('b.md')).toBe('content b')
      expect(await port.readFile('c.md')).toBe('content c')
    })
  })

  describe('listDir', () => {
    it('lists directory contents', async () => {
      await port.writeFile('a.md', 'a')
      await port.writeFile('b.md', 'b')
      await port.writeFile('c.md', 'c')

      const files = await port.listDir('/')

      expect(files).toHaveLength(3)
      expect(files).toContain('a.md')
      expect(files).toContain('b.md')
      expect(files).toContain('c.md')
    })

    it('returns empty array for empty dir', async () => {
      const files = await port.listDir('/')

      expect(files).toEqual([])
    })

    it('only lists files, not directories', async () => {
      await port.writeFile('dir/file.md', 'nested')

      const files = await port.listDir('/')

      expect(files).not.toContain('dir')
    })
  })

  describe('watch', () => {
    it('emits change event on write', async () => {
      const callback = vi.fn()
      port.watch('/', callback)

      await port.writeFile('watched.md', 'changed')

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'change',
          path: 'watched.md'
        })
      )
    })

    it('does not emit for unwritten files', async () => {
      const callback = vi.fn()
      port.watch('/', callback)

      await port.writeFile('other.md', 'unrelated')

      expect(callback).not.toHaveBeenCalledWith(
        expect.objectContaining({
          path: 'unwatched.md'
        })
      )
    })

    it('emits on overwrite', async () => {
      const callback = vi.fn()
      port.watch('/', callback)
      await port.writeFile('overwrite.md', 'old')
      await port.writeFile('overwrite.md', 'new')

      expect(callback).toHaveBeenCalledTimes(2)
    })
  })

  describe('atomicRename', () => {
    it('renames temp file to final path atomically', async () => {
      await port.writeFile('temp.tmp', 'content')
      await port.atomicRename('temp.tmp', 'final.md')

      const content = await port.readFile('final.md')
      expect(content).toBe('content')

      await expect(port.readFile('temp.tmp')).rejects.toThrow('temp.tmp')
    })

    it('throws if source does not exist', async () => {
      await expect(port.atomicRename('missing.tmp', 'final.md')).rejects.toThrow('missing.tmp')
    })
  })
})
