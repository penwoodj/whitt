import * as chokidar from 'chokidar'
import * as crypto from 'crypto'

export type WatcherCallback = (event: { type: string; path: string }) => void

export class WatcherAdapter {
  private watcher: chokidar.FSWatcher | null = null
  private memoryHashes: Map<string, string>
  private debounceTimers: Map<string, ReturnType<typeof setTimeout>>
  private readonly debounceMs: number

  constructor(
    private readonly fsPort: { readFile(path: string): Promise<string> },
    private readonly callback: WatcherCallback,
    private readonly ignored: string[] = ['node_modules', '.git', '.whitt']
  ) {
    this.memoryHashes = new Map()
    this.debounceTimers = new Map()
    this.debounceMs = 500
  }

  watch(path: string): void {
    this.watcher = chokidar.watch(path, {
      ignored: this.ignored,
      persistent: true,
      ignoreInitial: true
    })

    this.watcher.on('all', (event: string, filePath: string) => {
      if (event === 'change') {
        this.debouncedEmit(filePath)
      }
    })
  }

  private async debouncedEmit(filePath: string): Promise<void> {
    if (this.debounceTimers.has(filePath)) {
      clearTimeout(this.debounceTimers.get(filePath)!)
    }

    this.debounceTimers.set(
      filePath,
      setTimeout(() => {
        this.handleChange(filePath)
      }, this.debounceMs)
    )
  }

  private async handleChange(filePath: string): Promise<void> {
    try {
      const content = await this.fsPort.readFile(filePath)
      const newHash = this.computeHash(content)

      const existingHash = this.memoryHashes.get(filePath)

      if (existingHash !== newHash) {
        this.memoryHashes.set(filePath, newHash)
        this.callback({
          type: 'external-change',
          path: filePath
        })
      }
    } catch (error) {
      console.error('Error handling file change:', error)
    }
  }

  setMemoryHash(path: string, content: string): void {
    this.memoryHashes.set(path, this.computeHash(content))
  }

  private computeHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex')
  }

  dispose(): void {
    if (this.watcher) {
      this.watcher.close()
      this.watcher = null
    }

    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer)
    }

    this.debounceTimers.clear()
  }
}
