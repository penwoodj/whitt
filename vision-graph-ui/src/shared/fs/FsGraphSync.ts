import type { FsPort } from './FsPort'
import { WriteQueue } from './WriteQueue'
import { CommitBuilder } from './CommitBuilder'

export type ExternalChangeCallback = (event: { type: string; path: string }) => void

type WatcherAdapterLike = {
  watch(path: string): void
  setMemoryHash(path: string, content: string): void
  dispose(): void
}

const isNodeEnv = () =>
  typeof process !== 'undefined' && Boolean((process as { versions?: { node?: string } }).versions?.node)

export class FsGraphSync {
  private readonly writeQueue: WriteQueue
  private readonly commitBuilder: CommitBuilder
  private watcherAdapter: WatcherAdapterLike | null = null
  private watcherPromise: Promise<WatcherAdapterLike | null> | null = null
  private readonly pendingMemoryHashes = new Map<string, string>()
  private readonly onExternalChange?: ExternalChangeCallback
  private readonly fsPort: FsPort
  private readonly git: any

  constructor(
    fsPort: FsPort,
    git: any,
    onExternalChange?: ExternalChangeCallback
  ) {
    this.fsPort = fsPort
    this.git = git
    this.onExternalChange = onExternalChange
    this.writeQueue = new WriteQueue(this.handleFlush.bind(this))
    this.commitBuilder = new CommitBuilder(this.git)
  }

  private ensureWatcher(): Promise<WatcherAdapterLike | null> {
    if (this.watcherAdapter) return Promise.resolve(this.watcherAdapter)
    if (!this.onExternalChange || !isNodeEnv()) return Promise.resolve(null)
    if (!this.watcherPromise) {
      this.watcherPromise = import('./WatcherAdapter').then(({ WatcherAdapter }) => {
        const adapter: WatcherAdapterLike = new WatcherAdapter(this.fsPort, this.onExternalChange!)
        for (const [path, content] of this.pendingMemoryHashes) {
          adapter.setMemoryHash(path, content)
        }
        this.pendingMemoryHashes.clear()
        this.watcherAdapter = adapter
        return adapter
      })
    }
    return this.watcherPromise
  }

  write(path: string, content: string): void {
    this.writeQueue.write(path, content)
  }

  watch(path: string): void {
    void this.ensureWatcher().then((adapter) => adapter?.watch(path))
  }

  setMemoryHash(path: string, content: string): void {
    if (this.watcherAdapter) {
      this.watcherAdapter.setMemoryHash(path, content)
      return
    }
    this.pendingMemoryHashes.set(path, content)
  }

  getPendingWrites(): Array<{ path: string; content: string }> {
    return this.writeQueue.getPendingWrites()
  }

  flush(): void {
    this.writeQueue.flush()
  }

  private async handleFlush(writes: Array<{ path: string; content: string }>): Promise<void> {
    for (const write of writes) {
      await this.fsPort.writeFile(write.path, write.content)
    }

    if (writes.length > 0) {
      const paths = writes.map((w) => w.path)
      await this.commitBuilder.commit(paths, {
        actor: 'user',
        action: 'file-edit',
        refs: writes.map((w) => w.path),
        ts: new Date().toISOString()
      })
    }
  }

  dispose(): void {
    this.watcherAdapter?.dispose()
  }
}
