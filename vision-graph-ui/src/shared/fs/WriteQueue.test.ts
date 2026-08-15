import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { WriteQueue } from './WriteQueue'

describe('WriteQueue', () => {
  let queue: WriteQueue
  let flushCallback: vi.Mock

  beforeEach(() => {
    vi.useFakeTimers()
    flushCallback = vi.fn()
    queue = new WriteQueue(flushCallback, 2000)
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  describe('single write', () => {
    it('queues write and flushes after debounce', () => {
      queue.write('test.md', 'content')

      expect(flushCallback).not.toHaveBeenCalled()

      vi.advanceTimersByTime(2000)

      expect(flushCallback).toHaveBeenCalledTimes(1)
      expect(flushCallback).toHaveBeenCalledWith([
        { path: 'test.md', content: 'content' }
      ])
    })

    it('does not flush before debounce expires', () => {
      queue.write('test.md', 'content')

      vi.advanceTimersByTime(1500)

      expect(flushCallback).not.toHaveBeenCalled()
    })
  })

  describe('per-path coalescing', () => {
    it('coalesces multiple writes to same path', () => {
      queue.write('test.md', 'v1')
      vi.advanceTimersByTime(500)
      queue.write('test.md', 'v2')
      vi.advanceTimersByTime(500)
      queue.write('test.md', 'v3')

      vi.advanceTimersByTime(2000)

      expect(flushCallback).toHaveBeenCalledTimes(1)
      expect(flushCallback).toHaveBeenCalledWith([
        { path: 'test.md', content: 'v3' }
      ])
    })

    it('resets debounce timer on each write to same path', () => {
      queue.write('test.md', 'v1')

      vi.advanceTimersByTime(1500)

      queue.write('test.md', 'v2')

      vi.advanceTimersByTime(1500)

      expect(flushCallback).not.toHaveBeenCalled()

      vi.advanceTimersByTime(500)

      expect(flushCallback).toHaveBeenCalledTimes(1)
    })
  })

  describe('multiple paths', () => {
    it('flushes multiple paths independently', () => {
      queue.write('a.md', 'content a')
      queue.write('b.md', 'content b')

      vi.advanceTimersByTime(2000)

      expect(flushCallback).toHaveBeenCalledTimes(1)
      expect(flushCallback).toHaveBeenCalledWith([
        { path: 'a.md', content: 'content a' },
        { path: 'b.md', content: 'content b' }
      ])
    })

    it('coalesces per-path when mixing writes', () => {
      queue.write('a.md', 'v1')
      queue.write('b.md', 'v1')
      vi.advanceTimersByTime(500)
      queue.write('a.md', 'v2')
      queue.write('b.md', 'v2')

      vi.advanceTimersByTime(2000)

      expect(flushCallback).toHaveBeenCalledTimes(1)
      expect(flushCallback).toHaveBeenCalledWith([
        { path: 'a.md', content: 'v2' },
        { path: 'b.md', content: 'v2' }
      ])
    })
  })

  describe('manual flush', () => {
    it('flushes immediately when triggered', () => {
      queue.write('test.md', 'content')

      queue.flush()

      expect(flushCallback).toHaveBeenCalledTimes(1)
      expect(flushCallback).toHaveBeenCalledWith([
        { path: 'test.md', content: 'content' }
      ])
    })

    it('clears pending writes after flush', () => {
      queue.write('test.md', 'content')
      queue.flush()

      vi.advanceTimersByTime(2000)

      expect(flushCallback).toHaveBeenCalledTimes(1)
    })

    it('starts new debounce window after flush', () => {
      queue.write('test.md', 'first')
      queue.flush()

      queue.write('test.md', 'second')

      vi.advanceTimersByTime(2000)

      expect(flushCallback).toHaveBeenCalledTimes(2)
      expect(flushCallback).toHaveBeenNthCalledWith(1, [
        { path: 'test.md', content: 'first' }
      ])
      expect(flushCallback).toHaveBeenNthCalledWith(2, [
        { path: 'test.md', content: 'second' }
      ])
    })
  })

  describe('queue state', () => {
    it('has no pending writes initially', () => {
      const pending = queue.getPendingWrites()
      expect(pending).toEqual([])
    })

    it('tracks pending writes', () => {
      queue.write('test.md', 'content')

      const pending = queue.getPendingWrites()
      expect(pending).toEqual([{ path: 'test.md', content: 'content' }])
    })

    it('clears pending after flush', () => {
      queue.write('test.md', 'content')
      queue.flush()

      const pending = queue.getPendingWrites()
      expect(pending).toEqual([])
    })
  })
})
