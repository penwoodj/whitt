import type { FsPort } from './FsPort'
import * as fs from 'fs/promises'
import * as path from 'path'

export class RealFsPort implements FsPort {
  async readFile(pathStr: string): Promise<string> {
    return await fs.readFile(pathStr, 'utf-8')
  }

  async writeFile(pathStr: string, content: string): Promise<void> {
    const dir = path.dirname(pathStr)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(pathStr, content, 'utf-8')
  }

  async listDir(pathStr: string): Promise<string[]> {
    return await fs.readdir(pathStr)
  }

  watch(pathStr: string, callback: (event: { type: string; path: string }) => void): void {
    const chokidar = require('chokidar')
    const watcher = chokidar.watch(pathStr, {
      ignored: /node_modules/,
      persistent: true,
      ignoreInitial: true
    })

    watcher.on('all', (event: string, filePath: string) => {
      if (event === 'change') {
        callback({ type: 'change', path: filePath })
      }
    })
  }

  async atomicRename(tempPath: string, finalPath: string): Promise<void> {
    await fs.rename(tempPath, finalPath)
  }
}
