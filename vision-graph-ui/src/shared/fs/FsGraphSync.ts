import type { FsPort } from './FsPort'
import { WriteQueue } from './WriteQueue'
import { CommitBuilder } from './CommitBuilder'
import { WatcherAdapter } from './WatcherAdapter'

export type ExternalChangeCallback = (event: { type: string; path: string }) => void

export class FsGraphSync {
  private readonly writeQueue: WriteQueue
  private readonly commitBuilder: CommitBuilder
  private readonly watcherAdapter: WatcherAdapter | null
  private readonly fsPort: FsPort
  private readonly git: any

  constructor(
    fsPort: FsPort,
    git: any,
    onExternalChange?: ExternalChangeCallback
  ) {
    this.fsPort = fsPort
    this.git = git
    this.writeQueue = new WriteQueue(this.handleFlush.bind(this))
    this.commitBuilder = new CommitBuilder(this.git)
    this.watcherAdapter = onExternalChange
      ? new WatcherAdapter(this.fsPort, onExternalChange)
      : null
  }

  write(path: string, content: string): void {
    this.writeQueue.write(path, content)
  }

  watch(path: string): void {
    this.watcherAdapter?.watch(path)
  }

  setMemoryHash(path: string, content: string): void {
    this.watcherAdapter?.setMemoryHash(path, content)
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
