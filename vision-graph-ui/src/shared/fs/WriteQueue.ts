export type Write = { path: string; content: string }

export type FlushCallback = (writes: Write[]) => void

export class WriteQueue {
  private pendingWrites = new Map<string, string>()
  private debounceTimer: ReturnType<typeof setTimeout> | null = null
  private readonly flushCallback: FlushCallback
  private readonly debounceMs: number

  constructor(flushCallback: FlushCallback, debounceMs: number = 2000) {
    this.flushCallback = flushCallback
    this.debounceMs = debounceMs
  }

  write(path: string, content: string): void {
    this.pendingWrites.set(path, content)
    this.scheduleFlush()
  }

  flush(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }

    const writes = this.getPendingWrites()
    if (writes.length > 0) {
      this.flushCallback(writes)
      this.pendingWrites.clear()
    }
  }

  getPendingWrites(): Write[] {
    return Array.from(this.pendingWrites.entries()).map(([path, content]) => ({
      path,
      content
    }))
  }

  dispose(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }
    this.pendingWrites.clear()
  }

  private scheduleFlush(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    this.debounceTimer = setTimeout(() => {
      this.flush()
    }, this.debounceMs)
  }
}
