import { describe, it, expect, vi } from 'vitest'
import { createEvtBus } from '../eventBus'
import type { AgentEvt } from '../types'

describe('Event bus w/ generation counters', () => {
  describe('emit broadcasts to all subscribers', () => {
    it('all 3 subscribers receive event', () => {
      const bus = createEvtBus<AgentEvt>()
      const sub1 = vi.fn()
      const sub2 = vi.fn()
      const sub3 = vi.fn()

      const unsub1 = bus.subscribe(sub1)
      const unsub2 = bus.subscribe(sub2)
      const unsub3 = bus.subscribe(sub3)

      const evt: AgentEvt = {
        kind: 'run-start',
        runId: 'r1',
        nodeId: 'n1',
        workflow: 'draft',
      }

      bus.emit(evt)

      expect(sub1).toHaveBeenCalledWith(evt)
      expect(sub2).toHaveBeenCalledWith(evt)
      expect(sub3).toHaveBeenCalledWith(evt)

      unsub1()
      unsub2()
      unsub3()
    })

    it('subscribers receive in subscription order', () => {
      const bus = createEvtBus<AgentEvt>()
      const order: number[] = []

      const sub1 = () => order.push(1)
      const sub2 = () => order.push(2)
      const sub3 = () => order.push(3)

      bus.subscribe(sub1)
      bus.subscribe(sub2)
      bus.subscribe(sub3)

      bus.emit({ kind: 'log', runId: 'r1', level: 'info', msg: 'test' })

      expect(order).toEqual([1, 2, 3])
    })
  })

  describe('subscribers receive events in order', () => {
    it('receives all 3 events in emit order', () => {
      const bus = createEvtBus<AgentEvt>()
      const received: AgentEvt[] = []

      const sub = (evt: AgentEvt) => received.push(evt)
      bus.subscribe(sub)

      const evt1: AgentEvt = { kind: 'run-start', runId: 'r1', nodeId: 'n1', workflow: 'draft' }
      const evt2: AgentEvt = { kind: 'step-start', runId: 'r1', stepId: 's1', title: 'Step 1' }
      const evt3: AgentEvt = { kind: 'step-done', runId: 'r1', stepId: 's1' }

      bus.emit(evt1)
      bus.emit(evt2)
      bus.emit(evt3)

      expect(received).toEqual([evt1, evt2, evt3])
    })
  })

  describe('stale handlers skipped when generation counter mismatch', () => {
    it('stale subscriber does NOT receive event', () => {
      const bus = createEvtBus<AgentEvt>()
      const freshSub = vi.fn()
      const lateSub = vi.fn()

      const unsubFresh = bus.subscribe(freshSub)

      bus.emit({ kind: 'log', runId: 'r1', level: 'info', msg: '1' })
      bus.emit({ kind: 'log', runId: 'r1', level: 'info', msg: '2' })

      const unsubLate = bus.subscribe(lateSub)

      bus.emit({ kind: 'log', runId: 'r1', level: 'info', msg: '3' })

      expect(freshSub).toHaveBeenCalledTimes(3)
      expect(lateSub).toHaveBeenCalledTimes(1)

      unsubFresh()
      unsubLate()
    })

    it('bus increments generation after emit', () => {
      const bus = createEvtBus<AgentEvt>()
      const sub = vi.fn()
      bus.subscribe(sub)

      const initialGen = bus.getGeneration()
      bus.emit({ kind: 'log', runId: 'r1', level: 'info', msg: 'test' })
      const nextGen = bus.getGeneration()

      expect(nextGen).toBeGreaterThan(initialGen)
      expect(nextGen).toBe(initialGen + 1)
    })
  })

  describe('unsubscribe removes handler', () => {
    it('only remaining subscriber receives event after unsubscribe', () => {
      const bus = createEvtBus<AgentEvt>()
      const sub1 = vi.fn()
      const sub2 = vi.fn()

      const unsub1 = bus.subscribe(sub1)
      const unsub2 = bus.subscribe(sub2)

      bus.emit({ kind: 'log', runId: 'r1', level: 'info', msg: 'test1' })
      expect(sub1).toHaveBeenCalledTimes(1)
      expect(sub2).toHaveBeenCalledTimes(1)

      unsub1()

      bus.emit({ kind: 'log', runId: 'r1', level: 'info', msg: 'test2' })
      expect(sub1).toHaveBeenCalledTimes(1)
      expect(sub2).toHaveBeenCalledTimes(2)

      unsub2()
    })
  })
})
