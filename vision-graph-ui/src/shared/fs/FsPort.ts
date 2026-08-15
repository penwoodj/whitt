export interface FsPort {
  readFile(path: string): Promise<string>
  writeFile(path: string, content: string): Promise<void>
  listDir(path: string): Promise<string[]>
  watch(path: string, callback: (event: { type: string; path: string }) => void): void
  atomicRename(tempPath: string, finalPath: string): Promise<void>
}
