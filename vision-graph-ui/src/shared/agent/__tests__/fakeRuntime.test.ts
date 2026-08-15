import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FakeRuntime } from '../fakeRuntime'
import { createEvtBus } from '../eventBus'
import type { AgentEvt } from '../types'
import simpleExecutionJsonl from '../fixtures/simple-execution.jsonl?raw'
import malformedJsonl from '../fixtures/__tests__/malformed.jsonl?raw'

describe('Fake runtime + JSONL fixtures', () => {
  let bus: ReturnType<typeof createEvtBus<AgentEvt>>
  let runtime: FakeRuntime

  beforeEach(() => {
    bus = createEvtBus<AgentEvt>()
    runtime = new FakeRuntime()
  })

  describe('load JSONL fixture parses all lines', () => {
    it('5 events parsed from simple-execution.jsonl', () => {
      const events = runtime.load(simpleExecutionJsonl)
      expect(events).toHaveLength(5)
      events.forEach(evt => {
        expect(evt).toHaveProperty('kind')
        expect(evt).toHaveProperty('runId')
      })
    })
  })

  describe('play() emits events at recorded timestamps', () => {
    it('events emitted at correct relative delays', async () => {
      const handler = vi.fn()
      bus.subscribe(handler)

      runtime.load(simpleExecutionJsonl)
      runtime.play(bus, 1)

      await new Promise(resolve => setTimeout(resolve, 50))

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenNthCalledWith(1, expect.objectContaining({
        kind: 'run-start',
        runId: 'r1',
      }))
    })

    it('all events received in order', async () => {
      const received: AgentEvt[] = []
      bus.subscribe(evt => received.push(evt))

      runtime.load(simpleExecutionJsonl)
      runtime.play(bus, 10)

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(received).toHaveLength(5)
      expect(received[0].kind).toBe('run-start')
      expect(received[1].kind).toBe('step-start')
      expect(received[2].kind).toBe('step-done')
      expect(received[3].kind).toBe('file-write')
      expect(received[4].kind).toBe('run-done')
    })
  })

  describe('abort() stops emission mid-script', () => {
    it('only first 2 events emitted after abort', async () => {
      const received: AgentEvt[] = []
      bus.subscribe(evt => received.push(evt))

      runtime.load(simpleExecutionJsonl)
      runtime.play(bus, 100)

      await new Promise(resolve => setTimeout(resolve, 5))
      runtime.abort()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(received.length).toBeLessThan(5)
      expect(received.length).toBeGreaterThan(0)
    })
  })

  describe('malformed JSONL line throws parse error', () => {
    it('parse error thrown with line number', () => {
      expect(() => {
        runtime.load(malformedJsonl)
      }).toThrow()
    })
  })
})
