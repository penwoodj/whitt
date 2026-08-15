import type { AgentEvt } from './types'

export type EventHandler<T = AgentEvt> = (evt: T) => void
export type UnsubscribeFn = () => void

interface Subscriber<T> {
  handler: EventHandler<T>
  generation: number
}

export interface EvtBus<T = AgentEvt> {
  emit(evt: T): void
  subscribe(handler: EventHandler<T>): UnsubscribeFn
  getGeneration(): number
}

export function createEvtBus<T = AgentEvt>(): EvtBus<T> {
  let generation = 0
  const subscribers: Subscriber<T>[] = []

  const emit = (evt: T): void => {
    generation++
    subscribers.forEach(sub => {
      sub.handler(evt)
    })
  }

  const subscribe = (handler: EventHandler<T>): UnsubscribeFn => {
    const subscriber: Subscriber<T> = {
      handler,
      generation,
    }
    subscribers.push(subscriber)

    return () => {
      const index = subscribers.indexOf(subscriber)
      if (index > -1) {
        subscribers.splice(index, 1)
      }
    }
  }

  const getGeneration = (): number => generation

  return { emit, subscribe, getGeneration }
}

