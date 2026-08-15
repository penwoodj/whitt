import { describe, it, expect } from 'vitest'
import type { FsPort } from '../index'

describe('FsPort bridge interface', () => {
  describe('FsPort interface defines write() contract', () => {
    it('write() method accepts path and content', async () => {
      const port: FsPort = {
        write: async (path, content) => {},
        read: async (path) => '',
        delete: async (path) => {},
      }

      await expect(port.write('/test/path.txt', 'content')).resolves.not.toThrow()
    })

    it('write() returns Promise<void>', async () => {
      const port: FsPort = {
        write: async (path, content) => {},
        read: async (path) => '',
        delete: async (path) => {},
      }

      const result = port.write('/test/path.txt', 'content')
      expect(result).toBeInstanceOf(Promise)
    })
  })

  describe('FsPort interface defines read() contract', () => {
    it('read() method accepts path', async () => {
      const port: FsPort = {
        write: async (path, content) => {},
        read: async (path) => 'content',
        delete: async (path) => {},
      }

      const result = await port.read('/test/path.txt')
      expect(result).toBe('content')
    })

    it('read() returns Promise<string>', async () => {
      const port: FsPort = {
        write: async (path, content) => {},
        read: async (path) => '',
        delete: async (path) => {},
      }

      const result = port.read('/test/path.txt')
      expect(result).toBeInstanceOf(Promise)
    })
  })

  describe('FsPort interface defines delete() contract', () => {
    it('delete() method accepts path', async () => {
      const port: FsPort = {
        write: async (path, content) => {},
        read: async (path) => '',
        delete: async (path) => {},
      }

      await expect(port.delete('/test/path.txt')).resolves.not.toThrow()
    })

    it('delete() returns Promise<void>', async () => {
      const port: FsPort = {
        write: async (path, content) => {},
        read: async (path) => '',
        delete: async (path) => {},
      }

      const result = port.delete('/test/path.txt')
      expect(result).toBeInstanceOf(Promise)
    })
  })
})
