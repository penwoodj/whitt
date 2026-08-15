import type { FsPort } from './FsPort'

export class FakeFsPort implements FsPort {
  private files = new Map<string, string>()
  private watchers = new Map<string, ((event: { type: string; path: string }) => void)[]>()

  async readFile(path: string): Promise<string> {
    const content = this.files.get(path)
    if (content === undefined) {
      throw new Error(`File not found: ${path}`)
    }
    return content
  }

  async writeFile(path: string, content: string): Promise<void> {
    this.files.set(path, content)
    this.emitChange(path)
  }

  async listDir(path: string): Promise<string[]> {
    const normalizedPath = path === '/' ? '' : (path.endsWith('/') ? path : `${path}/`)
    const files: string[] = []
    for (const filePath of this.files.keys()) {
      if (filePath.startsWith(normalizedPath)) {
        const relativePath = filePath.slice(normalizedPath.length)
        if (!relativePath.includes('/')) {
          files.push(relativePath)
        }
      }
    }
    return files
  }

  watch(path: string, callback: (event: { type: string; path: string }) => void): void {
    if (!this.watchers.has(path)) {
      this.watchers.set(path, [])
    }
    this.watchers.get(path)!.push(callback)
  }

  async atomicRename(tempPath: string, finalPath: string): Promise<void> {
    const content = this.files.get(tempPath)
    if (content === undefined) {
      throw new Error(`Source file not found: ${tempPath}`)
    }
    this.files.delete(tempPath)
    this.files.set(finalPath, content)
    this.emitChange(finalPath)
  }

  private emitChange(path: string): void {
    const dir = this.getDirPath(path)
    const callbacks = this.watchers.get(dir) || []
    for (const callback of callbacks) {
      callback({ type: 'change', path })
    }
  }

  private getDirPath(path: string): string {
    const lastSlash = path.lastIndexOf('/')
    return lastSlash === -1 ? '/' : path.slice(0, lastSlash)
  }
}
