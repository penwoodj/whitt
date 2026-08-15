import type { EvtBus } from './eventBus'
import type { AgentEvt } from './types'

type TimedEvent = AgentEvt & { t: number }

export class FakeRuntime {
  private events: TimedEvent[] = []
  private aborted = false
  private playPromise: Promise<void> | null = null

  load(jsonlContent: string): AgentEvt[] {
    this.events = []
    this.aborted = false

    const lines = jsonlContent.trim().split('\n')

    lines.forEach((line, index) => {
      try {
        const parsed = JSON.parse(line) as TimedEvent
        if (typeof parsed.t !== 'number' || !parsed.kind) {
          throw new Error(`Invalid event format at line ${index + 1}`)
        }
        this.events.push(parsed)
      } catch (err) {
        throw new Error(`Failed to parse JSONL at line ${index + 1}: ${err}`)
      }
    })

    return this.events.map(({ t: _t, ...evt }) => evt)
  }

  async play(bus: EvtBus<AgentEvt>, speed = 1): Promise<void> {
    if (this.playPromise) {
      return this.playPromise
    }

    this.aborted = false

    this.playPromise = (async () => {
      let prevTime = 0

      for (const event of this.events) {
        if (this.aborted) {
          this.playPromise = null
          return
        }

        const delay = (event.t - prevTime) * 1000 / speed
        prevTime = event.t

        if (delay > 0) {
          await this.sleep(delay)
        }

        if (this.aborted) {
          this.playPromise = null
          return
        }

        const { t: _t, ...evt } = event
        bus.emit(evt)
      }

      this.playPromise = null
    })()

    return this.playPromise
  }

  abort(): void {
    this.aborted = true
    this.playPromise = null
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
