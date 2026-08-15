import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createFakeSttEngine } from './FakeSttEngine'
import type { SttEvent } from '../../../shared/stt/types'

describe('FakeSttEngine', () => {
  let events: SttEvent[]

  beforeEach(() => {
    events = []
    vi.useFakeTimers()
  })

  it('FakeSTT emits interim + final events', async () => {
    const engine = createFakeSttEngine(['Hello', 'World'])

    engine.on((evt: SttEvent) => events.push(evt))

    const startPromise = engine.start()

    await vi.runAllTimersAsync()
    await startPromise

    expect(events.length).toBeGreaterThanOrEqual(2)
    expect(events).toContainEqual({ type: 'final', text: 'Hello World' })
  })

  it('FakeSTT stops cleanly', async () => {
    const engine = createFakeSttEngine(['Test'])

    await engine.stop()

    expect(engine.getState()).toBe('stopped')
  })

  it('FakeSTT handles empty transcript', async () => {
    const engine = createFakeSttEngine([])

    engine.on((evt: SttEvent) => events.push(evt))

    await engine.start()

    expect(events.length).toBe(0)
  })
})
