import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { WatcherAdapter } from './WatcherAdapter'
import { FakeFsPort } from './FakeFsPort'

describe('WatcherAdapter', () => {
  let fsPort: FakeFsPort
  let callback: vi.Mock
  let watcher: WatcherAdapter

  beforeEach(() => {
    vi.useFakeTimers()
    fsPort = new FakeFsPort()
    callback = vi.fn()
    watcher = new WatcherAdapter(fsPort, callback)
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    watcher.dispose()
    vi.useRealTimers()
  })

  describe('watch', () => {
    it('emits event on file change', async () => {
      fsPort.writeFile('test.md', 'initial content')
      watcher.setMemoryHash('test.md', 'initial-content-hash')

      watcher.watch('/')

      await fsPort.writeFile('test.md', 'new content')

      vi.advanceTimersByTime(500)

      expect(callback).toHaveBeenCalledWith({
        type: 'external-change',
        path: 'test.md'
      })
    })

    it('does not emit if content hash unchanged', async () => {
      fsPort.writeFile('test.md', 'same content')
      watcher.setMemoryHash('test.md', 'same-content-hash')

      watcher.watch('/')

      await fsPort.writeFile('test.md', 'same content')

      vi.advanceTimersByTime(500)

      expect(callback).not.toHaveBeenCalled()
    })

    it('coalesces multiple rapid changes', async () => {
      fsPort.writeFile('test.md', 'v1')
      watcher.setMemoryHash('test.md', 'v1-hash')

      watcher.watch('/')

      await fsPort.writeFile('test.md', 'v2')
      vi.advanceTimersByTime(200)
      await fsPort.writeFile('test.md', 'v3')
      vi.advanceTimersByTime(200)
      await fsPort.writeFile('test.md', 'v4')

      vi.advanceTimersByTime(500)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('emits external-change event type', async () => {
      fsPort.writeFile('test.md', 'content')
      watcher.setMemoryHash('test.md', 'old-hash')

      watcher.watch('/')

      await fsPort.writeFile('test.md', 'new content')

      vi.advanceTimersByTime(500)

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'external-change'
        })
      )
    })
  })

  describe('dispose', () => {
    it('clears pending timers', () => {
      watcher.setMemoryHash('test.md', 'hash')
      watcher.watch('/')

      watcher.dispose()

      expect(() => watcher.dispose()).not.toThrow()
    })
  })
})
